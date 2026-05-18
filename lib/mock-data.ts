// Seed data per §7 — every prototype reference flows through this file.

import type {
  ActivityEvent,
  Brand,
  Connector,
  DesignGeneration,
  GeneratedDesign,
  HistoryItem,
  StyleDNARule,
  Template,
  User,
  Workspace,
} from "./types";

export const WORKSPACE: Workspace = {
  id: "ws_northfold",
  name: "Northfold",
  plan: "Team",
  memberCount: 12,
};

export const BRAND: Brand = {
  id: "brand_acme_cloud",
  name: "Acme Cloud",
  mark: "AC",
  accent: "#ED7472",
  capturedFromCount: 47,
};

// Primary user — defaults to Marketer; can be promoted to Admin in Settings.
export const MIRA: User = {
  id: "u_mira",
  name: "Mira Rowe",
  email: "mira@northfold.co",
  role: "Marketer",
  initials: "MR",
  avatarColor: "#ccfdcf", // mint
};

export const TEAM: User[] = [
  MIRA,
  {
    id: "u_theo",
    name: "Theo Park",
    email: "theo@northfold.co",
    role: "Designer",
    initials: "TP",
    avatarColor: "#d7e9ff", // sky
  },
  {
    id: "u_sam",
    name: "Sam Holt",
    email: "sam@northfold.co",
    role: "Marketer",
    initials: "SH",
    avatarColor: "#fff4b8", // sand
  },
  {
    id: "u_jules",
    name: "Jules Aoki",
    email: "jules@northfold.co",
    role: "Designer",
    initials: "JA",
    avatarColor: "#cebffa", // orchid
  },
  {
    id: "u_lin",
    name: "Lin Vega",
    email: "lin@northfold.co",
    role: "Marketer",
    initials: "LV",
    avatarColor: "#ffe1d6", // peach
  },
  {
    id: "u_kai",
    name: "Kai Brennan",
    email: "kai@northfold.co",
    role: "Sales",
    initials: "KB",
    avatarColor: "#f5cdbe",
  },
  {
    id: "u_ren",
    name: "Ren Salas",
    email: "ren@northfold.co",
    role: "Owner",
    initials: "RS",
    avatarColor: "#f3da8a",
  },
];

// ─── StyleDNA · 5 seed rules per §7 ─────────────────────────────────────────

const now = () => new Date().toISOString();

export const SEED_RULES: StyleDNARule[] = [
  {
    id: "r_color_01",
    brandId: BRAND.id,
    category: "Colors",
    title: "Coral as accent",
    description:
      "Coral (#ED7472) is used sparingly as accent — never as a background field. One coral moment per surface.",
    confidence: "Strong",
    exampleCount: 23,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
    swatches: ["#ED7472", "#0A0A0A", "#FFFFFF"],
  },
  {
    id: "r_color_04",
    brandId: BRAND.id,
    category: "Colors",
    title: "Obsidian panels with coral glow",
    description:
      "Dark panels (#0A0A0A) anchor heroes, with a soft 600px coral radial halo as the only light source.",
    confidence: "Strong",
    exampleCount: 19,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
    swatches: ["#0A0A0A", "#171717", "#ED7472"],
  },
  {
    id: "r_type_02",
    brandId: BRAND.id,
    category: "Typography",
    title: "StackSans Headline 400, tight tracking",
    description:
      "Headlines use StackSans Headline at weight 400 with −1.5px tracking. Never bold.",
    confidence: "Strong",
    exampleCount: 31,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
  },
  {
    id: "r_layout_03",
    brandId: BRAND.id,
    category: "Layout",
    title: "Asymmetric left-aligned hero",
    description:
      "Heroes anchor to the left edge with generous right-side breathing room. Vertical rhythm of 8px.",
    confidence: "Moderate",
    exampleCount: 14,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
  },
  {
    id: "r_voice_05",
    brandId: BRAND.id,
    category: "Voice",
    title: "Short declarative headlines",
    description:
      "Headlines are short declaratives. Periods, not exclamation marks. Maximum two sentences.",
    confidence: "Strong",
    exampleCount: 28,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
  },
  {
    id: "r_imagery_06",
    brandId: BRAND.id,
    category: "Imagery",
    title: "Soft radial halos over flat fields",
    description:
      "Photography is replaced by soft radial halos. No stock photography, no people.",
    confidence: "Moderate",
    exampleCount: 11,
    exampleThumbnails: [],
    lastUpdated: now(),
    isLocked: false,
    isDisabled: false,
    source: "observed",
  },
];

// ─── Demo generation · the spine ────────────────────────────────────────────

export const DEMO_PROMPT =
  "Announce Acme Cloud demo for next Tuesday — warm, on-brand, room for one short sentence.";

