"use client";

import { Pencil, Lock } from "lucide-react";
import { Chip, Eyebrow } from "@/components/ui/Badge";
import { relativeTime } from "@/lib/cn";
import type { StyleDNARule } from "@/lib/types";

export function RuleCard({
  rule,
  onEdit,
}: {
  rule: StyleDNARule;
  onEdit: () => void;
}) {
  return (
    <div
      className="surface surface-hover p-5 cursor-pointer relative group"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className="text-[15.5px] leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            letterSpacing: "-0.2px",
            color: "var(--fg-1)",
          }}
        >
          {rule.title}
        </h3>
        <button
          className="transition-colors"
          style={{ color: "var(--fg-4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-4)")}
          aria-label="Edit rule"
        >
          {rule.isLocked ? <Lock size={13} strokeWidth={1.6} /> : <Pencil size={13} strokeWidth={1.6} />}
        </button>
      </div>

      <p
        className="mt-2 text-[13px] leading-snug"
        style={{ color: "var(--fg-2)", fontWeight: 300 }}
      >
        {rule.description}
      </p>

      {rule.swatches && rule.swatches.length > 0 && (
        <div className="mt-4 flex items-center gap-1.5">
          {rule.swatches.map((s) => (
            <span
              key={s}
              className="h-6 w-6 rounded-md"
              style={{ background: s, border: "1px solid rgba(247,246,245,0.10)" }}
            />
          ))}
        </div>
      )}

      <div
        className="mt-4 pt-3 border-t flex items-center gap-2"
        style={{ borderColor: "var(--hairline)" }}
      >
        <Chip
          tone={
            rule.confidence === "Strong"
              ? "mint"
              : rule.confidence === "Moderate"
              ? "sand"
              : "orchid"
          }
          className="h-6 px-2.5 text-[10.5px]"
        >
          {rule.confidence}
        </Chip>
        <Eyebrow tone="muted">· {rule.exampleCount} examples</Eyebrow>
        <span className="ml-auto label-sm">{relativeTime(rule.lastUpdated)}</span>
      </div>

      {rule.isDisabled && (
        <div
          className="absolute inset-0 rounded-[20px] flex items-center justify-center"
          style={{ background: "rgba(14,12,14,0.55)", backdropFilter: "blur(2px)" }}
        >
          <span className="label">Disabled</span>
        </div>
      )}
    </div>
  );
}
