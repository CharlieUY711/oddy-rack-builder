import { Card, PageHeader, StatusBadge } from "@/components/ui";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        unit="U06"
        title="Reportes"
        description="Reportes de producción y trazabilidad. Módulo pendiente de implementación."
      />
      <Card
        title="Módulo en construcción"
        headerAccessory={<StatusBadge tone="pending" label="Sprint futuro" />}
      >
        <p className="text-sm text-text-muted">
          Acá se generarán reportes exportables de avance y trazabilidad. Sin fuente de datos
          conectada en este sprint.
        </p>
      </Card>
    </>
  );
}
