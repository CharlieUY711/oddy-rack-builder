import Link from "next/link";
import { Button, PageHeader } from "@/components/ui";
import { TemplateCard } from "@/features/rack-templates";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";

export default async function RackTemplatesPage() {
  const templates = await getTemplateRepository().list();

  return (
    <>
      <PageHeader
        unit="U03"
        title="Rack Templates"
        description="Plantillas que definen cómo debe estar compuesto un rack. El Rack Builder (sprint futuro) siempre leerá desde acá — nunca desde datos hardcodeados."
        action={
          <Link href="/rack-templates/new">
            <Button>+ Nueva Plantilla</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </>
  );
}
