"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
      "Connectors · Design / Distribution / Storage",
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
    <div className="px-10 py-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ Plans</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Plans</h1>
        <p className="text-[13px] text-white/45 mt-1">
          Billing flows are mocked in the prototype — the structure shows where this would live.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={cn(
              "surface p-6 relative",
              p.accent && "border-[rgba(237,116,114,0.30)]"
            )}
          >
            {p.current && (
              <div className="absolute -top-2 left-5 mono px-2 py-0.5 rounded-md bg-[#ED7472] text-black">
                Your plan
              </div>
            )}
            <div className="text-[15px] text-white/95">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-[32px] font-medium tracking-tight">{p.price}</span>
              <span className="text-white/45 text-[13px]">{p.cadence}</span>
            </div>
            <p className="mt-2 text-[12.5px] text-white/55 leading-snug">{p.tagline}</p>
            <ul className="mt-5 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="text-[13px] text-white/80 flex items-start gap-2">
                  <Check size={14} className="mt-0.5 text-[#7CE3B5] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
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
