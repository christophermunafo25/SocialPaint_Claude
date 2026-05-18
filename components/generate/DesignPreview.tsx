"use client";

import { cn } from "@/lib/cn";
import type { GeneratedDesign } from "@/lib/types";
import type { CompositionKey, Palette } from "@/lib/compositions";
import { platformOf } from "@/lib/platforms";
import { BRAND } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

interface Props {
  design: GeneratedDesign;
  size?: "card" | "hero";
  showSizeBadge?: boolean;
  className?: string;
  /** For carousels — render a specific slide variation (1-indexed). */
  slideIndex?: number;
  slideTotal?: number;
}

/**
 * Renders a generated design at the correct platform aspect ratio,
 * using its composition's visual template. Compositions are designed
 * to read in both the small results-card scale and the large hero scale.
 */
export function DesignPreview({
  design,
  size = "card",
  showSizeBadge = false,
  className,
  slideIndex,
  slideTotal,
}: Props) {
  const platform = platformOf(design.designType);
  const isHero = size === "hero";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isHero ? "rounded-[20px]" : "rounded-2xl",
        className
      )}
      style={{
        aspectRatio: platform.aspectRatio,
        border: "1px solid rgba(247,246,245,0.06)",
      }}
    >
      <PaletteSurface palette={design.palette}>
        <Composition
          composition={design.composition}
          design={design}
          isHero={isHero}
          slideIndex={slideIndex ?? 1}
          slideTotal={slideTotal ?? 5}
        />
      </PaletteSurface>

      {/* Always-on platform/dimension chip in upper-right of hero. Subtle on cards. */}
      {showSizeBadge && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.075em] z-20"
          style={{
            color: paletteInk(design.palette, 0.78),
            background: paletteInk(design.palette, 0.06, "bg"),
            border: `1px solid ${paletteInk(design.palette, 0.10, "bg")}`,
          }}
        >
          {platform.width} × {platform.height}
        </div>
      )}

      {/* Slide counter (carousel only) */}
      {design.composition === "carousel-slide" && slideIndex && slideTotal && (
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.075em] z-20"
          style={{
            color: paletteInk(design.palette, 0.78),
            background: paletteInk(design.palette, 0.06, "bg"),
            border: `1px solid ${paletteInk(design.palette, 0.10, "bg")}`,
          }}
        >
          {String(slideIndex).padStart(2, "0")} / {String(slideTotal).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

// ── Palette surfaces ──────────────────────────────────────────────────────

function PaletteSurface({
  palette,
  children,
}: {
  palette: Palette;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ background: paletteBg(palette), color: paletteFg(palette) }}
    >
      {/* Optional radial halo for ink/mesh palettes — gives the "warm bloom" cue */}
      {(palette === "ink") && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 55% at 70% 55%, rgba(237,116,114,0.42), rgba(237,116,114,0) 60%)",
          }}
        />
      )}
      {palette === "mesh" && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            opacity: 0.35,
          }}
        />
      )}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function paletteBg(p: Palette): string {
  switch (p) {
    case "ink":
      return "#0E0C0E";
    case "paper":
      return "#F7F6F5";
    case "mesh":
      return "radial-gradient(90% 75% at 82% 8%, rgba(245,192,68,0.95), rgba(245,192,68,0) 60%), radial-gradient(85% 75% at 6% 26%, rgba(237,90,42,0.95), rgba(237,90,42,0) 60%), radial-gradient(90% 75% at 58% 44%, rgba(241,122,59,0.95), rgba(241,122,59,0) 60%), radial-gradient(70% 60% at 22% 72%, rgba(241,121,126,0.95), rgba(241,121,126,0) 60%), radial-gradient(65% 55% at 6% 96%, rgba(216,82,122,0.95), rgba(216,82,122,0) 60%), linear-gradient(165deg, #f5c044 0%, #f4a34e 25%, #f17a3b 50%, #ed5a2a 75%, #d8527a 100%)";
    case "orchid":
      return "linear-gradient(155deg, #d8c9ff 0%, #cebffa 100%)";
    case "mint":
      return "linear-gradient(155deg, #d8ffdb 0%, #ccfdcf 100%)";
    case "peach":
      return "linear-gradient(155deg, #ffead6 0%, #ffe1d6 100%)";
    case "sand":
      return "linear-gradient(155deg, #fff8d2 0%, #fff4b8 100%)";
  }
}

