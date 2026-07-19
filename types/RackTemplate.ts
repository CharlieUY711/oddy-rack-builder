// Sprint 2 — SPEC-001 Rack Templates
//
// RackTemplate es la entidad central de este sprint: define COMO debe estar
// compuesto un rack. Ningun otro modulo (Rack Builder, QA, Inventario)
// conocera datos "hardcodeados" — todos leeran esta estructura a traves de
// TemplateRepository.
//
// Nota de interpretacion (ver docs/011-rack-template-spec.md): la spec pide
// dos campos de altura ("Altura (45U)" y "Cantidad de U"). Se modelan como
// dos medidas distintas y legitimas en la practica: la altura nominal del
// gabinete en U (heightU, ej. un "rack de 45U") y la cantidad de U
// realmente utilizables/instalables (usableU), que puede ser menor por
// espacio de ventilacion, PDU vertical, o rieles superiores/inferiores.

import type { RackTypeId } from "./RackType";
import type { RackTemplateComponent } from "./RackComponent";

export interface RackTemplate {
  id: string;
  name: string;
  description?: string;
  manufacturer: string;
  model: string;
  rackType: RackTypeId;
  /** Altura nominal del gabinete, en U (ej. 45). */
  heightU: number;
  /** Cantidad de U efectivamente utilizables/instalables. */
  usableU: number;
  observations?: string;
  components: RackTemplateComponent[];
}