export const DEMO_DESIGN_TYPE = "LinkedIn 1:1" as const;

export const DEMO_GENERATION_ID = "gen_acme_demo_v1";

export const DEMO_OPTIONS: GeneratedDesign[] = [
  {
    id: "d_opt_a",
    generationId: DEMO_GENERATION_ID,
    letter: "A",
    eyebrow: "Now live",
    headline: "Tuesday 9AM.",
    subhead: "The demo everyone showed up for.",
    ctaLabel: "Save your seat",
    composition: "announcement",
    palette: "ink",
    designType: DEMO_DESIGN_TYPE,
    complianceScore: 94,
    complianceBreakdown: { color: 100, typography: 92, layout: 90, imagery: 88, voice: 96 },
    appliedRules: [
      "Coral as accent",
      "No bold headlines",
      "Left-aligned hero",
      "Short declaratives",
    ],
    status: "draft",
  },
  {
    id: "d_opt_b",
    generationId: DEMO_GENERATION_ID,
    letter: "B",
    eyebrow: "Event",
    dateLine: "Tue · Mar 4 · 9:00 AM PT",
    headline: "Acme Cloud · live demo.",
    subhead: "30 min walkthrough, 15 min Q&A.",
    ctaLabel: "Save your seat",
    composition: "event-promo",
    palette: "paper",
    designType: DEMO_DESIGN_TYPE,
    complianceScore: 89,
    complianceBreakdown: { color: 95, typography: 90, layout: 85, imagery: 82, voice: 92 },
    appliedRules: ["Date forward", "Coral as accent", "CTA pill"],
    status: "draft",
  },
  {
    id: "d_opt_c",
    generationId: DEMO_GENERATION_ID,
    letter: "C",
    eyebrow: "By the numbers",
    statValue: "94",
    statSuffix: "compliance on launch",
    headline: "Acme Cloud · post-launch.",
    subhead: "Across the first 30 days of the demo program.",
    composition: "stat-callout",
    palette: "mesh",
    designType: DEMO_DESIGN_TYPE,
    complianceScore: 78,
    complianceBreakdown: { color: 80, typography: 70, layout: 75, imagery: 78, voice: 88 },
    appliedRules: ["Numerals over words", "Coral as accent"],
    status: "draft",
  },
];

export const DEMO_GENERATION: DesignGeneration = {
  id: DEMO_GENERATION_ID,
  prompt: DEMO_PROMPT,
  designType: DEMO_DESIGN_TYPE,
  createdBy: MIRA.id,
  createdAt: now(),
  status: "ready",
  options: DEMO_OPTIONS,
};

// ─── History · "Previous Masterpieces" ──────────────────────────────────────

export const SEED_HISTORY: HistoryItem[] = [
  {
    id: "h_01",
    generationId: "gen_archive_01",
    designId: "d_arch_01",
    title: "LinkedIn Product Launch",
    designType: "LinkedIn 1:1",
    score: 92,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: "h_02",
    generationId: "gen_archive_02",
    designId: "d_arch_02",
    title: "Instagram Event Promo",
    designType: "Instagram 4:5",
    score: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "h_03",
    generationId: "gen_archive_03",
    designId: "d_arch_03",
    title: "LinkedIn Thought-Leadership",
    designType: "LinkedIn 1:1",
    score: 91,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

// ─── Activity feed seed ─────────────────────────────────────────────────────

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: "a_05",
    type: "generation",
    actorId: "u_lin",
    prompt: "Thought-leadership carousel — Q3 retrospective",
    designType: "Carousel",
    complianceScore: 91,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    flaggedByAdmin: false,
  },
  {
    id: "a_04",
    type: "generation",
    actorId: "u_sam",
    prompt: "Email banner — pricing announcement",
    designType: "Email Banner",
    complianceScore: 72,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    flaggedByAdmin: true,
  },
  {
    id: "a_03",
    type: "rule_edited",
    actorId: "u_mira",
    ruleId: "r_type_02",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    flaggedByAdmin: false,
    note: "Edited Typography rule",
  },
  {
    id: "a_02",
    type: "asset_ingested",
    actorId: "u_jules",
    ingestionId: "ing_seed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    flaggedByAdmin: false,
    note: "Uploaded asset · 7 observations",
  },
  {
    id: "a_01b",
    type: "generation",
    actorId: "u_theo",
    prompt: "Event promo for Q3 conf",
    designType: "Instagram 4:5",
    complianceScore: 88,
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    flaggedByAdmin: false,
  },
];

