"use client";

import { useState } from "react";
import { Workflow, Check, Loader2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Badge";
import type { Connector } from "@/lib/types";

const SECTIONS: { title: string; key: Connector["category"]; tagline: string }[] = [
  {
    title: "Design tools",
    key: "Design",
    tagline: "Sources of truth — observed during work.",
  },
  {
    title: "Distribution",
    key: "Distribution",
    tagline: "Push generated work straight to channels.",
  },
  {
    title: "Storage",
    key: "Storage",
    tagline: "Drop saved Masterpieces into your stack.",
  },
];

export default function ConnectorsPage() {
  const connectors = useApp((s) => s.connectors);
  const connect = useApp((s) => s.connectConnector);
  const pushToast = useApp((s) => s.pushToast);
  const [pending, setPending] = useState<string | null>(null);

  const handleConnect = (id: string, name: string) => {
    setPending(id);
    setTimeout(() => {
      connect(id);
      pushToast({ message: `${name} connected.`, tone: "success" });
      setPending(null);
    }, 2000);
  };

  return (
    <div className="px-10 py-9 max-w-[1140px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Connectors · Integrations</Eyebrow>
      </div>
      <div className="flex items-end gap-4 mb-8">
        <div
          className="icon-tile"
          style={{
            width: 48,
            height: 48,
            background: "var(--sky)",
            color: "#231f23",
          }}
        >
          <Workflow size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="h1">Connectors</h1>
          <p className="body mt-1.5">
            Bring your existing tools in. SocialPaint observes — it doesn't
            ask designers to switch.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((sec) => {
          const items = connectors.filter((c) => c.category === sec.key);
          return (
            <section key={sec.key}>
              <div className="mb-4 flex items-baseline justify-between">
                <Eyebrow>{sec.title}</Eyebrow>
                <div className="text-[12.5px]" style={{ color: "var(--fg-3)" }}>
                  {sec.tagline}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((c) => {
                  const isConnected = c.status === "connected";
                  const isPending = pending === c.id;
                  return (
                    <div
                      key={c.id}
                      className="surface p-4 flex items-center gap-3.5"
                    >
                      <div
                        className="h-10 w-10 rounded-xl inline-flex items-center justify-center text-[13.5px]"
                        style={{
                          background: c.brandColor + "1A",
                          color: c.brandColor,
                          border: `1px solid ${c.brandColor}33`,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                        }}
                      >
                        {c.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[14px]"
                          style={{ color: "var(--fg-1)", fontWeight: 400 }}
                        >
                          {c.name}
                        </div>
                        <div className="label-sm mt-1">
                          {isConnected
                            ? "Connected · observing"
                            : isPending
                            ? "Connecting…"
                            : "Available"}
                        </div>
                      </div>
                      {isConnected ? (
                        <div
                          className="flex items-center gap-1.5 text-[12.5px] mr-1"
                          style={{ color: "#a9e8b5" }}
                        >
                          <Check size={13} strokeWidth={1.6} /> Connected
                        </div>
                      ) : isPending ? (
                        <div
                          className="flex items-center gap-1.5 text-[12.5px] mr-1"
                          style={{ color: "var(--fg-2)" }}
                        >
                          <Loader2 size={13} className="animate-spin" /> Connecting
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(c.id, c.name)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
