# ODDY Rack Builder

## Descripción

ODDY Rack Builder es una aplicación web para gestionar el armado, control de
calidad y trazabilidad de racks para proyectos de Data Centers.

## Objetivo

Centralizar y estandarizar el proceso de construcción de racks —desde el
armado físico hasta su control de calidad y documentación—, sentando una base
escalable para futuras funcionalidades de inventario, producción, QA,
etiquetado, reportes, gestión documental, pedidos y logística.

> **Estado actual: Sprint 3 — Rack Assembly Engine (cerrado).**
> Ya existe el motor de ensamblado: `RackInstance` generada desde una
> `RackTemplate`, checklist automático, vista frontal/trasera renderizada
> dinámicamente en SVG, y registro de PN leído/Serial Number/Observaciones
> con progreso calculado en vivo. Todavía no hay QA, Inventario, Etiquetas
> ni conexión a Supabase — ver
> [`docs/012-rack-assembly-engine.md`](./docs/012-rack-assembly-engine.md)
> para el detalle completo del sprint.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [GitHub](https://github.com/)
- ESLint
- Prettier

## Estructura del proyecto

```
Builder/
│
├── app
├── components
├── features
│   ├── dashboard
│   ├── projects
│   ├── racks
│   ├── builder
│   ├── qa
│   ├── labels
│   ├── reports
│
├── hooks
├── lib
├── services
├── store
├── types
├── utils
├── styles
│
├── assets
│   ├── logos
│   ├── icons
│   ├── svg
│   ├── templates
│   ├── labels
│   ├── photos
│
├── public
│   ├── svg
│   ├── images
│
├── data
├── docs
├── scripts
│
├── supabase
│   ├── migrations
│   ├── schema
│   ├── seed
│
├── tests
│
├── library
│   ├── ANTEL
│   ├── SONDA
│   ├── CPI
│   ├── CommScope
│   ├── Vertiv
│   ├── Huawei
│   ├── WESCO
│   ├── Standards
│   ├── Datasheets
│
└── .github
    └── workflows
```

## Roadmap

| Sprint | Alcance |
|--------|---------|
| Sprint 0 | Inicialización del proyecto: arquitectura, estructura de carpetas, configuración base. ✅ |
| Sprint 1 | Foundation: shell visual (Sidebar/TopBar/Main/Footer), navegación con páginas placeholder, sistema de componentes y tema visual. ✅ |
| Sprint 2 | Rack Templates: modelo de datos, Repository Pattern (JSON), pantallas de listado/detalle/creación de plantillas. ✅ |
| Sprint 3 | Rack Assembly Engine: RackInstance, checklist automático, vista SVG dinámica, registro de PN/Serial y progreso. ✅ |
| Sprint 4+ | QA, Inventario, Etiquetas, conexión a Supabase (a definir). |
| Futuro | Inventario, Producción, QA, Etiquetado, Reportes, Gestión documental, Pedidos, Logística. |

Ver el detalle en [`docs/006-roadmap.md`](./docs/006-roadmap.md).

## Cómo ejecutar localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/CharlieUY711/oddy-rack-builder.git
cd oddy-rack-builder

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar los valores de Supabase en .env.local

# 4. Ejecutar en modo desarrollo
npm run dev
```

## Convenciones

- Rama principal: `main`.
- Commits descriptivos en español o inglés, en modo imperativo (`Add`, `Fix`, `Update`).
- Código en TypeScript estricto.
- Formateo con Prettier, linting con ESLint (ver workflows en `.github/workflows`).
- La documentación funcional y técnica vive en `docs/`.
- Los tipos compartidos viven en `types/`.
- Cada dominio funcional futuro se organiza como un módulo dentro de `features/`.

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](./LICENSE).
