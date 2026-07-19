"use client";

import { useState } from "react";
import { Button, Card, Input, StatusBadge } from "@/components/ui";
import type { AssembledComponentView } from "@/services/rack-builder/assemble";
import type { UpdateComponentInput } from "@/services/rack-builder/RackInstanceRepository";

export interface ComponentPanelProps {
  component: AssembledComponentView | null;
  onSave: (templateComponentId: string, patch: UpdateComponentInput) => Promise<void>;
}

const STATUS_LABEL = {
  pendiente: "Pendiente",
  instalado: "Instalado",
  error: "Error",
} as const;

const STATUS_TONE = {
  pendiente: "pending",
  instalado: "operational",
  error: "blocked",
} as const;

/**
 * Panel del componente seleccionado. El estado (Pendiente/Instalado/Error)
 * nunca se elige a mano: se deriva automáticamente comparando el PN leído
 * contra el PN esperado (ver deriveComponentStatus).
 *
 * El padre (RackBuilderWorkspace) debe montar este componente con
 * `key={component.templateComponentId}` para que el formulario se
 * reinicie limpio al cambiar de selección, en vez de sincronizar props a
 * estado con useEffect (patrón desaconsejado — ver react-hooks/set-state-in-effect).
 */
export function ComponentPanel({ component, onSave }: ComponentPanelProps) {
  if (!component) {
    return (
      <Card title="Componente">
        <p className="text-sm text-text-muted">
          Seleccioná un componente del checklist o de la vista para ver su detalle acá.
        </p>
      </Card>
    );
  }

  return (
    <ComponentPanelForm key={component.templateComponentId} component={component} onSave={onSave} />
  );
}

interface ComponentPanelFormProps {
  component: AssembledComponentView;
  onSave: (templateComponentId: string, patch: UpdateComponentInput) => Promise<void>;
}

function ComponentPanelForm({ component, onSave }: ComponentPanelFormProps) {
  const [readPartNumber, setReadPartNumber] = useState(component.readPartNumber ?? "");
  const [serialNumber, setSerialNumber] = useState(component.serialNumber ?? "");
  const [observations, setObservations] = useState(component.observations ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(component.templateComponentId, {
        readPartNumber: readPartNumber.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        observations: observations.trim() || undefined,
      });
      setSavedAt(Date.now());
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card
      title={component.name}
      headerAccessory={
        <StatusBadge tone={STATUS_TONE[component.status]} label={STATUS_LABEL[component.status]} />
      }
    >
      <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-text-muted">Fabricante</dt>
        <dd className="text-text-primary">{component.manufacturer}</dd>

        <dt className="text-text-muted">PN esperado</dt>
        <dd className="font-mono text-text-primary">{component.expectedPartNumber}</dd>
      </dl>

      <div className="flex flex-col gap-3">
        <Input
          label="PN leído"
          value={readPartNumber}
          onChange={(e) => setReadPartNumber(e.target.value)}
          placeholder="Escaneá o tipeá el PN instalado"
        />
        {component.requiresSerial && (
          <Input
            label="Serial Number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="N.º de serie"
          />
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Observaciones</span>
          <textarea
            className="rounded-control border border-line bg-panel-raised px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-signal-amber"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
        {savedAt && <span className="text-xs text-text-muted">Guardado.</span>}
      </div>
    </Card>
  );
}
