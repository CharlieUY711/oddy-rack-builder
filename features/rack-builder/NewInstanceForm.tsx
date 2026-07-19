"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import type { RackTemplate } from "@/types/RackTemplate";
import { createRackInstanceAction } from "@/services/rack-builder/actions";

export interface NewInstanceFormProps {
  templates: RackTemplate[];
}

const selectClassName =
  "h-10 rounded-control border border-line bg-panel-raised px-3 text-sm text-text-primary outline-none transition-colors focus:border-signal-amber";

/**
 * Formulario de "Nueva Rack Instance": el técnico elige una plantilla y la
 * instancia se genera automáticamente (todos sus componentes en estado
 * "pendiente"), lista para empezar el ensamblado.
 */
export function NewInstanceForm({ templates }: NewInstanceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !templateId) {
      setError("Completá al menos el nombre y la plantilla.");
      return;
    }

    startTransition(async () => {
      try {
        const instance = await createRackInstanceAction({
          name: name.trim(),
          projectName: projectName.trim() || "Sin proyecto asignado",
          templateId,
        });
        router.push(`/rack-builder/${instance.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo crear la instancia.");
      }
    });
  }

  return (
    <Card title="Nueva Rack Instance">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rack 03 — Sala Norte"
          />
          <Input
            label="Proyecto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Proyecto de ejemplo (placeholder)"
          />
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-xs font-medium text-text-muted">Plantilla</span>
            <select
              className={selectClassName}
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="text-xs text-signal-red">{error}</p>}

        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Generando..." : "Generar Rack Instance"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
