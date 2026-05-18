"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wand2,
  Fingerprint,
  BarChart3,
  Workflow,
  LayoutTemplate,
  Settings,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SocialPaintMark } from "@/components/ui/BrandMark";
import { useApp, useCurrentUser } from "@/lib/store";
import { cn, relativeTime } from "@/lib/cn";
import { useState, useEffect } from "react";

/**
 * DS feature → pastel + lucide icon mapping. From README §iconography.
 * StyleDNA = orchid + Fingerprint, Generate = mint + Wand2,
 * Connectors = sky + Workflow, Insights = sand + BarChart3,
 * Brand Templates = peach + LayoutTemplate.
 */
type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  pastel: string;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/generate", label: "Generate designs", icon: Wand2, pastel: "var(--mint)" },
  { href: "/styledna", label: "StyleDNA", icon: Fingerprint, pastel: "var(--orchid)" },
  { href: "/insights", label: "Insights", icon: BarChart3, pastel: "var(--sand)" },
  { href: "/connectors", label: "Connectors", icon: Workflow, pastel: "var(--sky)" },
  { href: "/templates", label: "Brand templates", icon: LayoutTemplate, pastel: "var(--peach)" },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/plans", label: "Plans", icon: CreditCard, pastel: "rgba(247,246,245,0.10)" },
  { href: "/settings", label: "Settings", icon: Settings, pastel: "rgba(247,246,245,0.10)" },
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
        "shrink-0 sticky top-0 h-screen flex flex-col border-r transition-[width] duration-200 ease-out",
        collapsed ? "w-[72px]" : "w-[252px]"
      )}
      style={{
        background: "var(--ink-dark)",
        borderColor: "var(--hairline)",
      }}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link href="/generate" className="flex items-center gap-2.5">
          <SocialPaintMark size={24} />
          {!collapsed && (
            <span
              className="text-[16px] font-medium"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.4px",
              }}
            >
              SocialPaint
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-[var(--fg-4)] hover:text-[var(--fg-1)] transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      <nav className="px-2.5 mt-2 flex flex-col gap-0.5">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} />
        ))}

        {mounted && isAdmin && (
          <NavLink
            item={{
              href: "/admin-activity",
              label: "Admin activity",
              icon: Activity,
              pastel: "rgba(237,116,114,0.20)",
            }}
            active={isActive(pathname, "/admin-activity")}
            collapsed={collapsed}
            badge="new"
          />
        )}

        <div className="my-2 mx-2 border-t border-[var(--hairline)]" />

        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} collapsed={collapsed} subtle />
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-7 px-4">
          <div className="label mb-2.5">Previous Masterpieces</div>
          <div className="flex flex-col gap-0.5">
            {history.slice(0, 5).map((h) => (
              <Link
                key={h.id}
                href={`/generate/${h.generationId}/${h.designId}`}
                className="block text-[12.5px] truncate py-1.5 transition-opacity"
                style={{
                  color: "var(--fg-2)",
                }}
                title={`${h.title} · ${relativeTime(h.createdAt)}`}
              >
                {h.title}
              </Link>
            ))}
            {history.length === 0 && (
              <div className="text-[12px] py-1.5" style={{ color: "var(--fg-3)" }}>
                Generate to start your archive.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto px-3 pb-3">
        <div
          className="flex items-center gap-2.5 p-2.5 rounded-2xl"
          style={{
            background: "rgba(247,246,245,0.04)",
            border: "1px solid var(--hairline)",
          }}
        >
          <Avatar initials={user.initials} color={user.avatarColor} size={30} />
          {!collapsed && (
            <div className="min-w-0">
              <div
                className="text-[13px] truncate"
                style={{ color: "var(--fg-1)", fontWeight: 400 }}
              >
                {user.name}
              </div>
              <div className="label-sm truncate" style={{ color: "var(--fg-3)" }}>
                {user.role} · {workspace.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  active,
  collapsed,
  subtle,
  badge,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  subtle?: boolean;
  badge?: string;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center h-10 px-2.5 rounded-xl transition-colors",
        collapsed ? "justify-center" : "gap-3"
      )}
      style={{
        color: active ? "var(--fg-1)" : "var(--fg-2)",
        background: active ? "rgba(247,246,245,0.05)" : "transparent",
      }}
    >
      <span
        className="icon-tile shrink-0 transition-colors"
        style={{
          width: 28,
          height: 28,
          background: active ? item.pastel : subtle ? "transparent" : "rgba(247,246,245,0.04)",
          color: active ? "#231f23" : "var(--fg-2)",
          border: active ? "none" : `1px solid var(--hairline)`,
        }}
      >
        <Icon size={14} strokeWidth={1.6} />
      </span>
      {!collapsed && (
        <span
          className="text-[13.5px] truncate flex-1"
          style={{ fontWeight: 400 }}
        >
          {item.label}
        </span>
      )}
      {!collapsed && badge && (
        <span
          className="label-sm"
          style={{ color: "rgba(237,116,114,0.85)" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
