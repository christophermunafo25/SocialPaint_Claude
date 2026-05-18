"use client";

import { useApp } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Radio } from "lucide-react";

/**
 * DS toast — dark pill on light pages, soft drop shadow.
 * Bottom-center, dismissible after ~4s.
 */
export function ToastHost() {
  const toasts = useApp((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px]"
            style={{
              background: "var(--ink)",
              color: "var(--fg-on-dark-1)",
              boxShadow:
                "0 8px 32px rgba(35,31,35,0.18), 0 1px 2px rgba(35,31,35,0.06)",
            }}
          >
            {t.tone === "success" ? (
              <CheckCircle2 size={15} strokeWidth={1.75} style={{ color: "var(--mint)" }} />
            ) : t.tone === "live" ? (
              <span className="live-dot" />
            ) : (
              <Radio size={14} strokeWidth={1.75} style={{ color: "var(--fg-on-dark-3)" }} />
            )}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
