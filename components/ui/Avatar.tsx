"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * DS avatar — small initial swatch, sentence-case-ready.
 * Background uses the DS pastels, foreground always the deep ink for contrast.
 */
export function Avatar({
  initials,
  color = "#ccfdcf",
  size = 28,
  className,
}: {
  initials: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        background: color,
        color: "#231f23",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontSize: size <= 24 ? 9.5 : size <= 32 ? 10.5 : 12,
        letterSpacing: 0.4,
      }}
    >
      {initials}
    </div>
  );
}
