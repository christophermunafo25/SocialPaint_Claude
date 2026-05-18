"use client";

import { useState, useEffect } from "react";
import { useApp, useTeam } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/types";
import { Check, ChevronDown } from "lucide-react";

const TABS = ["Workspace", "Members", "Brand", "Billing"] as const;
type Tab = (typeof TABS)[number];

const ROLES: Role[] = ["Owner", "Admin", "Designer", "Marketer", "Sales", "Executive"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Members");

  return (
    <div className="px-10 py-8 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ 4.12 · Settings</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Settings</h1>
        <p className="text-[13px] text-white/45 mt-1">
          Workspace governance. Role dropdowns reveal the Admin Activity nav in real time.
        </p>
      </div>

      <div className="flex items-center gap-1 mb-5 border-b border-white/[0.05]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative h-10 px-4 text-[12.5px] font-mono uppercase tracking-[0.06em] transition-colors",
              tab === t ? "text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#ED7472]" />
            )}
          </button>
        ))}
      </div>

      {tab === "Workspace" && <WorkspaceTab />}
      {tab === "Members" && <MembersTab />}
      {tab === "Brand" && <BrandTab />}
      {tab === "Billing" && <BillingTab />}
    </div>
  );
}

function WorkspaceTab() {
  const workspace = useApp((s) => s.workspace);
  const team = useTeam();
  return (
    <div className="surface p-6">
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-[640px]">
        <Row label="Workspace" value={workspace.name} />
        <Row label="Plan" value={workspace.plan} />
        <Row label="Members" value={`${team.length} active`} />
        <Row label="Region" value="US-East · Frankfurt" />
        <Row label="Default brand" value="Acme Cloud" />
        <Row label="Default design type" value="LinkedIn 1:1" />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono mb-1.5">{label}</div>
      <div className="text-[14px] text-white/90">{value}</div>
    </div>
  );
}

function MembersTab() {
  const team = useTeam();
  const setRole = useApp((s) => s.setRole);
  const currentUserId = useApp((s) => s.currentUserId);
  const setCurrentUser = useApp((s) => s.setCurrentUser);
  const pushToast = useApp((s) => s.pushToast);

  return (
    <div className="surface overflow-hidden">
      <div className="grid grid-cols-[2fr_2fr_1.4fr_1fr] px-5 py-3 border-b border-white/[0.05] mono text-white/40">
        <div>Member</div>
        <div>Email</div>
        <div>Role</div>
        <div></div>
      </div>
      {team.map((m) => {
        const isCurrent = m.id === currentUserId;
        return (
          <div
            key={m.id}
            className="grid grid-cols-[2fr_2fr_1.4fr_1fr] px-5 py-3 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar initials={m.initials} color={m.avatarColor} size={28} />
              <span className="text-[13.5px] text-white/95 truncate">{m.name}</span>
              {isCurrent && <Chip tone="coral" className="ml-1 h-5 px-1.5 text-[10px]">You</Chip>}
            </div>
            <div className="text-[12.5px] text-white/55 truncate">{m.email}</div>
            <RoleDropdown
              role={m.role}
              onChange={(r) => {
                setRole(m.id, r);
                if (isCurrent) {
                  pushToast({
                    message:
                      r === "Admin" || r === "Owner"
                        ? "Admin Activity nav revealed."
                        : "Admin nav hidden.",
                    tone: "neutral",
                  });
                }
              }}
            />
            <div className="text-right">
              {!isCurrent && (
                <button
                  onClick={() => {
                    setCurrentUser(m.id);
                    pushToast({ message: `Now viewing as ${m.name}.`, tone: "neutral" });
                  }}
                  className="text-[12px] text-white/45 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/[0.05]"
                >
                  View as
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RoleDropdown({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md text-[12px] border transition-colors",
          role === "Admin" || role === "Owner"
            ? "bg-[rgba(237,116,114,0.10)] text-[#F29593] border-[rgba(237,116,114,0.20)]"
            : "bg-white/[0.04] text-white/75 border-white/[0.04] hover:bg-white/[0.07]"
        )}
      >
        {role}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-full mt-2 z-40 min-w-[160px] rounded-lg bg-[#181818] border border-white/[0.06] shadow-2xl py-1.5">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-white/[0.05] flex items-center gap-2",
                  role === r ? "text-white" : "text-white/70"
                )}
              >
                <span className="w-3.5 inline-flex items-center justify-center">
                  {role === r && <Check size={11} />}
                </span>
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BrandTab() {
  const brand = useApp((s) => s.brand);
  return (
    <div className="surface p-6">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="h-14 w-14 rounded-xl inline-flex items-center justify-center text-[17px] font-medium"
          style={{
            background:
              "linear-gradient(135deg, rgba(237,116,114,0.95), rgba(178,84,82,0.95))",
            color: "#0A0A0A",
          }}
        >
          {brand.mark}
        </div>
        <div>
          <div className="text-[18px] font-medium tracking-tight">{brand.name}</div>
          <div className="mono mt-1">Captured from {brand.capturedFromCount} designs</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-[640px]">
        <Row label="Accent" value={brand.accent} />
        <Row label="Logo mark" value={brand.mark} />
        <Row label="Voice" value="Warm, slightly playful, but adult" />
        <Row label="Typography" value="StackSans · low-contrast geometric sans" />
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="surface p-6 text-center">
      <div className="mono mb-3">Billing</div>
      <div className="text-[15px] text-white/85">Team plan · $24/seat/mo</div>
      <p className="mt-2 text-[12.5px] text-white/45 max-w-[400px] mx-auto">
        Billing flows are out of scope for the prototype — this surface shows what the live plan
        and seat allocation will look like.
      </p>
    </div>
  );
}

// Auto-close dropdowns on global Escape — small nicety.
if (typeof window !== "undefined") {
  // no-op marker so importers don't tree-shake the IIFE pattern
}
