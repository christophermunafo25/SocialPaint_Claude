"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { ComplianceBadge, Chip } from "@/components/ui/Badge";
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
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      {/* Header strip */}
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => router.push("/generate")}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04]"
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0 px-4 h-10 inline-flex items-center rounded-xl bg-[#171717] border border-white/[0.04]">
          <span className="truncate text-[13px] text-white/75">{generation.prompt}</span>
        </div>
        <Chip>{generation.designType}</Chip>
        <Button variant="outline" size="md" onClick={regenerate} disabled={regenerating}>
          <RefreshCw size={13} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Regenerating…" : "Regenerate"}
        </Button>
      </div>

      {/* Three options · one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {generation.options.map((opt) => (
          <Link
            href={`/generate/${generation.id}/${opt.id}`}
            key={opt.id}
            className="group surface p-4 hover:border-white/15 transition-colors block"
          >
            <DesignPreview
              design={opt}
              brandLabel={`${BRAND.mark} · ${BRAND.name.toUpperCase()}`}
              dimensionsLabel="1080 × 1080"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="mono">Option {opt.letter}</span>
              <ComplianceBadge score={opt.complianceScore} />
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-white/55">
              <span>Open · Save · Variations</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* Why these */}
      <div className="mt-7 pt-5 border-t border-white/[0.05] flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="mono-strong text-white/55">Why these</span>
        <span className="text-white/20">·</span>
        {[...aggregatedRules].slice(0, 6).map((r) => (
          <span key={r} className="text-[12.5px] text-white/55">
            {r}
          </span>
        ))}
      </div>

      {/* Refine strip */}
      <div className="mt-10 rounded-2xl bg-[#141414] border border-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <Sparkles size={15} className="text-[#ED7472]" />
          <span className="text-[13px] text-white/65">Refine across all three —</span>
          <input
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="Tighten the headline, push more coral…"
            className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-white/30"
          />
          <Button variant="outline" disabled={refinePrompt.trim().length < 3} onClick={regenerate}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
