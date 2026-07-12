# Content Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing (but manually-run) Arahkaii content engine into a scheduled weekday drafting pipeline that opens a review-ready PR each morning, with the human gate kept at PR merge.

**Architecture:** Reuse the existing commands/skills/references unchanged. Add only an orchestration layer: a scheduled cloud agent that runs `/draft-daily` Mon–Fri, and a weekly local `/trend-scan` cadence to refill the queue. No new content logic is written — this is scheduling + validation.

**Tech Stack:** Astro 6 + Git (repo is the CMS), Claude Code commands/skills, Claude Code scheduling (cron/routine), Firecrawl MCP (grounding + image sourcing, API-key based → headless-safe), Ahrefs MCP (trend-scan, local only), GitHub PRs (approval gate), Vercel (preview + prod deploy).

## Global Constraints

- **Nothing reaches `main` without a human-merged PR.** The routine never pushes `main`. (Verbatim: `CLAUDE.md` — "Approval = PR merge".)
- **Cadence:** 5 posts/week, weekdays. Target mix ~60% evergreen / 40% trending.
- **Images:** Firecrawl-sourced, official-site-first; licence confirmed in the PR. No `OPENROUTER_API_KEY` required. Never commit a sourced image without approval + logged licence.
- **Quality gate before a PR opens:** `npm run build` must pass (Zod schema); `arahkaii-editorial-reviewer` must pass (banned phrases, format-template compliance incl. `format:guide` per-entry H3 + halal-status line). A failing draft is **skipped + logged**, never shipped broken.
- **British English.** Em-dashes for parenthetical breaks. Sentence-case headlines.
- **Do not schedule live drafting until:** (a) the stale `drafts/2026-06-22-new-bahru` branch is rebased on `main`, and (b) the pipeline dry-run (Task 1) passes. These are hard preconditions.

---

### Task 1: Pipeline dry-run — prove `/draft-daily` works end-to-end

Validates the whole chain once, manually, before any automation. This is where headless/MCP gaps surface cheaply.

**Files:**
- Modify: `content-calendar.md` (a topic flips `ready → drafted`)
- Modify: `run-log.md` (one appended run line)
- Create: a `drafts/<slug>` branch + PR (produced by the command)

**Interfaces:**
- Consumes: the first `status:ready` topic in `content-calendar.md`; `references/*` (voice, format-templates, seo-fields); Firecrawl MCP.
- Produces: an open PR with schema-valid MDX + sourced-image candidates + a Vercel preview URL; a `run-log.md` entry.

- [ ] **Step 1: Confirm there is a `ready` topic**

Run: `grep -n "status:ready" content-calendar.md | head -1`
Expected: at least one match (e.g. the 2026-06-23 "best brunch singapore" entry).

- [ ] **Step 2: Run the drafter**

Run `/draft-daily` (in this local Claude Code session, full MCP access).
Expected: it grounds via Firecrawl, writes MDX, sources 2–3 image candidates per slot, runs the build, opens a PR on a `drafts/*` branch, flips the topic to `drafted`, appends to `run-log.md`.

- [ ] **Step 3: Acceptance check — the PR is review-ready**

Verify: PR exists (`gh pr list --state open`); CI "Astro, schema, links and semantics" check is green; the PR body surfaces image candidates + source URLs for the human pick; the Vercel preview URL renders the styled post.
Expected: all true. If the build or reviewer failed, the command should have skipped + logged — confirm `run-log.md` shows the skip reason instead of a broken PR.

- [ ] **Step 4: Record the outcome**

Note in `run-log.md` (the command does this) that this was the validation dry-run. Do **not** merge — this PR is a test artefact; close it or leave it for review.

- [ ] **Step 5: Decision gate**

If Step 3 passed → proceed to Task 2. If Firecrawl or the build failed headlessly-relevant checks, capture the exact failure here before automating (it determines whether the cloud agent can run unattended).

---

### Task 2: Schedule the weekday drafter (cloud)

