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
            className="fixed inset-0 z-[300]"
            style={{ background: "rgba(35,31,35,0.30)" }}
            onClick={onClose}
            aria-label="Close"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 z-[400] h-screen w-[480px] flex flex-col"
            style={{
              background: "var(--lift)",
              borderLeft: "1px solid var(--hairline)",
              boxShadow: "var(--shadow-e4)",
            }}
          >
            <header
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--hairline)" }}
            >
              <div>
                <div className="label">{draft.category} · Rule</div>
                <h2
                  className="text-[18px] mt-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.3px",
                    color: "var(--ink)",
                  }}
                >
                  Edit rule
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg inline-flex items-center justify-center transition-colors"
                style={{ color: "var(--fg-2)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--paper)";
                  e.currentTarget.style.color = "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--fg-2)";
                }}
                aria-label="Close drawer"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </header>

            <div className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-5">
              <div>
                <label className="label mb-2 block">Title</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full px-3.5 h-10 text-[14px] outline-none"
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 10,
                    color: "var(--ink)",
                  }}
                />
              </div>

              <div>
                <label className="label mb-2 block">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={4}
                  className="w-full px-3.5 py-3 text-[13.5px] outline-none resize-none"
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 10,
                    color: "var(--ink)",
                  }}
                />
              </div>

              <div>
                <label className="label mb-2 block">Confidence</label>
                <div className="flex items-center gap-2">
                  {CONFIDENCES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft({ ...draft, confidence: c })}
                      className="h-9 px-3.5 rounded-lg text-[12.5px] border transition-colors"
                      style={{
                        background:
                          draft.confidence === c ? "var(--ink)" : "var(--lift)",
                        color: draft.confidence === c ? "var(--fg-on-dark-1)" : "var(--ink)",
                        borderColor:
                          draft.confidence === c
                            ? "var(--ink)"
                            : "var(--hairline-strong)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="pt-4 border-t flex flex-col gap-3"
                style={{ borderColor: "var(--hairline)" }}
              >
                <ToggleRow
                  icon={<Lock size={14} strokeWidth={1.75} />}
                  label="Lock this rule"
                  hint="Prevents auto-updates from observation."
                  on={draft.isLocked}
                  onChange={(v) => setDraft({ ...draft, isLocked: v })}
                />
                <ToggleRow
                  icon={<EyeOff size={14} strokeWidth={1.75} />}
                  label="Disable rule"
                  hint="Stops applying this rule during generation."
                  on={draft.isDisabled}
                  onChange={(v) => setDraft({ ...draft, isDisabled: v })}
                />
              </div>
            </div>

            <footer
              className="px-6 py-4 border-t flex items-center justify-end gap-2"
              style={{ borderColor: "var(--hairline)" }}
            >
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
      className="flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--hairline)",
      }}
    >
      <span
        className="h-7 w-7 rounded-md inline-flex items-center justify-center"
        style={{
          background: on ? "var(--solar)" : "rgba(35,31,35,0.06)",
          color: on ? "white" : "var(--fg-2)",
        }}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13px]" style={{ color: "var(--ink)" }}>
          {label}
        </span>
        <span className="block text-[11.5px]" style={{ color: "var(--fg-3)" }}>
          {hint}
        </span>
      </span>
      <span
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ background: on ? "var(--solar)" : "rgba(35,31,35,0.16)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
          style={{ left: on ? 18 : 2 }}
        />
      </span>
    </button>
  );
}
