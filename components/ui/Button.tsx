"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "subtle" | "coral" | "inverted";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * DS button — 8px radius, Stack Sans body weight 400, no scale on press.
 * Primary uses the paper-on-ink inversion (white pill on dark canvas).
 */
const variantClass: Record<Variant, string> = {
  // Paper on dark canvas — the DS calls this the inverted/primary on dark sections.
  primary:
    "bg-[var(--paper)] text-[var(--canvas)] hover:bg-white disabled:bg-[rgba(247,246,245,0.16)] disabled:text-[rgba(247,246,245,0.32)]",
  ghost:
    "bg-transparent text-[var(--fg-2)] hover:text-[var(--fg-1)] hover:bg-[rgba(247,246,245,0.04)]",
  outline:
    "bg-transparent text-[var(--fg-1)] border border-[var(--hairline)] hover:border-[var(--hairline-strong)]",
  subtle:
    "bg-[rgba(247,246,245,0.06)] text-[var(--fg-1)] hover:bg-[rgba(247,246,245,0.10)] border border-[var(--hairline)]",
  coral:
    "bg-[#ed7472] text-[#0e0c0e] hover:bg-[#f08785] disabled:bg-[rgba(237,116,114,0.30)] disabled:text-[rgba(14,12,14,0.55)]",
  inverted:
    "bg-[var(--paper)] text-[var(--canvas)] hover:bg-white",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
  md: "h-9 px-4 text-[13.5px] rounded-lg gap-2",
  lg: "h-11 px-5 text-[14.5px] rounded-lg gap-2",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-normal transition-colors duration-200 ease-out disabled:cursor-not-allowed",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
        }}
        {...rest}
      />
    );
  }
);
Button.displayName = "Button";
