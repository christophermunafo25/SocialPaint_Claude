"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wand2,
  Fingerprint,
  BarChart3,
  Workflow,
  LayoutTemplate,
  Settings,
  CreditCard,
  Activity,
  Search,
  ChevronDown,
  Plus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SocialPaintMark } from "@/components/ui/BrandMark";
import { useApp, useCurrentUser } from "@/lib/store";
import { cn, relativeTime } from "@/lib/cn";
import { useState, useEffect } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: string;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/generate", label: "Generate", icon: Wand2, count: "⌘N" },
  { href: "/styledna", label: "StyleDNA", icon: Fingerprint },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/connectors", label: "Connectors", icon: Workflow },
  { href: "/templates", label: "Brand templates", icon: LayoutTemplate },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/plans", label: "Plans", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const BRAND_DOT_COLORS: Record<string, string> = {
  default: "var(--mesh-warm)",
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = useCurrentUser();
  const workspace = useApp((s) => s.workspace);
  const brand = useApp((s) => s.brand);
  const history = useApp((s) => s.history);

  useEffect(() => setMounted(true), []);

  // ⌘N to focus generate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        router.push("/generate");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const isAdmin = user.role === "Admin" || user.role === "Owner";

  return (
    <aside
      className="shrink-0 sticky top-0 h-screen w-[252px] flex flex-col"
      style={{
        background: "var(--paper)",
        borderRight: "1px solid var(--hairline)",
      }}
    >
      {/* Workspace pill */}
      <div className="px-3.5 pt-4 pb-2">
        <button
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] transition-colors"
          style={{
            background: "var(--lift)",
            border: "1px solid var(--hairline)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--hairline-strong)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        >
          <SocialPaintMark size={26} />
          <div className="flex-1 min-w-0 text-left">
            <div
              className="text-[13px] truncate"
              style={{
                color: "var(--ink)",
                fontWeight: 500,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.2px",
              }}
            >
              {workspace.name}
            </div>
            <div className="label-sm truncate" style={{ marginTop: 1 }}>
              {workspace.plan} plan · {workspace.memberCount} seats
            </div>
          </div>
          <ChevronDown size={12} className="shrink-0" style={{ color: "var(--fg-3)" }} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3.5 pb-3">
        <div className="relative">
          <Search
            size={13}
            strokeWidth={1.75}
            className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--fg-3)" }}
          />
          <input
            placeholder="Search or jump…"
            className="w-full pl-[30px] pr-[42px] py-[7px] outline-none text-[12.5px]"
            style={{
              background: "rgba(35,31,35,0.04)",
              borderRadius: 8,
              color: "var(--ink)",
              border: 0,
            }}
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] px-1.5 py-[2px] rounded font-mono"
            style={{
              color: "var(--fg-3)",
              background: "rgba(35,31,35,0.06)",
              letterSpacing: "0.04em",
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 flex-1 overflow-y-auto">
        <NavGroup label="Workspace" />
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
        {mounted && isAdmin && (
          <NavLink
            item={{ href: "/admin-activity", label: "Admin activity", icon: Activity, count: "new" }}
            active={isActive(pathname, "/admin-activity")}
          />
        )}

        <NavGroup label="Brand" plus />
        <NavBrandLink href="/styledna" name={brand.name} color="var(--mesh-warm)" />

        <NavGroup label="Recent" />
        {history.slice(0, 4).map((h) => (
          <Link
            key={h.id}
            href={`/generate/${h.generationId}/${h.designId}`}
            className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-[8px] text-[12.5px] transition-colors"
            style={{ color: "var(--fg-2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(35,31,35,0.04)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg-2)";
            }}
            title={`${h.title} · ${relativeTime(h.createdAt)}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--fg-4)" }}
            />
            <span className="truncate">{h.title}</span>
          </Link>
        ))}

        <NavGroup label="Settings" />
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      {/* New generation CTA · ink dark */}
      <div className="px-3.5 pt-3 pb-3 border-t" style={{ borderColor: "var(--hairline)" }}>
        <Link
          href="/generate"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] transition-opacity"
          style={{
            background: "var(--ink)",
            color: "var(--fg-on-dark-1)",
            fontWeight: 400,
          }}
        >
          <Sparkles size={13} strokeWidth={1.7} style={{ color: "var(--apricot)" }} />
          New generation
          <span
            className="ml-auto text-[9px] px-1.5 py-[2px] rounded font-mono"
            style={{
              color: "rgba(247,246,245,0.7)",
              background: "rgba(247,246,245,0.10)",
              letterSpacing: "0.04em",
            }}
          >
            ⌘N
          </span>
        </Link>
      </div>

      {/* User identity */}
      <div className="px-3 pb-3 pt-2">
        <button
          className="w-full flex items-center gap-2.5 p-2 rounded-[10px] text-left transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(35,31,35,0.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Avatar initials={user.initials} color={user.avatarColor} size={26} />
          <div className="flex-1 min-w-0">
            <div
              className="text-[12.5px] truncate"
              style={{ color: "var(--ink)", fontWeight: 400 }}
            >
              {user.name}
            </div>
            <div className="label-sm truncate">{user.role}</div>
          </div>
        </button>
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavGroup({ label, plus }: { label: string; plus?: boolean }) {
  return (
    <div className="px-2 pt-[14px] pb-1 flex items-center justify-between">
      <span className="label-sm" style={{ letterSpacing: "0.075em", color: "var(--fg-3)" }}>
        {label}
      </span>
      {plus && (
        <button
          className="h-5 w-5 inline-flex items-center justify-center rounded transition-colors"
          style={{ color: "var(--fg-3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
        >
          <Plus size={11} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-[8px] text-[13px] transition-colors"
      style={{
        color: active ? "var(--solar)" : "var(--fg-2)",
        background: active ? "rgba(237,90,42,0.10)" : "transparent",
        fontWeight: 400,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(35,31,35,0.04)";
          e.currentTarget.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--fg-2)";
        }
      }}
    >
      <Icon
        size={15}
        strokeWidth={1.75}
        style={{ color: active ? "var(--solar)" : "var(--fg-2)" }}
        className="shrink-0"
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.count && (
        <span
          className="label-sm shrink-0"
          style={{
            color: item.count === "new" ? "var(--solar)" : "var(--fg-3)",
          }}
        >
          {item.count}
        </span>
      )}
    </Link>
  );
}

function NavBrandLink({
  href,
  name,
  color,
}: {
  href: string;
  name: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-[8px] text-[13px] transition-colors"
      style={{ color: "var(--fg-2)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(35,31,35,0.04)";
        e.currentTarget.style.color = "var(--ink)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      <span
        className="w-3.5 h-3.5 rounded-[4px] shrink-0"
        style={{ background: color, border: "1px solid var(--hairline)" }}
      />
      <span className="truncate">{name}</span>
    </Link>
  );
}
