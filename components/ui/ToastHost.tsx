"use client";

import { useApp } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Radio } from "lucide-react";

export function ToastHost() {
  const toasts = useApp((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#171717] border border-white/[0.06] shadow-2xl text-[13px] text-white/85"
          >
            {t.tone === "success" ? (
              <CheckCircle2 size={15} className="text-[#7CE3B5]" />
            ) : t.tone === "live" ? (
              <span className="live-dot" />
            ) : (
              <Radio size={14} className="text-white/40" />
            )}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
