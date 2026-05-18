"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Loader2,
  Save,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ComplianceBadge, Chip } from "@/components/ui/Badge";
import { DesignPreview } from "./DesignPreview";
import type { DesignGeneration, GeneratedDesign } from "@/lib/types";
import { BRAND } from "@/lib/mock-data";
import { useApp, useCurrentUser } from "@/lib/store";
import { simulateRefine } from "@/lib/generate";
import { cn, complianceColor } from "@/lib/cn";

const BREAKDOWN_LABELS: { key: keyof GeneratedDesign["complianceBreakdown"]; label: string }[] = [
  { key: "color", label: "Color" },
  { key: "typography", label: "Typography" },
  { key: "layout", label: "Layout" },
  { key: "imagery", label: "Imagery" },
  { key: "voice", label: "Voice" },
];

export function Detail({
  generation,
  design,
}: {
  generation: DesignGeneration;
  design: GeneratedDesign;
}) {
  const router = useRouter();
  const [refining, setRefining] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const updateDesign = useApp((s) => s.updateDesign);
  const saveDesignToHistory = useApp((s) => s.saveDesignToHistory);
  const pushActivity = useApp((s) => s.pushActivity);
  const pushToast = useApp((s) => s.pushToast);
  const user = useCurrentUser();
  const history = useApp((s) => s.history);

  const isSaved = history.some((h) => h.designId === design.id);

  const refine = async () => {
    if (refinePrompt.trim().length < 3) return;
    setRefining(true);
    const next = await simulateRefine(design, refinePrompt);
    updateDesign(design.id, {
      headline: next.headline,
      subhead: next.subhead,
      previewBg: next.previewBg,
      complianceScore: next.complianceScore,
      complianceBreakdown: next.complianceBreakdown,
    });
    pushActivity({
      type: "refinement",
      actorId: user.id,
      prompt: refinePrompt,
      designType: generation.designType,
      generationId: generation.id,
      designId: design.id,
      complianceScore: next.complianceScore,
    });
    pushToast({
      message: `Refined · score ${design.complianceScore} → ${next.complianceScore}`,
      tone: "success",
    });
    setRefining(false);
    setRefinePrompt("");
  };

  const handleSave = () => {
    saveDesignToHistory(design.id);
    updateDesign(design.id, { status: "saved" });
    pushActivity({
      type: "save",
      actorId: user.id,
      generationId: generation.id,
      designId: design.id,
      designType: generation.designType,
      complianceScore: design.complianceScore,
    });
    pushToast({ message: "Saved to Masterpieces.", tone: "success" });
  };

  const handleExport = (format: "PNG" | "PDF" | "Figma") => {
    setExportOpen(false);
    updateDesign(design.id, { exported: true });
    pushActivity({
      type: "export",
      actorId: user.id,
      generationId: generation.id,
      designId: design.id,
      designType: generation.designType,
      complianceScore: design.complianceScore,
      note: `Exported as ${format}`,
    });
    pushToast({ message: `Exported as ${format}.`, tone: "success" });
  };

  return (
    <div className="min-h-screen px-8 py-6">
      {/* Top strip */}
      <div className="max-w-[1280px] mx-auto flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push(`/generate/${generation.id}`)}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04]"
          aria-label="Back to results"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="mono text-white/40">
          Generate · {generation.id.slice(0, 8)} · Option {design.letter}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Chip>{generation.designType}</Chip>
          <Link
            href={`/generate/${generation.id}`}
            className="text-[12px] text-white/45 hover:text-white px-3 py-1.5 rounded-md border border-white/[0.06] hover:bg-white/[0.04]"
          >
            All options
          </Link>
        </div>
      </div>

      {/* Body · 7/3 split */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Preview */}
        <div className="surface p-5">
          <div className="relative">
            <DesignPreview
              design={design}
              size="hero"
              brandLabel={`${BRAND.mark} · ${BRAND.name.toUpperCase()}`}
              dimensionsLabel="1080 × 1080"
            />
            {refining && (
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 text-[13px] text-white/85">
                  <Loader2 size={16} className="animate-spin text-[#ED7472]" />
                  Refining…
                </div>
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button className="h-8 w-8 rounded-md hover:bg-white/[0.05] text-white/45 hover:text-white inline-flex items-center justify-center">
                <ZoomOut size={14} />
              </button>
              <span className="mono text-white/40">100%</span>
              <button className="h-8 w-8 rounded-md hover:bg-white/[0.05] text-white/45 hover:text-white inline-flex items-center justify-center">
                <ZoomIn size={14} />
              </button>
            </div>
            <div className="mono text-white/35">
              {design.exported ? "Exported · ready to ship" : "Draft"}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          <div className="surface p-5">
            <div className="mono mb-3">Brand Compliance</div>
            <div className="flex items-baseline gap-3">
              <div
                className="text-[48px] font-medium tracking-tight tabular-nums"
                style={{ color: complianceColor(design.complianceScore).fg }}
              >
                {design.complianceScore}
              </div>
              <ComplianceBadge score={design.complianceScore} />
            </div>
            <div className="mt-5 space-y-2.5">
              {BREAKDOWN_LABELS.map(({ key, label }) => {
                const v = design.complianceBreakdown[key];
                const { fg } = complianceColor(v);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: fg }}
                    />
                    <span className="text-[13px] text-white/65 flex-1">{label}</span>
                    <span className="tabular-nums text-[13px] text-white/90">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="surface p-5">
            <div className="mono mb-3">Applied StyleDNA Rules</div>
            <div className="flex flex-wrap gap-2">
              {design.appliedRules.map((r) => (
                <Chip key={r} tone="neutral">
                  {r}
                </Chip>
              ))}
            </div>
          </div>

          <div className="surface p-5">
            <div className="mono mb-3">Refine</div>
            <div className="input-shell p-3.5">
              <textarea
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) refine();
                }}
                placeholder="Tighten the headline, push more coral…"
                rows={3}
                className="bg-transparent w-full outline-none resize-none text-[13.5px] placeholder:text-white/30"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="mono text-white/30">⌘↩ to apply</span>
                <Button
                  variant="coral"
                  size="sm"
                  onClick={refine}
                  disabled={refining || refinePrompt.trim().length < 3}
                >
                  <Sparkles size={12} />
                  {refining ? "Refining…" : "Refine"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleSave}
            >
              <Save size={14} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <div className="relative flex-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setExportOpen((v) => !v)}
              >
                <Download size={14} />
                Export
                <ChevronDown size={13} className="opacity-60" />
              </Button>
              {exportOpen && (
                <>
                  <button
                    className="fixed inset-0 z-30"
                    onClick={() => setExportOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full mt-2 z-40 min-w-[160px] rounded-lg bg-[#181818] border border-white/[0.06] shadow-2xl py-1.5">
                    {(["PNG", "PDF", "Figma"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => handleExport(f)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-[12.5px] text-white/85 hover:bg-white/[0.05]"
                        )}
                      >
                        Export as {f}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
