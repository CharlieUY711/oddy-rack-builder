import Link from "next/link";
import { Card, StatusBadge } from "@/components/ui";
import { getRackTypeLabel } from "@/types/RackType";
import type { RackTemplate } from "@/types/RackTemplate";

export interface TemplateCardProps {
  template: RackTemplate;
}

/**
 * Resumen de una plantilla dentro de la grilla de Rack Templates.
 * Solo lectura — la edición no existe todavía (ver TemplateRepository).
 */
export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card
      title={template.name}
      headerAccessory={<StatusBadge tone="info" label={getRackTypeLabel(template.rackType)} />}
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-text-muted">Fabricante</dt>
        <dd className="text-text-primary">{template.manufacturer}</dd>

        <dt className="text-text-muted">Modelo</dt>
        <dd className="font-mono text-text-primary">{template.model}</dd>

        <dt className="text-text-muted">Altura</dt>
        <dd className="text-text-primary">{template.heightU}U</dd>

        <dt className="text-text-muted">U utilizables</dt>
        <dd className="text-text-primary">{template.usableU}U</dd>

        <dt className="text-text-muted">Componentes</dt>
        <dd className="text-text-primary">{template.components.length}</dd>
      </dl>

      {template.description && (
        <p className="mt-3 text-xs text-text-faint">{template.description}</p>
      )}

      <Link
        href={`/rack-templates/${template.id}`}
        className="mt-4 inline-block text-xs font-medium text-signal-amber hover:underline"
      >
        Ver plantilla →
      </Link>
    </Card>
  );
}
