import { PageHeader } from "@/components/ui";
import { NewInstanceForm } from "@/features/rack-builder";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";

export default async function NewRackInstancePage() {
  const templates = await getTemplateRepository().list();

  return (
    <>
      <PageHeader
        unit="U04"
        title="Nueva Rack Instance"
        description="Elegí una plantilla — la instancia se genera automáticamente con todos sus componentes en estado pendiente."
      />
      <NewInstanceForm templates={templates} />
    </>
  );
}
