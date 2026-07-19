import type { ReactNode } from "react";

export interface PageHeaderProps {
  /** Tag mono de la sección, ej. "U01". Refuerza la numeración de rack del sidebar. */
  unit?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Encabezado estándar de página. Usado por cada placeholder de Sprint 1
 * y pensado para reutilizarse cuando cada módulo tenga contenido real.
 */
export function PageHeader({ unit, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
      <div>
        {unit && (
          <span className="font-mono text-xs tracking-wide text-signal-amber">{unit}</span>
        )}
        <h1 className="font-display text-xl font-semibold text-text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
