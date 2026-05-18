// Zustand store · history persists in localStorage. StyleDNA emits pseudo-live updates.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  BRAND,
  CONNECTORS,
  DEMO_GENERATION,
  MIRA,
  SEED_ACTIVITY,
  SEED_HISTORY,
  SEED_RULES,
  TEAM,
  TEMPLATES,
  WORKSPACE,
} from "./mock-data";
import type {
  ActivityEvent,
  ActivityEventType,
  AssetIngestion,
  Connector,
  DesignGeneration,
  DesignType,
  GeneratedDesign,
  HistoryItem,
  Role,
  StyleDNARule,
  User,
} from "./types";
import type { Palette } from "./compositions";
import { shortId } from "./cn";

interface Toast {
  id: string;
  message: string;
  tone: "neutral" | "success" | "live";
}

type RoleByUser = Record<string, Role>;

export interface GenerationPrefs {
  defaultPlatform: DesignType;
  defaultPalette: Palette | "auto";
  defaultMood: "calm" | "warm" | "bold";
  minScoreForExport: number;
  optionsPerGeneration: 3 | 4 | 6;
  preferStrongRules: boolean;
}

export interface NotificationPrefs {
  notifyOnLowCompliance: boolean;
  lowComplianceThreshold: number;
  notifyOnIngest: boolean;
  notifyOnRuleEdit: boolean;
  weeklyDigest: boolean;
}

export interface BrandPrefs {
  accentColor: string;
  secondaryAccent: string;
  voiceTone: "calm" | "warm" | "playful" | "bold";
  voiceRules: string[];
  defaultPalette: Palette;
  signaturePunctuation: "period" | "em-dash" | "comma";
}

interface AppState {
  // Identity
  workspace: typeof WORKSPACE;
  brand: typeof BRAND;
  currentUserId: string;
  rolesByUser: RoleByUser;

  // Workspace prefs
  generationPrefs: GenerationPrefs;
  notificationPrefs: NotificationPrefs;
  brandPrefs: BrandPrefs;

  // Data
  rules: StyleDNARule[];
  history: HistoryItem[];
  activity: ActivityEvent[];
  generations: Record<string, DesignGeneration>;
  ingestions: AssetIngestion[];
  connectors: Connector[];

  // Ephemeral
  toasts: Toast[];
  lastStyleDNATick: string;

  // Mutations
  setRole: (userId: string, role: Role) => void;
  setCurrentUser: (userId: string) => void;
  setGenerationPrefs: (patch: Partial<GenerationPrefs>) => void;
  setNotificationPrefs: (patch: Partial<NotificationPrefs>) => void;
  setBrandPrefs: (patch: Partial<BrandPrefs>) => void;

  setGeneration: (gen: DesignGeneration) => void;
  updateDesign: (designId: string, patch: Partial<GeneratedDesign>) => void;
  saveDesignToHistory: (designId: string) => void;

  addRule: (rule: Omit<StyleDNARule, "id" | "lastUpdated">) => StyleDNARule;
  updateRule: (id: string, patch: Partial<StyleDNARule>) => void;
  bumpRuleByCategory: (category: StyleDNARule["category"]) => void;

  addIngestion: (ingestion: AssetIngestion) => void;
  updateIngestion: (id: string, patch: Partial<AssetIngestion>) => void;
  acceptObservations: (ingestionId: string) => StyleDNARule[];

  pushActivity: (event: Omit<ActivityEvent, "id" | "createdAt" | "flaggedByAdmin"> & {
    flaggedByAdmin?: boolean;
  }) => void;
  toggleActivityFlag: (eventId: string) => void;

  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  setStyleDNATick: () => void;
  connectConnector: (id: string) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const baseConnectors: Connector[] = CONNECTORS;

// ── Store ───────────────────────────────────────────────────────────────────

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      workspace: WORKSPACE,
      brand: BRAND,
      currentUserId: MIRA.id,
      rolesByUser: {
        u_mira: "Marketer",
        u_theo: "Designer",
        u_sam: "Marketer",
        u_jules: "Designer",
        u_lin: "Marketer",
        u_kai: "Sales",
        u_ren: "Owner",
      },

