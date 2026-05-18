"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  FileUp,
  Link as LinkIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { INGESTING_STATUS_LINES } from "@/lib/mock-data";
import { simulateAssetAnalysis } from "@/lib/analyze-asset";
import { useApp, useCurrentUser } from "@/lib/store";
import type { AssetIngestion } from "@/lib/types";
import { cn } from "@/lib/cn";

type Tab = "upload" | "link";
type Phase = "idle" | "analyzing" | "review" | "added";

export default function IngestPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upload");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [ingestion, setIngestion] = useState<AssetIngestion | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useCurrentUser();
  const addIngestion = useApp((s) => s.addIngestion);
  const updateIngestion = useApp((s) => s.updateIngestion);
  const acceptObservations = useApp((s) => s.acceptObservations);
  const pushActivity = useApp((s) => s.pushActivity);
  const pushToast = useApp((s) => s.pushToast);

  const beginAnalysis = async (source: "upload" | "link", payload: { fileName?: string; url?: string }) => {
    setPhase("analyzing");
    setStage(0);
    const stageTimer = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, INGESTING_STATUS_LINES.length - 1));
    }, 700);

    const result = await simulateAssetAnalysis({
      source,
      fileName: payload.fileName,
      url: payload.url,
      createdBy: user.id,
    });
    window.clearInterval(stageTimer);
    addIngestion(result);
    setIngestion(result);
    setPhase("review");
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    beginAnalysis("upload", { fileName: file.name });
  };

  const handlePasteLink = () => {
    if (linkUrl.trim().length < 8) return;
    beginAnalysis("link", { url: linkUrl.trim() });
  };

  const toggleObs = (obsId: string, accepted: boolean) => {
    if (!ingestion) return;
    const next = {
      ...ingestion,
      detectedObservations: ingestion.detectedObservations.map((o) =>
        o.id === obsId ? { ...o, accepted } : o
      ),
    };
    setIngestion(next);
    updateIngestion(ingestion.id, next);
  };

  const confirm = () => {
    if (!ingestion) return;
    // Anything left ambiguous defaults to accept.
    const finalized = {
      ...ingestion,
      detectedObservations: ingestion.detectedObservations.map((o) =>
        o.accepted === null ? { ...o, accepted: true } : o
      ),
    };
    updateIngestion(ingestion.id, finalized);
    setIngestion(finalized);
    const newRules = acceptObservations(ingestion.id);
    const count = newRules.length;
    pushActivity({
      type: "asset_ingested",
      actorId: user.id,
      ingestionId: ingestion.id,
      note: `${count} observation${count === 1 ? "" : "s"} added to StyleDNA`,
    });
    pushToast({
      message: `${count} observation${count === 1 ? "" : "s"} added to StyleDNA.`,
      tone: "success",
    });
    setPhase("added");
    setTimeout(() => router.push("/styledna"), 1200);
  };

  return (
    <div className="px-10 py-8 max-w-[960px] mx-auto">
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => router.push("/styledna")}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04]"
          aria-label="Back to StyleDNA"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-[22px] font-medium tracking-tight">Add new observations</h1>
          <div className="mono mt-1.5">Feed StyleDNA explicitly · §4.7</div>
        </div>
      </div>

      <div className="surface p-6">
        {/* Tab strip */}
        <div className="flex items-center gap-1 mb-5 border-b border-white/[0.04]">
          {(["upload", "link"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative h-10 px-4 text-[12.5px] font-mono uppercase tracking-[0.06em] transition-colors ${
                tab === t ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "upload" ? "Upload file" : "Paste link"}
              {tab === t && (
                <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#ED7472]" />
              )}
            </button>
          ))}
        </div>

        {phase === "idle" && tab === "upload" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "rounded-xl border border-dashed h-[280px] flex flex-col items-center justify-center text-center cursor-pointer transition-all",
              dragOver
                ? "border-[#ED7472] bg-[rgba(237,116,114,0.05)]"
                : "border-white/[0.12] hover:border-white/25 bg-white/[0.01]"
            )}
          >
            <div className="h-11 w-11 rounded-xl bg-white/[0.04] inline-flex items-center justify-center mb-4">
              <Upload size={18} className="text-white/65" />
            </div>
            <div className="text-[14px] text-white/85">Drop PNG, JPG, PDF, or SVG here</div>
            <div className="mono mt-2">Or click to browse · multi-file supported</div>
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.svg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {phase === "idle" && tab === "link" && (
          <div className="rounded-xl bg-[#1A1A1A] border border-white/[0.05] p-4 flex items-center gap-3">
            <LinkIcon size={15} className="text-white/45" />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://figma.com/file/X8j2…/Acme-Q3"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/30"
            />
            <Button variant="coral" disabled={linkUrl.trim().length < 8} onClick={handlePasteLink}>
              Analyze
            </Button>
          </div>
        )}

        {(phase === "analyzing" || phase === "review" || phase === "added") && ingestion && (
          <>
            <div className="rounded-xl bg-[#1A1A1A] border border-white/[0.05] p-4 flex items-center gap-3">
              <FileUp size={15} className="text-white/55" />
              <span className="text-[13px] text-white/75 truncate">
                {ingestion.source === "link"
                  ? ingestion.url
                  : ingestion.fileName ?? "Uploaded asset"}
              </span>
              <span className="ml-auto mono">
                {phase === "analyzing"
                  ? "Analyzing…"
                  : phase === "review"
                  ? `${ingestion.detectedObservations.length} observations`
                  : "Added"}
              </span>
            </div>

            {phase === "analyzing" && (
              <div className="mt-5 flex flex-col gap-1.5 px-2">
                {INGESTING_STATUS_LINES.map((l, i) => (
                  <div
                    key={l}
                    className="text-[13.5px] transition-opacity"
                    style={{
                      opacity: i === stage ? 1 : i < stage ? 0.25 : 0.4,
                      color: i === stage ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {l}
                  </div>
                ))}
                <div className="mt-5 flex items-center gap-2 text-[12px] text-white/40">
                  <Loader2 size={13} className="animate-spin" /> Reading typography, color
                  hierarchy, layout DNA…
                </div>
              </div>
            )}

            {phase === "review" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="mono text-white/55">Detected observations</div>
                  <div className="flex items-center gap-2 text-[12px] text-white/55">
                    Tap to accept · ⌫ to reject
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ingestion.detectedObservations.map((obs) => {
                    const accepted = obs.accepted === true;
                    const rejected = obs.accepted === false;
                    return (
                      <div
                        key={obs.id}
                        className={cn(
                          "rounded-xl p-4 border transition-colors",
                          accepted
                            ? "bg-[rgba(124,227,181,0.05)] border-[rgba(124,227,181,0.20)]"
                            : rejected
                            ? "bg-[rgba(237,116,114,0.04)] border-[rgba(237,116,114,0.20)] opacity-60"
                            : "bg-white/[0.02] border-white/[0.06]"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Chip
                                tone={
                                  obs.confidence === "Strong"
                                    ? "mint"
                                    : obs.confidence === "Moderate"
                                    ? "amber"
                                    : "violet"
                                }
                                className="h-5 px-2 text-[10px] font-mono uppercase tracking-[0.06em]"
                              >
                                {obs.category}
                              </Chip>
                              <span className="mono text-white/35">{obs.confidence}</span>
                            </div>
                            <div className="text-[13.5px] font-medium text-white/90 mt-1.5">
                              {obs.title}
                            </div>
                            <p className="text-[12px] text-white/55 mt-1 leading-snug">
                              {obs.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleObs(obs.id, false)}
                            className={cn(
                              "h-7 w-7 rounded-md inline-flex items-center justify-center transition-colors",
                              rejected
                                ? "bg-[#ED7472] text-black"
                                : "bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white"
                            )}
                            aria-label="Reject"
                          >
                            <X size={13} />
                          </button>
                          <button
                            onClick={() => toggleObs(obs.id, true)}
                            className={cn(
                              "h-7 px-2.5 rounded-md inline-flex items-center gap-1.5 text-[12px] transition-colors",
                              accepted
                                ? "bg-[#7CE3B5] text-black"
                                : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white"
                            )}
                          >
                            <Check size={13} />
                            {accepted ? "Accepted" : "Accept"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="text-[12.5px] text-white/55">
                    {ingestion.detectedObservations.filter((o) => o.accepted === true).length} of{" "}
                    {ingestion.detectedObservations.length} accepted
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" onClick={() => router.push("/styledna")}>
                      Cancel
                    </Button>
                    <Button variant="coral" onClick={confirm}>
                      Add to StyleDNA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {phase === "added" && (
              <div className="mt-8 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-[rgba(124,227,181,0.10)] inline-flex items-center justify-center mb-3">
                  <Check size={20} className="text-[#7CE3B5]" />
                </div>
                <div className="text-[15px] text-white/90">Observations added</div>
                <div className="mono mt-2">Returning to StyleDNA…</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
