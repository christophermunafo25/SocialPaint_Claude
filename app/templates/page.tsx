"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "@/lib/mock-data";
import { Chip, Eyebrow } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const FILTERS = ["All", "LinkedIn", "Instagram", "Email", "Carousel"] as const;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    filter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div className="px-10 py-9 max-w-[1320px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Brand templates · Pre-built starts</Eyebrow>
      </div>
      <div className="flex items-end justify-between gap-6 mb-7">
        <div className="flex items-start gap-4">
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
              Click a tile to drop the prompt into Generate.
            </p>
          </div>
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
                filter === f
                  ? "var(--paper)"
                  : "rgba(247,246,245,0.04)",
              fontWeight: 400,
            }}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto label">{filtered.length} templates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/generate?prompt=${encodeURIComponent(t.prompt)}&type=${encodeURIComponent(t.designType)}`}
            className="surface surface-hover p-4 block group"
          >
            <div
              className="aspect-square rounded-2xl flex items-end p-5 relative overflow-hidden"
              style={{
                background: t.thumbBg,
                border: "1px solid rgba(247,246,245,0.06)",
              }}
            >
              <div
                className="text-[24px] text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  letterSpacing: "-0.5px",
                }}
              >
                {t.thumbAccent}.
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div
                className="text-[14px]"
                style={{ color: "var(--fg-1)", fontWeight: 400 }}
              >
                {t.name}
              </div>
              <Chip tone="mint">{t.designType}</Chip>
            </div>
            <p
              className="mt-2 text-[12.5px] leading-snug line-clamp-2"
              style={{ color: "var(--fg-3)", fontWeight: 300 }}
            >
              {t.prompt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
