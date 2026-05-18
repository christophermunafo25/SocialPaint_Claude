"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { complianceBand, complianceColor } from "@/lib/cn";

/**
 * Pill compliance badge — DS pill radius (999px), Fragment Mono label, sentence-case band.
 * 90+ uses success-on-mint, 75–89 uses warm-on-amber, <75 uses danger-on-coral.
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
 * DS chip — pill 999px radius, Stack Sans 13px, tonal pastels.
 */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "coral" | "mint" | "sand" | "orchid" | "peach" | "sky";
  className?: string;
}) {
  const toneStyle: Record<NonNullable<typeof tone>, React.CSSProperties> = {
    neutral: {
      background: "rgba(247,246,245,0.06)",
      color: "rgba(247,246,245,0.78)",
      borderColor: "var(--hairline)",
    },
    coral: {
      background: "rgba(237,116,114,0.14)",
      color: "#f5a7a4",
      borderColor: "rgba(237,116,114,0.20)",
    },
    mint: {
      background: "rgba(204,253,207,0.10)",
      color: "#a9e8b5",
      borderColor: "rgba(204,253,207,0.18)",
    },
    sand: {
      background: "rgba(255,244,184,0.10)",
      color: "#f3da8a",
      borderColor: "rgba(255,244,184,0.22)",
    },
    orchid: {
      background: "rgba(206,191,250,0.10)",
      color: "#c9b9f8",
      borderColor: "rgba(206,191,250,0.22)",
    },
    peach: {
      background: "rgba(255,225,214,0.10)",
      color: "#f5cdbe",
      borderColor: "rgba(255,225,214,0.22)",
    },
    sky: {
      background: "rgba(215,233,255,0.10)",
      color: "#c4daf6",
      borderColor: "rgba(215,233,255,0.22)",
    },
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-3 rounded-full border text-[12.5px] font-normal",
        className
      )}
      style={{ ...toneStyle[tone], fontWeight: 400 }}
    >
      {children}
    </span>
  );
}

/**
 * Eyebrow label — Fragment Mono uppercase, used for section meta / taxonomy.
 * Drop-in replacement for ad-hoc `mono` spans across the app.
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
        color: tone === "muted" ? "rgba(247,246,245,0.32)" : "rgba(247,246,245,0.48)",
      }}
    >
      {children}
    </span>
  );
}