      generationPrefs: {
        defaultPlatform: "LinkedIn 1:1",
        defaultPalette: "auto",
        defaultMood: "calm",
        minScoreForExport: 75,
        optionsPerGeneration: 3,
        preferStrongRules: true,
      },
      notificationPrefs: {
        notifyOnLowCompliance: true,
        lowComplianceThreshold: 75,
        notifyOnIngest: true,
        notifyOnRuleEdit: false,
        weeklyDigest: true,
      },
      brandPrefs: {
        accentColor: "#ED7472",
        secondaryAccent: "#F5C044",
        voiceTone: "calm",
        voiceRules: [
          "Periods, not exclamation marks.",
          "Sentence case for everything except mono labels.",
          "Numerals over spelled-out numbers from 10 onward.",
          "Active voice. Second person.",
        ],
        defaultPalette: "ink",
        signaturePunctuation: "period",
      },

      rules: SEED_RULES,
      history: SEED_HISTORY,
      activity: SEED_ACTIVITY,
      generations: { [DEMO_GENERATION.id]: DEMO_GENERATION },
      ingestions: [],
      connectors: baseConnectors,

      toasts: [],
      lastStyleDNATick: new Date().toISOString(),

      setRole: (userId, role) =>
        set((s) => ({ rolesByUser: { ...s.rolesByUser, [userId]: role } })),
      setCurrentUser: (userId) => set({ currentUserId: userId }),
      setGenerationPrefs: (patch) =>
        set((s) => ({ generationPrefs: { ...s.generationPrefs, ...patch } })),
      setNotificationPrefs: (patch) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...patch } })),
      setBrandPrefs: (patch) =>
        set((s) => ({ brandPrefs: { ...s.brandPrefs, ...patch } })),

      setGeneration: (gen) =>
        set((s) => ({ generations: { ...s.generations, [gen.id]: gen } })),

      updateDesign: (designId, patch) =>
        set((s) => {
          const next = { ...s.generations };
          for (const [gid, g] of Object.entries(s.generations)) {
            const idx = g.options.findIndex((o) => o.id === designId);
            if (idx >= 0) {
              const updated = { ...g.options[idx], ...patch };
              const opts = [...g.options];
              opts[idx] = updated;
              next[gid] = { ...g, options: opts };
              break;
            }
          }
          return { generations: next };
        }),

      saveDesignToHistory: (designId) =>
        set((s) => {
          let foundDesign: GeneratedDesign | undefined;
          let foundGen: DesignGeneration | undefined;
          for (const g of Object.values(s.generations)) {
            const d = g.options.find((o) => o.id === designId);
            if (d) {
              foundDesign = d;
              foundGen = g;
              break;
            }
          }
          if (!foundDesign || !foundGen) return s;
          if (s.history.some((h) => h.designId === designId)) return s;

          const title = foundGen.prompt.split(/[—,.]/)[0].trim().slice(0, 48);
          const item: HistoryItem = {
            id: shortId("h"),
            generationId: foundGen.id,
            designId: foundDesign.id,
            title: title || "Untitled Masterpiece",
            designType: foundGen.designType,
            score: foundDesign.complianceScore,
            createdAt: new Date().toISOString(),
          };
          return { history: [item, ...s.history].slice(0, 12) };
        }),

      addRule: (rule) => {
        const next: StyleDNARule = {
          ...rule,
          id: shortId("r"),
          lastUpdated: new Date().toISOString(),
        };
        set((s) => ({ rules: [...s.rules, next] }));
        return next;
      },

      updateRule: (id, patch) =>
        set((s) => ({
          rules: s.rules.map((r) =>
            r.id === id ? { ...r, ...patch, lastUpdated: new Date().toISOString() } : r
          ),
        })),

      bumpRuleByCategory: (category) =>
        set((s) => {
          const idx = s.rules.findIndex((r) => r.category === category);
          if (idx < 0) return s;
          const next = [...s.rules];
          next[idx] = {
            ...next[idx],
            exampleCount: next[idx].exampleCount + 1,
            lastUpdated: new Date().toISOString(),
          };
          return { rules: next, lastStyleDNATick: new Date().toISOString() };
        }),

      addIngestion: (ingestion) => set((s) => ({ ingestions: [ingestion, ...s.ingestions] })),
      updateIngestion: (id, patch) =>
        set((s) => ({
          ingestions: s.ingestions.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

      acceptObservations: (ingestionId) => {
        const ing = get().ingestions.find((i) => i.id === ingestionId);
        if (!ing) return [];
        const accepted = ing.detectedObservations.filter((o) => o.accepted === true);
        const newRules: StyleDNARule[] = accepted.map((obs) => ({
          id: shortId("r"),
          brandId: BRAND.id,
          category: obs.category,
          title: obs.title,
          description: obs.description,
          confidence: obs.confidence,
          exampleCount: 1,
          exampleThumbnails: [],
          lastUpdated: new Date().toISOString(),
          isLocked: false,
          isDisabled: false,
          source: "uploaded",
        }));
        set((s) => ({
          rules: [...newRules, ...s.rules],
          ingestions: s.ingestions.map((i) =>
            i.id === ingestionId ? { ...i, status: "added" as const } : i
          ),
          lastStyleDNATick: new Date().toISOString(),
        }));
        return newRules;
      },

      pushActivity: (event) => {
        const ev: ActivityEvent = {
          ...event,
          id: shortId("a"),
          createdAt: new Date().toISOString(),
          flaggedByAdmin: event.flaggedByAdmin ?? false,
        };
        set((s) => ({ activity: [ev, ...s.activity].slice(0, 60) }));
      },
      toggleActivityFlag: (eventId) =>
        set((s) => ({
          activity: s.activity.map((a) =>
            a.id === eventId ? { ...a, flaggedByAdmin: !a.flaggedByAdmin } : a
          ),
        })),

      pushToast: (t) => {
        const toast: Toast = { ...t, id: shortId("t") };
        set((s) => ({ toasts: [...s.toasts, toast] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((x) => x.id !== toast.id) }));
        }, 4200);
      },
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setStyleDNATick: () => set({ lastStyleDNATick: new Date().toISOString() }),

      connectConnector: (id) =>
        set((s) => ({
          connectors: s.connectors.map((c) =>
            c.id === id ? { ...c, status: "connected" as const } : c
          ),
        })),
    }),
    {
      name: "socialpaint-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        rolesByUser: s.rolesByUser,
        history: s.history,
        rules: s.rules,
        connectors: s.connectors,
        activity: s.activity.slice(0, 30),
        generationPrefs: s.generationPrefs,
        notificationPrefs: s.notificationPrefs,
        brandPrefs: s.brandPrefs,
      }),
      version: 2,
    }
  )
);