// ─── Templates per §4.8 ─────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    id: "t_li_launch",
    name: "Product launch",
    category: "LinkedIn",
    designType: "LinkedIn 1:1",
    prompt: "Announce Acme Cloud demo for next Tuesday — warm, on-brand, room for one short sentence.",
    composition: "announcement",
    palette: "ink",
    description: "Hero copy, halo glow, CTA pill. Bottom-left anchor.",
  },
  {
    id: "t_ig_event",
    name: "Event promo",
    category: "Instagram",
    designType: "Instagram 4:5",
    prompt: "Promote our Q3 customer summit — date forward, two-line voice.",
    composition: "event-promo",
    palette: "paper",
    description: "Date tile + headline + CTA. Reads like a calendar invite.",
  },
  {
    id: "t_carousel_tl",
    name: "Thought-leadership carousel",
    category: "Carousel",
    designType: "Carousel",
    prompt: "Five-slide thought-leadership piece on brand consistency at scale.",
    composition: "carousel-slide",
    palette: "ink",
    description: "Numbered eyebrows, slide ticker, consistent voice across 5.",
  },
  {
    id: "t_li_quote",
    name: "Pull quote",
    category: "LinkedIn",
    designType: "LinkedIn 1:1",
    prompt: "Pull-quote tile from our founder on documentation as design.",
    composition: "pull-quote",
    palette: "paper",
    description: "Large coral quote mark, short pull-quote, attribution.",
  },
  {
    id: "t_email_banner",
    name: "Email header",
    category: "Email",
    designType: "Email Banner",
    prompt: "Email header banner — newsletter issue with a one-line summary.",
    composition: "banner-strip",
    palette: "mesh",
    description: "Wide horizontal strip with brand mark + CTA pill.",
  },
  {
    id: "t_ig_stat",
    name: "Stat callout",
    category: "Instagram",
    designType: "Instagram 4:5",
    prompt: "Performance stat — 3.2× more engagement on Tuesday 9AM posts.",
    composition: "stat-callout",
    palette: "mesh",
    description: "Giant number, supporting suffix, dark mesh canvas.",
  },
  {
    id: "t_li_editorial",
    name: "Editorial cover",
    category: "LinkedIn",
    designType: "LinkedIn 1:1",
    prompt: "Issue 04 editorial cover — a short piece on brand consistency.",
    composition: "editorial-cover",
    palette: "ink",
    description: "Magazine-style ribbon eyebrow, big display, byline.",
  },
  {
    id: "t_li_case",
    name: "Case study card",
    category: "LinkedIn",
    designType: "LinkedIn 1:1",
    prompt: "Case study — how Acme Cloud ships on-brand work in 3 weeks.",
    composition: "paper-card",
    palette: "paper",
    description: "Paper-cream surface, structured grid, dark ink.",
  },
];

// ─── Connectors per §4.10 ───────────────────────────────────────────────────

export const CONNECTORS: Connector[] = [
  { id: "c_figma", name: "Figma", category: "Design", letter: "F", status: "connected", brandColor: "#A259FF" },
  { id: "c_adobe", name: "Adobe CC", category: "Design", letter: "A", status: "available", brandColor: "#E5482A" },
  { id: "c_canva", name: "Canva", category: "Design", letter: "C", status: "available", brandColor: "#00C4CC" },
  { id: "c_linkedin", name: "LinkedIn", category: "Distribution", letter: "in", status: "connected", brandColor: "#0A66C2" },
  { id: "c_drive", name: "Google Drive", category: "Storage", letter: "G", status: "available", brandColor: "#1AA463" },
  { id: "c_notion", name: "Notion", category: "Storage", letter: "N", status: "available", brandColor: "#FFFFFF" },
  { id: "c_dropbox", name: "Dropbox", category: "Storage", letter: "D", status: "available", brandColor: "#0061FE" },
  { id: "c_slack", name: "Slack", category: "Distribution", letter: "S", status: "available", brandColor: "#E01E5A" },
];

// ─── Status lines used by simulated generation ──────────────────────────────

export const GENERATING_STATUS_LINES = [
  "Reading StyleDNA…",
  "Applying brand colors…",
  "Checking type hierarchy…",
  "Rendering 3 options…",
];

export const INGESTING_STATUS_LINES = [
  "Fetching from source…",
  "Detecting colors…",
  "Measuring type hierarchy…",
  "Comparing to existing StyleDNA…",
];

// Used to invent a "v2" headline when user refines a design.
export const REFINE_HEADLINE_VARIANTS = [
  { headline: "Tuesday. 9AM.", subhead: "The demo everyone shows up for." },
  { headline: "Tuesday at 9AM.", subhead: "The demo people remember." },
  { headline: "9AM Tuesday.", subhead: "A demo, in coral." },
];
