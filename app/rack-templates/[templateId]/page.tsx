import { notFound } from "next/navigation";
import { Card, PageHeader, StatusBadge } from "@/components/ui";
import { ComponentPreviewTable } from "@/features/rack-templates";
import { getRackTypeLabel } from "@/types/RackType";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";

interface RackTemplateDetailPageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateStaticParams() {
  const templates = await getTemplateRepository().list();
  return templates.map((template) => ({ templateId: template.id }));
}

export default async function RackTemplateDetailPage({ params }: RackTemplateDetailPageProps) {
  const { templateId } = await params;
  const template = await getTemplateRepository().getById(templateId);

  if (!template) {
    notFound();
  }

  return (
    <>
      <PageHeader
        unit="U03"
        title={template.name}
        description={template.description}
        action={<StatusBadge tone="info" label={getRackTypeLabel(template.rackType)} />}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Fabricante">
          <p className="text-sm text-text-primary">{template.manufacturer}</p>
        </Card>
        <Card title="Modelo">
          <p className="font-mono text-sm text-text-primary">{template.model}</p>
        </Card>
        <Card title="Altura">
          <p className="text-sm text-text-primary">{template.heightU}U</p>
        </Card>
        <Card title="U utilizables">
          <p className="text-sm text-text-primary">{template.usableU}U</p>
        </Card>
      </div>

      {template.observations && (
        <Card title="Observaciones" className="mb-6">
          <p className="text-sm text-text-muted">{template.observations}</p>
        </Card>
      )}

      <Card title="Vista previa de componentes">
        <ComponentPreviewTable components={template.components} />
      </Card>
    </>
  );
}