// Convenience exports for activity-event types when callers don't want to import types separately.
export type { ActivityEventType };

// ── Stable derived hooks ────────────────────────────────────────────────────
// useApp selectors must return stable references when state hasn't changed —
// these helpers select primitive store fields and derive the user object via
// useMemo, so we don't trip React's useSyncExternalStore stability contract.

import { useMemo } from "react";

export function useCurrentUser(): User {
  const currentUserId = useApp((s) => s.currentUserId);
  const rolesByUser = useApp((s) => s.rolesByUser);
  return useMemo(() => {
    const base = TEAM.find((u) => u.id === currentUserId) ?? MIRA;
    const role = rolesByUser[base.id] ?? base.role;
    return { ...base, role };
  }, [currentUserId, rolesByUser]);
}

export function useTeam(): User[] {
  const rolesByUser = useApp((s) => s.rolesByUser);
  return useMemo(
    () => TEAM.map((u) => ({ ...u, role: rolesByUser[u.id] ?? u.role })),
    [rolesByUser]
  );
}

export function useUserById(id: string | undefined): User | undefined {
  const rolesByUser = useApp((s) => s.rolesByUser);
  return useMemo(() => {
    if (!id) return undefined;
    const base = TEAM.find((u) => u.id === id);
    if (!base) return undefined;
    return { ...base, role: rolesByUser[base.id] ?? base.role };
  }, [id, rolesByUser]);
}

// Pseudo-live ticker — kicks an observation update every 25–40s.
let tickerInit = false;
export function startStyleDNATicker() {
  if (typeof window === "undefined" || tickerInit) return;
  tickerInit = true;
  const categories: StyleDNARule["category"][] = ["Colors", "Typography", "Layout", "Voice", "Imagery"];
  const tick = () => {
    const next = 25_000 + Math.random() * 15_000; // 25–40s
    setTimeout(() => {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      useApp.getState().bumpRuleByCategory(cat);
      useApp.getState().pushToast({
        message: `New observation added to ${cat}.`,
        tone: "live",
      });
      tick();
    }, next);
  };
  tick();
}
