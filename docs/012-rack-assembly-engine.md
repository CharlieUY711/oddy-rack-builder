# 012 — Rack Assembly Engine (SPEC-002)

**Sprint:** 3 — Rack Assembly Engine
**Estado:** ✅ Cerrado — build, lint y typecheck sin errores. Lógica de negocio
verificada ejecutando directamente el código real compilado (ver sección
"Verificación").

---

## Arquitectura

Se mantiene intacta la arquitectura de Sprint 1/2. Este sprint introduce un
segundo concepto además de `RackTemplate`:

```
RackTemplate   → diseño del rack. Inmutable. Nunca guarda estado.
RackInstance   → rack real, generado desde un RackTemplate. Sí muta.
```

```
types/
├── Rack.ts           → RackInstance, RackInstanceComponent, estados
└── SerialNumber.ts    → alias semántico para números de serie

services/rack-builder/
├── assemble.ts               → merge template+instance, progreso, derivación de estado
├── RackInstanceRepository.ts → Repository Pattern (interfaz + impl. en memoria)
└── actions.ts                 → Server Actions (create / updateComponent)

features/rack-builder/
├── InstanceCard.tsx           → tarjeta resumen en el listado
├── NewInstanceForm.tsx         → alta de instancia desde una plantilla
├── Checklist.tsx                → lista generada 100% desde la instancia
├── RackElevationView.tsx        → SVG dinámico (frente/trasera)
├── ComponentPanel.tsx           → panel derecho (PN leído, serial, obs.)
├── RackBuilderWorkspace.tsx     → layout de 3 columnas + estado de sesión
└── index.ts

app/rack-builder/
├── page.tsx               → listado de Rack Instances
├── new/page.tsx            → alta de instancia
└── [instanceId]/page.tsx    → pantalla principal de ensamblado

assets/svg/
├── rack-front.svg   → marco de referencia genérico (45U, sin componentes)
└── rack-rear.svg     → ídem, vista trasera
```

---

## Modelo

```ts
RackInstance {
  id, name, projectName,        // projectName: placeholder de texto libre
  templateId,
  status: "pendiente" | "en_progreso" | "completo",   // derivado, nunca manual
  createdAt, updatedAt,
  components: RackInstanceComponent[],
}

RackInstanceComponent {
  templateComponentId,          // enlaza con RackTemplateComponent.id
  status: "pendiente" | "instalado" | "error",        // derivado, nunca manual
  expectedPartNumber,           // copiado del template al crear, nunca se edita
  readPartNumber?, serialNumber?, observations?,
}
```

`RackInstanceComponent` **no duplica** nombre, fabricante, posición U, lado,
etc. — esos siguen viviendo únicamente en `RackTemplateComponent`. La vista
que se muestra en pantalla (`AssembledComponentView`) es siempre el
resultado de cruzar ambos, vía `assembleComponentViews(template, instance)`.
Esto es lo que garantiza "el Builder nunca conoce componentes hardcodeados,
siempre lee la plantilla".

---

## Flujo

1. **Listado** (`/rack-builder`): lee `RackInstanceRepository.list()` +
   `TemplateRepository.list()` para resolver el nombre de la plantilla de
   cada instancia.
2. **Nueva Rack Instance** (`/rack-builder/new`): el técnico elige una
   plantilla; al confirmar, una Server Action (`createRackInstanceAction`)
   llama a `RackInstanceRepository.create()`, que copia la lista de
   componentes de la plantilla generando un `RackInstanceComponent` por
   cada uno, todos en estado `"pendiente"`. Redirige a la pantalla de
   ensamblado de la instancia recién creada.
3. **Rack Builder** (`/rack-builder/[instanceId]`):
   - El servidor resuelve la instancia y su plantilla, y se los pasa a
     `RackBuilderWorkspace` (Client Component).
   - **Checklist** (izquierda): `assembleComponentViews` cruza ambos y
     lista cada componente con su estado — nada hardcodeado.
   - **Vista Frontal / Trasera** (centro): `RackElevationView` dibuja un
     `<svg>` fila por fila desde `heightU` hasta 1, dibujando un bloque
     fusionado por cada componente que ocupa ese lado y esas posiciones U,
     coloreado según su estado. Los slots vacíos se muestran como huecos
     punteados con su número de U.
   - **Panel derecho**: al seleccionar un componente (desde el checklist o
     desde la vista), se muestran Nombre/Fabricante/PN esperado, y los
     campos editables (PN leído, Serial Number, Observaciones) + botón
     Guardar.
   - **Guardar**: llama a la Server Action `updateComponentAction`, que
     actualiza únicamente la `RackInstance` (la plantilla jamás se toca).
     El estado del componente se recalcula automáticamente comparando PN
     leído vs. PN esperado (ver Decisiones). Checklist, vista y progreso
     se actualizan solos porque todos derivan del mismo estado.

---

## Estados

| Estado de componente | Se activa cuando... |
|---|---|
| `pendiente` | Todavía no se registró ningún PN leído |
| `instalado` | El PN leído coincide con el PN esperado |
| `error` | El PN leído fue registrado pero **no coincide** con el esperado |

| Estado de instancia | Se activa cuando... |
|---|---|
| `pendiente` | Ningún componente tiene progreso todavía |
| `en_progreso` | Al menos un componente está instalado o en error, pero no todos instalados |
| `completo` | Todos los componentes están en estado `instalado` |

Ambos estados se **derivan siempre automáticamente** — en ningún lugar de
la UI existe un selector manual de estado.

---

## Decisiones tomadas

