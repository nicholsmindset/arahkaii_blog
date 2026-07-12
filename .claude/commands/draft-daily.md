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
`content-strategy.md` · **`format-templates.md` (MANDATORY skeletons)** ·
`url-database.md` · `seo-fields.md` · `schema-map.md` · `image-system.md`.

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
**Follow the skeleton for the calendar entry's `format:` — `references/format-templates.md`
is a HARD RULE (brand protection).** In particular: **`format:guide`** ⇒ every item
(shop / restaurant / hotel / label) is its own named `###` (H3) under thematic `##`
groups, with a **halal-status line inside each F&B entry** — never bold-lead
paragraphs. `format:explainer` ⇒ question-led `##` H2s + a `faq:` block.
pillar/feature/profile/essay ⇒ thematic prose H2s.

Then: pillar voice (`brand-voice.md` §4). Scene-led open (2–3 paras, no heading);
standfirst (italic epigraph, 25–40w); one H1 only (the title — never an H1 in body);
headings name things (entity/answer, never "The Experience"); question-format `##`
for AI-Overview (⊛) topics + a standalone answer sentence; 5–10 internal links from
`url-database.md` (category-prefixed); halal status plain in Dining/Travel/Guides;
empowering close. Zero Tier-1 banned phrases.

## STEP 5 — SEO + schema  (skill: arahkaii-seo-optimizer)
Frontmatter (`seo-fields.md`): `seoTitle` ≤70, `metaDescription` ≤160, slug,
tags (`category-tag-map.md`), author = pillar map. Set schema fields by type
(`schema-map.md`): explainer→`faq`; step-guide→`howTo`; ranked→`listItems`.

## STEP 6 — Review  (skill: arahkaii-editorial-reviewer)
Banned-phrase scan, opening pattern, argument-not-summary, word count ±10%,
fact/name accuracy, links read naturally, AI-slop checklist ≤1, **plus the
`format-templates.md` reviewer gate** — `format:guide` items must be named `###`
headings (not bold paragraphs), every F&B guide entry must carry a halal-status
line, no body H1, no orphan H3, no vague headings. Unfixable issue → log to
`run-log.md` but continue (human reviews the PR).

## STEP 7 — Write  (skill: arahkaii-publisher)
`node scripts/new-post.mjs … --draft` → MDX in `src/content/posts/<year>/`,
hero into `src/assets/images/<slug>/`. (For the first pass use a placeholder hero;
STEP 8 regenerates it.)

## STEP 8 — Images  (command: /illustrate · skill: arahkaii-featured-image-prompt)
**Editorial / conceptual** pieces → one pass auto-illustrates hero + per-H2:
```bash
node scripts/illustrate-post.mjs --post <slug> --hero --sections <list> \
  --subjects "0=<hero>;2=<sec>;…"     # concrete subjects in template voice
```
Density per `content-strategy.md` (`--density per-h2|every-other`); skip non-visual
H2s via `--sections`. Generates → injects `<Figure>`s → flips `.md→.mdx`. If no key,
it flags and leaves placeholders. **Listicle / real-entity** (named products/places)
→ Firecrawl-source 2–3 candidates with source URLs + licence notes → list in the PR
for the human pick instead. Modest-luxury + credit on every image (generated = "Arahkaii").

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
