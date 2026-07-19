import { PageHeader } from "@/components/ui";
import { NewTemplateForm } from "@/features/rack-templates";

export default function NewRackTemplatePage() {
  return (
    <>
      <PageHeader
        unit="U03"
        title="Nueva Plantilla"
        description="Definí una nueva plantilla de rack. Sin persistencia real todavía — el guardado se conectará cuando exista una capa de datos."
      />
      <NewTemplateForm />
    </>
  );
}
