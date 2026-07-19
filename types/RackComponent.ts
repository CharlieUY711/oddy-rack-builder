// Sprint 2 — SPEC-001 Rack Templates
// Estructura de un componente dentro de una plantilla de rack.
// Un RackTemplateComponent describe una POSICION a ocupar (ej. "U45, Patch
// Panel, frente"), no una unidad fisica serializada — eso corresponde a
// Rack Instance / SerialNumber en un sprint futuro.

export type RackSide = "frente" | "trasera";

export interface RackTemplateComponent {
  /** Identificador estable dentro de la plantilla (ej. "cmp-001"). */
  id: string;
  name: string;
  manufacturer: string;
  /** Part Number. Usar "PN_PLACEHOLDER" hasta contar con ingenieria definitiva. */
  partNumber: string;
  /** Unidad de rack superior que ocupa (ej. 45). */
  uStart: number;
  /** Unidad de rack inferior que ocupa (igual a uStart si ocupa 1U). */
  uEnd: number;
  side: RackSide;
  quantity: number;
  requiresSerial: boolean;
  requiresQA: boolean;
  requiresPhoto: boolean;
  comments?: string;
}
