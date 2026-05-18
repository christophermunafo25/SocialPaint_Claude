// Composition system — each generated design picks ONE of these templates.
// Templates are structurally + tonally distinct from one another, so a
// regenerated row never looks like three copies of the same layout.

import type { DesignType } from "./types";

export type CompositionKey =
  | "announcement"        // dark canvas, halo, hero copy bottom-left
  | "pull-quote"          // paper cream surface, large quote, mark
  | "stat-callout"        // big number on warm mesh
  | "editorial-cover"     // magazine-style, ribbon eyebrow, large display
  | "paper-card"          // cream surface, structured grid, dark ink
  | "warm-mesh"           // full warm mesh background, white display
  | "event-promo"         // date forward, calendar-tile mark
  | "minimal-quote"       // small mark + single line
  | "banner-strip"        // horizontal strip (Email / Twitter)
  | "carousel-slide";     // carousel slide variant

export type Palette =
  | "ink"            // dark canvas
  | "paper"          // cream
  | "mesh"           // warm gradient
  | "orchid"         // pastel field
  | "mint"           // pastel field
  | "peach"          // pastel field
  | "sand";          // pastel field

export interface CompositionSpec {
  key: CompositionKey;
  palette: Palette;
  /** Score multiplier — some compositions read as more "on-brand" by default. */
  baseScoreShift: number;
  /** Variations of brand-aligned copy this composition wants. */
  tone: "declarative" | "warm" | "specific";
}

/** Pool of compositions valid for each platform. */
const VALID_BY_PLATFORM: Record<DesignType, CompositionKey[]> = {
  "LinkedIn 1:1": [
    "announcement",
    "pull-quote",
    "stat-callout",
    "editorial-cover",
    "paper-card",
    "warm-mesh",
    "event-promo",
    "minimal-quote",
  ],
  "Instagram 4:5": [
    "announcement",
    "pull-quote",
    "stat-callout",
    "editorial-cover",
    "paper-card",
    "warm-mesh",
    "event-promo",
  ],
  "Story 9:16": [
    "announcement",
    "stat-callout",
    "editorial-cover",
    "warm-mesh",
    "event-promo",
  ],
  "Email Banner": ["banner-strip", "warm-mesh", "announcement"],
  "Twitter/X": ["banner-strip", "announcement", "stat-callout", "warm-mesh"],
  Carousel: ["carousel-slide"],
};

/**
 * Choose 3 distinct compositions, biased by what the prompt mentions.
 * Returns highest-affinity first (the 94-score option), descending.
 */
export function pickCompositions(prompt: string, designType: DesignType): CompositionSpec[] {
  const pool = VALID_BY_PLATFORM[designType] ?? VALID_BY_PLATFORM["LinkedIn 1:1"];
  const p = prompt.toLowerCase();

  // Score each composition by prompt affinity.
  const affinity = (k: CompositionKey): number => {
    if (k === "stat-callout" && /\b(\d+(\.\d+)?%|\b\d{2,}x\b|3\.\d+x|\d{2,}\s*\b(users|posts|hours|seconds|minutes))/i.test(prompt)) return 9;
    if (k === "pull-quote" && /(quote|thought|leadership|principle|founder|believe|opinion)/.test(p)) return 9;
    if (k === "event-promo" && /(event|conf|conference|summit|launch|demo|webinar|tuesday|monday|wednesday|thursday|friday|9am|10am|tomorrow|q[1-4])/.test(p)) return 8;
    if (k === "announcement" && /(announce|unveil|introduce|today|new|just launched|live now)/.test(p)) return 7;
    if (k === "editorial-cover" && /(issue|edition|magazine|guide|playbook|report)/.test(p)) return 8;
    if (k === "paper-card" && /(case study|customer|results|brief)/.test(p)) return 6;
    if (k === "warm-mesh" && /(warm|brand|hero|big|bold|major)/.test(p)) return 5;
    if (k === "minimal-quote" && p.split(" ").length < 6) return 6;
    if (k === "banner-strip") return designType === "Email Banner" || designType === "Twitter/X" ? 9 : 0;
    if (k === "carousel-slide") return designType === "Carousel" ? 10 : 0;
    return 2;
  };

  const ranked = [...new Set(pool)]
    .map((k) => ({ k, score: affinity(k) + Math.random() * 1.5 }))
    .sort((a, b) => b.score - a.score);

  // For carousel, just return 3 of carousel-slide variants with palette spread.
  if (designType === "Carousel") {
    return [
      compose("carousel-slide", "mesh", +1, "declarative"),
      compose("carousel-slide", "ink", 0, "warm"),
      compose("carousel-slide", "paper", -1, "specific"),
    ];
  }
  if (designType === "Email Banner") {
    return [
      compose("banner-strip", "mesh", +1, "declarative"),
      compose("banner-strip", "ink", 0, "warm"),
      compose("warm-mesh", "mesh", -1, "specific"),
    ];
  }

  // Pick top three distinct compositions, then assign palette/tone variety.
  const picks: CompositionKey[] = [];
  for (const r of ranked) {
    if (picks.length === 3) break;
    if (!picks.includes(r.k)) picks.push(r.k);
  }
  while (picks.length < 3) {
    const fallback = pool.find((k) => !picks.includes(k));
    if (!fallback) break;
    picks.push(fallback);
  }

  const palettes: Palette[] = paletteShuffleFor(designType);
  return picks.map((key, i) =>
    compose(
      key,
      paletteForComposition(key, palettes[i]),
      [+1, 0, -1][i] ?? 0,
      (["declarative", "warm", "specific"] as const)[i]
    )
  );
}

