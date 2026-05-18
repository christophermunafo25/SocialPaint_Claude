"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RuleCard } from "@/components/styledna/RuleCard";
import { EditDrawer } from "@/components/styledna/EditDrawer";
import { useApp } from "@/lib/store";
import { relativeTime } from "@/lib/cn";
import type { RuleCategory, StyleDNARule } from "@/lib/types";

const TABS: RuleCategory[] = ["Colors", "Typography", "Layout", "Imagery", "Voice"];

export default function StyleDNAPage() {
  const [tab, setTab] = useState<RuleCategory>("Colors");
  const [editing, setEditing] = useState<StyleDNARule | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const brand = useApp((s) => s.brand);
  const allRules = useApp((s) => s.rules);
  const lastTick = useApp((s) => s.lastStyleDNATick);

  useEffect(() => setHydrated(true), []);

  const rulesInTab = allRules.filter((r) => r.category === tab);

  // Build dynamic relative time so it refreshes on tick
  const updatedLabel = relativeTime(lastTick);

  return (
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      {/* Brand header */}
      <div className="surface p-6 mb-7">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl inline-flex items-center justify-center text-[16px] font-medium tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, rgba(237,116,114,0.95), rgba(178,84,82,0.95))",
                color: "#0A0A0A",
              }}
            >
              {brand.mark}
            </div>
            <div>
              <h1 className="text-[22px] font-medium tracking-tight">{brand.name}</h1>
              <div className="mono mt-1.5">
                Captured from {brand.capturedFromCount} designs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-[12px] text-white/65">
              <span className="live-dot" />
              {hydrated ? `LIVE · Updated ${updatedLabel}` : "LIVE"}
            </span>
            <Link href="/styledna/ingest">
              <Button variant="coral" size="md">
                <Upload size={13} />
                Add new observations
              </Button>
            </Link>
            <Button variant="outline" size="md">
              <Plus size={13} />
              Add rule
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-white/[0.05]">
        {TABS.map((t) => {
          const count = allRules.filter((r) => r.category === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative h-10 px-4 text-[13px] transition-colors ${
                tab === t ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {t}
              <span className="ml-1.5 mono text-white/30">{count}</span>
              {tab === t && (
                <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#ED7472]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {rulesInTab.length === 0 ? (
        <div className="surface p-12 text-center">
          <p className="text-white/45 text-[13.5px]">
            No {tab.toLowerCase()} rules yet — upload designs to teach SocialPaint your brand.
          </p>
          <div className="mt-4 inline-flex">
            <Link href="/styledna/ingest">
              <Button variant="coral" size="md">
                <Upload size={13} />
                Add new observations
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesInTab.map((r) => (
            <RuleCard key={r.id} rule={r} onEdit={() => setEditing(r)} />
          ))}
        </div>
      )}

      <EditDrawer rule={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
