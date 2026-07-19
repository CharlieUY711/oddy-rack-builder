import { Card, PageHeader, StatusBadge } from "@/components/ui";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        unit="U02"
        title="Proyectos"
        description="Listado de proyectos de Data Center. Módulo pendiente de implementación."
      />
      <Card
        title="Módulo en construcción"
        headerAccessory={<StatusBadge tone="pending" label="Sprint futuro" />}
      >
        <p className="text-sm text-text-muted">
          Acá se listarán los proyectos con su cliente, ubicación y estado general. La lógica de
          negocio y el modelo de datos se implementarán en un sprint posterior.
        </p>
      </Card>
    </>
  );
}
