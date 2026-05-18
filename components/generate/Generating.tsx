"use client";

import { useEffect, useState } from "react";
import { BrandHalo } from "@/components/ui/BrandMark";
import { GENERATING_STATUS_LINES } from "@/lib/mock-data";
import { motion } from "framer-motion";

export function Generating({ totalMs = 3500 }: { totalMs?: number }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = totalMs / GENERATING_STATUS_LINES.length;
    const stageTimers: number[] = [];
    GENERATING_STATUS_LINES.forEach((_, i) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="relative mb-10">
        <div
          className="absolute -inset-24 -z-10 opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(237,116,114,0.32), rgba(237,116,114,0) 60%)",
          }}
        />
        <BrandHalo />
      </div>

      <div className="h-[140px] flex flex-col items-center gap-1.5">
        {GENERATING_STATUS_LINES.map((line, i) => {
          const isActive = i === stage;
          const isPast = i < stage;
          return (
            <motion.div
              key={line}
              initial={false}
              animate={{
                opacity: isActive ? 1 : isPast ? 0.22 : 0.35,
                y: 0,
              }}
              transition={{ duration: 0.4 }}
              className="text-[15px]"
              style={{
                color: isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.4)",
              }}
            >
              {line}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 w-[280px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#ED7472] to-[#F29593] transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-4 mono text-white/25">Reading StyleDNA · Acme Cloud</div>
    </div>
  );
}
