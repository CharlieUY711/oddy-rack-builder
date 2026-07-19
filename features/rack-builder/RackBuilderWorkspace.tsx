"use client";

import { useMemo, useState } from "react";
import { Card, ProgressBar } from "@/components/ui";
import type { RackTemplate } from "@/types/RackTemplate";
import type { RackInstance } from "@/types/Rack";
import {
  assembleComponentViews,
  calculateProgress,
  deriveComponentStatus,
} from "@/services/rack-builder/assemble";
import type { UpdateComponentInput } from "@/services/rack-builder/RackInstanceRepository";
import { updateComponentAction } from "@/services/rack-builder/actions";
import { Checklist } from "./Checklist";
import { RackElevationView } from "./RackElevationView";
import { ComponentPanel } from "./ComponentPanel";

export interface RackBuilderWorkspaceProps {
  instance: RackInstance;
  template: RackTemplate;
}

/**
 * Pantalla principal de ensamblado: Checklist (izquierda) + vista frontal/
 * trasera (centro) + panel del componente seleccionado (derecha). Toda la
 * data sale de cruzar template + instanceState — nada hardcodeado.
 */
export function RackBuilderWorkspace({ instance, template }: RackBuilderWorkspaceProps) {
  const [instanceState, setInstanceState] = useState(instance);
  const [selectedId, setSelectedId] = useState<string | null>(
    template.components[0]?.id ?? null
  );

  const assembled = useMemo(
    () => assembleComponentViews(template, instanceState),
    [template, instanceState]
  );

  const selectedComponent =
    assembled.find((component) => component.templateComponentId === selectedId) ?? null;

  const progress = calculateProgress(instanceState.components);

  async function handleSave(templateComponentId: string, patch: UpdateComponentInput) {
    const status = deriveComponentStatus(
      selectedComponent?.expectedPartNumber ?? "",
      patch.readPartNumber
    );

    const updated = await updateComponentAction(instanceState.id, templateComponentId, {
      ...patch,
      status,
    });

    if (updated) {
      setInstanceState(updated);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Progreso de ensamblado">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <ProgressBar
            value={progress.percentage}
            segments={template.heightU > 30 ? 30 : template.heightU}
            label={`${progress.installed} de ${progress.total} instalados`}
          />
          <div className="flex gap-4 text-xs text-text-muted">
            <span>Pendientes: {progress.pending}</span>
            <span className="text-signal-red">Errores: {progress.errors}</span>
            <span className="font-mono text-text-primary">{progress.percentage}%</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr_320px]">
        <Card title="Checklist">
          <Checklist components={assembled} selectedId={selectedId} onSelect={setSelectedId} />
        </Card>

        <div className="flex flex-col gap-4">
          <RackElevationView
            title="Vista Frontal"
            side="frente"
            heightU={template.heightU}
            components={assembled}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <RackElevationView
            title="Vista Trasera"
            side="trasera"
            heightU={template.heightU}
            components={assembled}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <ComponentPanel component={selectedComponent} onSave={handleSave} />
      </div>
    </div>
  );
}
