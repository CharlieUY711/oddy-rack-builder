import { notFound } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/ui";
import { RackBuilderWorkspace } from "@/features/rack-builder";
import { getRackInstanceRepository } from "@/services/rack-builder/RackInstanceRepository";
import { getTemplateRepository } from "@/services/rack-templates/TemplateRepository";
import { getRackTypeLabel } from "@/types/RackType";

interface RackBuilderInstancePageProps {
  params: Promise<{ instanceId: string }>;
}

export default async function RackBuilderInstancePage({ params }: RackBuilderInstancePageProps) {
  const { instanceId } = await params;
  const instance = await getRackInstanceRepository().getById(instanceId);

  if (!instance) {
    notFound();
  }

  const template = await getTemplateRepository().getById(instance.templateId);

  if (!template) {
    notFound();
  }

  return (
    <>
      <PageHeader
        unit="U04"
        title={instance.name}
        description={`Proyecto: ${instance.projectName} · Plantilla: ${template.name}`}
        action={<StatusBadge tone="info" label={getRackTypeLabel(template.rackType)} />}
      />
      <RackBuilderWorkspace instance={instance} template={template} />
    </>
  );
}
