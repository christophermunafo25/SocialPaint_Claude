"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "@/lib/mock-data";
import { Chip, Eyebrow } from "@/components/ui/Badge";
import { DesignPreview } from "@/components/generate/DesignPreview";
import { composeCopy } from "@/lib/compositions";
import type { GeneratedDesign, Template } from "@/lib/types";
import { cn } from "@/lib/cn";

const FILTERS = ["All", "LinkedIn", "Instagram", "Email", "Carousel"] as const;

function templateToDesign(t: Template): GeneratedDesign {
  const copy = composeCopy(t.prompt, {
    key: t.composition,
    palette: t.palette,
    baseScoreShift: 1,
    tone: "declarative",
  });
  return {
    id: `tpl_${t.id}`,
    generationId: `tpl_${t.id}`,
    letter: "A",
    eyebrow: copy.eyebrow,
    headline: copy.headline,
    subhead: copy.subhead,
    detail: copy.detail,
    statValue: copy.statValue,
    statSuffix: copy.statSuffix,
    dateLine: copy.dateLine,
    ctaLabel: copy.ctaLabel,
    composition: t.composition,
    palette: t.palette,
    designType: t.designType,
    complianceScore: 94,
    complianceBreakdown: { color: 95, typography: 95, layout: 92, imagery: 88, voice: 96 },
    appliedRules: [],
    status: "draft",
  };
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    filter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div className="px-10 py-9 max-w-[1320px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Brand templates · Pre-built starts</Eyebrow>
      </div>
      <div className="flex items-end gap-4 mb-7">
        <div
          className="icon-tile"
          style={{
            width: 48,
            height: 48,
            background: "var(--peach)",
            color: "#231f23",
          }}
        >
          <LayoutTemplate size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="h1">Templates</h1>
          <p className="body mt-1.5">
            Pre-built layouts. Click a tile to open Generate with the prompt and
            composition pre-selected.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="h-9 px-4 rounded-full text-[12.5px] transition-colors"
            style={{
              color: filter === f ? "var(--canvas)" : "var(--fg-2)",
              background:
                filter === f ? "var(--paper)" : "rgba(247,246,245,0.04)",
              fontWeight: 400,
            }}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto label">{filtered.length} templates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => {
          const design = templateToDesign(t);
          return (
            <Link
              key={t.id}
              href={`/generate?prompt=${encodeURIComponent(t.prompt)}&type=${encodeURIComponent(t.designType)}`}
              className="surface surface-hover p-4 block group"
            >
              <DesignPreview design={design} />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className="text-[14px] truncate"
                    style={{ color: "var(--fg-1)", fontWeight: 400 }}
                  >
                    {t.name}
                  </div>
                  <div className="label-sm truncate mt-0.5">{t.description}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Chip tone="mint">{t.designType}</Chip>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
