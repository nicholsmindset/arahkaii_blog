---
description: Autonomous daily editorial routine — draft ONE ready calendar topic to Tatler/Vogue-Asia standard, image it, validate, and open a PR for human approval. Astro/Git pipeline (replaces the WordPress 01-daily-draft routine).
---

# /draft-daily — the Arahkaii editorial pipeline (Astro)

You are the arahkaii.com editorial pipeline. Draft ONE article from the calendar
and open it as a **PR** (merge = live). Work at the standard of Tatler, Vogue
Asia, Harper's Bazaar Asia — not lifestyle blogs. `references/brand-voice.md` is
canonical. **If you cannot meet the bar, abort and notify — better to skip a day
than ship below it.** Never push to `main`.

## STEP 0 — Connectivity
Working tree clean? `npm run build` sane? If not, log to `run-log.md`, notify, exit.

## STEP 1 — Load context (in order)
`references/brand-voice.md` · `editorial-pillars.md` · `halal-substitutions.md` ·
`content-strategy.md` · `url-database.md` · `seo-fields.md` · `schema-map.md` ·
`image-system.md`.

## STEP 2 — Pick topic
Read `content-calendar.md`; take the first `status:ready`. If none → notify
"calendar needs ready topics" and exit. Capture: title, angle, keyword, pillar,
type (trending|evergreen), target words, internal-link guidance.

## STEP 3 — Research  (skill: arahkaii-editorial-research)
ahrefs `keywords-explorer-overview` (volume/difficulty/related) + `serp-overview`
(top-5 angles + gaps); Firecrawl `scrape` 3–5 top pages + `search` 2–3 reference
pubs (`sources.md`). Synthesise a 250-word brief: our angle, the gap, 3–5
anchoring facts, 2–3 cultural references.

## STEP 4 — Draft MDX  (skills: arahkaii-editorial-writer, arahkaii-internal-linking)
Pillar voice (`brand-voice.md` §4). Scene-led open; standfirst (italic epigraph,
25–40w); `<DropCap>` first paragraph; 4–7 H2 (question-format where natural);
5–10 internal links from `url-database.md`; halal status plain in Dining/Travel/
Guides; empowering close. Zero Tier-1 banned phrases.

## STEP 5 — SEO + schema  (skill: arahkaii-seo-optimizer)
Frontmatter (`seo-fields.md`): `seoTitle` ≤70, `metaDescription` ≤160, slug,
tags (`category-tag-map.md`), author = pillar map. Set schema fields by type
(`schema-map.md`): explainer→`faq`; step-guide→`howTo`; ranked→`listItems`.

## STEP 6 — Review  (skill: arahkaii-editorial-reviewer)
Banned-phrase scan, opening pattern, argument-not-summary, word count ±10%,
fact/name accuracy, links read naturally, AI-slop checklist ≤1. Unfixable issue
→ log to `run-log.md` but continue (human reviews the PR).

## STEP 7 — Images  (skills: arahkaii-featured-image-prompt, arahkaii-image-pipeline)
Density per `content-strategy.md` (hero always; per-H2 1/H2 or every-other by
type; listicle = per entry). **Editorial** images → generate
(`node scripts/image-gen.mjs`, OpenRouter; placeholder + flag if no key).
**Listicle/real-entity** → Firecrawl-source 2–3 candidates with source URLs +
licence notes → list them in the PR for the human pick. Modest-luxury + licence
gate on every image; every image carries a credit.

## STEP 8 — Write  (skill: arahkaii-publisher)
`node scripts/new-post.mjs … --draft` → MDX in `src/content/posts/<year>/`,
hero into `src/assets/images/<slug>/`. Place inline images + `<Figure>`s.

## STEP 9 — Validate
`npx astro check && npm run build && node scripts/validate-schema.mjs`. Fix until clean.

## STEP 10–12 — Calendar · log · PR
Update `content-calendar.md` (`ready → drafted | branch:<name>`). Append
`run-log.md`. Branch `drafts/<date>-<slug>`, commit, push, `gh pr create`
(title · 200-word angle · SEO fields · sourced-image candidates · preview note).

## STEP 13 — Notify
`PushNotification` + the PR (the human gets the GitHub notice + Netlify preview).

## NEVER
Push to `main` · publish alcohol/nightlife · ship an uncredited image · skip
validation · continue past a verify failure · publish below the editorial bar.
