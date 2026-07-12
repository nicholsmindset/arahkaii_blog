---
description: Content-strategist run — scan reference sites + Google Trends + ahrefs for trending and evergreen opportunities, score them, and propose a balanced batch into the content calendar for human approval. Feeds /draft-daily.
---

# /trend-scan — the content-discovery engine

Act as Arahkaii's content marketer. Surface what's worth writing — trending news
**and** evergreen gaps — score it, and propose a balanced batch. You only
**propose**; the human flips `proposed → ready`. Weekly deep pass + a light
mid-week sweep (`content-strategy.md` cadence).

## STEP 1 — Load
`references/content-strategy.md` · `sources.md` · `editorial-pillars.md` ·
`halal-substitutions.md` · `url-database.md` (to dedupe vs published).

## STEP 2 — Scrape the watchlist  (skill: arahkaii-content-research)
Firecrawl `scrape`/`map`/`search` the reference sites in `sources.md` — capture
recent headlines + section fronts (the angle they took, what they missed).

## STEP 3 — Trend + gap signal
- Google Trends (Firecrawl scrape) — rising/breakout queries for our pillars in SG/MY/ID/AE.
- ahrefs `keywords-explorer` (matching/related/**questions**), `serp-overview`,
  and competitor `site-explorer` `top-pages` / `organic-keywords` (content gaps).

## STEP 4 — Cluster & classify
Group into topic candidates; tag each `type:trending` (time-sensitive) or
`type:evergreen`. Map to a pillar.

## STEP 5 — Score (rubric in `content-strategy.md`, 0–100)
Search opportunity 30 · brand/guardrail fit 25 (violation = reject) · differentiation 20 ·
authority/internal-link fit 15 · freshness 10. Drop anything that duplicates an
existing post (`url-database.md`) — route true refreshes to `/quarterly-refresh-sweep`.

## STEP 6 — Compose the batch
Take `score ≥ 60`, balanced to ~60/40 evergreen/trending and the pillar shares.
For each: pillar · author (pillar map) · target words · primary keyword · angle ·
2–3 internal-link suggestions · `type` · score · source.

## STEP 7 — Propose
Append entries to `content-calendar.md` as **`status:proposed`** (never `ready`).
Append `run-log.md`. Open a `trends/<date>` branch + `gh pr create` digest
summarising the batch for thumbs-up. The PR is the notification. The human flips chosen
items to `status:ready` (edit the calendar or say so) → they become eligible for
`/draft-daily`.

## NEVER
Propose alcohol/nightlife (substitute via `halal-substitutions.md`) · auto-mark
anything `ready` · duplicate existing coverage.
