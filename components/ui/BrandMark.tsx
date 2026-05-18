"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The SocialPaint cluster mark — coral-to-peach warm-mesh "B" glyph.
 * Uses the official PNG from /public/assets/logo-socialpaint-mark.png.
 */
export function SocialPaintMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/assets/logo-socialpaint-mark.png"
      alt="SocialPaint"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority
    />
  );
}

/**
 * Wordmark for the sidebar / nav.
 */
export function SocialPaintWordmark({
  height = 22,
  className,
}: {
  height?: number;
  className?: string;
}) {
  // The wordmark-white file is sized for dark backgrounds.
  return (
    <Image
      src="/assets/logo-socialpaint-wordmark-white.png"
      alt="SocialPaint"
      width={height * 6}
      height={height}
      className={cn("object-contain", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );
}

/**
 * The signature halo bloom — coral → sand → peach radial gradient, blurred.
 * Use behind hero headlines. One per page.
 */
export function HeroHalo({
  width = 980,
  height = 600,
  className,
  style,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute pointer-events-none -z-10", className)}
      style={{
        width,
        height,
        maxWidth: "95vw",
        background:
          "radial-gradient(60% 55% at 50% 45%, rgba(245,192,68,0.42) 0%, rgba(244,163,78,0.32) 22%, rgba(241,122,59,0.25) 42%, rgba(237,90,42,0.18) 62%, rgba(216,82,122,0.08) 80%, transparent 100%)",
        filter: "blur(40px)",
        ...style,
      }}
    />
  );
}

/**
 * The brand glyph "centerpiece" — a compact mesh-warm rounded square,
 * used on Home / Generating screens where there's no headline competing.
 */
export function BrandHalo({
  size = 60,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("brand-glyph relative", className)}
      style={{
        width: size,
        height: size,
        borderRadius: 14,
      }}
      aria-hidden
    />
  );
}

// ── Feature pastel mapping per DS README §iconography ────────────────────

export type FeatureKey = "styledna" | "generate" | "connectors" | "insights" | "templates";

export const FEATURE_PASTEL: Record<FeatureKey, string> = {
  styledna: "var(--orchid)",
  generate: "var(--mint)",
  connectors: "var(--sky)",
  insights: "var(--sand)",
  templates: "var(--peach)",
};

export const FEATURE_PASTEL_SOFT: Record<FeatureKey, string> = {
  styledna: "rgba(206,191,250,0.14)",
  generate: "rgba(204,253,207,0.14)",
  connectors: "rgba(215,233,255,0.14)",
  insights: "rgba(255,244,184,0.14)",
  templates: "rgba(255,225,214,0.14)",
};
