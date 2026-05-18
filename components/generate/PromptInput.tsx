"use client";

import { useRef, useState, useEffect } from "react";
import { Paperclip, Plus, ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { simulateGeneration } from "@/lib/generate";
import { useApp, useCurrentUser } from "@/lib/store";
import type { DesignType } from "@/lib/types";
import { cn } from "@/lib/cn";

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
  const taRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const setGeneration = useApp((s) => s.setGeneration);
  const pushActivity = useApp((s) => s.pushActivity);
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

  return (
    <div className="w-full">
      <div
        className="rounded-2xl p-4 flex flex-col gap-3.5 transition-all"
        style={{
          background: "var(--card)",
          border: "1px solid var(--hairline)",
        }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Describe what you'd like to create…"
          rows={2}
          className="bg-transparent outline-none resize-none text-[15.5px] leading-[1.5] w-full"
          style={{
            color: "var(--fg-1)",
            fontWeight: 300,
          }}
        />

        <div className="flex items-center gap-1.5">
          <button
            className="h-8 w-8 rounded-lg inline-flex items-center justify-center transition-colors"
            style={{ color: "var(--fg-3)" }}
            aria-label="Add"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(247,246,245,0.06)";
              e.currentTarget.style.color = "var(--fg-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg-3)";
            }}
          >
            <Plus size={15} strokeWidth={1.6} />
          </button>

          <button
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] transition-colors"
            style={{ color: "var(--fg-2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(247,246,245,0.06)";
              e.currentTarget.style.color = "var(--fg-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg-2)";
            }}
          >
            <Paperclip size={13} strokeWidth={1.6} />
            Attach
          </button>

          <div className="relative ml-1">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] transition-colors"
              style={{
                color: "var(--fg-1)",
                background: "rgba(247,246,245,0.04)",
                border: "1px solid var(--hairline)",
              }}
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
                  className="absolute bottom-full mb-2 left-0 z-40 min-w-[200px] rounded-xl py-1.5"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--hairline)",
                    boxShadow: "var(--shadow-dropdown)",
                  }}
                >
                  {DESIGN_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setDesignType(t);
                        setPickerOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-2 text-[13px] transition-colors",
                        designType === t ? "" : ""
                      )}
                      style={{
                        color: designType === t ? "var(--fg-1)" : "var(--fg-2)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(247,246,245,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={submit}
            disabled={!ready}
            className={cn(
              "ml-auto h-9 w-9 rounded-full inline-flex items-center justify-center transition-colors"
            )}
            style={{
              background: ready ? "var(--paper)" : "rgba(247,246,245,0.10)",
              color: ready ? "var(--canvas)" : "var(--fg-4)",
              cursor: ready ? "pointer" : "not-allowed",
            }}
            aria-label="Send prompt"
          >
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 label-sm">
        <span>⌘K to focus</span>
        <span>·</span>
        <span>⌘↩ to send</span>
      </div>
    </div>
  );
}
