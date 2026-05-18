"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, HelpCircle, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/lib/store";

/**
 * DS topbar — breadcrumbs left, help / notifications / invite / avatar right.
 * Lives on every page below the sidebar's header.
 */
export function Topbar() {
  const pathname = usePathname();
  const user = useCurrentUser();

  const segments = buildSegments(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-7 h-[56px] shrink-0"
      style={{
        background: "var(--lift)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
        {segments.map((s, i) => {
          const isLast = i === segments.length - 1;
          return (
            <span key={s.href} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <ChevronRight size={13} strokeWidth={1.75} style={{ color: "var(--fg-4)" }} />
              )}
              {isLast ? (
                <span
                  className="truncate"
                  style={{ color: "var(--ink)", fontWeight: 500, fontFamily: "var(--font-display)" }}
                >
                  {s.label}
                </span>
              ) : (
                <Link
                  href={s.href}
                  className="truncate transition-colors hover:opacity-70"
                  style={{ color: "var(--fg-2)" }}
                >
                  {s.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <IconButton aria-label="Notifications" dot>
          <Bell size={15} strokeWidth={1.75} />
        </IconButton>
        <IconButton aria-label="Help">
          <HelpCircle size={15} strokeWidth={1.75} />
        </IconButton>
        <Button variant="outline" size="sm" className="hidden md:inline-flex">
          Invite
        </Button>
        <Avatar initials={user.initials} color={user.avatarColor} size={26} />
      </div>
    </header>
  );
}

function IconButton({
  children,
  dot,
  ...rest
}: {
  children: React.ReactNode;
  dot?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="relative h-8 w-8 inline-flex items-center justify-center rounded-lg transition-colors"
      style={{ color: "var(--fg-2)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--paper)";
        e.currentTarget.style.color = "var(--ink)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      {children}
      {dot && (
        <span
          className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full"
          style={{ background: "var(--solar)", border: "1.5px solid var(--lift)" }}
        />
      )}
    </button>
  );
}

const ROUTE_LABELS: Record<string, string> = {
  generate: "Generate",
  styledna: "StyleDNA",
  ingest: "Add observations",
  insights: "Insights",
  connectors: "Connectors",
  templates: "Brand templates",
  plans: "Plans",
  settings: "Settings",
  "admin-activity": "Admin activity",
};

function buildSegments(pathname: string): { href: string; label: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ href: "/", label: "Home" }];

  // Always lead with workspace.
  const out: { href: string; label: string }[] = [
    { href: "/generate", label: "Northfold" },
  ];

  let acc = "";
  parts.forEach((p, i) => {
    acc += "/" + p;
    const labelFromMap = ROUTE_LABELS[p];
    if (labelFromMap) {
      out.push({ href: acc, label: labelFromMap });
      return;
    }
    // generation / design ids → short slug
    if (i === parts.length - 1 && /^(gen|d)_/.test(p)) {
      out.push({ href: acc, label: p.replace(/^.*?_/, "#") });
      return;
    }
    out.push({ href: acc, label: p });
  });

  return out;
}
