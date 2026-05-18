"use client";

import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const PLANS = [
  {
    name: "Solo",
    price: "$12",
    cadence: "/mo",
    tagline: "For founders shipping their own brand.",
    features: ["1 brand", "Unlimited generations", "Saved Masterpieces"],
    cta: "Downgrade",
    accent: false,
  },
  {
    name: "Team",
    price: "$24",
    cadence: "/seat/mo",
    tagline: "For design teams that ship together.",
    features: [
      "Up to 5 brands",
      "Live StyleDNA observation",
      "Admin Activity feed",
      "Connectors · Design, Distribution, Storage",
    ],
    cta: "Current plan",
    accent: true,
    current: true,
  },
  {
    name: "Org",
    price: "Custom",
    cadence: "",
    tagline: "For organizations with multiple brands.",
    features: [
      "Unlimited brands",
      "SOC 2 · audit log retention",
      "Custom roles & policies",
      "Dedicated support",
    ],
    cta: "Talk to us",
    accent: false,
  },
];

export default function PlansPage() {
  return (
    <div className="px-10 py-9 max-w-[1140px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Plans · Pricing</Eyebrow>
      </div>
      <div className="flex items-end gap-4 mb-7">
        <div
          className="icon-tile"
          style={{
            width: 48,
            height: 48,
            background: "rgba(35,31,35,0.06)",
            color: "var(--fg-1)",
            border: "1px solid var(--hairline)",
          }}
        >
          <CreditCard size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="h1">Plans</h1>
          <p className="body mt-1.5">
            Billing flows are mocked — the structure shows where this would live.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={cn("surface p-6 relative")}
            style={{
              borderColor: p.accent ? "rgba(237,116,114,0.30)" : undefined,
            }}
          >
            {p.current && (
              <div
                className="absolute -top-2.5 left-5 label px-2.5 py-0.5 rounded-full"
                style={{
                  background: "var(--solar)",
                  color: "#0e0c0e",
                  letterSpacing: "0.08em",
                }}
              >
                Your plan
              </div>
            )}
            <div className="text-[15px]" style={{ color: "var(--fg-1)", fontWeight: 400 }}>
              {p.name}
            </div>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span
                className="text-[36px] tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  letterSpacing: "-1.2px",
                  color: "var(--fg-1)",
                  lineHeight: 1,
                }}
              >
                {p.price}
              </span>
              <span className="text-[13px]" style={{ color: "var(--fg-3)" }}>
                {p.cadence}
              </span>
            </div>
            <p
              className="mt-3 text-[13px] leading-snug"
              style={{ color: "var(--fg-2)", fontWeight: 300 }}
            >
              {p.tagline}
            </p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="text-[13px] flex items-start gap-2"
                  style={{ color: "var(--fg-1)", fontWeight: 300 }}
                >
                  <Check
                    size={14}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#a9e8b5" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button
                variant={p.accent ? "coral" : "outline"}
                size="lg"
                className="w-full"
                disabled={p.current}
              >
                {p.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
