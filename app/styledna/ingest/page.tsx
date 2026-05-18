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
import { Chip, Eyebrow } from "@/components/ui/Badge";
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

  const beginAnalysis = async (
    source: "upload" | "link",
    payload: { fileName?: string; url?: string }
  ) => {
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
    <div className="px-10 py-9 max-w-[960px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.push("/styledna")}
          className="h-9 w-9 rounded-lg inline-flex items-center justify-center transition-colors"
          style={{ color: "var(--fg-3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(247,246,245,0.05)";
            e.currentTarget.style.color = "var(--fg-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--fg-3)";
          }}
          aria-label="Back to StyleDNA"
        >
          <ArrowLeft size={16} strokeWidth={1.6} />
        </button>
        <Eyebrow>Asset ingestion · Feed StyleDNA</Eyebrow>
      </div>
      <h1 className="h1 mb-7">Add new observations</h1>

      <div className="surface p-6">
        <div className="flex items-center gap-1 mb-5 border-b" style={{ borderColor: "var(--hairline)" }}>
          {(["upload", "link"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative h-10 px-4 text-[13px] transition-colors"
              style={{
                color: tab === t ? "var(--fg-1)" : "var(--fg-3)",
                fontWeight: 400,
              }}
            >
              {t === "upload" ? "Upload file" : "Paste link"}
              {tab === t && (
                <span
                  className="absolute -bottom-px left-0 right-0 h-[2px]"
                  style={{ background: "var(--coral)" }}
                />
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
              "rounded-2xl border border-dashed h-[280px] flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            )}
            style={{
              borderColor: dragOver ? "var(--coral)" : "rgba(247,246,245,0.14)",
              background: dragOver
                ? "rgba(237,116,114,0.04)"
                : "rgba(247,246,245,0.01)",
            }}
          >
            <div
              className="icon-tile mb-4"
              style={{
                width: 44,
                height: 44,
                background: "var(--orchid)",
                color: "#231f23",
              }}
            >
              <Upload size={18} strokeWidth={1.6} />
            </div>
            <div className="body" style={{ color: "var(--fg-1)" }}>
              Drop PNG, JPG, PDF, or SVG here
            </div>
            <div className="label mt-2">Or click to browse · multi-file supported</div>
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
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "var(--input)",
              border: "1px solid var(--hairline)",
            }}
          >
            <LinkIcon size={15} style={{ color: "var(--fg-3)" }} strokeWidth={1.6} />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://figma.com/file/X8j2…/Acme-Q3"
              className="flex-1 bg-transparent outline-none text-[14px]"
              style={{ color: "var(--fg-1)", fontWeight: 300 }}
            />
            <Button variant="primary" disabled={linkUrl.trim().length < 8} onClick={handlePasteLink}>
              Analyze
            </Button>
          </div>
        )}

        {(phase === "analyzing" || phase === "review" || phase === "added") && ingestion && (
          <>
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: "var(--input)",
                border: "1px solid var(--hairline)",
              }}
            >
              <FileUp size={15} style={{ color: "var(--fg-2)" }} strokeWidth={1.6} />
              <span className="text-[13.5px] truncate" style={{ color: "var(--fg-1)" }}>
                {ingestion.source === "link"
                  ? ingestion.url
                  : ingestion.fileName ?? "Uploaded asset"}
              </span>
              <span className="ml-auto label">
                {phase === "analyzing"
                  ? "Analyzing…"
                  : phase === "review"
                  ? `${ingestion.detectedObservations.length} observations`
                  : "Added"}
              </span>
            </div>

            {phase === "analyzing" && (
              <div className="mt-6 flex flex-col gap-1.5 px-2">
                {INGESTING_STATUS_LINES.map((l, i) => (
                  <div
                    key={l}
                    className="text-[14px] transition-opacity"
                    style={{
                      opacity: i === stage ? 1 : i < stage ? 0.25 : 0.42,
                      color:
                        i === stage ? "var(--fg-1)" : "var(--fg-3)",
                      fontWeight: 300,
                    }}
                  >
                    {l}
                  </div>
                ))}
                <div className="mt-5 flex items-center gap-2 label">
                  <Loader2 size={13} className="animate-spin" /> Reading typography, color
                  hierarchy, layout DNA…
                </div>
              </div>
            )}

            {phase === "review" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <Eyebrow>Detected observations</Eyebrow>
                  <span className="label-sm">Tap to accept · ⌫ to reject</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ingestion.detectedObservations.map((obs) => {
                    const accepted = obs.accepted === true;
                    const rejected = obs.accepted === false;
                    return (
                      <div
                        key={obs.id}
                        className="rounded-2xl p-4 border transition-colors"
                        style={{
                          background: accepted
                            ? "rgba(204,253,207,0.05)"
                            : rejected
                            ? "rgba(237,116,114,0.04)"
                            : "rgba(247,246,245,0.02)",
                          borderColor: accepted
                            ? "rgba(204,253,207,0.20)"
                            : rejected
                            ? "rgba(237,116,114,0.20)"
                            : "var(--hairline)",
                          opacity: rejected ? 0.6 : 1,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Chip
                            tone={
                              obs.category === "Colors"
                                ? "coral"
                                : obs.category === "Typography"
                                ? "orchid"
                                : obs.category === "Layout"
                                ? "sky"
                                : obs.category === "Voice"
                                ? "sand"
                                : "peach"
                            }
                            className="h-5.5 px-2 text-[10.5px]"
                          >
                            {obs.category}
                          </Chip>
                          <span className="label-sm">{obs.confidence}</span>
                        </div>
                        <div
                          className="text-[14px] mt-2"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 400,
                            letterSpacing: "-0.2px",
                            color: "var(--fg-1)",
                          }}
                        >
                          {obs.title}
                        </div>
                        <p
                          className="text-[12.5px] mt-1.5 leading-snug"
                          style={{ color: "var(--fg-2)", fontWeight: 300 }}
                        >
                          {obs.description}
                        </p>
                        <div className="mt-3 flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleObs(obs.id, false)}
                            className="h-7 w-7 rounded-lg inline-flex items-center justify-center transition-colors"
                            style={{
                              background: rejected
                                ? "var(--coral)"
                                : "rgba(247,246,245,0.04)",
                              color: rejected ? "#0e0c0e" : "var(--fg-3)",
                            }}
                            aria-label="Reject"
                          >
                            <X size={13} strokeWidth={1.6} />
                          </button>
                          <button
                            onClick={() => toggleObs(obs.id, true)}
                            className="h-7 px-3 rounded-lg inline-flex items-center gap-1.5 text-[12.5px] transition-colors"
                            style={{
                              background: accepted
                                ? "var(--mint)"
                                : "rgba(247,246,245,0.04)",
                              color: accepted ? "#231f23" : "var(--fg-1)",
                            }}
                          >
                            <Check size={13} strokeWidth={1.6} />
                            {accepted ? "Accepted" : "Accept"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="body-sm" style={{ color: "var(--fg-2)" }}>
                    {ingestion.detectedObservations.filter((o) => o.accepted === true).length} of{" "}
                    {ingestion.detectedObservations.length} accepted
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" onClick={() => router.push("/styledna")}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={confirm}>
                      Add to StyleDNA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {phase === "added" && (
              <div className="mt-9 flex flex-col items-center text-center">
                <div
                  className="icon-tile mb-3"
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--mint)",
                    color: "#231f23",
                  }}
                >
                  <Check size={20} strokeWidth={1.6} />
                </div>
                <div className="h3" style={{ color: "var(--fg-1)" }}>
                  Observations added.
                </div>
                <div className="label mt-2">Returning to StyleDNA…</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