Automate Task 1 on a Mon–Fri cadence via a Claude Code scheduled agent. The drafter needs only Firecrawl (API-key) + git/gh, which run headless.

**Files:**
- Create: `docs/superpowers/plans/notes/schedule-config.md` (record the schedule id, cron expression, and the exact prompt used — so it's documented in-repo even though the routine itself lives in the Claude Code runtime).

**Interfaces:**
- Consumes: the `/draft-daily` command (validated in Task 1).
- Produces: a recurring routine that opens one draft PR each weekday morning.

- [ ] **Step 1: Author the scheduled agent**

Use the Claude Code `schedule` skill (or `CronCreate`) to create a routine:
- Cron: weekday mornings (e.g. `0 7 * * 1-5`, user's local timezone).
- Prompt: `Run /draft-daily. Ground via Firecrawl, open a review-ready PR on a drafts/* branch, do not touch main. If the build or editorial reviewer fails, skip and log the reason in run-log.md instead of opening a PR.`

- [ ] **Step 2: Record the config in-repo**

Write the schedule id, cron, timezone, and prompt into `docs/superpowers/plans/notes/schedule-config.md` so the automation is discoverable in Git.

- [ ] **Step 3: Acceptance check — one real scheduled run**

Trigger the routine once (or wait for the next firing) and confirm it opens a PR headlessly with a green CI check, exactly like the Task 1 dry-run.
Expected: PR opened by the scheduled run; `run-log.md` appended. If Firecrawl is unavailable headless, fall back: keep drafting local (run `/draft-daily` manually each morning) and note that in the config file.

- [ ] **Step 4: Commit the config note**

```bash
git add docs/superpowers/plans/notes/schedule-config.md
git commit -m "docs(pipeline): record weekday drafter schedule config"
```

---

### Task 3: Weekly trend-scan cadence (local) + queue health

Keep the `ready` queue topped up. Ahrefs is local-only by design, and the queue already has ~13 weeks of runway, so this is weekly, not daily.

**Files:**
- Modify: `content-calendar.md` (new `status:proposed` topics appended by trend-scan; human flips chosen ones to `ready`).

**Interfaces:**
- Consumes: Ahrefs MCP, `references/content-strategy.md` (scoring), `references/sources.md`.
- Produces: fresh `status:proposed` topics (score ≥ 60) for the human to promote to `ready`.

- [ ] **Step 1: Establish the weekly local run**

Every Monday, run `/trend-scan` locally (full MCP). It appends scored `status:proposed` topics.

- [ ] **Step 2: Human promotes topics**

Human flips chosen `proposed → ready` in `content-calendar.md` (the drafter only pulls `ready`).

- [ ] **Step 3: Acceptance check — queue never below ~2 weeks**

Run: `grep -c "status:ready" content-calendar.md`
Expected: ≥ 10 (≈2 weeks at 5/week). If lower, run `/trend-scan` and promote more before the drafter drains it.

---

### Task 4: Operational guardrails

Make failures visible and the queue self-monitoring.

**Files:**
- Modify: `run-log.md` (already append-only — this task just verifies it's being written).

- [ ] **Step 1: Verify run-log discipline**

Run: `tail -5 run-log.md`
Expected: one line per drafter run (success or skip), with a reason on skips. If the scheduled agent isn't logging, fix the prompt in Task 2's config to require it.

- [ ] **Step 2: Queue-depletion check (weekly, alongside Task 3)**

Run: `grep -c "status:ready" content-calendar.md`
Expected: ≥ 10. This is the single number that tells you the pipeline won't stall.

- [ ] **Step 3: Notification (optional, low priority)**

Default: GitHub PR notifications tell the human a draft is ready. If more is wanted later, add a ping (out of scope for v1).

---

## Out of scope for v1 (do not build here)

- Social distribution (`/social-distribution` + blotato MCP) → Phase 2.
- AI image generation (OpenRouter) → future flag.
- Newsletter capture (Resend) → after email DNS.
- Auto-merge of any kind → the human gate is the point.
