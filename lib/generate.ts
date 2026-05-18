// Simulated generation — produces 3 options after ~3.5s.
import type { DesignGeneration, GeneratedDesign, DesignType } from "./types";
import { DEMO_OPTIONS, DEMO_PROMPT, REFINE_HEADLINE_VARIANTS } from "./mock-data";
import { shortId } from "./cn";

const VARIANT_BG = [
  "radial-gradient(circle at 70% 55%, rgba(237,116,114,0.55), rgba(237,116,114,0) 55%), #0A0A0A",
  "radial-gradient(circle at 40% 65%, rgba(237,116,114,0.42), rgba(237,116,114,0) 60%), #0A0A0A",
  "radial-gradient(circle at 50% 40%, rgba(237,116,114,0.30), rgba(237,116,114,0) 65%), #0A0A0A",
];

// Returns a function-shaped headline derived from the prompt, with subhead.
function deriveHeadlines(prompt: string): { headline: string; subhead?: string }[] {
  const p = prompt.toLowerCase();
  // If the prompt closely matches the demo prompt, return the canonical options.
  if (p.includes("acme") || p.includes("tuesday")) {
    return DEMO_OPTIONS.map((o) => ({ headline: o.headline, subhead: o.subhead }));
  }
  // Otherwise, derive three terse declaratives from prompt fragments.
  const trimmed = prompt.replace(/[.!?]+$/, "").trim();
  const lead = trimmed.split(/[,;:—-]/)[0]?.trim() || "Something new.";
  const short = lead.length > 38 ? lead.slice(0, 36).trim() + "…" : lead + ".";
  return [
    { headline: short, subhead: "On-brand. By default." },
    { headline: capitalize(trimmed.split(" ").slice(0, 5).join(" ")) + ".", subhead: "Now in coral." },
    { headline: "Here it is.", subhead: short },
  ];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function simulateGeneration(
  prompt: string,
  designType: DesignType,
  userId: string
): Promise<DesignGeneration> {
  const generationId = shortId("gen");
  const headlines = deriveHeadlines(prompt);
  const scores = [94, 89, 78];
  const breakdowns = [
    { color: 100, typography: 92, layout: 90, imagery: 88, voice: 96 },
    { color: 95, typography: 90, layout: 85, imagery: 82, voice: 92 },
    { color: 80, typography: 70, layout: 75, imagery: 78, voice: 88 },
  ];
  const ruleSets = [
    ["Coral as accent", "No bold headlines", "Left-aligned hero", "Short declaratives"],
    ["Coral as accent", "Left-aligned hero", "Short declaratives"],
    ["Coral as accent", "Short declaratives"],
  ];

  const options: GeneratedDesign[] = headlines.map((h, i) => ({
    id: shortId("d"),
    generationId,
    letter: (["A", "B", "C"] as const)[i],
    headline: h.headline,
    subhead: h.subhead,
    previewBg: VARIANT_BG[i],
    complianceScore: scores[i],
    complianceBreakdown: breakdowns[i],
    appliedRules: ruleSets[i],
    status: "draft",
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: generationId,
        prompt: prompt || DEMO_PROMPT,
        designType,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        status: "ready",
        options,
      });
    }, 3500);
  });
}

// Refine: returns a v2 design with +2 score and a swapped headline.
export function simulateRefine(
  design: GeneratedDesign,
  refinePrompt: string
): Promise<GeneratedDesign> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const variant = REFINE_HEADLINE_VARIANTS[Math.floor(Math.random() * REFINE_HEADLINE_VARIANTS.length)];
      const nextScore = Math.min(100, design.complianceScore + 2);
      const bumpedBreakdown = {
        color: Math.min(100, design.complianceBreakdown.color + 1),
        typography: Math.min(100, design.complianceBreakdown.typography + 3),
        layout: Math.min(100, design.complianceBreakdown.layout + 2),
        imagery: design.complianceBreakdown.imagery,
        voice: Math.min(100, design.complianceBreakdown.voice + 2),
      };
      // Slightly different halo position to indicate the swap.
      const refinedBg =
        "radial-gradient(circle at 72% 50%, rgba(237,116,114,0.62), rgba(237,116,114,0) 55%), #0A0A0A";
      resolve({
        ...design,
        headline: variant.headline,
        subhead: variant.subhead,
        previewBg: refinedBg,
        complianceScore: nextScore,
        complianceBreakdown: bumpedBreakdown,
      });
    }, 2000);
  });
}
