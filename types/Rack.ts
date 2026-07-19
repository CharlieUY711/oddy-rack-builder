// Sprint 3 — SPEC-002 Rack Assembly Engine
//
// RackInstance representa un rack REAL, generado a partir de un
// RackTemplate. A diferencia de la plantilla (que nunca cambia y nunca
// guarda estado), la instancia sí muta: cada componente lleva su propio
// estado de ensamblado.
//
// Importante: RackInstanceComponent NO duplica los datos estructurales del
// componente (nombre, fabricante, posición U, lado, etc.) — esos siguen
// viviendo únicamente en RackTemplate. Acá solo se guarda lo que cambia
// durante el ensamblado, enlazado por `templateComponentId`. La vista final
// (Checklist, elevación, panel derecho) se arma cruzando plantilla +
// instancia — ver services/rack-builder/assemble.ts.

import type { SerialNumber } from "./SerialNumber";

export type ComponentAssemblyStatus = "pendiente" | "instalado" | "error";

export type RackInstanceStatus = "pendiente" | "en_progreso" | "completo";

export interface RackInstanceComponent {
  /** Igual al id del componente en el RackTemplate de origen. */
  templateComponentId: string;
  status: ComponentAssemblyStatus;
  /** Copiado del template al crear la instancia — nunca se edita. */
  expectedPartNumber: string;
  /** Lo que el técnico registra al instalar. */
  readPartNumber?: string;
  serialNumber?: SerialNumber;
  observations?: string;
}

export interface RackInstance {
  id: string;
  name: string;
  /** Placeholder de texto libre — todavía no existe relación real a Project. */
  projectName: string;
  templateId: string;
  status: RackInstanceStatus;
  createdAt: string;
  updatedAt: string;
  components: RackInstanceComponent[];
}
