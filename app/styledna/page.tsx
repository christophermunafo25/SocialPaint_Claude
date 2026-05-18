"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Upload, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
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
  const updatedLabel = relativeTime(lastTick);

  return (
    <div className="px-8 py-9 max-w-[1340px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>StyleDNA · Brand intelligence</Eyebrow>
      </div>

      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div
            className="icon-tile"
            style={{
              width: 48,
              height: 48,
              background: "var(--orchid)",
              color: "var(--ink)",
            }}
          >
            <Fingerprint size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="h1">{brand.name}</h1>
            <div className="label mt-2">
              Captured from {brand.capturedFromCount} designs · {allRules.length} rules
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center gap-2 text-[12px] px-3 h-9 rounded-full"
            style={{
              background: "rgba(74,124,89,0.08)",
              color: "var(--success)",
              border: "1px solid rgba(74,124,89,0.20)",
            }}
          >
            <span className="live-dot" />
            {hydrated ? `Live · updated ${updatedLabel}` : "Live"}
          </span>
          <Link href="/styledna/ingest">
            <Button variant="primary" size="md">
              <Upload size={13} strokeWidth={1.75} />
              Add observations
            </Button>
          </Link>
          <Button variant="outline" size="md">
            <Plus size={13} strokeWidth={1.75} />
            Add rule
          </Button>
        </div>
      </div>

      <div
        className="flex items-center gap-1 mb-6 border-b"
        style={{ borderColor: "var(--hairline)" }}
      >
        {TABS.map((t) => {
          const count = allRules.filter((r) => r.category === t).length;
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative h-11 px-4 text-[13.5px] transition-colors"
              style={{
                color: active ? "var(--ink)" : "var(--fg-3)",
                fontWeight: 400,
              }}
            >
              {t}
              <span className="ml-1.5 label-sm">{count}</span>
              {active && (
                <span
                  className="absolute -bottom-px left-0 right-0 h-[2px]"
                  style={{ background: "var(--solar)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {rulesInTab.length === 0 ? (
        <div className="surface p-14 text-center" style={{ boxShadow: "var(--shadow-e1)" }}>
          <p className="body mb-5">
            No {tab.toLowerCase()} rules yet — upload designs to teach SocialPaint your brand.
          </p>
          <Link href="/styledna/ingest">
            <Button variant="primary" size="md">
              <Upload size={13} strokeWidth={1.75} />
              Add observations
            </Button>
          </Link>
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
