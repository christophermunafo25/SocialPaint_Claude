"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Flag } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ComplianceBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp, useCurrentUser, useTeam, useUserById } from "@/lib/store";
import { cn, relativeTime } from "@/lib/cn";
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

  // Role-gate · redirect non-admins
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

  // KPIs · always over the last 24h regardless of filters
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
    (a) => a.flaggedByAdmin || (typeof a.complianceScore === "number" && a.complianceScore < 75)
  ).length;

  if (!mounted) return null;
  if (user.role !== "Admin" && user.role !== "Owner") return null;

  return (
    <div className="px-10 py-8 max-w-[1320px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ 4.11 · Observability</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Admin Activity</h1>
        <p className="text-[13px] text-white/45 mt-1">
          Every generation across {team.length} members. Filter, flag, open.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Designs today" value={designsToday.toString()} />
        <KpiCard label="Avg compliance" value={avgCompliance ? avgCompliance.toString() : "—"} />
        <KpiCard label="Off-brand flagged" value={offBrandFlagged.toString()} tone="warn" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Filter label="Member">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="bg-transparent outline-none text-[12.5px] text-white/85 pr-1"
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
            className="bg-transparent outline-none text-[12.5px] text-white/85 pr-1"
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
            className="bg-transparent outline-none text-[12.5px] text-white/85 pr-1"
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
            className="bg-transparent outline-none text-[12.5px] text-white/85 pr-1"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
            <option value="all">All time</option>
          </select>
        </Filter>
        <span className="ml-auto mono">
          {filtered.length} events · <span className="live-dot inline-block align-middle" /> live
        </span>
      </div>

      {/* Table */}
      <div className="surface overflow-hidden">
        <div className="grid grid-cols-[1.4fr_2fr_0.9fr_0.7fr_0.7fr_0.4fr] px-5 py-3 border-b border-white/[0.05] mono text-white/40">
          <div>Member</div>
          <div>Prompt / action</div>
          <div>Type</div>
          <div>Score</div>
          <div>When</div>
          <div></div>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-14 text-center text-white/45 text-[13px]">
            No events match these filters.
          </div>
        )}
        {filtered.map((a) => (
          <ActivityRowWithUser
            key={a.id}
            event={a}
            onToggleFlag={() => toggleActivityFlag(a.id)}
          />
        ))}
      </div>

      <div className="mt-5 text-[12px] text-white/35">
        Approvals removed in v2 — admins observe, members ship.{" "}
        <Link href="/settings" className="underline decoration-white/15 hover:decoration-white/55">
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
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warn";
}) {
  return (
    <div className="surface p-5">
      <div className="mono mb-2">{label}</div>
      <div
        className={cn(
          "text-[40px] font-medium tracking-tight tabular-nums",
          tone === "warn" ? "text-[#ED7472]" : "text-white"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-8 px-3 rounded-md bg-white/[0.04] border border-white/[0.04] inline-flex items-center gap-2 hover:bg-white/[0.06] transition-colors">
      <span className="mono">{label}</span>
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
    if (event.type === "export") return event.note ?? `Exported design`;
    if (event.type === "save") return "Saved to Masterpieces";
    return event.prompt ?? "(no prompt)";
  })();

  return (
    <div
      className={cn(
        "grid grid-cols-[1.4fr_2fr_0.9fr_0.7fr_0.7fr_0.4fr] px-5 py-3 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group",
        event.flaggedByAdmin && "bg-[rgba(237,116,114,0.04)]"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar
          initials={user?.initials ?? "??"}
          color={user?.avatarColor ?? "#888"}
          size={26}
        />
        <span className="text-[13px] text-white/90 truncate">{user?.name ?? "—"}</span>
      </div>
      <div className="text-[13px] text-white/75 truncate" title={actionLabel}>
        {actionLabel}
      </div>
      <div className="text-[12.5px] text-white/55">
        {event.designType ?? eventTypeLabel(event.type)}
      </div>
      <div>
        {typeof event.complianceScore === "number" ? (
          <ComplianceBadge score={event.complianceScore} />
        ) : (
          <span className="text-white/30">—</span>
        )}
      </div>
      <div className="mono text-white/50">{relativeTime(event.createdAt)}</div>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onToggleFlag}
          className={cn(
            "h-7 w-7 rounded-md inline-flex items-center justify-center transition-colors",
            event.flaggedByAdmin
              ? "bg-[#ED7472] text-black"
              : "text-white/30 hover:text-white hover:bg-white/[0.05] opacity-0 group-hover:opacity-100"
          )}
          aria-label={event.flaggedByAdmin ? "Unflag" : "Flag for review"}
          title={event.flaggedByAdmin ? "Unflag" : "Mark Needs Review"}
        >
          <Flag size={12} />
        </button>
        {event.generationId && (
          <button
            onClick={open}
            className="h-7 w-7 rounded-md inline-flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.05]"
            aria-label="Open"
          >
            <ChevronRight size={14} />
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
