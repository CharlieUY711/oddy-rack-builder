export interface ProgressBarProps {
  /** Progreso de 0 a 100. */
  value: number;
  /** Cantidad de segmentos del medidor (evoca las unidades de un rack). */
  segments?: number;
  label?: string;
}

/**
 * Medidor de progreso segmentado en vez de una barra continua:
 * referencia visual a la ocupación de unidades (U) en un rack físico,
 * en lugar de un gradiente genérico.
 * Sprint 1: solo el componente visual, sin datos reales conectados.
 */
export function ProgressBar({ value, segments = 12, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const filledSegments = Math.round((clamped / 100) * segments);

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-text-muted">{label}</span>
          <span className="font-mono text-text-primary">{clamped}%</span>
        </div>
      )}
      <div className="flex gap-0.5" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        {Array.from({ length: segments }).map((_, index) => (
          <span
            key={index}
            className={[
              "h-2 flex-1 rounded-[2px]",
              index < filledSegments ? "bg-signal-amber" : "bg-panel-raised",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
