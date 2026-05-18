"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PromptInput } from "@/components/generate/PromptInput";
import { BrandHalo } from "@/components/ui/BrandMark";
import { DEMO_PROMPT } from "@/lib/mock-data";
import type { DesignType } from "@/lib/types";

const SUGGESTIONS = [
  DEMO_PROMPT,
  "A pull-quote tile for our Q3 keynote.",
  "Email banner for the pricing update.",
];

function GenerateInner() {
  const params = useSearchParams();
  const prefillPrompt = params.get("prompt") ?? "";
  const prefillType = (params.get("type") as DesignType | null) ?? "LinkedIn 1:1";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[680px] flex flex-col items-center text-center">
          <BrandHalo className="mb-9" />
          <h1 className="headline-display text-[44px] sm:text-[52px] mb-2.5">
            What are we{" "}
            <span className="text-[#ED7472]">painting</span> today?
          </h1>
          <p className="text-[14px] text-white/45 mb-12 max-w-[460px]">
            Describe a piece of content. SocialPaint will read your StyleDNA,
            apply the brand, and bring back three options scored against it.
          </p>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="w-full max-w-[760px] mx-auto">
          <PromptInput
            autoFocus
            initialPrompt={prefillPrompt}
            initialDesignType={prefillType}
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="mono text-white/30">Try</span>
            {SUGGESTIONS.map((s) => (
              <SuggestionChip key={s} prompt={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={null}>
      <GenerateInner />
    </Suspense>
  );
}

function SuggestionChip({ prompt }: { prompt: string }) {
  return (
    <button
      onClick={() => {
        const ta = document.querySelector(
          "textarea"
        ) as HTMLTextAreaElement | null;
        if (ta) {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          )?.set;
          setter?.call(ta, prompt);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.focus();
        }
      }}
      className="text-[12px] text-white/55 hover:text-white px-3 py-1.5 rounded-full border border-white/[0.06] hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-colors max-w-[280px] truncate"
      title={prompt}
    >
      {prompt === DEMO_PROMPT ? "Acme Cloud demo announcement" : prompt}
    </button>
  );
}
