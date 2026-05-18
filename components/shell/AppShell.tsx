"use client";

import { Sidebar } from "./Sidebar";
import { ToastHost } from "@/components/ui/ToastHost";
import { useEffect } from "react";
import { startStyleDNATicker } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startStyleDNATicker();
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 relative">{children}</main>
      <ToastHost />
    </div>
  );
}
