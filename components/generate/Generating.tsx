"use client";

import { useEffect, useState } from "react";
import { HeroHalo } from "@/components/ui/BrandMark";
import { motion } from "framer-motion";

/**
 * DS Generating moment — sentence-case rotating status lines, single coral halo,
 * thin warm progress bar, Fragment Mono meta. No spinners.
 */
const STATUS_LINES = [
  "Reading StyleDNA…",
  "Applying brand colors…",
  "Checking type hierarchy…",
  "Rendering 3 options…",
];

export function Generating({ totalMs = 3500 }: { totalMs?: number }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = totalMs / STATUS_LINES.length;
    const stageTimers: number[] = [];
    STATUS_LINES.forEach((_, i) => {
      stageTimers.push(window.setTimeout(() => setStage(i), i * stageInterval));
    });

    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(1, elapsed / totalMs);
      setProgress(pct);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stageTimers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [totalMs]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden isolate">
      <HeroHalo
        width={920}
        height={560}
        style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="h-[140px] flex flex-col items-center gap-1.5 relative">
        {STATUS_LINES.map((line, i) => {
          const isActive = i === stage;
          const isPast = i < stage;
          return (
            <motion.div
              key={line}
              initial={false}
              animate={{ opacity: isActive ? 1 : isPast ? 0.22 : 0.38, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="display-2 text-[26px] sm:text-[32px]"
              style={{
                color: isActive ? "var(--fg-1)" : "var(--fg-3)",
                letterSpacing: "-0.6px",
                fontWeight: 400,
              }}
            >
              {line}
            </motion.div>
          );
        })}
      </div>

      <div
        className="mt-12 w-[320px] h-[2px] rounded-full overflow-hidden relative"
        style={{ background: "rgba(247,246,245,0.06)" }}
      >
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, #ed5a2a 0%, #f17a3b 35%, #f5c044 70%, #ed7472 100%)",
          }}
        />
      </div>

      <div className="mt-5 label">Reading StyleDNA · Acme Cloud</div>
    </div>
  );
}
