"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * DS avatar — small initial swatch on a pastel/mesh background.
 * Foreground is always ink for contrast.
 */
export function Avatar({
  initials,
  color = "var(--mesh-warm)",
  size = 28,
  className,
}: {
  initials: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  // Detect if a CSS gradient (uses spaces / parens) — those need to be a background-image.
  const isGradient = color.includes("gradient") || color.includes("var(");

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        background: isGradient ? undefined : color,
        backgroundImage: isGradient ? color : undefined,
        color: isGradient ? "#fff" : "#231f23",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: size <= 24 ? 10 : size <= 32 ? 11.5 : 13,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </div>
  );
}
