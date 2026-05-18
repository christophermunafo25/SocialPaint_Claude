"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Check, Loader2 } from "lucide-react";
import type { Connector } from "@/lib/types";

const SECTIONS: { title: string; key: Connector["category"]; tagline: string }[] = [
  { title: "Design tools", key: "Design", tagline: "Sources of truth — observed during work." },
  { title: "Distribution", key: "Distribution", tagline: "Push generated work straight to channels." },
  { title: "Storage", key: "Storage", tagline: "Drop saved Masterpieces into your stack." },
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
    <div className="px-10 py-8 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ 4.10 · Connectors</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Connectors</h1>
        <p className="text-[13px] text-white/45 mt-1">
          Bring your existing tools in. SocialPaint observes — it doesn't ask designers to switch.
        </p>
      </div>

      <div className="flex flex-col gap-7">
        {SECTIONS.map((sec) => {
          const items = connectors.filter((c) => c.category === sec.key);
          return (
            <section key={sec.key}>
              <div className="mb-3 flex items-baseline justify-between">
                <div className="mono">{sec.title}</div>
                <div className="text-[12px] text-white/35">{sec.tagline}</div>
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
                        className="h-9 w-9 rounded-lg inline-flex items-center justify-center text-[13px] font-medium"
                        style={{
                          background: c.brandColor + "1A",
                          color: c.brandColor,
                          border: `1px solid ${c.brandColor}33`,
                        }}
                      >
                        {c.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] text-white/95">{c.name}</div>
                        <div className="mono mt-0.5 text-white/40">
                          {isConnected
                            ? "CONNECTED · OBSERVING"
                            : isPending
                            ? "CONNECTING…"
                            : "AVAILABLE"}
                        </div>
                      </div>
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#7CE3B5] mr-1">
                          <Check size={13} /> Connected
                        </div>
                      ) : isPending ? (
                        <div className="flex items-center gap-1.5 text-[12px] text-white/65 mr-1">
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
