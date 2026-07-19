// Sprint 2 — SPEC-001 Rack Templates
// Enumeracion de los tipos de rack soportados por el motor de plantillas.
// Esto es catalogo/estructura, no logica de negocio: define QUE tipos existen,
// no COMO se arma un rack (eso vive en cada RackTemplate).

export type RackTypeId = "tipo1" | "tipo2" | "tipo3" | "half";

export interface RackTypeDefinition {
  id: RackTypeId;
  label: string;
}

export const RACK_TYPES: RackTypeDefinition[] = [
  { id: "tipo1", label: "Tipo 1" },
  { id: "tipo2", label: "Tipo 2" },
  { id: "tipo3", label: "Tipo 3" },
  { id: "half", label: "Half Rack" },
];

export function getRackTypeLabel(id: RackTypeId): string {
  return RACK_TYPES.find((type) => type.id === id)?.label ?? id;
}
