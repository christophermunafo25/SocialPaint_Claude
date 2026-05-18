"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Check, ChevronDown, Bell, Wand2, Shield, Palette as PaletteIcon } from "lucide-react";
import { useApp, useTeam } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Chip, Eyebrow } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PLATFORM_SPECS } from "@/lib/platforms";
import type { DesignType, Role } from "@/lib/types";
import type { Palette as PaletteKey } from "@/lib/compositions";

const TABS = [
  "Workspace",
  "Members",
  "Brand",
  "Generation",
  "Policies",
  "Billing",
] as const;
type Tab = (typeof TABS)[number];

const ROLES: Role[] = ["Owner", "Admin", "Designer", "Marketer", "Sales", "Executive"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Workspace");

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
            Brand, generation, and policy settings shape every output.
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1 mb-6 border-b overflow-x-auto"
        style={{ borderColor: "var(--hairline)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative h-10 px-4 text-[13px] transition-colors whitespace-nowrap"
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
      {tab === "Generation" && <GenerationTab />}
      {tab === "Policies" && <PoliciesTab />}
      {tab === "Billing" && <BillingTab />}
    </div>
  );
}

// ── Workspace ────────────────────────────────────────────────────────────

function WorkspaceTab() {
  const workspace = useApp((s) => s.workspace);
  const team = useTeam();
  return (
    <div className="surface p-7">
      <Eyebrow className="mb-5">Workspace</Eyebrow>
      <div className="grid grid-cols-2 gap-y-6 gap-x-12 max-w-[680px]">
        <Row label="Workspace name" value={workspace.name} />
        <Row label="Plan" value={workspace.plan} />
        <Row label="Members" value={`${team.length} active`} />
        <Row label="Region" value="US-East · Frankfurt" />
        <Row label="Default brand" value="Acme Cloud" />
        <Row label="Created" value="March 2026" />
      </div>
    </div>
  );
}

// ── Members ──────────────────────────────────────────────────────────────

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
            className="grid grid-cols-[2fr_2fr_1.4fr_1fr] px-5 py-3 items-center border-b"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar initials={m.initials} color={m.avatarColor} size={28} />
              <span className="text-[13.5px] truncate" style={{ color: "var(--fg-1)" }}>{m.name}</span>
              {isCurrent && (
                <Chip tone="coral" className="ml-1 h-5 px-2 text-[10px]">You</Chip>
              )}
            </div>
            <div className="text-[12.5px] truncate" style={{ color: "var(--fg-3)" }}>{m.email}</div>
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
        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] border"
        style={{
          background: isElevated ? "rgba(237,116,114,0.10)" : "rgba(247,246,245,0.04)",
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
          <button className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
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
                className="w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2"
                style={{ color: role === r ? "var(--fg-1)" : "var(--fg-2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(247,246,245,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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

// ── Brand · the rich one ─────────────────────────────────────────────────

function BrandTab() {
  const brand = useApp((s) => s.brand);
  const prefs = useApp((s) => s.brandPrefs);
  const setBrandPrefs = useApp((s) => s.setBrandPrefs);
  const pushToast = useApp((s) => s.pushToast);

  const ACCENT_SWATCHES = ["#ED7472", "#F17A3B", "#F5C044", "#CEBFFA", "#CCFDCF", "#D7E9FF"];
  const TONE_OPTIONS: Array<{ key: typeof prefs.voiceTone; label: string; hint: string }> = [
    { key: "calm", label: "Calm", hint: "Documentation-clean. Quiet." },
    { key: "warm", label: "Warm", hint: "Direct, with rhythm." },
    { key: "playful", label: "Playful", hint: "Light, occasional wink." },
    { key: "bold", label: "Bold", hint: "Definitive. Short sentences." },
  ];

  return (
    <div className="space-y-5">
      <div className="surface p-7">
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
              fontSize: 22,
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

        <Eyebrow className="mb-3">
          <PaletteIcon size={11} strokeWidth={1.6} className="inline -mt-0.5 mr-1" />
          Accent color
        </Eyebrow>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          {ACCENT_SWATCHES.map((c) => {
            const active = c.toLowerCase() === prefs.accentColor.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => {
                  setBrandPrefs({ accentColor: c });
                  pushToast({ message: "Brand accent updated.", tone: "success" });
                }}
                className="h-10 w-10 rounded-lg transition-all relative"
                style={{
                  background: c,
                  border: active
                    ? "2px solid var(--fg-1)"
                    : "1px solid rgba(247,246,245,0.10)",
                  boxShadow: active ? "0 0 0 4px rgba(247,246,245,0.06)" : "none",
                }}
                aria-label={c}
              >
                {active && (
                  <Check
                    size={14}
                    strokeWidth={2}
                    style={{ color: "#0E0C0E", margin: "auto", position: "absolute", inset: 0 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="label-sm">Current · {prefs.accentColor.toUpperCase()}</div>
      </div>

      <div className="surface p-7">
        <Eyebrow className="mb-4">Voice tone</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TONE_OPTIONS.map((t) => {
            const active = prefs.voiceTone === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setBrandPrefs({ voiceTone: t.key })}
                className={cn(
                  "p-4 rounded-2xl text-left transition-colors",
                  active && "shadow-sm"
                )}
                style={{
                  background: active
                    ? "rgba(237,116,114,0.06)"
                    : "rgba(247,246,245,0.02)",
                  border: active
                    ? "1px solid rgba(237,116,114,0.25)"
                    : "1px solid var(--hairline)",
                }}
              >
                <div
                  className="text-[14px]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    color: active ? "#f29593" : "var(--fg-1)",
                  }}
                >
                  {t.label}
                </div>
                <div className="text-[12px] mt-1" style={{ color: "var(--fg-3)" }}>
                  {t.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface p-7">
        <Eyebrow className="mb-3">Voice rules</Eyebrow>
        <ul className="space-y-2">
          {prefs.voiceRules.map((r, i) => (
            <li
              key={i}
              className="text-[13.5px] flex items-start gap-2"
              style={{ color: "var(--fg-2)", fontWeight: 300 }}
            >
              <span className="mt-1 h-1 w-1 rounded-full shrink-0" style={{ background: "var(--coral)" }} />
              {r}
            </li>
          ))}
        </ul>
        <div className="label-sm mt-4">
          Captured from observation. Hand-edit a rule in StyleDNA to extend.
        </div>
      </div>
    </div>
  );
}

// ── Generation defaults ──────────────────────────────────────────────────

function GenerationTab() {
  const prefs = useApp((s) => s.generationPrefs);
  const set = useApp((s) => s.setGenerationPrefs);
  const pushToast = useApp((s) => s.pushToast);

  return (
    <div className="space-y-5">
      <div className="surface p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-tile" style={{ width: 32, height: 32, background: "var(--mint)", color: "#231f23" }}>
            <Wand2 size={14} strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-[15px]" style={{ color: "var(--fg-1)", fontWeight: 400 }}>
              Generation defaults
            </div>
            <div className="label-sm">Applied to every new design unless the user overrides them.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Default platform">
            <SimpleSelect
              value={prefs.defaultPlatform}
              onChange={(v) => set({ defaultPlatform: v as DesignType })}
              options={Object.keys(PLATFORM_SPECS).map((k) => ({
                value: k,
                label: `${PLATFORM_SPECS[k as DesignType].label} · ${PLATFORM_SPECS[k as DesignType].ratioLabel}`,
              }))}
            />
          </Field>
          <Field label="Default palette">
            <SimpleSelect
              value={prefs.defaultPalette}
              onChange={(v) => set({ defaultPalette: v as PaletteKey | "auto" })}
              options={[
                { value: "auto", label: "Auto (varies per option)" },
                { value: "ink", label: "Ink · dark" },
                { value: "paper", label: "Paper · cream" },
                { value: "mesh", label: "Warm mesh" },
                { value: "orchid", label: "Orchid pastel" },
                { value: "mint", label: "Mint pastel" },
                { value: "peach", label: "Peach pastel" },
                { value: "sand", label: "Sand pastel" },
              ]}
            />
          </Field>
          <Field label="Default mood">
            <SimpleSelect
              value={prefs.defaultMood}
              onChange={(v) => set({ defaultMood: v as "calm" | "warm" | "bold" })}
              options={[
                { value: "calm", label: "Calm · editorial" },
                { value: "warm", label: "Warm · with rhythm" },
                { value: "bold", label: "Bold · definitive" },
              ]}
            />
          </Field>
          <Field label="Options per generation">
            <SimpleSelect
              value={String(prefs.optionsPerGeneration)}
              onChange={(v) =>
                set({ optionsPerGeneration: Number(v) as 3 | 4 | 6 })
              }
              options={[
                { value: "3", label: "3 options · fastest" },
                { value: "4", label: "4 options" },
                { value: "6", label: "6 options · widest spread" },
              ]}
            />
          </Field>
          <Field label="Minimum score to export" hint="Lower-scoring designs show a warning before export.">
            <input
              type="range"
              min={60}
              max={100}
              value={prefs.minScoreForExport}
              onChange={(e) => set({ minScoreForExport: Number(e.target.value) })}
              className="w-full accent-[#ed7472]"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="label-sm">60</span>
              <span
                className="tabular-nums text-[13px]"
                style={{ color: "var(--fg-1)", fontWeight: 400 }}
              >
                {prefs.minScoreForExport}
              </span>
              <span className="label-sm">100</span>
            </div>
          </Field>
          <Field
            label="Prefer Strong rules"
            hint="When set, Generation weights Strong (vs Moderate / Emerging) StyleDNA rules higher."
          >
            <Toggle
              on={prefs.preferStrongRules}
              onChange={(v) => set({ preferStrongRules: v })}
              label={prefs.preferStrongRules ? "On" : "Off"}
            />
          </Field>
        </div>
        <div className="mt-7 flex justify-end">
          <Button variant="primary" size="md" onClick={() => pushToast({ message: "Generation defaults saved.", tone: "success" })}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="surface p-7">
        <Eyebrow className="mb-4">Platform reference</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(PLATFORM_SPECS).map((p) => (
            <div
              key={p.designType}
              className="flex items-center justify-between p-3.5 rounded-xl"
              style={{
                background: "rgba(247,246,245,0.02)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div>
                <div className="text-[13.5px]" style={{ color: "var(--fg-1)" }}>
                  {p.label}
                </div>
                <div className="label-sm mt-0.5">{p.designType}</div>
              </div>
              <div className="text-right">
                <div
                  className="tabular-nums text-[13.5px]"
                  style={{ color: "var(--fg-1)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}
                >
                  {p.width} × {p.height}
                </div>
                <div className="label-sm">{p.ratioLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Policies & notifications ─────────────────────────────────────────────

function PoliciesTab() {
  const np = useApp((s) => s.notificationPrefs);
  const setNp = useApp((s) => s.setNotificationPrefs);
  const gp = useApp((s) => s.generationPrefs);
  const pushToast = useApp((s) => s.pushToast);

  return (
    <div className="space-y-5">
      <div className="surface p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-tile" style={{ width: 32, height: 32, background: "var(--sand)", color: "#231f23" }}>
            <Bell size={14} strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-[15px]" style={{ color: "var(--fg-1)" }}>Notifications</div>
            <div className="label-sm">Admins receive these as inline toasts plus a daily digest.</div>
          </div>
        </div>
        <ToggleRow
          title="Notify on low compliance"
          hint={`Pings admins when a generation lands below ${np.lowComplianceThreshold}.`}
          on={np.notifyOnLowCompliance}
          onChange={(v) => setNp({ notifyOnLowCompliance: v })}
        />
        <ToggleRow
          title="Notify on asset ingestion"
          hint="Pings designers when new observations land."
          on={np.notifyOnIngest}
          onChange={(v) => setNp({ notifyOnIngest: v })}
        />
        <ToggleRow
          title="Notify on StyleDNA edits"
          hint="Pings when a rule is locked, disabled, or rewritten."
          on={np.notifyOnRuleEdit}
          onChange={(v) => setNp({ notifyOnRuleEdit: v })}
        />
        <ToggleRow
          title="Weekly digest"
          hint="A Monday morning summary of generations, exports, and rule changes."
          on={np.weeklyDigest}
          onChange={(v) => setNp({ weeklyDigest: v })}
        />
      </div>

      <div className="surface p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-tile" style={{ width: 32, height: 32, background: "var(--peach)", color: "#231f23" }}>
            <Shield size={14} strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-[15px]" style={{ color: "var(--fg-1)" }}>Policies</div>
            <div className="label-sm">Workspace-wide guardrails. Approvals are removed in v2 — admins observe.</div>
          </div>
        </div>
        <Row label="Minimum compliance to export" value={`${gp.minScoreForExport}`} />
        <Row label="Low-compliance threshold" value={`< ${np.lowComplianceThreshold}`} />
        <Row label="Approval workflow" value="Removed in v2 · observe-only" />
        <Row label="Locked rules" value="Locks live on individual StyleDNA rules" />
        <div className="mt-5 flex justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={() => pushToast({ message: "Policies saved.", tone: "success" })}
          >
            Save changes
          </Button>
        </div>
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

// ── Atoms ─────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-b-0"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="label">{label}</div>
      <div className="text-[13.5px]" style={{ color: "var(--fg-1)", fontWeight: 400 }}>
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="label mb-2">{label}</div>
      {children}
      {hint && (
        <div className="label-sm mt-1.5" style={{ color: "var(--fg-4)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function SimpleSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      className="rounded-lg px-3 h-10 flex items-center"
      style={{
        background: "var(--input)",
        border: "1px solid var(--hairline)",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none w-full text-[13.5px]"
        style={{ color: "var(--fg-1)", fontWeight: 400 }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-3 transition-colors"
    >
      <span
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ background: on ? "var(--coral)" : "rgba(247,246,245,0.10)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
          style={{ left: on ? 18 : 2 }}
        />
      </span>
      <span className="text-[13px]" style={{ color: "var(--fg-1)" }}>{label}</span>
    </button>
  );
}

function ToggleRow({
  title,
  hint,
  on,
  onChange,
}: {
  title: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="py-3.5 flex items-center justify-between border-b last:border-b-0"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="flex-1 min-w-0 pr-6">
        <div className="text-[13.5px]" style={{ color: "var(--fg-1)" }}>
          {title}
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: "var(--fg-3)" }}>
          {hint}
        </div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}
