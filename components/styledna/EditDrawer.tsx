"use client";

import { useEffect, useState } from "react";
import { X, Lock, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useApp, useCurrentUser } from "@/lib/store";
import type { StyleDNARule, Confidence } from "@/lib/types";

interface Props {
  rule: StyleDNARule | null;
  onClose: () => void;
}

const CONFIDENCES: Confidence[] = ["Strong", "Moderate", "Emerging"];

export function EditDrawer({ rule, onClose }: Props) {
  const [draft, setDraft] = useState<StyleDNARule | null>(rule);
  const updateRule = useApp((s) => s.updateRule);
  const pushActivity = useApp((s) => s.pushActivity);
  const pushToast = useApp((s) => s.pushToast);
  const user = useCurrentUser();

  useEffect(() => setDraft(rule), [rule]);

  const open = !!rule && !!draft;

  const handleSave = () => {
    if (!draft) return;
    updateRule(draft.id, {
      title: draft.title,
      description: draft.description,
      confidence: draft.confidence,
      isLocked: draft.isLocked,
      isDisabled: draft.isDisabled,
    });
    pushActivity({
      type: "rule_edited",
      actorId: user.id,
      ruleId: draft.id,
      note: `Edited "${draft.title}"`,
    });
    pushToast({ message: "Rule updated.", tone: "success" });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && draft && (
        <>
          <motion.button
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0.32, 1] }}
            className="fixed top-0 right-0 z-50 h-screen w-[460px] bg-[#141414] border-l border-white/[0.06] flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.04]">
              <div>
                <div className="mono text-white/35">{draft.category} · Rule</div>
                <h2 className="text-[16px] font-medium mt-0.5">Edit rule</h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-md text-white/45 hover:text-white hover:bg-white/[0.05] inline-flex items-center justify-center"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </header>

            <div className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-5">
              <div>
                <label className="mono mb-2 block">Title</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="input-shell w-full px-3.5 h-10 text-[14px] bg-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="mono mb-2 block">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={4}
                  className="input-shell w-full px-3.5 py-3 text-[13.5px] bg-[#1A1A1A] outline-none resize-none"
                />
              </div>

              <div>
                <label className="mono mb-2 block">Confidence</label>
                <div className="flex items-center gap-2">
                  {CONFIDENCES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft({ ...draft, confidence: c })}
                      className={`h-8 px-3 rounded-md text-[12.5px] border transition-colors ${
                        draft.confidence === c
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white/65 border-white/10 hover:border-white/25"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex flex-col gap-3">
                <ToggleRow
                  icon={<Lock size={14} />}
                  label="Lock this rule"
                  hint="Prevents auto-updates from observation."
                  on={draft.isLocked}
                  onChange={(v) => setDraft({ ...draft, isLocked: v })}
                />
                <ToggleRow
                  icon={<EyeOff size={14} />}
                  label="Disable rule"
                  hint="Stops applying this rule during generation."
                  on={draft.isDisabled}
                  onChange={(v) => setDraft({ ...draft, isDisabled: v })}
                />
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save changes
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  on,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] text-left"
    >
      <span
        className={`h-7 w-7 rounded-md inline-flex items-center justify-center ${
          on ? "bg-[#ED7472] text-black" : "bg-white/[0.06] text-white/55"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] text-white/90">{label}</span>
        <span className="block text-[11.5px] text-white/45">{hint}</span>
      </span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          on ? "bg-[#ED7472]" : "bg-white/[0.10]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            on ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
