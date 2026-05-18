"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wand2,
  Dna,
  LineChart,
  Plug,
  LayoutGrid,
  Settings,
  CreditCard,
  ChevronsLeft,
  ChevronsRight,
  Activity,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SocialPaintMark } from "@/components/ui/BrandMark";
import { useApp, useCurrentUser } from "@/lib/store";
import { cn, relativeTime } from "@/lib/cn";
import { useState, useEffect } from "react";

const PRIMARY_NAV = [
  { href: "/generate", label: "Generate Designs", icon: Wand2 },
  { href: "/styledna", label: "StyleDNA", icon: Dna },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/connectors", label: "Connectors", icon: Plug },
  { href: "/templates", label: "Brand Templates", icon: LayoutGrid },
  { href: "/plans", label: "Plans", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const user = useCurrentUser();
  const workspace = useApp((s) => s.workspace);
  const history = useApp((s) => s.history);

  const isAdmin = user.role === "Admin" || user.role === "Owner";

  return (
    <aside
      className={cn(
        "shrink-0 sticky top-0 h-screen flex flex-col bg-[#121212] border-r border-white/[0.04] transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-[244px]"
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href="/generate" className="flex items-center gap-2.5">
          <SocialPaintMark size={22} />
          {!collapsed && (
            <span className="text-[14.5px] font-medium tracking-tight">SocialPaint</span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-white/35 hover:text-white/80 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
        </button>
      </div>

      <nav className="px-2 mt-2 flex flex-col gap-0.5">
        {PRIMARY_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 h-9 rounded-lg text-[13.5px] transition-colors",
                active
                  ? "bg-[rgba(237,116,114,0.10)] text-white"
                  : "text-white/55 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 inline-flex items-center justify-center",
                  active ? "text-[#ED7472]" : "text-white/45 group-hover:text-white/75"
                )}
              >
                <Icon size={15} strokeWidth={1.8} />
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ED7472]" />
              )}
            </Link>
          );
        })}

        {mounted && isAdmin && (
          <Link
            href="/admin-activity"
            className={cn(
              "mt-1 group flex items-center gap-3 px-3 h-9 rounded-lg text-[13.5px] transition-colors",
              pathname.startsWith("/admin-activity")
                ? "bg-[rgba(237,116,114,0.10)] text-white"
                : "text-white/55 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <span
              className={cn(
                "w-4 h-4 inline-flex items-center justify-center",
                pathname.startsWith("/admin-activity")
                  ? "text-[#ED7472]"
                  : "text-white/45 group-hover:text-white/75"
              )}
            >
              <Activity size={15} strokeWidth={1.8} />
            </span>
            {!collapsed && (
              <span className="truncate flex items-center gap-2">
                Admin Activity
                <span className="text-[9px] font-mono uppercase tracking-[0.06em] text-white/35">
                  NEW
                </span>
              </span>
            )}
          </Link>
        )}
      </nav>

      {!collapsed && (
        <div className="mt-6 px-4">
          <div className="mono text-white/35 mb-2">Previous Masterpieces</div>
          <div className="flex flex-col gap-0.5">
            {history.slice(0, 6).map((h) => (
              <Link
                key={h.id}
                href={`/generate/${h.generationId}/${h.designId}`}
                className="block text-[12.5px] text-white/55 hover:text-white truncate py-1.5"
                title={`${h.title} · ${relativeTime(h.createdAt)}`}
              >
                {h.title}
              </Link>
            ))}
            {history.length === 0 && (
              <div className="text-[12px] text-white/30 py-1.5">
                Generate to start your archive.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto px-3 pb-3">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Avatar initials={user.initials} color={user.avatarColor} size={30} />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[12.5px] text-white/90 truncate">{user.name}</div>
              <div className="text-[10.5px] text-white/40 truncate font-mono uppercase tracking-[0.06em]">
                {user.role} · {workspace.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
