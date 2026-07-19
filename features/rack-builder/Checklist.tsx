import { StatusBadge } from "@/components/ui";
import type { AssembledComponentView } from "@/services/rack-builder/assemble";
import type { ComponentAssemblyStatus } from "@/types/Rack";

export interface ChecklistProps {
  components: AssembledComponentView[];
  selectedId: string | null;
  onSelect: (templateComponentId: string) => void;
}

const STATUS_LABEL: Record<ComponentAssemblyStatus, string> = {
  pendiente: "Pendiente",
  instalado: "Instalado",
  error: "Error",
};

const STATUS_TONE: Record<ComponentAssemblyStatus, "pending" | "operational" | "blocked"> = {
  pendiente: "pending",
  instalado: "operational",
  error: "blocked",
};

/**
 * Checklist construido 100% a partir de la RackInstance (vía
 * assembleComponentViews) — no existe ningún componente hardcodeado acá.
 */
export function Checklist({ components, selectedId, onSelect }: ChecklistProps) {
  const sorted = [...components].sort((a, b) => b.uStart - a.uStart);

  return (
    <ul className="flex flex-col gap-1">
      {sorted.map((component) => {
        const isSelected = component.templateComponentId === selectedId;
        return (
          <li key={component.templateComponentId}>
            <button
              type="button"
              onClick={() => onSelect(component.templateComponentId)}
              className={[
                "flex w-full items-center justify-between gap-2 rounded-control border px-3 py-2 text-left text-sm transition-colors",
                isSelected
                  ? "border-signal-amber bg-panel-raised text-text-primary"
                  : "border-transparent text-text-muted hover:bg-panel-raised hover:text-text-primary",
              ].join(" ")}
            >
              <span className="flex flex-col">
                <span className="font-mono text-[11px] text-text-faint">
                  U{component.uStart}
                  {component.uStart !== component.uEnd ? `–U${component.uEnd}` : ""}
                </span>
                <span>{component.name}</span>
              </span>
              <StatusBadge tone={STATUS_TONE[component.status]} label={STATUS_LABEL[component.status]} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
