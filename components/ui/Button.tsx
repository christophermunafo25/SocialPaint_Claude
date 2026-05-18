"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "subtle" | "coral";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 disabled:bg-white/15 disabled:text-white/40",
  ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.04]",
  outline:
    "bg-transparent text-white/85 border border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
  subtle:
    "bg-white/[0.05] text-white/85 hover:bg-white/[0.08] border border-white/[0.04]",
  coral:
    "bg-[#ED7472] text-black hover:bg-[#F08785] disabled:bg-[#ED7472]/30 disabled:text-black/50",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg",
  md: "h-9 px-4 text-[13.5px] rounded-lg",
  lg: "h-10 px-5 text-sm rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:cursor-not-allowed",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        {...rest}
      />
    );
  }
);
Button.displayName = "Button";
