import Link from "next/link";
import { Card, ProgressBar, StatusBadge } from "@/components/ui";
import type { RackInstance, RackInstanceStatus } from "@/types/Rack";
import { calculateProgress } from "@/services/rack-builder/assemble";

export interface InstanceCardProps {
  instance: RackInstance;
  templateName: string;
}

const STATUS_LABEL: Record<RackInstanceStatus, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completo: "Completo",
};

const STATUS_TONE: Record<RackInstanceStatus, "pending" | "info" | "operational"> = {
  pendiente: "pending",
  en_progreso: "info",
  completo: "operational",
};

export function InstanceCard({ instance, templateName }: InstanceCardProps) {
  const progress = calculateProgress(instance.components);

  return (
    <Card
      title={instance.name}
      headerAccessory={
        <StatusBadge tone={STATUS_TONE[instance.status]} label={STATUS_LABEL[instance.status]} />
      }
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-text-muted">Proyecto</dt>
        <dd className="text-text-primary">{instance.projectName}</dd>

        <dt className="text-text-muted">Plantilla</dt>
        <dd className="text-text-primary">{templateName}</dd>
      </dl>

      <div className="mt-4">
        <ProgressBar
          value={progress.percentage}
          label={`Instalados: ${progress.installed}/${progress.total}`}
        />
      </div>

      <Link
        href={`/rack-builder/${instance.id}`}
        className="mt-4 inline-block text-xs font-medium text-signal-amber hover:underline"
      >
        Abrir Rack Builder →
      </Link>
    </Card>
  );
}
