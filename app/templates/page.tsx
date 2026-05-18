"use client";

import { useState } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/lib/mock-data";
import { Chip } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const FILTERS = ["All", "LinkedIn", "Instagram", "Email", "Carousel"] as const;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered =
    filter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ 4.8 · Templates</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Brand Templates</h1>
        <p className="text-[13px] text-white/45 mt-1">
          Pre-built starting points. Click a tile to drop the prompt into Generate.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "h-8 px-3.5 rounded-full text-[12.5px] transition-colors",
              filter === f
                ? "bg-white text-black"
                : "text-white/55 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]"
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto mono">{filtered.length} templates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/generate?prompt=${encodeURIComponent(t.prompt)}&type=${encodeURIComponent(t.designType)}`}
            className="surface p-4 hover:border-white/15 transition-colors block group"
          >
            <div
              className="aspect-square rounded-xl flex items-end p-5 relative overflow-hidden"
              style={{ background: t.thumbBg }}
            >
              <div className="headline-display text-white text-[22px]">{t.thumbAccent}.</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[13.5px] text-white/90">{t.name}</div>
              <Chip>{t.designType}</Chip>
            </div>
            <p className="mt-2 text-[12px] text-white/45 line-clamp-2">{t.prompt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
