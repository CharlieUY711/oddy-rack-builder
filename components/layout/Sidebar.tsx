"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Navegación principal del shell. Cada ítem se rotula con un tag mono
 * "U0x" (unidad de rack), replicando la numeración real de un rack físico
 * en lugar de una lista numerada genérica.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-line bg-panel">
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="h-2 w-2 rounded-full bg-signal-amber" aria-hidden="true" />
        <span className="font-display text-sm font-semibold tracking-tight text-text-primary">
          ODDY
        </span>
        <span className="font-mono text-[11px] text-text-faint">Rack Builder</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-panel-raised text-text-primary"
                  : "text-text-muted hover:bg-panel-raised hover:text-text-primary",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-[11px]",
                  isActive ? "text-signal-amber" : "text-text-faint",
                ].join(" ")}
              >
                {item.unit}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
