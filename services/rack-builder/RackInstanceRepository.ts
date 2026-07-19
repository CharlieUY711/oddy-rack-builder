// Sprint 3 — SPEC-002 Rack Assembly Engine
//
// Repository Pattern para RackInstance, igual en espíritu a
// TemplateRepository (Sprint 2): el resto de la app nunca crea ni edita
// instancias directamente, siempre pasa por acá.
//
// Nota de persistencia (ver docs/012-rack-assembly-engine.md): "Continuar
// utilizando JSON" + "No conectar Supabase" + "No API" implica que, sin un
// backend real, no hay forma de persistir en disco desde el navegador. La
// implementación actual mantiene las instancias en memoria del proceso de
// servidor (Server Actions), lo cual alcanza para trabajar una sesión de
// ensamblado completa, pero NO sobrevive a un reinicio del servidor. Cuando
// se conecte Supabase, solo esta clase cambia.

import type { RackInstance, RackInstanceComponent } from "@/types/Rack";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";
import { deriveInstanceStatus } from "./assemble";

export interface CreateRackInstanceInput {
  name: string;
  projectName: string;
  templateId: string;
}

export interface UpdateComponentInput {
  status?: RackInstanceComponent["status"];
  readPartNumber?: string;
  serialNumber?: string;
  observations?: string;
}

export interface RackInstanceRepository {
  list(): Promise<RackInstance[]>;
  getById(id: string): Promise<RackInstance | null>;
  create(input: CreateRackInstanceInput): Promise<RackInstance>;
  updateComponent(
    instanceId: string,
    templateComponentId: string,
    patch: UpdateComponentInput
  ): Promise<RackInstance | null>;
}

let nextInstanceSeq = 1;

export class InMemoryRackInstanceRepository implements RackInstanceRepository {
  private instances: RackInstance[] = [];

  async list(): Promise<RackInstance[]> {
    return this.instances;
  }

  async getById(id: string): Promise<RackInstance | null> {
    return this.instances.find((instance) => instance.id === id) ?? null;
  }

  async create(input: CreateRackInstanceInput): Promise<RackInstance> {
    const template = await getTemplateRepository().getById(input.templateId);
    if (!template) {
      throw new Error(`No existe una plantilla con id "${input.templateId}".`);
    }

    const now = new Date().toISOString();
    const components: RackInstanceComponent[] = template.components.map((component) => ({
      templateComponentId: component.id,
      status: "pendiente",
      expectedPartNumber: component.partNumber,
    }));

    const instance: RackInstance = {
      id: `rack-${nextInstanceSeq++}`,
      name: input.name,
      projectName: input.projectName,
      templateId: input.templateId,
      status: deriveInstanceStatus(components),
      createdAt: now,
      updatedAt: now,
      components,
    };

    this.instances.push(instance);
    return instance;
  }

  async updateComponent(
    instanceId: string,
    templateComponentId: string,
    patch: UpdateComponentInput
  ): Promise<RackInstance | null> {
    const instance = this.instances.find((item) => item.id === instanceId);
    if (!instance) return null;

    let found = false;
    const components = instance.components.map((component) => {
      if (component.templateComponentId !== templateComponentId) return component;
      found = true;
      return { ...component, ...patch };
    });

    if (!found) {
      components.push({
        templateComponentId,
        status: patch.status ?? "pendiente",
        expectedPartNumber: "",
        readPartNumber: patch.readPartNumber,
        serialNumber: patch.serialNumber,
        observations: patch.observations,
      });
    }

    instance.components = components;
    instance.status = deriveInstanceStatus(components);
    instance.updatedAt = new Date().toISOString();

    return instance;
  }
}

let repositoryInstance: RackInstanceRepository | null = null;

export function getRackInstanceRepository(): RackInstanceRepository {
  if (!repositoryInstance) {
    repositoryInstance = new InMemoryRackInstanceRepository();
  }
  return repositoryInstance;
}
