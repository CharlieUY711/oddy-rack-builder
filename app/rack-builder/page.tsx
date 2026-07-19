import Link from "next/link";
import { Button, PageHeader } from "@/components/ui";
import { InstanceCard } from "@/features/rack-builder";
import { getRackInstanceRepository } from "@/services/rack-builder/RackInstanceRepository";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";

export default async function RackBuilderPage() {
  const [instances, templates] = await Promise.all([
    getRackInstanceRepository().list(),
    getTemplateRepository().list(),
  ]);

  const templateNameById = new Map(templates.map((template) => [template.id, template.name]));

  return (
    <>
      <PageHeader
        unit="U04"
        title="Rack Builder"
        description="Rack Instances generadas a partir de una plantilla. Cada una registra su propio avance de ensamblado."
        action={
          <Link href="/rack-builder/new">
            <Button>+ Nueva Rack Instance</Button>
          </Link>
        }
      />

      {instances.length === 0 ? (
        <p className="text-sm text-text-muted">
          Todavía no hay ninguna Rack Instance. Creá una desde una plantilla para empezar el
          ensamblado.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {instances.map((instance) => (
            <InstanceCard
              key={instance.id}
              instance={instance}
              templateName={templateNameById.get(instance.templateId) ?? instance.templateId}
            />
          ))}
        </div>
      )}
    </>
  );
}
