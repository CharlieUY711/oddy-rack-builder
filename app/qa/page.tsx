import { Card, PageHeader, StatusBadge } from "@/components/ui";

export default function QAPage() {
  return (
    <>
      <PageHeader
        unit="U04"
        title="QA"
        description="Control de calidad y checklist de armado. Módulo pendiente de implementación."
      />
      <Card
        title="Módulo en construcción"
        headerAccessory={<StatusBadge tone="pending" label="Sprint futuro" />}
      >
        <p className="text-sm text-text-muted">
          Acá vivirán los checklists de control de calidad por rack. Sin lógica de validación
          implementada todavía.
        </p>
      </Card>
    </>
  );
}
