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
        isHero ? "aspect-square rounded-2xl p-10" : "aspect-square rounded-xl p-5",
        className
      )}
      style={{ background: design.previewBg }}
    >
      {(brandLabel || dimensionsLabel) && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between mono text-white/35">
          {brandLabel && <span>{brandLabel}</span>}
          {dimensionsLabel && <span>{dimensionsLabel}</span>}
        </div>
      )}
      <div
        className={cn(
          "relative z-10",
          isHero ? "max-w-[80%]" : "max-w-[88%]"
        )}
      >
        <div
          className={cn(
            "headline-display text-white",
            isHero ? "text-[40px]" : "text-[19px] leading-[1.08]"
          )}
        >
          <Highlight text={design.headline} />
        </div>
        {design.subhead && (
          <div
            className={cn(
              "mt-2 text-white/65",
              isHero ? "text-[15px]" : "text-[12px]"
            )}
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
