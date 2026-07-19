import { Card, PageHeader, StatusBadge, ProgressBar } from "@/components/ui";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        unit="U01"
        title="Dashboard"
        description="Vista general del proyecto. Sprint 1: shell visual — sin datos reales conectados todavía."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Estado general" headerAccessory={<StatusBadge tone="pending" label="Sin datos" />}>
          <p className="text-sm text-text-muted">
            Este panel mostrará el resumen de proyectos y racks activos una vez conectado el
            modelo de datos.
          </p>
        </Card>

        <Card title="Ejemplo de progreso">
          <ProgressBar value={0} label="Ocupación de ejemplo" />
          <p className="mt-3 text-xs text-text-faint">
            Componente de referencia — no representa un rack real.
          </p>
        </Card>

        <Card title="Estados de referencia">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="operational" label="Operativo" />
            <StatusBadge tone="warning" label="Atención" />
            <StatusBadge tone="blocked" label="Bloqueado" />
            <StatusBadge tone="info" label="En progreso" />
            <StatusBadge tone="pending" label="Pendiente" />
          </div>
        </Card>
      </div>
    </>
  );
}
