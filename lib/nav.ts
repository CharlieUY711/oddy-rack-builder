// Sprint 1: configuracion estatica de navegacion del shell.
// Esto es estructura de UI (que paginas existen y en que orden), no logica de negocio.

export interface NavItem {
  /** Etiqueta visible en el sidebar. */
  label: string;
  /** Ruta destino dentro de app/. */
  href: string;
  /**
   * Tag tipo "unidad de rack" (U01, U02, ...) mostrado en mono junto al label.
   * Referencia directa al dominio: en un rack fisico las posiciones se
   * numeran como unidades (U). Se usa como indice de navegacion, no como
   * decoracion generica.
   */
  unit: string;
}

export const NAV_ITEMS: NavItem[] = [
  { unit: "U01", label: "Dashboard", href: "/dashboard" },
  { unit: "U02", label: "Proyectos", href: "/projects" },
  { unit: "U03", label: "Rack Templates", href: "/rack-templates" },
  { unit: "U04", label: "Rack Builder", href: "/rack-builder" },
  { unit: "U05", label: "QA", href: "/qa" },
  { unit: "U06", label: "Reportes", href: "/reports" },
  { unit: "U07", label: "Configuración", href: "/settings" },
];