- **El estado del componente nunca se elige a mano.** La spec no incluye un
  selector de estado en el panel derecho (solo PN leído, Serial, Observaciones
  y Guardar). Se decidió derivarlo automáticamente: sin PN leído → pendiente;
  PN leído == PN esperado → instalado; PN leído distinto → error (posible
  componente equivocado). Esto cumple "Actualizar automáticamente Checklist/
  Vista/Progreso" de forma literal — todo sale de los datos, no de un toggle.
- **Persistencia en memoria del proceso de servidor, no en disco.** La spec
  pide "Continuar utilizando JSON" + "No conectar Supabase" + "No API". Sin
  backend real, no existe forma de escribir en disco desde el navegador. Se
  implementó `InMemoryRackInstanceRepository`, que vive mientras el proceso
  de Node esté corriendo (dev server o instancia de producción), suficiente
  para trabajar una sesión de ensamblado completa. **No sobrevive a un
  reinicio del servidor** — ver Riesgos.
- **Server Actions, no una API propia.** Para que "Guardar" dispare la
  mutación en el servidor sin construir route handlers, se usaron Server
  Actions (`"use server"`), el mecanismo nativo de Next.js App Router. Se
  interpretó que esto no es "crear una API" en el sentido que la spec
  excluye (no hay endpoints públicos, ni sincronización externa): es la
  forma idiomática de conectar una acción de UI con el servidor en este
  framework.
- **SVG dinámico en React, no manipulación de archivo estático.** Se
  crearon los dos archivos `rack-front.svg` / `rack-rear.svg` pedidos
  literalmente por la spec, como marco de referencia genérico (45U, sin
  componentes). Pero la vista funcional del Builder se genera con un
  `<svg>` inline en `RackElevationView.tsx`, porque la altura real varía
  por plantilla (22U/42U/45U/47U) y el contenido debe reflejar el estado
  vivo de la instancia — algo que un archivo `.svg` estático no puede
  hacer por sí solo. Esta decisión se documenta explícitamente para que
  quede claro que no se ignoró el pedido, sino que se resolvió de la forma
  técnicamente correcta.
- **Nombre de archivo `rack-rear.svg` (no `rack-back.svg`).** Sprint 0
  había reservado `assets/svg/rack-back.svg` (vacío). Esta spec pide
  `rack-rear.svg`. Se creó el archivo con el nombre exacto pedido en este
  sprint; `rack-back.svg` queda sin uso, sin eliminar (para no tocar
  archivos fuera del alcance de este sprint sin necesidad).
- **`RackInstance.id` autoincremental simple (`rack-1`, `rack-2`, ...).**
  Consistente con el enfoque de `RackTemplate` (slugs legibles), y
  suficiente para una implementación en memoria. Se reemplazará cuando
  exista una base de datos real.

---

## Verificación

Además de `lint`/`typecheck`/`build`, se compiló el código real de
`services/` (no una reimplementación) y se ejecutó directamente en Node
para validar el flujo completo de punta a punta:

```
1) Instancia creada: rack-1 status: pendiente componentes: 5
2) Tras instalar cmp-001 -> instance.status: en_progreso
3) Tras error en cmp-003 -> instance.status: en_progreso
4) Progreso: { total: 5, installed: 1, errors: 1, pending: 3, percentage: 20 }
   cmp-001 en vista combinada: instalado - Patch Panel 24 puertos
   cmp-003 en vista combinada: error - Switch de acceso 48 puertos
   getById funciona: true
   list() devuelve 1 instancia: true
   Template sigue intacto (no fue mutado): true
```

Esto confirma en código real, no solo por lectura, los puntos del
Definition of Done relacionados con creación, inmutabilidad de la
plantilla, progreso y derivación de estado.

---

## Riesgos abiertos

1. **La persistencia no sobrevive a un reinicio del servidor.** Es una
   limitación conocida y documentada, consecuencia directa de "No Supabase
   / No API" en este sprint. Cuando se conecte una base de datos real, solo
   hay que reemplazar `InMemoryRackInstanceRepository` — el resto del
   código no cambia.
2. **Sin validación de solapamiento de U al crear la instancia.** Se hereda
   textualmente la estructura de la plantilla; si una plantilla tuviera
   datos inconsistentes (dos componentes en la misma U y lado), el motor no
   lo detecta. Debería resolverse como validación en el editor de
   plantillas (Sprint 2), no acá.
3. **Un componente sin `requiresSerial` igual puede recibir un PN leído
   incorrecto y marcarse en error.** Es el comportamiento esperado (control
   de que se instaló la pieza correcta), pero conviene comunicarlo bien a
   los técnicos: "error" no siempre significa falla física, puede ser un
   PN mal tipeado/escaneado.
4. **`rack-back.svg` (Sprint 0) queda sin uso.** No se eliminó para no
   exceder el alcance de este sprint; se recomienda decidir en un sprint de
   limpieza si se elimina o se reutiliza.
5. **Sin control de concurrencia.** Si dos personas trabajan sobre la misma
   instancia al mismo tiempo (dos pestañas), la última escritura gana. No
   es relevante hoy (repositorio en memoria de un solo proceso), pero hay
   que tenerlo en cuenta al migrar a un backend real con múltiples clientes.

---

## Próximos pasos sugeridos

- Conectar Supabase y reemplazar `InMemoryRackInstanceRepository` por una
  implementación real, sin tocar `features/` ni `app/`.
- QA: agregar una etapa de revisión posterior al ensamblado (hoy el estado
  "instalado" es autodeclarado por PN leído, sin una validación humana
  adicional).
- Fotografías: los componentes con `requiresPhoto: true` todavía no tienen
  ningún campo ni flujo asociado — queda para el sprint de QA/Fotos.
- Reportes/expediente: una vez que existan instancias completas, generar
  un resumen exportable (fuera de alcance de este sprint).