function paletteFg(p: Palette): string {
  return p === "paper" || p === "orchid" || p === "mint" || p === "peach" || p === "sand"
    ? "#231f23"
    : "#f7f6f5";
}

function paletteInk(p: Palette, alpha: number, mode: "fg" | "bg" = "fg"): string {
  const onLight = p === "paper" || p === "orchid" || p === "mint" || p === "peach" || p === "sand";
  if (mode === "fg") {
    return onLight ? `rgba(35,31,35,${alpha})` : `rgba(247,246,245,${alpha})`;
  }
  return onLight ? `rgba(35,31,35,${alpha})` : `rgba(247,246,245,${alpha})`;
}

// ── Composition router ────────────────────────────────────────────────────

function Composition({
  composition,
  design,
  isHero,
  slideIndex,
  slideTotal,
}: {
  composition: CompositionKey;
  design: GeneratedDesign;
  isHero: boolean;
  slideIndex: number;
  slideTotal: number;
}) {
  switch (composition) {
    case "announcement":
      return <AnnouncementComposition design={design} isHero={isHero} />;
    case "pull-quote":
      return <PullQuoteComposition design={design} isHero={isHero} />;
    case "stat-callout":
      return <StatCalloutComposition design={design} isHero={isHero} />;
    case "editorial-cover":
      return <EditorialCoverComposition design={design} isHero={isHero} />;
    case "paper-card":
      return <PaperCardComposition design={design} isHero={isHero} />;
    case "warm-mesh":
      return <WarmMeshComposition design={design} isHero={isHero} />;
    case "event-promo":
      return <EventPromoComposition design={design} isHero={isHero} />;
    case "minimal-quote":
      return <MinimalQuoteComposition design={design} isHero={isHero} />;
    case "banner-strip":
      return <BannerStripComposition design={design} isHero={isHero} />;
    case "carousel-slide":
      return <CarouselSlideComposition design={design} isHero={isHero} slideIndex={slideIndex} slideTotal={slideTotal} />;
  }
}

// ── Building blocks ───────────────────────────────────────────────────────

function S({
  isHero,
  cardSize,
  heroSize,
  className,
  children,
  style,
  as: As = "div",
}: {
  isHero: boolean;
  cardSize: number;
  heroSize: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}) {
  const Tag = As as unknown as React.ElementType;
  return (
    <Tag
      className={className}
      style={{
        fontSize: isHero ? heroSize : cardSize,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ children, isHero }: { children: React.ReactNode; isHero: boolean }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: isHero ? 12 : 9.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity: 0.55,
        marginBottom: isHero ? 14 : 6,
      }}
    >
      {children}
    </div>
  );
}

function HeroHeadline({ text, isHero, max = 22 }: { text: string; isHero: boolean; max?: number }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: isHero ? 48 : 21,
        letterSpacing: isHero ? "-1.6px" : "-0.5px",
        lineHeight: 1.04,
        maxWidth: `${max}ch`,
      }}
    >
      <Highlight text={text} />
    </div>
  );
}

function Subhead({ text, isHero }: { text: string; isHero: boolean }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: isHero ? 16 : 11.5,
        lineHeight: 1.45,
        opacity: 0.75,
        marginTop: isHero ? 16 : 6,
        maxWidth: isHero ? "36ch" : "32ch",
      }}
    >
      {text}
    </div>
  );
}

