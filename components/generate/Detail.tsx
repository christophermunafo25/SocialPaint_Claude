"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Save,
  Shuffle,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ComplianceBadge, Chip, Eyebrow } from "@/components/ui/Badge";
import { DesignPreview } from "./DesignPreview";
import type { DesignGeneration, GeneratedDesign } from "@/lib/types";
import { useApp, useCurrentUser } from "@/lib/store";
import { simulateRefine, simulateRegenerateOne } from "@/lib/generate";
import { complianceColor } from "@/lib/cn";
import { platformOf } from "@/lib/platforms";
import { compositionLabel } from "@/lib/composition-labels";

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
  const [slideIndex, setSlideIndex] = useState(1);
  const updateDesign = useApp((s) => s.updateDesign);
  const saveDesignToHistory = useApp((s) => s.saveDesignToHistory);
  const pushActivity = useApp((s) => s.pushActivity);
  const pushToast = useApp((s) => s.pushToast);
  const user = useCurrentUser();
  const history = useApp((s) => s.history);

  const platform = platformOf(design.designType);
  const isCarousel = design.composition === "carousel-slide";
  const slideTotal = platform.slideCount ?? 5;

  const isSaved = history.some((h) => h.designId === design.id);

  const refine = async () => {
    if (refinePrompt.trim().length < 3) return;
    setRefining(true);
    const next = await simulateRefine(design, refinePrompt);
    updateDesign(design.id, {
      headline: next.headline,
      subhead: next.subhead,
      eyebrow: next.eyebrow,
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
      message: `Refined · score ${design.complianceScore} → ${next.complianceScore}.`,
      tone: "success",
    });
    setRefining(false);
    setRefinePrompt("");
  };

  const swapComposition = async () => {
    setRefining(true);
    const fresh = await simulateRegenerateOne(
      generation.prompt,
      generation.designType,
      generation.id,
      design.composition,
      design.letter
    );
    updateDesign(design.id, {
      headline: fresh.headline,
      subhead: fresh.subhead,
      eyebrow: fresh.eyebrow,
      detail: fresh.detail,
      statValue: fresh.statValue,
      statSuffix: fresh.statSuffix,
      dateLine: fresh.dateLine,
      ctaLabel: fresh.ctaLabel,
      composition: fresh.composition,
      palette: fresh.palette,
      complianceScore: fresh.complianceScore,
      complianceBreakdown: fresh.complianceBreakdown,
      appliedRules: fresh.appliedRules,
    });
    pushToast({
      message: `Swapped layout · ${compositionLabel(fresh.composition)}.`,
      tone: "success",
    });
    setRefining(false);
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
    const dims =
      format === "Figma"
        ? `as Figma frame at ${platform.width}×${platform.height}px`
        : isCarousel
        ? `${slideTotal} ${format} files · ${platform.width}×${platform.height}px each`
        : `${format} · ${platform.width}×${platform.height}px`;
    pushActivity({
      type: "export",
      actorId: user.id,
      generationId: generation.id,
      designId: design.id,
      designType: generation.designType,
      complianceScore: design.complianceScore,
      note: `Exported ${dims}`,
    });
    pushToast({ message: `Exported · ${dims}.`, tone: "success" });
  };

  return (
    <div className="min-h-screen px-10 py-7">
      <div className="max-w-[1320px] mx-auto flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push(`/generate/${generation.id}`)}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center transition-colors"
          style={{ color: "var(--fg-3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(247,246,245,0.05)";
            e.currentTarget.style.color = "var(--fg-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--fg-3)";
          }}
          aria-label="Back to results"
        >
          <ArrowLeft size={16} strokeWidth={1.6} />
        </button>
        <Eyebrow>
          Option {design.letter} · {compositionLabel(design.composition)}
        </Eyebrow>
        <div className="ml-auto flex items-center gap-2">
          <Chip tone="mint">{platform.label}</Chip>
          <Chip>
            {platform.width} × {platform.height}
          </Chip>
          <Link
            href={`/generate/${generation.id}`}
            className="text-[12.5px] px-3 h-8 inline-flex items-center rounded-lg transition-colors"
            style={{
              color: "var(--fg-2)",
              border: "1px solid var(--hairline)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(247,246,245,0.04)";
              e.currentTarget.style.color = "var(--fg-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg-2)";
            }}
          >
            All options
          </Link>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="surface p-5">
          <div className="relative flex justify-center">
            <div
              style={{
                maxWidth: platform.surfaceMax.w,
                width: "100%",
              }}
            >
              <DesignPreview
                design={design}
                size="hero"
                showSizeBadge
                slideIndex={slideIndex}
                slideTotal={slideTotal}
              />
              {refining && (
                <div
                  className="absolute inset-0 rounded-[20px] flex items-center justify-center backdrop-blur-sm"
                  style={{ background: "rgba(14,12,14,0.45)" }}
                >
                  <div className="flex items-center gap-2.5 text-[13.5px]" style={{ color: "var(--fg-1)" }}>
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--coral)" }} />
                    Working…
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Carousel slide selector */}
          {isCarousel && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setSlideIndex((s) => Math.max(1, s - 1))}
                disabled={slideIndex === 1}
                className="h-8 w-8 rounded-lg inline-flex items-center justify-center disabled:opacity-30"
                style={{
                  background: "rgba(247,246,245,0.06)",
                  color: "var(--fg-1)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <ChevronLeft size={14} strokeWidth={1.6} />
              </button>
              {Array.from({ length: slideTotal }).map((_, i) => {
                const n = i + 1;
                const active = n === slideIndex;
                return (
                  <button
                    key={n}
                    onClick={() => setSlideIndex(n)}
                    className="h-8 px-3 rounded-lg text-[12px] transition-colors"
                    style={{
                      color: active ? "var(--canvas)" : "var(--fg-2)",
                      background: active ? "var(--paper)" : "rgba(247,246,245,0.04)",
                      border: active ? "none" : "1px solid var(--hairline)",
                      fontWeight: 400,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {String(n).padStart(2, "0")}
                  </button>
                );
              })}
              <button
                onClick={() => setSlideIndex((s) => Math.min(slideTotal, s + 1))}
                disabled={slideIndex === slideTotal}
                className="h-8 w-8 rounded-lg inline-flex items-center justify-center disabled:opacity-30"
                style={{
                  background: "rgba(247,246,245,0.06)",
                  color: "var(--fg-1)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <ChevronRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button className="h-8 w-8 rounded-lg inline-flex items-center justify-center" style={{ color: "var(--fg-3)" }}>
                <ZoomOut size={14} strokeWidth={1.6} />
              </button>
              <span className="label">100%</span>
              <button className="h-8 w-8 rounded-lg inline-flex items-center justify-center" style={{ color: "var(--fg-3)" }}>
                <ZoomIn size={14} strokeWidth={1.6} />
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={swapComposition} disabled={refining}>
              <Shuffle size={13} strokeWidth={1.6} />
              Swap layout
            </Button>
            <div className="label">
              {design.exported ? "Exported · ready to ship" : "Draft"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface p-5">
            <Eyebrow className="mb-4">Brand compliance</Eyebrow>
            <div className="flex items-baseline gap-3">
              <div
                className="text-[52px] tabular-nums"
                style={{
                  color: complianceColor(design.complianceScore).fg,
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
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
                    <span className="text-[13px] flex-1" style={{ color: "var(--fg-2)" }}>
                      {label}
                    </span>
                    <span className="tabular-nums text-[13px]" style={{ color: "var(--fg-1)" }}>
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="surface p-5">
            <Eyebrow className="mb-3">Applied StyleDNA rules</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {design.appliedRules.map((r) => (
                <Chip key={r} tone="orchid">
                  {r}
                </Chip>
              ))}
            </div>
          </div>

          <div className="surface p-5">
            <Eyebrow className="mb-3">Refine</Eyebrow>
            <div className="input-shell p-3.5">
              <textarea
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) refine();
                }}
                placeholder="Tighten the headline, push more coral…"
                rows={3}
                className="bg-transparent w-full outline-none resize-none text-[14px]"
                style={{ color: "var(--fg-1)", fontWeight: 300 }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="label-sm">⌘↩ to apply</span>
                <Button
                  variant="coral"
                  size="sm"
                  onClick={refine}
                  disabled={refining || refinePrompt.trim().length < 3}
                >
                  <Sparkles size={12} strokeWidth={1.6} />
                  {refining ? "Refining…" : "Refine"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" className="flex-1" onClick={handleSave}>
              <Save size={14} strokeWidth={1.6} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <div className="relative flex-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setExportOpen((v) => !v)}
              >
                <Download size={14} strokeWidth={1.6} />
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
                  <div
                    className="absolute right-0 top-full mt-2 z-40 min-w-[220px] rounded-xl py-1.5"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--hairline)",
                      boxShadow: "var(--shadow-dropdown)",
                    }}
                  >
                    {(["PNG", "PDF", "Figma"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => handleExport(f)}
                        className="w-full text-left px-3.5 py-2 text-[13px] transition-colors flex flex-col gap-0.5"
                        style={{ color: "var(--fg-1)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(247,246,245,0.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span>Export as {f}</span>
                        <span className="label-sm">
                          {isCarousel
                            ? `${slideTotal} files · ${platform.width}×${platform.height}px each`
                            : `${platform.width}×${platform.height}px`}
                        </span>
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
