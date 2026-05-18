"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PromptInput } from "@/components/generate/PromptInput";
import { HeroHalo } from "@/components/ui/BrandMark";
import { Eyebrow } from "@/components/ui/Badge";
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 isolate overflow-hidden">
      <HeroHalo
        width={1080}
        height={680}
        style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="w-full max-w-[760px] flex flex-col items-center text-center relative">
        <Eyebrow className="mb-5" tone="muted">
          Generate designs · Acme Cloud
        </Eyebrow>
        <h1
          className="display-2 mb-4"
          style={{ color: "var(--fg-1)", maxWidth: "16ch" }}
        >
          What are we painting today?
        </h1>
        <p className="body-lg mb-10" style={{ maxWidth: "480px" }}>
          Describe a piece of content. SocialPaint reads your StyleDNA, applies
          the brand, and brings back three options scored against it.
        </p>

        <div className="w-full">
          <PromptInput
            autoFocus
            initialPrompt={prefillPrompt}
            initialDesignType={prefillType}
          />
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-2 max-w-[640px]">
          <Eyebrow tone="muted">Try</Eyebrow>
          {SUGGESTIONS.map((s) => (
            <SuggestionChip key={s} prompt={s} />
          ))}
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
        const ta = document.querySelector("textarea") as HTMLTextAreaElement | null;
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
      className="text-[12.5px] px-3.5 py-1.5 rounded-full border transition-colors max-w-[280px] truncate"
      style={{
        color: "var(--fg-2)",
        background: "rgba(247,246,245,0.03)",
        borderColor: "var(--hairline)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--fg-1)";
        e.currentTarget.style.background = "rgba(247,246,245,0.06)";
        e.currentTarget.style.borderColor = "var(--hairline-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--fg-2)";
        e.currentTarget.style.background = "rgba(247,246,245,0.03)";
        e.currentTarget.style.borderColor = "var(--hairline)";
      }}
      title={prompt}
    >
      {prompt === DEMO_PROMPT ? "Acme Cloud demo announcement" : prompt}
    </button>
  );
}
