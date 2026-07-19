import { StatusBadge } from "@/components/ui";
import type { RackTemplateComponent } from "@/types/RackComponent";

export interface ComponentPreviewTableProps {
  components: RackTemplateComponent[];
}

function formatU(component: RackTemplateComponent): string {
  return component.uStart === component.uEnd
    ? `U${component.uStart}`
    : `U${component.uStart}–U${component.uEnd}`;
}

/**
 * Vista previa en tabla de los componentes de una plantilla, ordenados de
 * la unidad más alta a la más baja — igual a como se lee una elevación de
 * rack real (de arriba hacia abajo). Todavía sin representación SVG.
 */
export function ComponentPreviewTable({ components }: ComponentPreviewTableProps) {
  const sorted = [...components].sort((a, b) => b.uStart - a.uStart);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-text-muted">Esta plantilla todavía no tiene componentes.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-panel-raised text-xs text-text-muted">
            <th className="px-3 py-2 font-mono">U</th>
            <th className="px-3 py-2">Componente</th>
            <th className="px-3 py-2">Fabricante</th>
            <th className="px-3 py-2 font-mono">PN</th>
            <th className="px-3 py-2">Lado</th>
            <th className="px-3 py-2">Cant.</th>
            <th className="px-3 py-2">Requisitos</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((component) => (
            <tr key={component.id} className="border-b border-line last:border-b-0">
              <td className="px-3 py-2 font-mono text-signal-amber">{formatU(component)}</td>
              <td className="px-3 py-2 text-text-primary">{component.name}</td>
              <td className="px-3 py-2 text-text-muted">{component.manufacturer}</td>
              <td className="px-3 py-2 font-mono text-text-faint">{component.partNumber}</td>
              <td className="px-3 py-2 capitalize text-text-muted">{component.side}</td>
              <td className="px-3 py-2 text-text-muted">{component.quantity}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {component.requiresSerial && <StatusBadge tone="info" label="Serial" />}
                  {component.requiresQA && <StatusBadge tone="warning" label="QA" />}
                  {component.requiresPhoto && <StatusBadge tone="pending" label="Foto" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
