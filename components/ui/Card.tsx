import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Título opcional mostrado en el encabezado interno de la card. */
  title?: string;
  /** Contenido accesorio alineado a la derecha del título (ej. un StatusBadge). */
  headerAccessory?: ReactNode;
}

/**
 * Contenedor base tipo "panel" del sistema de diseño.
 * Sprint 1: puramente presentacional, sin datos reales.
 */
export function Card({ title, headerAccessory, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-panel border border-line bg-panel p-5",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.02)_inset]",
        className,
      ].join(" ")}
      {...props}
    >
      {(title || headerAccessory) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="font-display text-sm font-medium text-text-primary">{title}</h3>
          )}
          {headerAccessory}
        </div>
      )}
      {children}
    </div>
  );
}
