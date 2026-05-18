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
 * DS button — 8px radius, Stack Sans body weight 400.
 *
 * - primary: ink dark on light surfaces (the brand's primary CTA pattern)
 * - inverted: paper on dark sections
 * - outline: hairline border on transparent
 * - ghost: subtle hover only
 * - subtle: paper-warm tint, useful inside cards
 * - coral: warm solar accent (use sparingly — one per page)
 */
const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--fg-on-dark-1)] hover:bg-[#0e0c0e] disabled:bg-[rgba(35,31,35,0.16)] disabled:text-[rgba(247,246,245,0.5)]",
  inverted: "bg-[var(--paper)] text-[var(--ink)] hover:bg-white",
  ghost:
    "bg-transparent text-[var(--fg-2)] hover:text-[var(--ink)] hover:bg-[rgba(35,31,35,0.04)]",
  outline:
    "bg-transparent text-[var(--ink)] border border-[var(--hairline-strong)] hover:border-[var(--ink)]",
  subtle:
    "bg-[rgba(35,31,35,0.04)] text-[var(--ink)] hover:bg-[rgba(35,31,35,0.08)]",
  coral:
    "bg-[var(--solar)] text-white hover:bg-[#d44d22] disabled:bg-[rgba(237,90,42,0.30)] disabled:text-white/60",
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
