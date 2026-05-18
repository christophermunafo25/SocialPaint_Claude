// Platform-native sizing — every design preview / export reference flows
// through this table so the prototype never lies about output dimensions.

import type { DesignType } from "./types";

export interface PlatformSpec {
  designType: DesignType;
  width: number;          // native export width (px)
  height: number;         // native export height (px)
  aspectRatio: string;    // CSS aspect-ratio value
  label: string;          // short user-facing label
  ratioLabel: string;     // e.g. "1:1", "4:5", "16:9"
  slideCount?: number;    // carousels are multi-slide
  surfaceMax: { w: number; h: number }; // px cap for in-app preview
}

export const PLATFORM_SPECS: Record<DesignType, PlatformSpec> = {
  "LinkedIn 1:1": {
    designType: "LinkedIn 1:1",
    width: 1080,
    height: 1080,
    aspectRatio: "1 / 1",
    label: "LinkedIn post",
    ratioLabel: "1:1",
    surfaceMax: { w: 640, h: 640 },
  },
  "Instagram 4:5": {
    designType: "Instagram 4:5",
    width: 1080,
    height: 1350,
    aspectRatio: "4 / 5",
    label: "Instagram post",
    ratioLabel: "4:5",
    surfaceMax: { w: 540, h: 675 },
  },
  "Story 9:16": {
    designType: "Story 9:16",
    width: 1080,
    height: 1920,
    aspectRatio: "9 / 16",
    label: "Story / Reel",
    ratioLabel: "9:16",
    surfaceMax: { w: 380, h: 676 },
  },
  "Email Banner": {
    designType: "Email Banner",
    width: 600,
    height: 200,
    aspectRatio: "3 / 1",
    label: "Email banner",
    ratioLabel: "3:1",
    surfaceMax: { w: 720, h: 240 },
  },
  "Carousel": {
    designType: "Carousel",
    width: 1080,
    height: 1080,
    aspectRatio: "1 / 1",
    label: "Carousel · 5 slides",
    ratioLabel: "1:1 × 5",
    slideCount: 5,
    surfaceMax: { w: 620, h: 620 },
  },
  "Twitter/X": {
    designType: "Twitter/X",
    width: 1600,
    height: 900,
    aspectRatio: "16 / 9",
    label: "Twitter / X",
    ratioLabel: "16:9",
    surfaceMax: { w: 720, h: 405 },
  },
};

export function platformOf(type: DesignType): PlatformSpec {
  return PLATFORM_SPECS[type];
}

export function exportLabel(type: DesignType): string {
  const p = PLATFORM_SPECS[type];
  return `${p.width} × ${p.height}px · ${p.label}`;
}
