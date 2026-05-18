"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { complianceBand, complianceColor } from "@/lib/cn";

/**
 * DS pill compliance badge — Fragment Mono label, sentence-case band.
 */
export function ComplianceBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const band = complianceBand(score);
  const { fg, bg } = complianceColor(score);
  const label =
    band === "ON-BRAND" ? "On-brand" : band === "MOSTLY" ? "Mostly" : "Needs review";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px]",
        className
      )}
      style={{
        color: fg,
        background: bg,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      <span className="tabular-nums" style={{ color: fg }}>
        {score}
      </span>
      <span className="opacity-50">·</span>
      <span>{label}</span>
    </span>
  );
}

/**
 * DS chip — pill 999px radius, tonal pastels on light surfaces.
 */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "coral" | "mint" | "sand" | "orchid" | "peach" | "sky" | "solar";
  className?: string;
}) {
  const toneStyle: Record<NonNullable<typeof tone>, React.CSSProperties> = {
    neutral: {
      background: "rgba(35,31,35,0.06)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    coral: {
      background: "rgba(237,116,114,0.16)",
      color: "#a73d3b",
      borderColor: "transparent",
    },
    mint: {
      background: "var(--mint)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    sand: {
      background: "var(--sand)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    orchid: {
      background: "var(--orchid)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    peach: {
      background: "var(--peach)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    sky: {
      background: "var(--sky)",
      color: "var(--ink)",
      borderColor: "transparent",
    },
    solar: {
      background: "rgba(237,90,42,0.10)",
      color: "var(--solar)",
      borderColor: "transparent",
    },
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full border text-[12px] py-[3px]",
        className
      )}
      style={{ ...toneStyle[tone], fontWeight: 400 }}
    >
      {children}
    </span>
  );
}

/**
 * Eyebrow label — Fragment Mono uppercase. Used for taxonomy & metadata.
 */
export function Eyebrow({
  children,
  className,
  tone,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "muted";
}) {
  return (
    <span
      className={cn("label", className)}
      style={{
        color: tone === "muted" ? "var(--fg-4)" : "var(--fg-3)",
      }}
    >
      {children}
    </span>
  );
}
