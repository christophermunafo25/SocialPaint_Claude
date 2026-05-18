"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { complianceBand, complianceColor } from "@/lib/cn";

export function ComplianceBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const band = complianceBand(score);
  const { fg, bg } = complianceColor(score);
  const label = band === "ON-BRAND" ? "ON-BRAND" : band === "MOSTLY" ? "MOSTLY" : "REVIEW";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md text-[10.5px] font-mono uppercase tracking-[0.06em]",
        className
      )}
      style={{ color: fg, background: bg }}
    >
      <span className="font-semibold tabular-nums" style={{ color: fg }}>
        {score}
      </span>
      <span className="opacity-70">·</span>
      <span>{label}</span>
    </span>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "coral" | "mint" | "amber" | "violet";
  className?: string;
}) {
  const toneClass: Record<typeof tone, string> = {
    neutral: "bg-white/[0.05] text-white/75 border-white/[0.04]",
    coral: "bg-[rgba(237,116,114,0.10)] text-[#F29593] border-[rgba(237,116,114,0.18)]",
    mint: "bg-[rgba(124,227,181,0.10)] text-[#7CE3B5] border-[rgba(124,227,181,0.18)]",
    amber: "bg-[rgba(247,197,122,0.10)] text-[#F7C57A] border-[rgba(247,197,122,0.18)]",
    violet: "bg-[rgba(217,166,255,0.10)] text-[#D9A6FF] border-[rgba(217,166,255,0.20)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[12px]",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
