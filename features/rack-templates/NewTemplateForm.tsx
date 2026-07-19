"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { RACK_TYPES, type RackTypeId } from "@/types/RackType";
import type { RackSide, RackTemplateComponent } from "@/types/RackComponent";
import { ComponentPreviewTable } from "./ComponentPreviewTable";

interface TemplateMetadataDraft {
  name: string;
  description: string;
  manufacturer: string;
  model: string;
  rackType: RackTypeId;
  heightU: string;
  usableU: string;
  observations: string;
}

const EMPTY_METADATA: TemplateMetadataDraft = {
  name: "",
  description: "",
  manufacturer: "",
  model: "",
  rackType: "tipo1",
  heightU: "",
  usableU: "",
  observations: "",
};

function createComponentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `draft-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function createEmptyComponent(): RackTemplateComponent {
  return {
    id: createComponentId(),
    name: "",
    manufacturer: "",
    partNumber: "PN_PLACEHOLDER",
    uStart: 1,
    uEnd: 1,
    side: "frente",
    quantity: 1,
    requiresSerial: false,
    requiresQA: false,
    requiresPhoto: false,
    comments: "",
  };
}

const selectClassName =
  "h-10 rounded-control border border-line bg-panel-raised px-3 text-sm text-text-primary outline-none transition-colors focus:border-signal-amber";

const textareaClassName =
  "rounded-control border border-line bg-panel-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-faint outline-none transition-colors focus:border-signal-amber";

/**
 * Pantalla "Nueva Plantilla". Es un formulario completamente interactivo,
 * pero sin conexión a persistencia real: al día de hoy no existe backend
 * (Supabase queda explícitamente fuera de alcance de este sprint), así que
 * "Guardar" solo confirma que el borrador está listo — no escribe datos.
 */
export function NewTemplateForm() {
  const [metadata, setMetadata] = useState<TemplateMetadataDraft>(EMPTY_METADATA);
  const [components, setComponents] = useState<RackTemplateComponent[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function updateMetadata<K extends keyof TemplateMetadataDraft>(
    key: K,
    value: TemplateMetadataDraft[K]
  ) {
    setSubmitted(false);
    setMetadata((prev) => ({ ...prev, [key]: value }));
  }

  function addComponent() {
    setSubmitted(false);
    setComponents((prev) => [...prev, createEmptyComponent()]);
  }

  function removeComponent(id: string) {
    setSubmitted(false);
    setComponents((prev) => prev.filter((component) => component.id !== id));
  }

  function updateComponent<K extends keyof RackTemplateComponent>(
    id: string,
    key: K,
    value: RackTemplateComponent[K]
  ) {
    setSubmitted(false);
    setComponents((prev) =>
      prev.map((component) => (component.id === id ? { ...component, [key]: value } : component))
    );
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Datos generales">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Nombre"
            value={metadata.name}
            onChange={(e) => updateMetadata("name", e.target.value)}
            placeholder="Rack Tipo 1 — Estándar 45U"
          />
          <Input
            label="Fabricante"
            value={metadata.manufacturer}
            onChange={(e) => updateMetadata("manufacturer", e.target.value)}
            placeholder="Genérico"
          />
          <Input
            label="Modelo"
            value={metadata.model}
            onChange={(e) => updateMetadata("model", e.target.value)}
            placeholder="PN_PLACEHOLDER"
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-muted">Tipo de rack</span>
            <select
              className={selectClassName}
              value={metadata.rackType}
              onChange={(e) => updateMetadata("rackType", e.target.value as RackTypeId)}
            >
              {RACK_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Altura (U)"
            type="number"
            min={1}
            value={metadata.heightU}
            onChange={(e) => updateMetadata("heightU", e.target.value)}
            placeholder="45"
            hint="Altura nominal del gabinete, ej. 45U"
          />
          <Input
            label="Cantidad de U utilizables"
            type="number"
            min={1}
            value={metadata.usableU}
            onChange={(e) => updateMetadata("usableU", e.target.value)}
            placeholder="42"
            hint="U disponibles para instalar componentes"
          />
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-xs font-medium text-text-muted">Descripción</span>
            <textarea
              className={textareaClassName}
              rows={2}
              value={metadata.description}
              onChange={(e) => updateMetadata("description", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-xs font-medium text-text-muted">Observaciones</span>
            <textarea
              className={textareaClassName}
              rows={2}
              value={metadata.observations}
              onChange={(e) => updateMetadata("observations", e.target.value)}
            />
          </label>
        </div>
      </Card>

      <Card
        title="Componentes de la plantilla"
        headerAccessory={
          <Button type="button" variant="secondary" size="sm" onClick={addComponent}>
            + Agregar componente
          </Button>
        }
      >
        {components.length === 0 ? (
          <p className="text-sm text-text-muted">
            Todavía no agregaste componentes. Usá &ldquo;Agregar componente&rdquo; para empezar.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {components.map((component, index) => (
              <div
                key={component.id}
                className="grid grid-cols-1 gap-3 rounded-control border border-line bg-panel-raised p-3 md:grid-cols-6"
              >
                <Input
                  label="Nombre"
                  value={component.name}
                  onChange={(e) => updateComponent(component.id, "name", e.target.value)}
                  placeholder={`Componente ${index + 1}`}
                />
                <Input
                  label="Fabricante"
                  value={component.manufacturer}
                  onChange={(e) => updateComponent(component.id, "manufacturer", e.target.value)}
                />
                <Input
                  label="Part Number"
                  value={component.partNumber}
                  onChange={(e) => updateComponent(component.id, "partNumber", e.target.value)}
                />
                <Input
                  label="U inicial"
                  type="number"
                  min={1}
                  value={component.uStart}
                  onChange={(e) =>
                    updateComponent(component.id, "uStart", Number(e.target.value) || 1)
                  }
                />
                <Input
                  label="U final"
                  type="number"
                  min={1}
                  value={component.uEnd}
                  onChange={(e) =>
                    updateComponent(component.id, "uEnd", Number(e.target.value) || 1)
                  }
                />
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-text-muted">Lado</span>
                  <select
                    className={selectClassName}
                    value={component.side}
                    onChange={(e) =>
                      updateComponent(component.id, "side", e.target.value as RackSide)
                    }
                  >
                    <option value="frente">Frente</option>
                    <option value="trasera">Trasera</option>
                  </select>
                </label>
                <Input
                  label="Cantidad"
                  type="number"
                  min={1}
                  value={component.quantity}
                  onChange={(e) =>
                    updateComponent(component.id, "quantity", Number(e.target.value) || 1)
                  }
                />
                <label className="flex items-center gap-2 pt-6 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-signal-amber"
                    checked={component.requiresSerial}
                    onChange={(e) =>
                      updateComponent(component.id, "requiresSerial", e.target.checked)
                    }
                  />
                  Requiere Serial
                </label>
                <label className="flex items-center gap-2 pt-6 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-signal-amber"
                    checked={component.requiresQA}
                    onChange={(e) => updateComponent(component.id, "requiresQA", e.target.checked)}
                  />
                  Requiere QA
                </label>
                <label className="flex items-center gap-2 pt-6 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-signal-amber"
                    checked={component.requiresPhoto}
                    onChange={(e) =>
                      updateComponent(component.id, "requiresPhoto", e.target.checked)
                    }
                  />
                  Requiere Foto
                </label>
                <label className="flex flex-col gap-1.5 md:col-span-3">
                  <span className="text-xs font-medium text-text-muted">Comentarios</span>
                  <input
                    className="h-10 rounded-control border border-line bg-ink px-3 text-sm text-text-primary outline-none focus:border-signal-amber"
                    value={component.comments ?? ""}
                    onChange={(e) => updateComponent(component.id, "comments", e.target.value)}
                  />
                </label>
                <div className="flex items-end md:col-span-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent(component.id)}
                  >
                    Eliminar componente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Vista previa">
        <ComponentPreviewTable components={components} />
      </Card>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSubmit}>
          Guardar plantilla
        </Button>
        {submitted && (
          <span className="text-xs text-text-muted">
            Borrador validado — la persistencia real llegará cuando se conecte Supabase. Todavía
            no se guarda nada.
          </span>
        )}
      </div>
    </div>
  );
}
