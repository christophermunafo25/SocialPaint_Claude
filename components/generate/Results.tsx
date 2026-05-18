"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Shuffle, Sparkles } from "lucide-react";
import { ComplianceBadge, Chip, Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DesignPreview } from "./DesignPreview";
import type { DesignGeneration } from "@/lib/types";
import { useApp, useCurrentUser } from "@/lib/store";
import { simulateGeneration, simulateRegenerateOne } from "@/lib/generate";
import { platformOf } from "@/lib/platforms";
import { useState } from "react";
import { compositionLabel } from "@/lib/composition-labels";

interface Props {
  generation: DesignGeneration;
}

export function Results({ generation }: Props) {
  const router = useRouter();
  const setGeneration = useApp((s) => s.setGeneration);
  const pushActivity = useApp((s) => s.pushActivity);
  const pushToast = useApp((s) => s.pushToast);
  const user = useCurrentUser();
  const [regenerating, setRegenerating] = useState(false);
  const [perVariantLoading, setPerVariantLoading] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState("");

  const platform = platformOf(generation.designType);
  const aggregatedRules = new Set<string>();
  generation.options.forEach((o) => o.appliedRules.forEach((r) => aggregatedRules.add(r)));

  const regenerate = async () => {
    setRegenerating(true);
    const real = await simulateGeneration(
      generation.prompt,
      generation.designType,
      user.id
    );
    setGeneration({ ...real, id: generation.id });
    pushActivity({
      type: "generation",
      actorId: user.id,
      prompt: generation.prompt,
      designType: generation.designType,
      generationId: generation.id,
      complianceScore: real.options[0]?.complianceScore,
    });
    pushToast({ message: "Regenerated 3 options.", tone: "success" });
    setRegenerating(false);
  };

  const regenerateOne = async (designId: string) => {
    const target = generation.options.find((o) => o.id === designId);
    if (!target) return;
    setPerVariantLoading(designId);
    const fresh = await simulateRegenerateOne(
      generation.prompt,
      generation.designType,
      generation.id,
      target.composition,
      target.letter
    );
    const nextOptions = generation.options.map((o) =>
      o.id === designId ? { ...fresh, id: designId } : o
    );
    setGeneration({ ...generation, options: nextOptions });
    pushActivity({
      type: "generation",
      actorId: user.id,
      prompt: generation.prompt,
      designType: generation.designType,
      generationId: generation.id,
      designId,
      complianceScore: fresh.complianceScore,
      note: `Regenerated option ${target.letter}`,
    });
    pushToast({ message: `Option ${target.letter} regenerated.`, tone: "success" });
    setPerVariantLoading(null);
  };

  return (
    <div className="px-8 py-9 max-w-[1340px] mx-auto" style={{ background: "var(--linen)" }}>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.push("/generate")}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center transition-colors"
          style={{ color: "var(--fg-2)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(35,31,35,0.05)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--fg-2)";
          }}
          aria-label="Back"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
        </button>
        <Eyebrow>Generate · 3 options · {platform.label}</Eyebrow>
      </div>

      <div className="flex items-start gap-6 mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="h1 mb-2" style={{ maxWidth: "30ch" }}>
            {truncatePrompt(generation.prompt)}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip tone="solar">{platform.label}</Chip>
            <span className="label">·</span>
            <span className="label">
              {platform.width} × {platform.height}px · {platform.ratioLabel}
            </span>
          </div>
        </div>
        <Button variant="outline" size="md" onClick={regenerate} disabled={regenerating}>
          <RefreshCw size={13} strokeWidth={1.75} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Regenerating…" : "Regenerate all"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {generation.options.map((opt) => {
          const isLoading = perVariantLoading === opt.id;
          return (
            <div key={opt.id} className="group relative">
              <Link
                href={`/generate/${generation.id}/${opt.id}`}
                className="block surface surface-hover p-4"
                style={{ boxShadow: "var(--shadow-e2)" }}
              >
                <div className="relative">
                  <DesignPreview design={opt} />
                  {isLoading && (
                    <div
                      className="absolute inset-0 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                      style={{ background: "rgba(247,246,245,0.65)" }}
                    >
                      <span
                        className="flex items-center gap-1.5 text-[12.5px]"
                        style={{ color: "var(--ink)" }}
                      >
                        <RefreshCw size={13} className="animate-spin" /> Refreshing…
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="label" style={{ color: "var(--ink)" }}>
                      Option {opt.letter}
                    </span>
                    <span className="label-sm">· {compositionLabel(opt.composition)}</span>
                  </div>
                  <ComplianceBadge score={opt.complianceScore} />
                </div>
                <div className="mt-2 body-sm">Open · Save · Variations</div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  regenerateOne(opt.id);
                }}
                disabled={isLoading || regenerating}
                title="Shuffle this option · fresh composition"
                className="absolute top-7 right-7 h-8 w-8 rounded-lg inline-flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                style={{
                  background: "var(--lift)",
                  color: "var(--ink)",
                  boxShadow: "var(--shadow-e2)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <Shuffle size={13} strokeWidth={1.75} />
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="mt-10 pt-7 border-t"
        style={{ borderColor: "var(--hairline)" }}
      >
        <Eyebrow className="mb-3">Why these</Eyebrow>
        <div className="flex flex-wrap items-center gap-2">
          {[...aggregatedRules].slice(0, 8).map((r) => (
            <Chip key={r} tone="orchid">
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div
        className="mt-10 surface p-5"
        style={{ boxShadow: "var(--shadow-e1)" }}
      >
        <Eyebrow className="mb-3">Refine all three</Eyebrow>
        <div className="flex items-center gap-3">
          <Sparkles size={15} strokeWidth={1.75} style={{ color: "var(--solar)" }} />
          <input
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="Tighten the headline, push more coral…"
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{ color: "var(--ink)", fontWeight: 300 }}
          />
          <Button
            variant="outline"
            disabled={refinePrompt.trim().length < 3}
            onClick={regenerate}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

function truncatePrompt(prompt: string) {
  const cut = prompt.split(/[—.]/)[0].trim();
  return cut.length > 100 ? cut.slice(0, 98) + "…" : cut + ".";
}
