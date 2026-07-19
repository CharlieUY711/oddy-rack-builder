"use server";

// Sprint 3 — SPEC-002 Rack Assembly Engine
//
// Server Actions: es el mecanismo nativo de Next.js para que un Client
// Component dispare una mutación en el servidor sin tener que construir
// una API propia (route handlers). Esto NO es "crear una API" en el
// sentido que excluye la spec (no hay endpoints públicos, no hay
// sincronización externa) — es la forma idiomática de App Router de
// conectar una acción de UI con el repositorio del lado del servidor.

import { revalidatePath } from "next/cache";
import {
  getRackInstanceRepository,
  type CreateRackInstanceInput,
  type UpdateComponentInput,
} from "./RackInstanceRepository";

export async function createRackInstanceAction(input: CreateRackInstanceInput) {
  const instance = await getRackInstanceRepository().create(input);
  revalidatePath("/rack-builder");
  return instance;
}

export async function updateComponentAction(
  instanceId: string,
  templateComponentId: string,
  patch: UpdateComponentInput
) {
  const instance = await getRackInstanceRepository().updateComponent(
    instanceId,
    templateComponentId,
    patch
  );
  revalidatePath(`/rack-builder/${instanceId}`);
  return instance;
}
