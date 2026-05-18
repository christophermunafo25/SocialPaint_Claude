// Simulated generation — produces three structurally distinct options after ~3.5s.
import type { DesignGeneration, GeneratedDesign, DesignType } from "./types";
import { DEMO_PROMPT } from "./mock-data";
import { shortId } from "./cn";
import { pickCompositions, composeCopy, scoreForComposition, type CompositionSpec } from "./compositions";

const RULE_LIBRARY: Record<string, string[]> = {
  announcement: ["Coral as accent", "Left-aligned hero", "Short declaratives", "No bold headlines"],
  "pull-quote": ["Quote marks as motif", "Paper-cream surface", "Short declaratives"],
  "stat-callout": ["Numerals over words", "Coral as accent", "8px vertical rhythm"],
  "editorial-cover": ["Fragment Mono eyebrows", "Short declaratives", "Asymmetric hero"],
  "paper-card": ["Paper-cream surface", "Hairline borders", "Sentence-case headlines"],
  "warm-mesh": ["Warm mesh background", "White display type"],
  "event-promo": ["Date forward", "Coral as accent", "CTA pill"],
  "minimal-quote": ["Short declaratives", "Coral as accent"],
  "banner-strip": ["Warm spectrum gradient", "Single line of copy"],
  "carousel-slide": ["Numbered slide eyebrow", "Stack Sans Headline 400"],
};

function buildDesign(
  generationId: string,
  prompt: string,
  designType: DesignType,
  spec: CompositionSpec,
  letter: "A" | "B" | "C"
): GeneratedDesign {
  const copy = composeCopy(prompt, spec);
  const { score, breakdown } = scoreForComposition(spec);
  const rules = RULE_LIBRARY[spec.key] ?? ["Coral as accent", "Short declaratives"];

  return {
    id: shortId("d"),
    generationId,
    letter,
    headline: copy.headline,
    subhead: copy.subhead,
    eyebrow: copy.eyebrow,
    detail: copy.detail,
    statValue: copy.statValue,
    statSuffix: copy.statSuffix,
    dateLine: copy.dateLine,
    ctaLabel: copy.ctaLabel,
    composition: spec.key,
    palette: spec.palette,
    designType,
    complianceScore: score,
    complianceBreakdown: breakdown,
    appliedRules: rules,
    status: "draft",
  };
}

export function simulateGeneration(
  prompt: string,
  designType: DesignType,
  userId: string
): Promise<DesignGeneration> {
  const generationId = shortId("gen");
  const specs = pickCompositions(prompt || DEMO_PROMPT, designType);

  // Sort by base score shift so Option A is the strongest.
  const sorted = [...specs].sort((a, b) => b.baseScoreShift - a.baseScoreShift);
  const letters: ("A" | "B" | "C")[] = ["A", "B", "C"];

  const options: GeneratedDesign[] = sorted.map((spec, i) =>
    buildDesign(generationId, prompt || DEMO_PROMPT, designType, spec, letters[i])
  );

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

/** Regenerate a single variant — picks a fresh composition different from the existing one. */
export function simulateRegenerateOne(
  prompt: string,
  designType: DesignType,
  generationId: string,
  excludeComposition: string,
  letter: "A" | "B" | "C"
): Promise<GeneratedDesign> {
  // Pick from the full pool of compositions and try to avoid duplicates.
  const specs = pickCompositions(prompt, designType);
  const fresh = specs.find((s) => s.key !== excludeComposition) ?? specs[0];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buildDesign(generationId, prompt, designType, fresh, letter));
    }, 1800);
  });
}

// Refine: tighten copy + bump score by ~2.
export function simulateRefine(
  design: GeneratedDesign,
  _refinePrompt: string
): Promise<GeneratedDesign> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const refinedCopy = composeCopy(design.headline, {
        key: design.composition,
        palette: design.palette,
        baseScoreShift: 1,
        tone: "declarative",
      });
      const nextScore = Math.min(100, design.complianceScore + 2);
      const bumpedBreakdown = {
        color: Math.min(100, design.complianceBreakdown.color + 1),
        typography: Math.min(100, design.complianceBreakdown.typography + 3),
        layout: Math.min(100, design.complianceBreakdown.layout + 2),
        imagery: design.complianceBreakdown.imagery,
        voice: Math.min(100, design.complianceBreakdown.voice + 2),
      };
      resolve({
        ...design,
        headline: refinedCopy.headline,
        subhead: refinedCopy.subhead,
        eyebrow: refinedCopy.eyebrow ?? design.eyebrow,
        complianceScore: nextScore,
        complianceBreakdown: bumpedBreakdown,
      });
    }, 1800);
  });
}
