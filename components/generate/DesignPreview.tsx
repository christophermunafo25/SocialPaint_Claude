"use client";

import { cn } from "@/lib/cn";
import type { GeneratedDesign } from "@/lib/types";

interface Props {
  design: Pick<GeneratedDesign, "headline" | "subhead" | "previewBg">;
  size?: "card" | "hero";
  brandLabel?: string;
  dimensionsLabel?: string;
  className?: string;
}

export function DesignPreview({
  design,
  size = "card",
  brandLabel,
  dimensionsLabel,
  className,
}: Props) {
  const isHero = size === "hero";
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden flex flex-col justify-end",
        isHero ? "aspect-square rounded-[20px] p-12" : "aspect-square rounded-2xl p-5",
        className
      )}
      style={{
        background: design.previewBg,
        border: "1px solid rgba(247,246,245,0.06)",
      }}
    >
      {(brandLabel || dimensionsLabel) && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {brandLabel && (
            <span
              className="font-mono uppercase tracking-[0.075em] text-[10px]"
              style={{ color: "rgba(247,246,245,0.42)" }}
            >
              {brandLabel}
            </span>
          )}
          {dimensionsLabel && (
            <span
              className="font-mono uppercase tracking-[0.075em] text-[10px]"
              style={{ color: "rgba(247,246,245,0.42)" }}
            >
              {dimensionsLabel}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "relative z-10",
          isHero ? "max-w-[80%]" : "max-w-[90%]"
        )}
      >
        <div
          className={cn(
            isHero ? "text-[44px]" : "text-[20px] leading-[1.08]"
          )}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "#f7f6f5",
            letterSpacing: isHero ? "-1.5px" : "-0.4px",
            lineHeight: 1.05,
          }}
        >
          <Highlight text={design.headline} />
        </div>
        {design.subhead && (
          <div
            className={cn(
              "mt-2",
              isHero ? "text-[15px]" : "text-[12.5px]"
            )}
            style={{
              color: "rgba(247,246,245,0.68)",
              fontWeight: 300,
            }}
          >
            {design.subhead}
          </div>
        )}
      </div>
    </div>
  );
}

// Highlight numerals / "Acme" in coral to give the preview a brand feel.
function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\bAcme\b|\b\d{1,2}AM\b|\b\d{1,2}PM\b|\b9AM\b)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^(Acme|\d{1,2}AM|\d{1,2}PM|9AM)$/.test(p) ? (
          <span key={i} style={{ color: "#ED7472" }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
