# 010 — Sprint 1 Review: Foundation

**Fecha de cierre:** 19 de julio de 2026
**Estado:** ✅ Cerrado — build, lint y typecheck sin errores.

---

## Resumen del Sprint

El objetivo de Sprint 1 fue construir la base visual y técnica de ODDY Rack
Builder, sin implementar ninguna lógica de negocio, modelo de datos ni
conexión a Supabase. Se entregó:

- Corrección de los 3 hallazgos críticos (❌) detectados en la auditoría de
  Sprint 0 (ESLint, GitHub Actions/lockfile, ausencia de `app/layout.tsx`).
- Shell de aplicación completo: Sidebar + TopBar + Main + Footer.
- Sistema de navegación con 6 páginas placeholder (Dashboard, Proyectos,
  Rack Builder, QA, Reportes, Configuración).
- 8 componentes reutilizables del sistema de diseño (Button, Card, Input,
  PageHeader, Sidebar, TopBar, StatusBadge, ProgressBar).
- Tema visual consistente basado en tokens (Tailwind v4 `@theme`).
- Los cuatro comandos de verificación (`lint`, `typecheck`, `build`, `dev`)
  corren sin errores, verificados de forma real dentro del entorno de
  ejecución, no solo revisados por lectura de código.

No se implementó lógica de negocio, formularios funcionales, conexión a
Supabase, ni el editor de Rack Builder — tal como establecían las reglas del
sprint.

---

## Arquitectura implementada

```
app/
├── layout.tsx        → Root layout, monta AppShell y metadata global
├── page.tsx           → Redirect a /dashboard
├── globals.css         → Tokens de diseño (Tailwind v4 @theme)
├── dashboard/page.tsx
├── projects/page.tsx
├── rack-builder/page.tsx
├── qa/page.tsx
├── reports/page.tsx
└── settings/page.tsx

components/
├── layout/
│   ├── AppShell.tsx    → Compone Sidebar + TopBar + Main + Footer
│   ├── Sidebar.tsx     → Navegación con tags "U01"–"U06" (unidad de rack)
│   ├── TopBar.tsx       → Título de sección activa + estado de sistema
│   ├── Footer.tsx       → Placa de versión/proyecto
│   └── index.ts         → Barrel export
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── PageHeader.tsx
    ├── StatusBadge.tsx  → Indicador tipo LED de estado de equipo
    ├── ProgressBar.tsx  → Medidor segmentado (ocupación de rack)
    └── index.ts          → Barrel export

lib/
└── nav.ts               → Configuración estática de navegación (NAV_ITEMS)
```

### Dirección visual

Se optó deliberadamente por una estética de "sala de control / instrumento
técnico" en lugar de un dashboard genérico: fondo oscuro (`--color-ink`),
paneles diferenciados (`--color-panel`, `--color-panel-raised`), y acentos de
color con significado funcional — ámbar, verde y rojo replican la semántica
de los LEDs de estado de equipos de telecom (operativo / atención / falla),
coherente con el dominio real del proyecto (armado de racks para Data
Centers). La tipografía monoespaciada se reserva exclusivamente para
identificadores (tags "U01"–"U06" en el sidebar, versión en el footer),
anticipando su uso futuro con números de serie y códigos de proyecto.

---

## Problemas encontrados y soluciones aplicadas

| # | Problema | Causa | Solución aplicada |
|---|----------|-------|--------------------|
| 1 | `npm run lint` fallaba con `TypeError` en `react/display-name` | `eslint-config-next@16.2.10` trae anidado `eslint-plugin-react@7.37.5`, cuyo peerDependency solo soporta ESLint hasta `^9.7`, no ESLint 10 | Se fijó el proyecto a `eslint@^9.39.5` (última 9.x estable), compatible con la cadena de dependencias de `eslint-config-next` |
| 2 | Warning `MODULE_TYPELESS_PACKAGE_JSON` en cada comando de Node | Los archivos de configuración (`eslint.config.js`, `next.config.ts`, `postcss.config.mjs`, `prettier.config.js`) usan sintaxis ESM sin que `package.json` lo declarara | Se agregó `"type": "module"` a `package.json` |
| 3 | `npm run build` fallaba: `next/font/google` no podía resolver `fonts.googleapis.com` (403) | El entorno de verificación no tiene salida de red hacia dominios de Google Fonts | Se reemplazó `next/font/google` (Inter, IBM Plex Sans, IBM Plex Mono) por *stacks* de fuentes de sistema (`ui-sans-serif`, `ui-monospace`, etc.), eliminando toda dependencia de red en build |
| 4 | `package-lock.json` inexistente rompía `npm ci` en los 3 workflows de CI (hallazgo de la auditoría de Sprint 0) | Nunca se había corrido `npm install` real | Se corrió `npm install` con las versiones vigentes del registry y se commiteó el lockfile generado |
| 5 | `.gitkeep` obsoletos en `app/`, `components/` y `lib/` | Esas carpetas ya no están vacías tras Sprint 1 | Se eliminaron los `.gitkeep` de las 3 carpetas |
| 6 | Warning de estilo `import/no-anonymous-default-export` en `prettier.config.js` | Export default de un objeto anónimo | Se asignó a una variable (`prettierConfig`) antes de exportar |

---

## Decisiones tomadas

- **TypeScript en línea 5.9, no 7.x**: el registry ofrece TypeScript 7.0.2
  como `latest` (reescritura del compilador), pero se decidió fijar
  `^5.9.3` — la última release estable de la línea anterior — para
  priorizar estabilidad en una base fundacional recién creada, en vez de
  adoptar un major muy reciente sin trayectoria. Revisar esta decisión en
  un sprint futuro.
