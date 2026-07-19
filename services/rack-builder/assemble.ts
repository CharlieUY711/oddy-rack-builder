// Sprint 3 — SPEC-002 Rack Assembly Engine
//
// Funciones puras que cruzan RackTemplate + RackInstance. Ningún componente
// de UI debe leer datos "planos" de un lado u otro por separado para
// mostrar la vista de ensamblado — siempre pasan por acá, para que la
// regla "el Builder nunca conoce componentes hardcodeados, siempre lee la
// plantilla" se cumpla en un único lugar.

import type { RackTemplate } from "@/types/RackTemplate";
import type { RackTemplateComponent } from "@/types/RackComponent";
import type { RackInstance, RackInstanceComponent } from "@/types/Rack";

/** Vista combinada: estructura de la plantilla + estado de ensamblado. */
export interface AssembledComponentView extends RackTemplateComponent, RackInstanceComponent {}

export interface ProgressSummary {
  total: number;
  installed: number;
  errors: number;
  pending: number;
  percentage: number;
}

/**
 * Combina los componentes definidos en la plantilla con el estado de
 * ensamblado guardado en la instancia. Si la plantilla agrega un
 * componente nuevo después de crear la instancia, igual aparece (como
 * "pendiente"), ya que la estructura siempre se lee en vivo desde el
 * template.
 */
export function assembleComponentViews(
  template: RackTemplate,
  instance: RackInstance
): AssembledComponentView[] {
  const instanceByTemplateId = new Map<string, RackInstanceComponent>(
    instance.components.map((component) => [component.templateComponentId, component])
  );

  return template.components.map((templateComponent) => {
    const instanceComponent = instanceByTemplateId.get(templateComponent.id) ?? {
      templateComponentId: templateComponent.id,
      status: "pendiente" as const,
      expectedPartNumber: templateComponent.partNumber,
    };

    return { ...templateComponent, ...instanceComponent };
  });
}

/** Deriva automáticamente el estado general de la instancia. Nunca se setea a mano. */
export function deriveInstanceStatus(
  components: RackInstanceComponent[]
): RackInstance["status"] {
  if (components.length === 0) return "pendiente";
  const allInstalled = components.every((component) => component.status === "instalado");
  if (allInstalled) return "completo";
  const anyProgress = components.some((component) => component.status !== "pendiente");
  return anyProgress ? "en_progreso" : "pendiente";
}

export function calculateProgress(components: RackInstanceComponent[]): ProgressSummary {
  const total = components.length;
  const installed = components.filter((c) => c.status === "instalado").length;
  const errors = components.filter((c) => c.status === "error").length;
  const pending = total - installed - errors;
  const percentage = total === 0 ? 0 : Math.round((installed / total) * 100);

  return { total, installed, errors, pending, percentage };
}

/**
 * Deriva el estado de un componente a partir del PN leído, sin que el
 * técnico tenga que elegir un estado a mano:
 * - Sin PN leído todavía            -> "pendiente"
 * - PN leído coincide con esperado  -> "instalado"
 * - PN leído no coincide            -> "error" (posible componente equivocado)
 */
export function deriveComponentStatus(
  expectedPartNumber: string,
  readPartNumber: string | undefined
): RackInstanceComponent["status"] {
  const read = readPartNumber?.trim();
  if (!read) return "pendiente";
  return read.toLowerCase() === expectedPartNumber.trim().toLowerCase() ? "instalado" : "error";
}