function paletteShuffleFor(_t: DesignType): Palette[] {
  // A reasonable visual spread across the 3 results.
  const variants: Palette[][] = [
    ["ink", "paper", "mesh"],
    ["mesh", "ink", "paper"],
    ["ink", "mesh", "orchid"],
    ["paper", "ink", "peach"],
    ["mesh", "paper", "sand"],
    ["ink", "mint", "paper"],
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

function paletteForComposition(key: CompositionKey, fallback: Palette): Palette {
  // Some compositions are tied to a specific palette.
  if (key === "warm-mesh") return "mesh";
  if (key === "paper-card") return "paper";
  if (key === "pull-quote") return "paper";
  if (key === "editorial-cover" && fallback === "paper") return "paper";
  if (key === "minimal-quote" && fallback === "mesh") return "ink";
  return fallback;
}

function compose(
  key: CompositionKey,
  palette: Palette,
  baseScoreShift: number,
  tone: CompositionSpec["tone"]
): CompositionSpec {
  return { key, palette, baseScoreShift, tone };
}

// ─── Copy generators per composition + prompt ────────────────────────────

export interface ComposedCopy {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  detail?: string;   // smaller line under subhead
  statValue?: string;     // for stat-callout
  statSuffix?: string;
  dateLine?: string;      // for event-promo
  ctaLabel?: string;
}

const ACME_BIAS = (p: string) =>
  /(acme|tuesday|demo)/i.test(p);

export function composeCopy(prompt: string, spec: CompositionSpec): ComposedCopy {
  const isAcme = ACME_BIAS(prompt);
  const lead = prompt.split(/[—,;:]/)[0].trim() || prompt.slice(0, 80);
  const fragmented = prompt.replace(/[.!?]+$/, "").split(/\s+/).slice(0, 8).join(" ");
  const eyebrowOptions = ["Now live", "This week", "In product", "For the team", "Issue 04", "Launch"];

  switch (spec.key) {
    case "announcement": {
      if (isAcme)
        return {
          eyebrow: "Now live",
          headline: "Tuesday 9AM.",
          subhead: "The demo everyone showed up for.",
          ctaLabel: "Save your seat",
        };
      return {
        eyebrow: pick(eyebrowOptions),
        headline: titleCase(fragmented) + ".",
        subhead: "On-brand. By default.",
        ctaLabel: "Read more",
      };
    }
    case "pull-quote": {
      const candidates = [
        "Tools should not police taste — they should learn it.",
        "Documentation is the design.",
        "Brand is a memory, kept current.",
        "Generate, don't decorate.",
      ];
      return {
        eyebrow: "Field notes",
        headline: candidates[Math.floor(Math.random() * candidates.length)],
        subhead: "— Mira Rowe · Marketing, Northfold",
      };
    }
    case "stat-callout": {
      const numbers = ["3.2×", "62%", "12 days", "47", "94"];
      return {
        eyebrow: "By the numbers",
        statValue: numbers[Math.floor(Math.random() * numbers.length)],
        statSuffix: isAcme ? "of design hours saved" : "more engagement",
        headline: isAcme
          ? "Acme Cloud · post-launch."
          : "Performance, in one glance.",
        subhead: isAcme
          ? "Across the first 30 days of the demo program."
          : "Compared to the same window last quarter.",
      };
    }
    case "editorial-cover": {
      return {
        eyebrow: `Issue 04 · ${todayLabel()}`,
        headline: isAcme ? "The demo, in coral." : titleCase(fragmented) + ".",
        subhead: "A short editorial on brand consistency at scale.",
        detail: "by Mira Rowe",
      };
    }
    case "paper-card": {
      return {
        eyebrow: "Case study",
        headline: isAcme ? "How Acme Cloud ships on-brand." : titleCase(fragmented) + ".",
        subhead:
          "Three weeks. One brand. Zero designer queue. SocialPaint observes how the team makes — and replicates it.",
        detail: "Northfold · Brand intelligence",
      };
    }
    case "warm-mesh": {
      return {
        eyebrow: "Featured",
        headline: isAcme ? "The demo, in coral." : titleCase(fragmented.split(" ").slice(0, 6).join(" ")) + ".",
        subhead: "Generated with SocialPaint.",
      };
    }
    case "event-promo": {
      return {
        eyebrow: "Event",
        dateLine: isAcme ? "Tue · Mar 4 · 9:00 AM PT" : nextWeekLabel(),
        headline: isAcme ? "Acme Cloud · live demo." : titleCase(fragmented) + ".",
        subhead: "30 min walkthrough, 15 min Q&A.",
        ctaLabel: "Save your seat",
      };
    }
    case "minimal-quote": {
      return {
        headline: isAcme ? "Tuesday." : firstWord(fragmented) + ".",
        subhead: isAcme ? "9AM." : "On-brand.",
      };
    }
    case "banner-strip": {
      return {
        eyebrow: "Newsletter",
        headline: isAcme ? "Acme Cloud · the demo issue." : titleCase(lead.slice(0, 40)) + ".",
        ctaLabel: "Read",
      };
    }
    case "carousel-slide": {
      return {
        eyebrow: "01 / 05",
        headline: isAcme ? "Brand, in three weeks." : titleCase(fragmented) + ".",
        subhead: "Slide 1 of 5 — see the rest in the deck.",
      };
    }
  }
}

// ─── Per-composition score breakdown ─────────────────────────────────────

export function scoreForComposition(spec: CompositionSpec): {
  score: number;
  breakdown: { color: number; typography: number; layout: number; imagery: number; voice: number };
} {
  // Base "this looks like the brand made it" score, modified by base shift.
  const center = 87 + spec.baseScoreShift * 5;
  // Slight per-axis randomness inside +/- 6.
  const wiggle = () => Math.round(Math.random() * 10 - 5);
  const color = clamp(center + wiggle() + (spec.palette === "mesh" || spec.palette === "ink" ? 2 : 0));
  const typography = clamp(center + wiggle() + 2);
  const layout = clamp(center + wiggle() + (spec.key === "minimal-quote" ? 4 : 0));
  const imagery = clamp(center + wiggle() - 4);
  const voice = clamp(center + wiggle() + (spec.tone === "declarative" ? 5 : 0));
  const score = Math.round((color + typography + layout + imagery + voice) / 5);
  return { score, breakdown: { color, typography, layout, imagery, voice } };
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function clamp(n: number) {
  return Math.max(60, Math.min(100, n));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function titleCase(s: string) {
  if (!s) return "Something new";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function firstWord(s: string) {
  return s.split(/\s+/)[0] ? titleCase(s.split(/\s+/)[0]) : "Today";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function nextWeekLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
