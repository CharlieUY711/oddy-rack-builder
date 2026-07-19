"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Barra superior del shell: título de la sección activa + un clúster de
 * estado "de sistema" (placeholder visual, sin datos reales todavía).
 */
export function TopBar() {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname?.startsWith(item.href));

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ink px-6">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-text-faint">{current?.unit ?? "—"}</span>
        <span className="text-sm font-medium text-text-primary">
          {current?.label ?? "ODDY Rack Builder"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="Estado del sistema (placeholder)">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-green" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-signal-amber" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-text-faint" aria-hidden="true" />
        </div>
        <div className="h-8 w-8 rounded-full border border-line bg-panel-raised" aria-hidden="true" />
      </div>
    </header>
  );
}
