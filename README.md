# SocialPaint · v2 prototype

> A brand intelligence layer that captures how a company's design team makes
> on-brand content — and lets anyone generate work that looks like the design
> team made it.

This is the **v2 build kickoff** prototype (May 2026). It demonstrates one
polished end-to-end flow: prompt → generate → results → detail → refine →
export → save — with a **live, editable StyleDNA** moat updating quietly
underneath, **asset ingestion** that feeds new observations back in, and an
**admin observability feed** that replaces the old approval workflow.

## What's in the demo

| Surface             | Route                                  | Depth      |
| ------------------- | -------------------------------------- | ---------- |
| Generate (home)     | `/generate`                            | deep       |
| Generating          | `/generate/[generationId]` (status)    | deep       |
| Results             | `/generate/[generationId]`             | deep       |
| Detail              | `/generate/[generationId]/[designId]`  | deep       |
| StyleDNA            | `/styledna`                            | deep       |
| Asset Ingestion     | `/styledna/ingest`                     | deep       |
| Admin Activity      | `/admin-activity` (role-gated)         | deep       |
| Templates           | `/templates`                           | shallow    |
| Insights            | `/insights`                            | shallow    |
| Connectors          | `/connectors`                          | shallow    |
| Settings            | `/settings` (Members → role dropdown)  | shallow    |
| Plans               | `/plans`                               | shallow    |

## The demo flow

1. Land on **/generate** — focused prompt input, sidebar with Mira's identity.
2. Type the Acme demo prompt, hit send.
3. Watch the ~3.5s generation moment: four rotating status lines, no spinners.
4. Scan three options scored 94 / 89 / 78. "Why these?" lists the rules.
5. Open the 94 option → right rail with breakdown, applied rules, refine input.
6. Refine "tighten headline, push more coral" → preview swaps, score 94 → 96.
7. Export → PDF, then Save → it appears in **Previous Masterpieces**.
8. Visit **/styledna/ingest** and paste a Figma link. Accept observations.
9. Rules show up in **/styledna**. Live tick + edit drawer let designers correct.
10. In **/settings → Members**, change Mira from Marketer → Admin. The
    **Admin Activity** nav reveals in real time — every generation, refine,
    export, ingest, and rule edit is logged with score, time, and actor.

## Stack

- **Next.js 14** · App Router · TypeScript
- **Tailwind v4** · design tokens declared in `app/globals.css`
- **Zustand** · single store, persisted to `localStorage`
- **Framer Motion** · drawers + status-line cascade
- **Recharts** · Insights area + bar charts
- **Lucide** · icon set

No backend. No real AI. No auth. All generation is simulated in `lib/generate.ts`;
all asset ingestion is simulated in `lib/analyze-asset.ts`. Seed data lives in
`lib/mock-data.ts` per §7 of the brief.

## Running locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Layout

```
app/                  · App Router pages
components/
  shell/              · Sidebar, AppShell, ToastHost
  generate/           · PromptInput, Generating, Results, Detail, DesignPreview
  styledna/           · RuleCard, EditDrawer
  ui/                 · Button, Badge, Avatar, BrandMark
lib/
  types.ts            · Domain types (per §6 of the brief)
  mock-data.ts        · Seed: workspace, brand, user, 5 rules, 3 options
  store.ts            · Zustand store + stable derived hooks
  generate.ts         · simulateGeneration() · simulateRefine()
  analyze-asset.ts    · simulateAssetAnalysis()
  cn.ts               · cn(), complianceBand(), relativeTime()
```

## Visual direction

Dark, editorial, calm. One coral moment per screen. Generous whitespace.
Live signals stay quiet: a single mint pulse, a soft toast, a dimming
status-line cascade.

| Token             | Value                  |
| ----------------- | ---------------------- |
| Canvas            | `#0A0A0A`              |
| Sidebar           | `#121212`              |
| Card              | `#171717`              |
| Coral accent      | `#ED7472`              |
| Mint (live)       | `#7CE3B5`              |

## What this prototype does **not** do

Per §9 of the brief — auth, billing, real AI, file parsing, multi-brand,
multi-workspace, real integrations, mobile views, and the **approval
workflow** (removed in v2) are all out of scope. Paste-link and uploads are
mocked. Exports are mocked toasts.