- **Tailwind CSS v4 (CSS-first)**: se adoptó el enfoque nuevo de Tailwind v4
  (`@import "tailwindcss"` + `@theme` en `globals.css`, sin
  `tailwind.config.js`), que es el flujo de configuración recomendado por
  Tailwind para esta versión.
- **Sin fuentes de Google en build**: en vez de auto-hospedar binarios de
  fuente (`next/font/local`) o depender de fetch a Google Fonts en build
  time, se usaron stacks de fuentes de sistema. Esto hace el build 100%
  independiente de la red, más robusto ante entornos de CI restringidos,
  a costa de menor identidad tipográfica distintiva. Ver "Riesgos abiertos".
- **Rutas en inglés, labels en español**: las URLs (`/dashboard`,
  `/rack-builder`, etc.) siguen convención en inglés (estándar de la
  industria), mientras que las etiquetas visibles en el sidebar están en
  español, siguiendo el idioma del resto del producto.
- **Barrel exports (`index.ts`)** adoptados en `components/ui` y
  `components/layout`, resolviendo la recomendación pendiente de la
  auditoría de Sprint 0 sobre definir el patrón de imports.

---

## Dependencias finales

**Runtime:**
| Paquete | Versión |
|---|---|
| next | ^16.2.10 |
| react | ^19.2.7 |
| react-dom | ^19.2.7 |
| @supabase/supabase-js | ^2.110.7 *(instalado, aún no conectado — reservado para sprint de datos)* |

**Desarrollo:**
| Paquete | Versión |
|---|---|
| typescript | ^5.9.3 |
| eslint | ^9.39.5 |
| eslint-config-next | ^16.2.10 |
| @eslint/js | ^9.39.1 |
| prettier | ^3.9.5 |
| tailwindcss | ^4.3.3 |
| @tailwindcss/postcss | ^4.3.3 |
| postcss | ^8.5.19 |
| @types/node, @types/react, @types/react-dom | últimas compatibles con React 19 / Node 26 |

---

## Riesgos abiertos

1. **Identidad tipográfica reducida**: al eliminar `next/font/google`, el
   proyecto usa fuentes de sistema en vez de IBM Plex Sans/Mono + Inter.
   Visualmente es coherente pero menos distintivo. Si la identidad
   tipográfica importa antes de producción, evaluar auto-hospedar los
   archivos `.woff2` (`next/font/local`) en lugar de depender de un fetch
   externo en build.
2. **`npm audit`: 2 vulnerabilidades moderadas** — corresponden a un
   `postcss@8.4.31` que **Next.js empaqueta internamente** para su propio
   tooling (no nuestro `postcss` de nivel superior, ya en `8.5.19`). No es
   corregible desde este repositorio sin forzar un downgrade masivo de
   Next; se considera un riesgo aceptado de bajo impacto, pendiente de que
   el propio Next.js actualice su dependencia interna.
3. **Sin colapso de Sidebar en mobile**: el "responsive básico" verificado
   cubre el grid de contenido (`grid-cols-1` → `md:grid-cols-2` →
   `xl:grid-cols-3`), pero el Sidebar mantiene un ancho fijo de `240px` sin
   un patrón de navegación colapsable (hamburger/drawer) para viewports
   angostos. Se deja fuera de alcance deliberadamente (evitar features
   nuevas en este sprint) — recomendado para un sprint de UI dedicado.
4. **`@supabase/supabase-js` instalado sin uso**: declarado en
   `dependencies` desde Sprint 0, todavía sin inicializar ningún cliente.
   No representa un riesgo de seguridad (no hay credenciales en el
   repositorio), pero es una dependencia "muerta" hasta el sprint de datos.
5. **Verificación de build limitada por red del entorno de desarrollo**:
   la corrección del problema de fuentes fue validada en el entorno de
   verificación actual; se recomienda una verificación adicional de
   `npm run build` en el pipeline de CI real (GitHub Actions) y en Vercel
   como confirmación final e independiente.

---

## Métricas del proyecto

| Métrica | Valor |
|---|---|
| Archivos TypeScript/TSX creados en Sprint 1 | 20 |
| Líneas de código TS/TSX (app + components + lib) | ~565 |
| Componentes reutilizables | 8 (+ AppShell) |
| Páginas/rutas | 7 (`/`, dashboard, projects, rack-builder, qa, reports, settings) |
| Workflows de CI | 3 (lint, typecheck, build) |
| Resultado `npm run lint` | ✅ 0 errores, 0 warnings |
| Resultado `npm run typecheck` | ✅ 0 errores |
| Resultado `npm run build` | ✅ 8 rutas generadas como contenido estático |
| Resultado `npm run dev` | ✅ Responde HTTP 200 en las 6 páginas, 307 en `/` (redirect) |
| Vulnerabilidades de `npm audit` | 2 moderadas (upstream, en Next.js interno — ver Riesgos) |

---

## Trabajo pendiente (fuera de alcance de Sprint 1)

- Definir modelo de datos y conectar Supabase (Sprint futuro).
- Implementar lógica real del Rack Builder, QA e Inventario.
- Formularios funcionales (Configuración, Proyectos).
- Navegación mobile colapsable para el Sidebar.
- Evaluar auto-hospedaje de fuentes tipográficas de marca.
- Completar `003-architecture.md`, `004-data-model.md` y `007-decisions.md`
  con el detalle formal de las decisiones ya tomadas en este documento.
