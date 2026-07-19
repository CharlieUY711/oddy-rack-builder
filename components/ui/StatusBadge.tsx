export type StatusTone = "operational" | "warning" | "blocked" | "pending" | "info";

export interface StatusBadgeProps {
  tone: StatusTone;
  label: string;
}

const TONE_STYLES: Record<StatusTone, { dot: string; text: string }> = {
  operational: { dot: "bg-signal-green", text: "text-signal-green" },
  warning: { dot: "bg-signal-amber", text: "text-signal-amber" },
  blocked: { dot: "bg-signal-red", text: "text-signal-red" },
  pending: { dot: "bg-text-faint", text: "text-text-muted" },
  info: { dot: "bg-signal-blue", text: "text-signal-blue" },
};

/**
 * Indicador de estado inspirado en los LEDs de estado de equipos de
 * telecom/data center (verde = operativo, ámbar = atención, rojo = falla).
 * Sprint 1: solo el componente visual, sin fuente de datos real.
 */
export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const styles = TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-raised px-2.5 py-1 text-xs font-medium ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
