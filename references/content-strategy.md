# Content strategy — the playbook

The built-in content marketer. `/trend-scan` and `/draft-daily` load this to make
expert calls so the human only approves. Tunable — change the numbers here.

## Cadence & mix
- **~5 posts/week.** Target mix **~60% evergreen / 40% trending** over any rolling fortnight.
- **Trend scan:** weekly deep pass (Mon) + one light mid-week sweep (Thu) for fast-moving news.
- **Pillar share** (rolling, from `editorial-pillars.md`): Style 25% · Dining 20% · Beauty 15% · Travel 15% · People 8% · Living 7% · Culture 7% · Guides 3%. Don't starve a pillar for >2 weeks.

## Trending vs evergreen
- **Trending** = time-sensitive: fashion-week results, new launches/openings, a cultural moment, seasonal (Eid/Ramadan/Mother's Day/CNY). Publish within days; decays.
- **Evergreen** = service + reference: "best halal fine dining SG", ingredient explainers, city guides, founder profiles. Compounds; refresh quarterly (see `/quarterly-refresh-sweep`).
- Each calendar entry is tagged `type:trending|evergreen`.

## Topic scoring (rank candidates 0–100)
- **Search opportunity 30** — ahrefs volume ÷ difficulty; questions/“striking-distance” bonus.
- **Brand & guardrail fit 25** — on a pillar, modest-luxury, passes `halal-substitutions.md`. A guardrail violation = auto-reject, not a low score.
- **Differentiation 20** — can we out-angle the top-5 SERP / the reference sites? (gap from `/trend-scan` step 3).
- **Authority/internal-link fit 15** — strengthens a cluster; links to/from existing posts (`url-database.md`).
- **Freshness/timeliness 10** — higher for trending with a clear window.
- **Novelty gate** — if it duplicates an existing post, drop or route to `/quarterly-refresh-sweep` instead.

Only `score ≥ 60` becomes `status:proposed`; the human flips `proposed → ready`.

## Target length by type
- Listicle/guide: 1,400–2,200w · Feature/profile: 1,200–1,800w · Explainer: 1,000–1,500w · Culture/analysis: 1,000–1,400w.

## Image density (per-H2) — for `/draft-daily`
- **Hero:** always (generate for editorial; Firecrawl-source for listicles/real entities).
- **Listicle/guide:** one image per entry.
- **Long feature (>1,500w) or visual pillar (Style/Beauty/Travel/Dining/Living):** ~**1 image per H2**.
- **Standard/analysis (Culture, business, shorter pieces):** **every other H2**.
- Minimum 2 inline images; cap ~1 per 250–300 words. All pass the modest-luxury image rules + licence gate; sourced ones surface in the PR for the human pick.

## Hard rules
- Zero alcohol/nightlife — substitute via `halal-substitutions.md`.
- `halalStatus:` recorded in frontmatter for every Dining/Travel/Guides piece (internal QA record; never foregrounded as on-page brand copy).
- Never publish below the editorial bar — skip the day and notify instead.
- Nothing reaches `main` without a human-merged PR.
