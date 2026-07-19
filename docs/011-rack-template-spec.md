# 011 — Rack Template Spec (SPEC-001)

**Sprint:** 2 — Rack Templates
**Estado:** ✅ Cerrado — build, lint y typecheck sin errores.

---

## Arquitectura

Todo Rack debe originarse desde una Plantilla. El Rack Builder (sprint
futuro) nunca conocerá qué componentes lleva un rack directamente — siempre
leerá esa información a través de `TemplateRepository`.

```
Project
    ↓
Rack Template   ← este sprint
    ↓
Rack Instance   (sprint futuro)
    ↓
QA
    ↓
Expediente
```

```
types/
├── RackType.ts        → catálogo de tipos (Tipo 1/2/3/Half)
├── RackComponent.ts    → estructura de un componente dentro de una plantilla
└── RackTemplate.ts     → entidad plantilla (metadata + componentes)

services/rack-templates/
└── TemplateRepository.ts → Repository Pattern (interfaz + implementación JSON)

features/rack-templates/
├── TemplateCard.tsx           → tarjeta resumen en la grilla
├── ComponentPreviewTable.tsx  → tabla de vista previa (sin SVG todavía)
├── NewTemplateForm.tsx        → formulario de creación (sin persistencia real)
└── index.ts                   → barrel export

app/rack-templates/
├── page.tsx                → grilla de plantillas (lee TemplateRepository)
├── new/page.tsx             → pantalla "Nueva Plantilla"
└── [templateId]/page.tsx    → detalle + vista previa de una plantilla

data/
├── rack_tipo1.json
├── rack_tipo2.json
├── rack_tipo3.json
└── rack_half.json
```

---

## Modelo de datos

```ts
RackTemplate {
  id, name, description?, manufacturer, model,
  rackType: RackTypeId,
  heightU: number,   // altura nominal del gabinete, en U
  usableU: number,   // U efectivamente utilizables/instalables
  observations?: string,
  components: RackTemplateComponent[],
}

RackTemplateComponent {
  id, name, manufacturer, partNumber,
  uStart, uEnd, side: "frente" | "trasera",
  quantity,
  requiresSerial, requiresQA, requiresPhoto: boolean,
  comments?,
}
```

### Nota de interpretación: "Altura (45U)" vs "Cantidad de U"

La spec original lista ambos campos por separado para la pantalla "Nueva
Plantilla". Se interpretaron como dos medidas legítimamente distintas en la
práctica: `heightU` es la altura nominal del gabinete (ej. "un rack de
45U"), mientras que `usableU` es la cantidad de U realmente disponibles
para instalar componentes — casi siempre menor a la altura nominal por
espacio reservado a ventilación, PDU, o rieles superiores/inferiores. Esta
distinción queda documentada en el propio archivo `types/RackTemplate.ts`.

---

## Flujo

1. `TemplateRepository.list()` lee las 4 plantillas seed desde `/data/*.json`
   y las devuelve tipadas como `RackTemplate[]`.
2. `/rack-templates` renderiza una grilla con `TemplateCard` por cada
   plantilla (Server Component — sin JavaScript de cliente necesario para
   listar).
3. `/rack-templates/[templateId]` resuelve el detalle vía
   `TemplateRepository.getById()` y renderiza `ComponentPreviewTable`,
   ordenando los componentes de la unidad más alta a la más baja (igual a
   como se lee una elevación de rack física). Se generan estáticamente las
   4 rutas conocidas vía `generateStaticParams`.
4. `/rack-templates/new` es un formulario de cliente completamente
   interactivo (alta/baja de componentes, todos los campos pedidos por la
   spec), con una vista previa en vivo reutilizando `ComponentPreviewTable`.
   El botón "Guardar" no persiste nada — lo confirma explícitamente en
   pantalla — porque no existe todavía una capa de escritura (Supabase
   queda fuera de alcance de este sprint).

---

## Decisiones tomadas

- **Repository Pattern real, no solo interfaz vacía**: se implementó
  `JsonTemplateRepository` funcionando de punta a punta (lee, tipa y sirve
  las 4 plantillas), no solo el contrato. Esto permite que `/rack-templates`
  y el detalle sean genuinamente funcionales en este sprint, cumpliendo
  "todo el sistema futuro depende de las plantillas, nunca de datos
  hardcodeados" — las páginas ya no conocen los JSON, solo conocen el
  repositorio.
- **`getTemplateRepository()` como único punto de acceso**: el día que
  exista `SupabaseTemplateRepository`, el cambio se hace en un solo lugar
  (el factory), sin tocar `app/` ni `features/`.
- **Reordenamiento de navegación**: se agregó "Rack Templates" como ítem
  propio del sidebar (`U03`), antes de "Rack Builder", desplazando QA,
  Reportes y Configuración una posición (`U04`→`U07`). Se decidió darle
  entidad propia en la navegación en lugar de anidarlo bajo "Rack Builder",
  porque conceptualmente es una capa independiente (Project → Rack Template
  → Rack Instance) que otros módulos futuros (QA, Inventario) también
  necesitarán consultar directamente.
- **Sin componentes nuevos de Design System**: los campos tipo `select` y
  `checkbox` del formulario se estilizaron en línea dentro de
  `NewTemplateForm.tsx`, sin agregar `Select`/`Checkbox` a
  `components/ui`, respetando la instrucción de no crear un nuevo sistema
  de diseño en este sprint. Si estos patrones se repiten en más
  formularios futuros, evaluar promoverlos a `components/ui`.
- **Manufacturer/model como "Genérico" / `PN_PLACEHOLDER` en todos los
  seeds**: para evitar cualquier ambigüedad sobre si los datos de ejemplo
  representan especificaciones reales de fabricantes concretos, todos los
  campos de fabricante/modelo/PN de los 4 JSON semilla usan valores
  genéricos explícitamente marcados como placeholder.

---

## Riesgos abiertos

1. **`NewTemplateForm` no persiste** — es interactivo de punta a punta,
   pero al recargar la página se pierde el borrador. Esto es intencional
   (no hay backend todavía), pero hay que comunicarlo bien al usuario final
   cuando se use en operación real, no solo en este documento.
2. **`RackTemplate.id` como string libre** — hoy son slugs manuales
   (`tipo1-standard`, etc.). Cuando se conecte Supabase, hay que decidir si
   se mantiene como slug legible o pasa a UUID generado por la base.
3. **Validación de rangos U** — el formulario no valida todavía que
   `uStart`/`uEnd` estén dentro de `heightU`, ni que no se solapen dos
   componentes en la misma U y lado. Se deja pendiente para el sprint del
   Rack Builder, donde probablemente se necesite de todas formas una
   validación visual (SVG) más rica que una validación de formulario plana.
4. **Sin loading/error state en la grilla** — como los datos son estáticos
   (JSON local), no hay manejo de error de red. Habrá que agregarlo cuando
   la implementación pase a Supabase.

---

## Trabajo pendiente (fuera de alcance de Sprint 2)

- Rack Builder real (consumir `RackTemplate` para armar una `Rack Instance`).
- Representación visual SVG de la elevación del rack.
- Persistencia real de plantillas (`SupabaseTemplateRepository`).
- Edición/eliminación de plantillas existentes.
- Validación de solapamiento de U y de límites de altura.
