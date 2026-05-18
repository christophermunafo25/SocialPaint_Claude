"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Flag, Activity as ActivityIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ComplianceBadge, Eyebrow } from "@/components/ui/Badge";
import { useApp, useCurrentUser, useTeam, useUserById } from "@/lib/store";
import { cn, relativeTime, complianceColor } from "@/lib/cn";
import type { ActivityEvent, User } from "@/lib/types";

type DateFilter = "24h" | "7d" | "30d" | "all";
type ScoreBand = "all" | "ON-BRAND" | "MOSTLY" | "REVIEW";

export default function AdminActivityPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreBand>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("24h");

  const user = useCurrentUser();
  const team = useTeam();
  const activity = useApp((s) => s.activity);
  const toggleActivityFlag = useApp((s) => s.toggleActivityFlag);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (user.role !== "Admin" && user.role !== "Owner") {
      router.push("/generate");
    }
  }, [mounted, user.role, router]);

  const designTypes = useMemo(
    () => Array.from(new Set(activity.map((a) => a.designType).filter(Boolean))),
    [activity]
  );

  const filtered = useMemo(() => {
    return activity.filter((a) => {
      if (memberFilter !== "all" && a.actorId !== memberFilter) return false;
      if (typeFilter !== "all" && a.designType !== typeFilter) return false;
      if (scoreFilter !== "all" && a.complianceScore !== undefined) {
        const score = a.complianceScore;
        if (scoreFilter === "ON-BRAND" && score < 90) return false;
        if (scoreFilter === "MOSTLY" && (score < 75 || score >= 90)) return false;
        if (scoreFilter === "REVIEW" && score >= 75) return false;
      }
      if (dateFilter !== "all") {
        const diff = Date.now() - new Date(a.createdAt).getTime();
        const ms =
          dateFilter === "24h"
            ? 1000 * 60 * 60 * 24
            : dateFilter === "7d"
            ? 1000 * 60 * 60 * 24 * 7
            : 1000 * 60 * 60 * 24 * 30;
        if (diff > ms) return false;
      }
      return true;
    });
  }, [activity, memberFilter, typeFilter, scoreFilter, dateFilter]);

  const last24 = useMemo(
    () =>
      activity.filter(
        (a) => Date.now() - new Date(a.createdAt).getTime() < 1000 * 60 * 60 * 24
      ),
    [activity]
  );
  const designsToday = last24.filter(
    (a) => a.type === "generation" || a.type === "refinement"
  ).length;
  const scoredEvents = last24.filter((a) => typeof a.complianceScore === "number");
  const avgCompliance =
    scoredEvents.length === 0
      ? 0
      : Math.round(
          (scoredEvents.reduce((acc, a) => acc + (a.complianceScore ?? 0), 0) /
            scoredEvents.length) *
            10
        ) / 10;
  const offBrandFlagged = activity.filter(
    (a) =>
      a.flaggedByAdmin || (typeof a.complianceScore === "number" && a.complianceScore < 75)
  ).length;

  if (!mounted) return null;
  if (user.role !== "Admin" && user.role !== "Owner") return null;

  return (
    <div className="px-8 py-9 max-w-[1340px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Admin · Observability</Eyebrow>
      </div>
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="h1">Activity</h1>
          <p className="body mt-1.5">
            Every generation across {team.length} members. Filter, flag, open.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-2 text-[12px] px-3 h-9 rounded-full"
          style={{
            background: "rgba(74,124,89,0.08)",
            color: "var(--success)",
            border: "1px solid rgba(74,124,89,0.20)",
          }}
        >
          <span className="live-dot" />
          Live · {activity.length} events
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Designs today" value={designsToday.toString()} pastel="var(--mint)" />
        <KpiCard
          label="Avg compliance"
          value={avgCompliance ? avgCompliance.toString() : "—"}
          pastel="var(--sand)"
        />
        <KpiCard
          label="Off-brand flagged"
          value={offBrandFlagged.toString()}
          pastel="var(--peach)"
          tone="warn"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Filter label="Member">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="bg-transparent outline-none text-[12.5px] pr-1"
            style={{ color: "var(--ink)" }}
          >
            <option value="all">All members</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Filter>
        <Filter label="Type">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent outline-none text-[12.5px] pr-1"
            style={{ color: "var(--ink)" }}
          >
            <option value="all">All types</option>
            {designTypes.map((t) => (
              <option key={t!} value={t!}>
                {t}
              </option>
            ))}
          </select>
        </Filter>
        <Filter label="Score">
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as ScoreBand)}
            className="bg-transparent outline-none text-[12.5px] pr-1"
            style={{ color: "var(--ink)" }}
          >
            <option value="all">All scores</option>
            <option value="ON-BRAND">On-brand (90+)</option>
            <option value="MOSTLY">Mostly (75–89)</option>
            <option value="REVIEW">Needs review (&lt;75)</option>
          </select>
        </Filter>
        <Filter label="Window">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="bg-transparent outline-none text-[12.5px] pr-1"
            style={{ color: "var(--ink)" }}
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
            <option value="all">All time</option>
          </select>
        </Filter>
        <span className="ml-auto label">{filtered.length} events shown</span>
      </div>

      <div className="surface overflow-hidden" style={{ boxShadow: "var(--shadow-e1)" }}>
        <div
          className="grid grid-cols-[1.4fr_2.2fr_0.9fr_0.9fr_0.7fr_0.4fr] px-5 py-3 border-b label"
          style={{
            borderColor: "var(--hairline)",
            background: "var(--paper)",
          }}
        >
          <div>Member</div>
          <div>Prompt / action</div>
          <div>Type</div>
          <div>Score</div>
          <div>When</div>
          <div></div>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center body">No events match these filters.</div>
        )}
        {filtered.map((a) => (
          <ActivityRowWithUser
            key={a.id}
            event={a}
            onToggleFlag={() => toggleActivityFlag(a.id)}
          />
        ))}
      </div>

      <div className="mt-5 body-sm" style={{ color: "var(--fg-3)" }}>
        Approvals removed in v2 — admins observe, members ship.{" "}
        <Link href="/settings" className="underline" style={{ color: "var(--ink)" }}>
          Manage members
        </Link>
        .
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  pastel,
  tone = "neutral",
}: {
  label: string;
  value: string;
  pastel: string;
  tone?: "neutral" | "warn";
}) {
  return (
    <div className="surface p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-e1)" }}>
      <div className="flex items-start justify-between">
        <Eyebrow>{label}</Eyebrow>
        <span
          className="icon-tile"
          style={{
            width: 28,
            height: 28,
            background: pastel,
            color: "var(--ink)",
          }}
        >
          <ActivityIcon size={14} strokeWidth={1.75} />
        </span>
      </div>
      <div
        className="mt-3 text-[42px] tabular-nums"
        style={{
          color: tone === "warn" ? "#a23a48" : "var(--ink)",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          letterSpacing: "-1.5px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="h-9 px-3 rounded-lg inline-flex items-center gap-2 transition-colors"
      style={{
        background: "var(--lift)",
        border: "1px solid var(--hairline)",
      }}
    >
      <span className="label-sm">{label}</span>
      {children}
    </div>
  );
}

