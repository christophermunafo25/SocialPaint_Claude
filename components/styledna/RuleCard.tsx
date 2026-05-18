"use client";

import { Pencil, Lock } from "lucide-react";
import { Chip } from "@/components/ui/Badge";
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
      className="surface p-5 surface-hover transition-colors cursor-pointer relative group"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-white/95 leading-tight">
          {rule.title}
        </h3>
        <button
          className="text-white/30 group-hover:text-white/80 transition-colors"
          aria-label="Edit rule"
        >
          {rule.isLocked ? <Lock size={13} /> : <Pencil size={13} />}
        </button>
      </div>

      <p className="mt-2 text-[12.5px] text-white/55 leading-snug">
        {rule.description}
      </p>

      {rule.swatches && rule.swatches.length > 0 && (
        <div className="mt-4 flex items-center gap-1.5">
          {rule.swatches.map((s) => (
            <span
              key={s}
              className="h-5 w-5 rounded-md border border-white/10"
              style={{ background: s }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
        <Chip
          tone={
            rule.confidence === "Strong"
              ? "mint"
              : rule.confidence === "Moderate"
              ? "amber"
              : "violet"
          }
          className="h-5 px-2 text-[10.5px] font-mono uppercase tracking-[0.06em]"
        >
          {rule.confidence}
        </Chip>
        <span className="mono text-white/35">· {rule.exampleCount} examples</span>
        <span className="ml-auto mono text-white/25">
          {relativeTime(rule.lastUpdated)}
        </span>
      </div>

      {rule.isDisabled && (
        <div className="absolute inset-0 rounded-2xl bg-[#0A0A0A]/50 backdrop-blur-[1px] flex items-center justify-center">
          <span className="mono text-white/50">Disabled</span>
        </div>
      )}
    </div>
  );
}
