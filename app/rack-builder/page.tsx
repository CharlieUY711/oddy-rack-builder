import { Card, PageHeader, StatusBadge } from "@/components/ui";

export default function RackBuilderPage() {
  return (
    <>
      <PageHeader
        unit="U04"
        title="Rack Builder"
        description="Armado visual de racks. Módulo pendiente de implementación."
      />
      <Card
        title="Módulo en construcción"
        headerAccessory={<StatusBadge tone="pending" label="Sprint futuro" />}
      >
        <p className="text-sm text-text-muted">
          Acá se construirá el editor visual de racks (frontal/trasero, componentes, unidades
          ocupadas). No se implementa lógica de armado en este sprint.
        </p>
      </Card>
    </>
  );
}
