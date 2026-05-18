"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Avatar({
  initials,
  color = "#7CE3B5",
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
        "inline-flex items-center justify-center rounded-full font-medium select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        background: color,
        color: "#0A0A0A",
        fontSize: size <= 24 ? 10 : size <= 32 ? 11 : 13,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </div>
  );
}
