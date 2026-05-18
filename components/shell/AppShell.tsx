"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastHost } from "@/components/ui/ToastHost";
import { useEffect } from "react";
import { startStyleDNATicker } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startStyleDNATicker();
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--linen)" }}>
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="flex-1 min-w-0">{children}</div>
      </main>
      <ToastHost />
    </div>
  );
}