function ActivityRowWithUser({
  event,
  onToggleFlag,
}: {
  event: ActivityEvent;
  onToggleFlag: () => void;
}) {
  const user = useUserById(event.actorId);
  return <ActivityRow event={event} user={user} onToggleFlag={onToggleFlag} />;
}

function ActivityRow({
  event,
  user,
  onToggleFlag,
}: {
  event: ActivityEvent;
  user: User | undefined;
  onToggleFlag: () => void;
}) {
  const router = useRouter();
  const open = () => {
    if (event.generationId && event.designId) {
      router.push(`/generate/${event.generationId}/${event.designId}`);
    } else if (event.generationId) {
      router.push(`/generate/${event.generationId}`);
    }
  };

  const actionLabel = (() => {
    if (event.type === "asset_ingested") return event.note ?? "Uploaded asset";
    if (event.type === "rule_edited") return event.note ?? "Edited a StyleDNA rule";
    if (event.type === "export") return event.note ?? "Exported design";
    if (event.type === "save") return "Saved to Masterpieces";
    return event.prompt ?? "(no prompt)";
  })();

  return (
    <div
      className="grid grid-cols-[1.4fr_2.2fr_0.9fr_0.9fr_0.7fr_0.4fr] px-5 py-3 items-center border-b transition-colors group"
      style={{
        borderColor: "var(--hairline)",
        background: event.flaggedByAdmin ? "rgba(237,90,42,0.04)" : "var(--lift)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar
          initials={user?.initials ?? "??"}
          color={user?.avatarColor ?? "#dcdcdc"}
          size={26}
        />
        <span className="text-[13.5px] truncate" style={{ color: "var(--ink)" }}>
          {user?.name ?? "—"}
        </span>
      </div>
      <div className="text-[13px] truncate" style={{ color: "var(--fg-2)" }} title={actionLabel}>
        {actionLabel}
      </div>
      <div className="text-[12.5px]" style={{ color: "var(--fg-3)" }}>
        {event.designType ?? eventTypeLabel(event.type)}
      </div>
      <div>
        {typeof event.complianceScore === "number" ? (
          <ComplianceBadge score={event.complianceScore} />
        ) : (
          <span style={{ color: "var(--fg-4)" }}>—</span>
        )}
      </div>
      <div className="label-sm">{relativeTime(event.createdAt)}</div>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onToggleFlag}
          className={cn(
            "h-7 w-7 rounded-lg inline-flex items-center justify-center transition-colors"
          )}
          style={{
            background: event.flaggedByAdmin ? "var(--solar)" : "transparent",
            color: event.flaggedByAdmin ? "white" : "var(--fg-3)",
          }}
          aria-label={event.flaggedByAdmin ? "Unflag" : "Flag for review"}
        >
          <Flag size={12} strokeWidth={1.75} />
        </button>
        {event.generationId && (
          <button
            onClick={open}
            className="h-7 w-7 rounded-lg inline-flex items-center justify-center transition-colors"
            style={{ color: "var(--fg-3)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--paper)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg-3)";
            }}
            aria-label="Open"
          >
            <ChevronRight size={14} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}

function eventTypeLabel(t: ActivityEvent["type"]) {
  switch (t) {
    case "asset_ingested":
      return "Ingestion";
    case "rule_edited":
      return "StyleDNA";
    case "export":
      return "Export";
    case "save":
      return "Save";
    case "refinement":
      return "Refine";
    default:
      return "Generation";
  }
}