function CTAPill({ label, isHero, palette }: { label: string; isHero: boolean; palette: Palette }) {
  const onLight = palette === "paper" || palette === "orchid" || palette === "mint" || palette === "peach" || palette === "sand";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: isHero ? "8px 14px" : "4px 9px",
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
        fontSize: isHero ? 13 : 10,
        background: onLight ? "#231f23" : "#f7f6f5",
        color: onLight ? "#f7f6f5" : "#0E0C0E",
        fontWeight: 400,
      }}
    >
      {label} <ArrowRight size={isHero ? 13 : 10} strokeWidth={1.7} />
    </span>
  );
}

function BrandTag({ palette, isHero }: { palette: Palette; isHero: boolean }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: isHero ? 11 : 9,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity: 0.42,
      }}
    >
      {BRAND.mark} · {BRAND.name}
    </div>
  );
}

function Highlight({ text }: { text: string }) {
  // Coral-tint specific tokens to give the layout a brand pop.
  const parts = text.split(/(\bAcme\b|\bAcme Cloud\b|\b\d{1,2}AM\b|\b\d{1,2}PM\b|\b9AM\b|\bTuesday\b)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^(Acme Cloud|Acme|\d{1,2}AM|\d{1,2}PM|9AM|Tuesday)$/.test(p) ? (
          <span key={i} style={{ color: "#ed7472" }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// ── Composition implementations ───────────────────────────────────────────

function AnnouncementComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 48 : 22;
  return (
    <div
      className="relative h-full flex flex-col justify-between"
      style={{ padding }}
    >
      <div className="flex items-start justify-between">
        <BrandTag palette={design.palette} isHero={isHero} />
        {design.eyebrow && <Eyebrow isHero={isHero}>{design.eyebrow}</Eyebrow>}
      </div>
      <div>
        <HeroHeadline text={design.headline} isHero={isHero} />
        {design.subhead && <Subhead text={design.subhead} isHero={isHero} />}
        {design.ctaLabel && (
          <div style={{ marginTop: isHero ? 22 : 10 }}>
            <CTAPill label={design.ctaLabel} isHero={isHero} palette={design.palette} />
          </div>
        )}
      </div>
    </div>
  );
}

function PullQuoteComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 56 : 24;
  return (
    <div
      className="relative h-full flex flex-col justify-between"
      style={{ padding }}
    >
      <div>
        {design.eyebrow && <Eyebrow isHero={isHero}>{design.eyebrow}</Eyebrow>}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isHero ? 100 : 44,
            lineHeight: 0.65,
            color: "#ed7472",
            marginBottom: isHero ? -6 : -2,
          }}
        >
          "
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isHero ? 38 : 16,
            letterSpacing: isHero ? "-0.8px" : "-0.2px",
            lineHeight: 1.22,
            maxWidth: "20ch",
          }}
        >
          {design.headline}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: isHero ? 14 : 10.5,
            opacity: 0.6,
          }}
        >
          {design.subhead}
        </div>
        <BrandTag palette={design.palette} isHero={isHero} />
      </div>
    </div>
  );
}

function StatCalloutComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 56 : 22;
  return (
    <div
      className="relative h-full flex flex-col justify-between"
      style={{ padding }}
    >
      <div className="flex items-center justify-between">
        <Eyebrow isHero={isHero}>{design.eyebrow ?? "By the numbers"}</Eyebrow>
        <BrandTag palette={design.palette} isHero={isHero} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isHero ? 140 : 60,
            letterSpacing: isHero ? "-5px" : "-2px",
            lineHeight: 0.92,
            color: design.palette === "mesh" ? "#0E0C0E" : "#ed7472",
          }}
        >
          {design.statValue ?? "—"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: isHero ? 18 : 12,
            opacity: 0.85,
            marginTop: isHero ? 6 : 3,
            fontWeight: 400,
          }}
        >
          {design.statSuffix}
        </div>
      </div>
      <div>
        <HeroHeadline text={design.headline} isHero={isHero} max={26} />
        {design.subhead && <Subhead text={design.subhead} isHero={isHero} />}
      </div>
    </div>
  );
}

function EditorialCoverComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 52 : 22;
  return (
    <div
      className="relative h-full flex flex-col justify-between"
      style={{ padding }}
    >
      <div className="flex items-center justify-between">
        <BrandTag palette={design.palette} isHero={isHero} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: isHero ? 10 : 8.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: isHero ? "4px 10px" : "2px 6px",
            borderRadius: 999,
            border: "1px solid currentColor",
            opacity: 0.65,
          }}
        >
          {design.eyebrow}
        </span>
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isHero ? 64 : 28,
            letterSpacing: isHero ? "-2.4px" : "-0.8px",
            lineHeight: 0.98,
          }}
        >
          <Highlight text={design.headline} />
        </div>
        {design.subhead && (
          <Subhead text={design.subhead} isHero={isHero} />
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: isHero ? 11 : 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.48,
        }}
      >
        {design.detail}
      </div>
    </div>
  );
}

function PaperCardComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 48 : 22;
  return (
    <div className="relative h-full" style={{ padding }}>
      <div className="flex items-start justify-between">
        <Eyebrow isHero={isHero}>{design.eyebrow}</Eyebrow>
        <BrandTag palette={design.palette} isHero={isHero} />
      </div>
      <div style={{ marginTop: isHero ? 28 : 14 }}>
        <HeroHeadline text={design.headline} isHero={isHero} />
      </div>
      <div
        style={{
          marginTop: isHero ? 22 : 10,
          height: 1,
          background: "rgba(35,31,35,0.10)",
        }}
      />
      {design.subhead && <Subhead text={design.subhead} isHero={isHero} />}
      <div
        style={{
          position: "absolute",
          bottom: padding,
          left: padding,
          right: padding,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: isHero ? 11 : 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.48,
          }}
        >
          {design.detail ?? "Northfold · Brand intelligence"}
        </div>
        <CTAPill label={design.ctaLabel ?? "Read more"} isHero={isHero} palette={design.palette} />
      </div>
    </div>
  );
}

function WarmMeshComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 52 : 22;
  return (
    <div
      className="relative h-full flex flex-col justify-between"
      style={{ padding, color: "#0E0C0E" }}
    >
      <div className="flex items-center justify-between">
        <Eyebrow isHero={isHero}>{design.eyebrow}</Eyebrow>
        <BrandTag palette={design.palette} isHero={isHero} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isHero ? 60 : 26,
            letterSpacing: isHero ? "-2px" : "-0.6px",
            lineHeight: 1.0,
            color: "#0E0C0E",
            maxWidth: "16ch",
          }}
        >
          {design.headline}
        </div>
        {design.subhead && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: isHero ? 16 : 11.5,
              marginTop: isHero ? 14 : 7,
              color: "rgba(14,12,14,0.78)",
            }}
          >
            {design.subhead}
          </div>
        )}
      </div>
    </div>
  );
}

function EventPromoComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 48 : 22;
  return (
    <div className="relative h-full flex flex-col justify-between" style={{ padding }}>
      <div className="flex items-start gap-3">
        <div
          style={{
            width: isHero ? 64 : 32,
            height: isHero ? 64 : 32,
            borderRadius: 12,
            background: "#ed7472",
            color: "#0E0C0E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            letterSpacing: "-0.4px",
          }}
        >
          <div style={{ fontSize: isHero ? 11 : 8, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1 }}>
            {(design.dateLine ?? "").split("·")[0]?.trim() || "Tue"}
          </div>
          <div style={{ fontSize: isHero ? 26 : 14, lineHeight: 1 }}>
            {(design.dateLine?.match(/\d+/g)?.[0]) ?? "04"}
          </div>
        </div>
        <div>
          <Eyebrow isHero={isHero}>{design.eyebrow ?? "Event"}</Eyebrow>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: isHero ? 12 : 9.5,
              letterSpacing: "0.075em",
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            {design.dateLine}
          </div>
        </div>
      </div>
      <div>
        <HeroHeadline text={design.headline} isHero={isHero} />
        {design.subhead && <Subhead text={design.subhead} isHero={isHero} />}
        {design.ctaLabel && (
          <div style={{ marginTop: isHero ? 18 : 9 }}>
            <CTAPill label={design.ctaLabel} isHero={isHero} palette={design.palette} />
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalQuoteComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  const padding = isHero ? 56 : 22;
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center" style={{ padding }}>
      <BrandTag palette={design.palette} isHero={isHero} />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: isHero ? 130 : 56,
          letterSpacing: isHero ? "-5px" : "-2px",
          lineHeight: 1,
          marginTop: isHero ? 22 : 10,
        }}
      >
        <Highlight text={design.headline} />
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: isHero ? 42 : 18,
          letterSpacing: isHero ? "-1.4px" : "-0.5px",
          opacity: 0.7,
          marginTop: isHero ? 6 : 3,
        }}
      >
        {design.subhead}
      </div>
    </div>
  );
}

function BannerStripComposition({ design, isHero }: { design: GeneratedDesign; isHero: boolean }) {
  return (
    <div
      className="relative h-full flex items-center justify-between"
      style={{ padding: isHero ? "0 56px" : "0 24px" }}
    >
      <div className="flex items-center gap-4">
        <BrandTag palette={design.palette} isHero={isHero} />
        <span
          style={{
            width: 1,
            height: isHero ? 28 : 14,
            background: "currentColor",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isHero ? 32 : 18,
            letterSpacing: isHero ? "-0.8px" : "-0.4px",
            lineHeight: 1.05,
          }}
        >
          <Highlight text={design.headline} />
        </div>
      </div>
      {design.ctaLabel && <CTAPill label={design.ctaLabel} isHero={isHero} palette={design.palette} />}
    </div>
  );
}

function CarouselSlideComposition({
  design,
  isHero,
  slideIndex,
  slideTotal,
}: {
  design: GeneratedDesign;
  isHero: boolean;
  slideIndex: number;
  slideTotal: number;
}) {
  const padding = isHero ? 52 : 22;
  // Vary copy slightly per slide so it doesn't look like 5 copies.
  const slideHeadlines = [
    design.headline,
    "Document the work.",
    "Watch the team.",
    "Update the model.",
    "Ship the brand.",
  ];
  const slideSubheads = [
    design.subhead ?? "How SocialPaint observes your team.",
    "Every action becomes signal.",
    "Designers stay in Figma. SocialPaint stays in the background.",
    "Live observations feed StyleDNA in real time.",
    "Anyone in the company can now generate on-brand work.",
  ];
  return (
    <div className="relative h-full flex flex-col justify-between" style={{ padding }}>
      <div className="flex items-center justify-between">
        <Eyebrow isHero={isHero}>
          {String(slideIndex).padStart(2, "0")} / {String(slideTotal).padStart(2, "0")}
        </Eyebrow>
        <BrandTag palette={design.palette} isHero={isHero} />
      </div>
      <div>
        <HeroHeadline text={slideHeadlines[(slideIndex - 1) % slideHeadlines.length]} isHero={isHero} />
        <Subhead text={slideSubheads[(slideIndex - 1) % slideSubheads.length]} isHero={isHero} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          opacity: 0.55,
        }}
      >
        {Array.from({ length: slideTotal }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i + 1 === slideIndex ? (isHero ? 28 : 14) : (isHero ? 16 : 8),
              height: 2,
              borderRadius: 2,
              background:
                i + 1 === slideIndex
                  ? "#ed7472"
                  : "currentColor",
              opacity: i + 1 === slideIndex ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
