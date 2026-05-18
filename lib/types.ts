// Domain types per §6 — only fields the prototype uses.

export type Role = "Owner" | "Admin" | "Designer" | "Marketer" | "Sales" | "Executive";

export type Confidence = "Strong" | "Moderate" | "Emerging";

export type RuleCategory = "Colors" | "Typography" | "Layout" | "Imagery" | "Voice";

export type DesignType =
  | "LinkedIn 1:1"
  | "Instagram 4:5"
  | "Email Banner"
  | "Carousel"
  | "Story 9:16"
  | "Twitter/X";

export type ComplianceBand = "ON-BRAND" | "MOSTLY" | "REVIEW";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  avatarColor: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  memberCount: number;
}

export interface Brand {
  id: string;
  name: string;
  mark: string;
  accent: string;
  capturedFromCount: number;
}

export interface StyleDNARule {
  id: string;
  brandId: string;
  category: RuleCategory;
  title: string;
  description: string;
  confidence: Confidence;
  exampleCount: number;
  exampleThumbnails: string[];
  lastUpdated: string; // ISO
  isLocked: boolean;
  isDisabled: boolean;
  source: "observed" | "uploaded" | "manual";
  swatches?: string[]; // colors rule
}

export interface ComplianceBreakdown {
  color: number;
  typography: number;
  layout: number;
  imagery: number;
  voice: number;
}

export interface GeneratedDesign {
  id: string;
  generationId: string;
  letter: "A" | "B" | "C";
  headline: string;
  subhead?: string;
  eyebrow?: string;
  detail?: string;
  statValue?: string;
  statSuffix?: string;
  dateLine?: string;
  ctaLabel?: string;
  composition: import("./compositions").CompositionKey;
  palette: import("./compositions").Palette;
  designType: DesignType;
  /** Optional override for the simple "halo on dark" preview if a composition is missing.
   *  New compositions render themselves; this is just a fallback. */
  previewBg?: string;
  complianceScore: number;
  complianceBreakdown: ComplianceBreakdown;
  appliedRules: string[];
  status: "draft" | "saved" | "flagged";
  exported?: boolean;
}

export interface DesignGeneration {
  id: string;
  prompt: string;
  designType: DesignType;
  templateId?: string;
  createdBy: string; // userId
  createdAt: string;
  status: "generating" | "ready" | "failed";
  options: GeneratedDesign[];
}

export interface DetectedObservation {
  id: string;
  category: RuleCategory;
  title: string;
  description: string;
  confidence: Confidence;
  accepted: boolean | null; // null = pending
}

export interface AssetIngestion {
  id: string;
  source: "upload" | "link";
  fileName?: string;
  url?: string;
  thumbnailUrl?: string;
  status: "analyzing" | "review" | "added" | "failed";
  detectedObservations: DetectedObservation[];
  createdBy: string;
  createdAt: string;
}

export type ActivityEventType =
  | "generation"
  | "refinement"
  | "export"
  | "asset_ingested"
  | "rule_edited"
  | "save";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actorId: string;
  prompt?: string;
  designType?: DesignType;
  designId?: string;
  generationId?: string;
  ruleId?: string;
  ingestionId?: string;
  complianceScore?: number;
  createdAt: string;
  flaggedByAdmin: boolean;
  note?: string;
}

export interface HistoryItem {
  id: string;
  generationId: string;
  designId: string;
  title: string;
  designType: DesignType;
  score: number;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: "LinkedIn" | "Instagram" | "Email" | "Carousel";
  designType: DesignType;
  prompt: string;
  composition: import("./compositions").CompositionKey;
  palette: import("./compositions").Palette;
  description: string;
}

export interface Connector {
  id: string;
  name: string;
  category: "Design" | "Distribution" | "Storage";
  letter: string;
  status: "connected" | "available";
  brandColor: string;
}
