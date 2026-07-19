"use client";

import type { AssembledComponentView } from "@/services/rack-builder/assemble";
import type { RackSide } from "@/types/RackComponent";

export interface RackElevationViewProps {
  title: string;
  side: RackSide;
  heightU: number;
  components: AssembledComponentView[];
  selectedId: string | null;
  onSelect: (templateComponentId: string) => void;
}

const ROW_HEIGHT = 20;
const WIDTH = 280;
const LABEL_WIDTH = 34;

const STATUS_FILL: Record<AssembledComponentView["status"], string> = {
  pendiente: "var(--color-panel-raised)",
  instalado: "color-mix(in srgb, var(--color-signal-green) 25%, transparent)",
  error: "color-mix(in srgb, var(--color-signal-red) 25%, transparent)",
};

const STATUS_STROKE: Record<AssembledComponentView["status"], string> = {
  pendiente: "var(--color-line)",
  instalado: "var(--color-signal-green)",
  error: "var(--color-signal-red)",
};

type Row =
  | { kind: "empty"; u: number }
  | { kind: "component"; component: AssembledComponentView; span: number };

/**
 * Elevación de rack renderizada 100% dinámicamente: no hay ningún
 * componente hardcodeado en el SVG. Cada fila sale de cruzar la altura de
 * la plantilla con los componentes de la instancia para este lado
 * (frente/trasera). Ver assets/svg/rack-front.svg y rack-rear.svg para el
 * marco de referencia genérico equivalente.
 */
export function RackElevationView({
  title,
  side,
  heightU,
  components,
  selectedId,
  onSelect,
}: RackElevationViewProps) {
  const sideComponents = components.filter((component) => component.side === side);

  const rows: Row[] = [];
  let u = heightU;
  while (u >= 1) {
    const covering = sideComponents.find((c) => u <= c.uStart && u >= c.uEnd);
    if (covering) {
      const span = covering.uStart - covering.uEnd + 1;
      rows.push({ kind: "component", component: covering, span });
      u = covering.uEnd - 1;
    } else {
      rows.push({ kind: "empty", u });
      u -= 1;
    }
  }

  const totalHeight = heightU * ROW_HEIGHT;
  let cursorY = 0;

  return (
    <div className="rounded-panel border border-line bg-panel-raised p-3">
      <p className="mb-2 text-xs font-medium text-text-muted">{title}</p>
      <svg
        viewBox={`0 0 ${WIDTH} ${totalHeight}`}
        width="100%"
        role="img"
        aria-label={`Elevación ${title}`}
      >
        {rows.map((row) => {
          if (row.kind === "empty") {
            const y = cursorY;
            cursorY += ROW_HEIGHT;
            return (
              <g key={`empty-${row.u}`}>
                <text
                  x={LABEL_WIDTH - 6}
                  y={y + ROW_HEIGHT / 2 + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  fill="var(--color-text-faint)"
                >
                  U{row.u}
                </text>
                <rect
                  x={LABEL_WIDTH}
                  y={y}
                  width={WIDTH - LABEL_WIDTH - 4}
                  height={ROW_HEIGHT - 2}
                  rx={2}
                  fill="transparent"
                  stroke="var(--color-line)"
                  strokeDasharray="2 2"
                />
              </g>
            );
          }

          const { component, span } = row;
          const y = cursorY;
          const height = span * ROW_HEIGHT;
          cursorY += height;
          const isSelected = component.templateComponentId === selectedId;

          return (
            <g
              key={component.templateComponentId}
              onClick={() => onSelect(component.templateComponentId)}
              style={{ cursor: "pointer" }}
            >
              <text
                x={LABEL_WIDTH - 6}
                y={y + height / 2 + 3}
                textAnchor="end"
                fontSize="9"
                fontFamily="var(--font-mono)"
                fill="var(--color-text-faint)"
              >
                U{component.uStart}
              </text>
              <rect
                x={LABEL_WIDTH}
                y={y + 1}
                width={WIDTH - LABEL_WIDTH - 4}
                height={height - 2}
                rx={3}
                fill={STATUS_FILL[component.status]}
                stroke={isSelected ? "var(--color-signal-amber)" : STATUS_STROKE[component.status]}
                strokeWidth={isSelected ? 2 : 1}
              />
              <text
                x={LABEL_WIDTH + 8}
                y={y + height / 2 + 3}
                fontSize="10"
                fill="var(--color-text-primary)"
              >
                {component.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
