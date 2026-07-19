/**
 * Footer del shell, con formato de "placa de equipo": nombre del proyecto,
 * versión en mono, y año. Deliberadamente discreto.
 */
export function Footer() {
  return (
    <footer className="flex h-10 shrink-0 items-center justify-between border-t border-line bg-ink px-6 text-xs text-text-faint">
      <span>ODDY Rack Builder</span>
      <span className="font-mono">v0.1.0 · Sprint 1 — Foundation · © 2026</span>
    </footer>
  );
}
