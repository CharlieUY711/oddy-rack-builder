import { Card, PageHeader, Input, Button } from "@/components/ui";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        unit="U06"
        title="Configuración"
        description="Preferencias generales del proyecto. Módulo pendiente de implementación."
      />
      <Card title="Vista previa de componentes (no funcional)">
        <div className="grid max-w-md gap-4">
          <Input label="Nombre del proyecto" placeholder="ODDY Rack Builder" disabled />
          <Input label="Zona horaria" placeholder="America/Montevideo" disabled />
          <div>
            <Button variant="secondary" disabled>
              Guardar cambios
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-text-faint">
          Estos campos son solo de referencia visual — no guardan ningún dato todavía.
        </p>
      </Card>
    </>
  );
}
