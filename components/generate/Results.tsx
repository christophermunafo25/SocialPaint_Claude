"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { ComplianceBadge, Chip, Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DesignPreview } from "./DesignPreview";
import type { DesignGeneration } from "@/lib/types";
import { BRAND } from "@/lib/mock-data";
import { useApp, useCurrentUser } from "@/lib/store";
import { simulateGeneration } from "@/lib/generate";
import { useState } from "react";

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
  const [refinePrompt, setRefinePrompt] = useState("");

  const aggregatedRules = new Set<string>();
  generation.options.forEach((o) => o.appliedRules.forEach((r) => aggregatedRules.add(r)));

  const regenerate = async () => {
    setRegenerating(true);
    const real = await simulateGeneration(generation.prompt, generation.designType, user.id);
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

  return (
    <div className="px-10 py-9 max-w-[1320px] mx-auto">
      {/* Eyebrow + back */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push("/generate")}
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
          aria-label="Back"
        >
          <ArrowLeft size={16} strokeWidth={1.6} />
        </button>
        <Eyebrow>Generate · Three options</Eyebrow>
      </div>

      {/* Headline strip */}
      <div className="flex items-start gap-6 mb-7">
        <div className="flex-1 min-w-0">
          <h1 className="h1 mb-2" style={{ maxWidth: "26ch" }}>
            {truncatePrompt(generation.prompt)}
          </h1>
          <div className="body-sm flex items-center gap-2">
            <Chip tone="mint">{generation.designType}</Chip>
            <span style={{ color: "var(--fg-3)" }}>·</span>
            <span style={{ color: "var(--fg-3)" }}>1080 × 1080</span>
          </div>
        </div>
        <Button variant="outline" size="md" onClick={regenerate} disabled={regenerating}>
          <RefreshCw size={13} strokeWidth={1.6} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Regenerating…" : "Regenerate"}
        </Button>
      </div>

      {/* Three options · one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {generation.options.map((opt) => (
          <Link
            href={`/generate/${generation.id}/${opt.id}`}
            key={opt.id}
            className="surface surface-hover p-4 block group transition-transform"
          >
            <DesignPreview
              design={opt}
              brandLabel={`${BRAND.mark} · ${BRAND.name}`}
              dimensionsLabel="1080 × 1080"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="label">Option {opt.letter}</div>
              <ComplianceBadge score={opt.complianceScore} />
            </div>
            <div className="mt-3 flex items-center body-sm" style={{ color: "var(--fg-3)" }}>
              Open · Save · Variations
            </div>
          </Link>
        ))}
      </div>

      {/* Why these */}
      <div
        className="mt-9 pt-6 border-t"
        style={{ borderColor: "var(--hairline)" }}
      >
        <Eyebrow className="mb-3">Why these</Eyebrow>
        <div className="flex flex-wrap items-center gap-2">
          {[...aggregatedRules].slice(0, 6).map((r) => (
            <Chip key={r} tone="orchid">
              {r}
            </Chip>
          ))}
        </div>
      </div>

      {/* Refine strip */}
      <div className="mt-10 surface p-5">
        <Eyebrow className="mb-3">Refine all three</Eyebrow>
        <div className="flex items-center gap-3">
          <Sparkles size={15} strokeWidth={1.6} style={{ color: "var(--coral)" }} />
          <input
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="Tighten the headline, push more coral…"
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{
              color: "var(--fg-1)",
              fontWeight: 300,
            }}
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
  // Headline-ify: take the first segment up to em-dash / period / 80 chars.
  const cut = prompt.split(/[—.]/)[0].trim();
  return cut.length > 80 ? cut.slice(0, 78) + "…" : cut + ".";
}
