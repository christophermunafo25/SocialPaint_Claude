"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Check, ChevronDown } from "lucide-react";
import { useApp, useTeam } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Chip, Eyebrow } from "@/components/ui/Badge";
import type { Role } from "@/lib/types";

const TABS = ["Workspace", "Members", "Brand", "Billing"] as const;
type Tab = (typeof TABS)[number];

const ROLES: Role[] = ["Owner", "Admin", "Designer", "Marketer", "Sales", "Executive"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Members");

  return (
    <div className="px-10 py-9 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Settings · Workspace governance</Eyebrow>
      </div>
      <div className="flex items-end gap-4 mb-7">
        <div
          className="icon-tile"
          style={{
            width: 48,
            height: 48,
            background: "rgba(247,246,245,0.06)",
            color: "var(--fg-1)",
            border: "1px solid var(--hairline)",
          }}
        >
          <SettingsIcon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="h1">Settings</h1>
          <p className="body mt-1.5">
            Role dropdowns reveal the Admin Activity nav in real time.
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1 mb-6 border-b"
        style={{ borderColor: "var(--hairline)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative h-10 px-4 text-[13px] transition-colors"
            style={{
              color: tab === t ? "var(--fg-1)" : "var(--fg-3)",
              fontWeight: 400,
            }}
          >
            {t}
            {tab === t && (
              <span
                className="absolute -bottom-px left-0 right-0 h-[2px]"
                style={{ background: "var(--coral)" }}
              />
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
      <div className="grid grid-cols-2 gap-y-5 gap-x-12 max-w-[680px]">
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
      <div className="label mb-1.5">{label}</div>
      <div
        className="text-[15px]"
        style={{ color: "var(--fg-1)", fontWeight: 400 }}
      >
        {value}
      </div>
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
      <div
        className="grid grid-cols-[2fr_2fr_1.4fr_1fr] px-5 py-3 border-b label"
        style={{ borderColor: "var(--hairline)" }}
      >
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
            className="grid grid-cols-[2fr_2fr_1.4fr_1fr] px-5 py-3 items-center border-b transition-colors"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar initials={m.initials} color={m.avatarColor} size={28} />
              <span
                className="text-[13.5px] truncate"
                style={{ color: "var(--fg-1)" }}
              >
                {m.name}
              </span>
              {isCurrent && (
                <Chip tone="coral" className="ml-1 h-5 px-2 text-[10px]">
                  You
                </Chip>
              )}
            </div>
            <div className="text-[12.5px] truncate" style={{ color: "var(--fg-3)" }}>
              {m.email}
            </div>
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
                    pushToast({
                      message: `Now viewing as ${m.name}.`,
                      tone: "neutral",
                    });
                  }}
                  className="text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--fg-3)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(247,246,245,0.05)";
                    e.currentTarget.style.color = "var(--fg-1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--fg-3)";
                  }}
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
  const isElevated = role === "Admin" || role === "Owner";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] border transition-colors"
        style={{
          background: isElevated
            ? "rgba(237,116,114,0.10)"
            : "rgba(247,246,245,0.04)",
          color: isElevated ? "#f5a7a4" : "var(--fg-1)",
          borderColor: isElevated ? "rgba(237,116,114,0.20)" : "var(--hairline)",
          fontWeight: 400,
        }}
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
          <div
            className="absolute left-0 top-full mt-2 z-40 min-w-[180px] rounded-xl py-1.5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--hairline)",
              boxShadow: "var(--shadow-dropdown)",
            }}
          >
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2 transition-colors"
                style={{ color: role === r ? "var(--fg-1)" : "var(--fg-2)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(247,246,245,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span className="w-3.5 inline-flex items-center justify-center">
                  {role === r && <Check size={11} strokeWidth={1.8} />}
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
          className="icon-tile"
          style={{
            width: 56,
            height: 56,
            background: "var(--orchid)",
            color: "#231f23",
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: 20,
          }}
        >
          {brand.mark}
        </div>
        <div>
          <div
            className="text-[20px]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              letterSpacing: "-0.3px",
              color: "var(--fg-1)",
            }}
          >
            {brand.name}
          </div>
          <div className="label mt-1.5">Captured from {brand.capturedFromCount} designs</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-w-[680px]">
        <Row label="Accent" value={brand.accent} />
        <Row label="Logo mark" value={brand.mark} />
        <Row label="Voice" value="Calm, exact, quietly witty" />
        <Row label="Typography" value="Stack Sans · low-contrast geometric sans" />
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="surface p-9 text-center">
      <Eyebrow className="block mb-4">Billing</Eyebrow>
      <div
        className="text-[24px]"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          letterSpacing: "-0.5px",
          color: "var(--fg-1)",
        }}
      >
        Team plan · $24 per seat per month.
      </div>
      <p
        className="mt-3 text-[13px] max-w-[440px] mx-auto"
        style={{ color: "var(--fg-3)", fontWeight: 300 }}
      >
        Billing flows are out of scope for the prototype — this surface
        previews where seat allocation and invoices will live.
      </p>
    </div>
  );
}
