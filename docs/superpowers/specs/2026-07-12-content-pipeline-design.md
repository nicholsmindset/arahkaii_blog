# Content pipeline — design spec

**Date:** 2026-07-12 · **Status:** approved (brainstorm) · **Owner:** Robert Nichols

## Purpose

Operationalise and schedule the content engine that **already exists** in this
repo (commands, skills, references, a loaded 90-day queue). This is not a
rebuild — it is deciding how the machine is run day-to-day, with the human gate
kept exactly where brand risk lives: at PR merge.

## Decisions locked (from brainstorm)

| Decision | Choice |
| --- | --- |
| Approval model | **Scheduled draft → human approves.** Nothing reaches `main` without a human-merged PR. |
| Cadence | **5 posts/week, weekdays.** Matches `references/content-strategy.md`. |
| Images | **Firecrawl-sourced, picked in the PR.** Official-site-first; licence confirmed at review. No `OPENROUTER_API_KEY` needed. |
| Where it runs | **Daily drafter = Claude Code scheduled cloud agent** (Firecrawl is API-key based → works headless). **Weekly trend-scan = local** (Ahrefs dependency; queue has ~13 weeks runway so daily headless Ahrefs is not required). |

## Flow

```
WEEKLY (local, Mon)          DAILY (cloud, Mon–Fri)             HUMAN (async)            AUTO
/trend-scan                  /draft-daily                       review PR:               merge →
 → Ahrefs research            → next status:ready                • Vercel preview          Vercel
 → append status:proposed     → Firecrawl grounds facts          • read draft              deploys
 → HUMAN flips → ready         → write schema-valid MDX           • pick sourced image      → live
                              → Firecrawl sources 2–3 img/slot   • confirm licence
                              → npm run build (gate)             → merge = publish
                              → open PR (drafts/* branch)
                              → mark drafted, log run
```

## Components (reuse — do not reinvent)

- **Commands:** `/trend-scan`, `/draft-daily`, `/approve`, plus weekly/monthly/
  quarterly review commands (`.claude/commands/`).
- **Skills:** `arahkaii-editorial-writer`, `-editorial-research`,
  `-editorial-reviewer`, `-seo-optimizer`, `-internal-linking`,
  `-featured-image-prompt`, `-content-research`, `-content-auditor`,
  `-publisher`.
- **References (loaded before generation):** `brand-voice.md`,
  `content-strategy.md`, `format-templates.md`, `editorial-pillars.md`,
  `halal-substitutions.md`, `seo-fields.md`, `keyword-research-2026-h2.md`,
  `url-database.md`.
- **State:** `content-calendar.md` (queue), `run-log.md` (append-only run log).

## Human gate & preview

- Approval **is** the PR merge (`CLAUDE.md` rule). The routine never pushes
  `main`.
- Every PR carries a **Vercel preview URL** → the human reviews the fully-styled
  post, not raw MDX. Sourced images + licences are confirmed in the PR.

## Editorial balance (enforced by the drafter, from `content-strategy.md`)

- ~60% evergreen / 40% trending over any rolling fortnight.
- Pillar shares: Style 25 · Dining 20 · Beauty 15 · Travel 15 · People 8 ·
  Living 7 · Culture 7 · Guides 3. Never starve a pillar >2 weeks.
- Only `score ≥ 60` topics are eligible; guardrail violations auto-reject.

## Quality gates (a draft that fails is skipped + logged, never shipped broken)

1. `npm run build` — Zod schema fails on missing captions/credits, bad category.
2. `arahkaii-editorial-reviewer` — banned-phrase scan, **format-template
   compliance** (esp. `format:guide` per-entry H3 + halal-status line),
   AI-slop checklist.
3. `arahkaii-internal-linking` — cluster/link coverage.

## Go-live sequencing

- Drafting can start immediately — PRs are reviewable via preview regardless of
  the DNS cutover. Merges deploy to production. Human's choice whether to merge
  immediately or stack approved PRs until the domain is fully live.

## Out of scope for v1 (noted, not built)

- **Social distribution** (`/social-distribution` + blotato MCP) → Phase 2.
- **AI image generation** (OpenRouter) → future flag once the key is added.
- **Newsletter capture** (Resend) → after email DNS is configured.

## Rollout (de-risked)

1. **Manual dry-run first** — run `/draft-daily` once end-to-end; confirm PR +
   preview + image candidates + green build all work in practice.
2. **Schedule** the weekday cloud agent (drafter).
3. **Weekly** run `/trend-scan` locally to top up the queue.
4. Review commands (`/weekly-performance-review`, `/monthly-seo-audit`,
   `/monthly-ai-citations`, `/quarterly-refresh-sweep`) stay on-demand.

## Risks / open items

- **Headless MCP availability** — validated by the dry-run before scheduling.
  Firecrawl (key) expected to work; Ahrefs kept local by design.
- **Queue depletion** — ~64 posts loaded through 2026-09-18 (~13 weeks at
  5/week). Trend-scan refills weekly; monitor so it never empties.
- **Notification** — default GitHub PR notifications; optional ping later.

## Success metrics

- ≥5 merged posts/week sustained, zero broken builds reaching `main`.
- Editorial bar held (reviewer pass rate, no banned phrases, format compliance).
- Queue never drops below ~2 weeks of `ready` topics.
