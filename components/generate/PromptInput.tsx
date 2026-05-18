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

  // ⌘K to focus
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
    // Pre-create a pending generation id by starting the simulation.
    // The Generating screen lives at /generate/[id] — we route there after we have an id.
    const gen = await Promise.resolve().then(() => {
      const pendingId = "gen_" + Math.random().toString(36).slice(2, 9);
      const start = simulateGeneration(prompt, designType, user.id);
      // Pre-populate a pending generation so the route can read state.
      setGeneration({
        id: pendingId,
        prompt,
        designType,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        status: "generating",
        options: [],
      });
      // When real one resolves, swap it in under the same pending id.
      start.then((real) => {
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
      return { id: pendingId };
    });
    router.push(`/generate/${gen.id}`);
  };

  return (
    <div className="w-full">
      <div className="input-shell px-4 py-3.5 flex flex-col gap-3 transition-all">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Describe what you'd like to create…"
          rows={2}
          className="bg-transparent outline-none resize-none text-[15px] leading-[1.5] text-white/95 placeholder:text-white/30 w-full"
        />

        <div className="flex items-center gap-1.5">
          <button
            className="h-7 w-7 rounded-md text-white/45 hover:text-white hover:bg-white/[0.06] inline-flex items-center justify-center"
            aria-label="Add"
          >
            <Plus size={15} />
          </button>

          <button className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md text-[12px] text-white/65 hover:text-white hover:bg-white/[0.06]">
            <Paperclip size={13} />
            Attach
          </button>

          <div className="relative ml-1">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md text-[12px] text-white/80 bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.07]"
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
                <div className="absolute bottom-full mb-2 left-0 z-40 min-w-[180px] rounded-lg bg-[#181818] border border-white/[0.06] shadow-2xl py-1.5">
                  {DESIGN_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setDesignType(t);
                        setPickerOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-white/[0.05]",
                        designType === t ? "text-white" : "text-white/65"
                      )}
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
              "ml-auto h-8 w-8 rounded-full inline-flex items-center justify-center transition-colors",
              ready
                ? "bg-white text-black hover:bg-white"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
            aria-label="Send prompt"
          >
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/30 font-mono uppercase tracking-[0.06em]">
        <span>⌘K to focus</span>
        <span>·</span>
        <span>⌘↩ to send</span>
      </div>
    </div>
  );
}
