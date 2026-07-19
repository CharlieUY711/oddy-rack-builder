// Sprint 2 — SPEC-001 Rack Templates
//
// Repository Pattern: el resto de la aplicación (paginas, features) nunca
// debe leer los archivos de /data directamente. Siempre pasa por
// TemplateRepository. Esto permite reemplazar la implementación JSON por
// una implementación Supabase en un sprint futuro sin tocar el resto del
// código — solo cambia qué implementación devuelve getTemplateRepository().

import type { RackTemplate } from "@/types/RackTemplate";

import rackTipo1 from "@/data/rack_tipo1.json";
import rackTipo2 from "@/data/rack_tipo2.json";
import rackTipo3 from "@/data/rack_tipo3.json";
import rackHalf from "@/data/rack_half.json";

export interface TemplateRepository {
  list(): Promise<RackTemplate[]>;
  getById(id: string): Promise<RackTemplate | null>;
}

/**
 * Implementación temporal: lee las plantillas desde los archivos JSON
 * estáticos de /data. Sin escritura — crear/editar plantillas queda fuera
 * de alcance hasta contar con una capa de persistencia real (Supabase).
 */
export class JsonTemplateRepository implements TemplateRepository {
  private readonly templates: RackTemplate[] = [
    rackTipo1 as RackTemplate,
    rackTipo2 as RackTemplate,
    rackTipo3 as RackTemplate,
    rackHalf as RackTemplate,
  ];

  async list(): Promise<RackTemplate[]> {
    return this.templates;
  }

  async getById(id: string): Promise<RackTemplate | null> {
    return this.templates.find((template) => template.id === id) ?? null;
  }
}

let repositoryInstance: TemplateRepository | null = null;

/**
 * Punto único de acceso al repositorio activo. El día que exista una
 * implementación Supabase, este factory es el único lugar a modificar.
 */
export function getTemplateRepository(): TemplateRepository {
  if (!repositoryInstance) {
    repositoryInstance = new JsonTemplateRepository();
  }
  return repositoryInstance;
}
