"use client";

import { useRef, useState, useEffect } from "react";
import { Paperclip, AtSign, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { simulateGeneration } from "@/lib/generate";
import { useApp, useCurrentUser } from "@/lib/store";
import type { DesignType } from "@/lib/types";
import { cn } from "@/lib/cn";
import { PLATFORM_SPECS } from "@/lib/platforms";

const DESIGN_TYPES: DesignType[] = [
  "LinkedIn 1:1",
  "Instagram 4:5",
  "Email Banner",
  "Carousel",
  "Story 9:16",
  "Twitter/X",
];

interface Props {
  initialPrompt?: string;
  initialDesignType?: DesignType;
  autoFocus?: boolean;
}

export function PromptInput({
  initialPrompt = "",
  initialDesignType = "LinkedIn 1:1",
  autoFocus,
}: Props) {
  const [value, setValue] = useState(initialPrompt);
  const [designType, setDesignType] = useState<DesignType>(initialDesignType);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const setGeneration = useApp((s) => s.setGeneration);
  const pushActivity = useApp((s) => s.pushActivity);
  const brand = useApp((s) => s.brand);
  const brandPrefs = useApp((s) => s.brandPrefs);
  const user = useCurrentUser();

  useEffect(() => {
    if (autoFocus) taRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        taRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ready = value.trim().length > 2;

  const submit = async () => {
    if (!ready) return;
    const prompt = value.trim();
    const pendingId = "gen_" + Math.random().toString(36).slice(2, 9);
    setGeneration({
      id: pendingId,
      prompt,
      designType,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: "generating",
      options: [],
    });
    simulateGeneration(prompt, designType, user.id).then((real) => {
      setGeneration({ ...real, id: pendingId });
      pushActivity({
        type: "generation",
        actorId: user.id,
        prompt,
        designType,
        generationId: pendingId,
        designId: real.options[0]?.id,
        complianceScore: real.options[0]?.complianceScore,
      });
    });
    router.push(`/generate/${pendingId}`);
  };

  const platform = PLATFORM_SPECS[designType];

  return (
    <div className="w-full">
      <div
        className="rounded-2xl overflow-hidden transition-all"
        style={{
          background: "var(--lift)",
          border: `1px solid ${focused ? "var(--solar)" : "var(--hairline-strong)"}`,
          boxShadow: focused
            ? "0 0 0 3px rgba(237,90,42,0.20), var(--shadow-e2)"
            : "var(--shadow-e2)",
        }}
      >
        {/* Grounding chips · brand + voice + size */}
        <div className="px-4 pt-3 flex items-center gap-1.5 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px]"
            style={{
              background: "rgba(237,90,42,0.10)",
              color: "var(--solar)",
            }}
          >
            ◆ {brand.name}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px]"
            style={{
              background: "var(--orchid)",
              color: "var(--ink)",
            }}
          >
            {brandPrefs.voiceTone} · plainspoken
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px]"
            style={{
              background: "rgba(35,31,35,0.04)",
              color: "var(--fg-2)",
            }}
          >
            {platform.label} · {platform.width}×{platform.height}
          </span>
        </div>

        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Describe what you'd like to create…"
          rows={2}
          className="w-full px-4 pt-3 pb-2 outline-none resize-none text-[16px] leading-[1.55]"
          style={{
            background: "transparent",
            color: "var(--ink)",
            fontWeight: 300,
          }}
        />

        <div
          className="px-3 py-2.5 flex items-center gap-1"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <ToolButton title="Attach a reference" label="Attach">
            <Paperclip size={13} strokeWidth={1.75} />
          </ToolButton>
          <ToolButton title="Slash for actions" label="/">
            <span className="font-mono text-[11px]">/</span>
          </ToolButton>
          <ToolButton title="Mention a teammate" label="@">
            <AtSign size={13} strokeWidth={1.75} />
          </ToolButton>

          <div className="relative ml-1">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] transition-colors"
              style={{
                color: "var(--ink)",
                background: "var(--paper)",
                border: "1px solid var(--hairline)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--hairline-strong)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
            >
              {designType}
              <ChevronDown size={12} className="opacity-60" />
            </button>
            {pickerOpen && (
              <>
                <button
                  className="fixed inset-0 z-30"
                  onClick={() => setPickerOpen(false)}
                  aria-hidden
                />
                <div
                  className="absolute bottom-full mb-2 left-0 z-40 min-w-[240px] rounded-xl py-1.5"
                  style={{
                    background: "var(--lift)",
                    border: "1px solid var(--hairline)",
                    boxShadow: "var(--shadow-e3)",
                  }}
                >
                  {DESIGN_TYPES.map((t) => {
                    const p = PLATFORM_SPECS[t];
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setDesignType(t);
                          setPickerOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3.5 py-2 text-[13px] transition-colors flex items-center justify-between gap-3"
                        )}
                        style={{
                          color: designType === t ? "var(--ink)" : "var(--fg-2)",
                          background: designType === t ? "rgba(237,90,42,0.06)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(35,31,35,0.04)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            designType === t ? "rgba(237,90,42,0.06)" : "transparent")
                        }
                      >
                        <span>{t}</span>
                        <span className="label-sm">{p.ratioLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button
            onClick={submit}
            disabled={!ready}
            className={cn(
              "ml-auto h-9 px-4 inline-flex items-center gap-2 rounded-lg text-[13.5px] transition-colors"
            )}
            style={{
              background: ready ? "var(--ink)" : "rgba(35,31,35,0.08)",
              color: ready ? "var(--fg-on-dark-1)" : "var(--fg-4)",
              cursor: ready ? "pointer" : "not-allowed",
              fontWeight: 400,
            }}
            aria-label="Send prompt"
          >
            <Sparkles size={13} strokeWidth={1.75} style={ready ? { color: "var(--apricot)" } : {}} />
            Generate
            <span
              className="text-[9px] font-mono px-1.5 py-[2px] rounded ml-1"
              style={{
                background: ready ? "rgba(247,246,245,0.12)" : "rgba(35,31,35,0.06)",
                color: ready ? "rgba(247,246,245,0.7)" : "var(--fg-4)",
                letterSpacing: "0.04em",
              }}
            >
              ⌘↵
            </span>
            <ArrowRight size={13} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div
        className="mt-3 text-[11.5px]"
        style={{ color: "var(--fg-3)", fontWeight: 300 }}
      >
        Tip: <kbd className="px-1 py-[1px] rounded text-[10px]" style={{ background: "rgba(35,31,35,0.06)", fontFamily: "var(--font-mono)" }}>⌘K</kbd> focuses
        the prompt anywhere in the app.
      </div>
    </div>
  );
}

function ToolButton({
  children,
  label,
  title,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
}) {
  return (
    <button
      title={title}
      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] transition-colors"
      style={{ color: "var(--fg-2)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--paper)";
        e.currentTarget.style.color = "var(--ink)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
