import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Estructura general de la aplicación: Sidebar + (TopBar + Main) + Footer.
 * Sprint 1: únicamente el shell visual, sin lógica de negocio.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-ink px-8 py-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
