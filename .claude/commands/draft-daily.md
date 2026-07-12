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
Working tree clean? `npm run verify` sane? If not, log to `run-log.md`, notify, exit.

## STEP 1 — Load context (in order)
`references/brand-voice.md` · `editorial-pillars.md` · `halal-substitutions.md` ·
`content-strategy.md` · **`format-templates.md` (MANDATORY skeletons)** ·
`url-database.md` · `seo-fields.md` · `schema-map.md` · `image-system.md`.

## STEP 2 — Pick topic
Read `content-calendar.md`; take the first `status:ready`. If none → notify
"calendar needs ready topics" and exit. Capture: title, angle, keyword, pillar,
type (trending|evergreen), target words, internal-link guidance.

## STEP 3 — Research  (skill: arahkaii-editorial-research)
Prefer ahrefs `keywords-explorer-overview` (volume/difficulty/related) +
`serp-overview` (top-5 angles + gaps), and Firecrawl `scrape` for 3–5 primary or
reference sources. In GitHub Actions those MCPs may be unavailable: fall back to
WebSearch/WebFetch, prioritise official sources and primary reporting, and mark
unavailable keyword metrics as `not verified` in the PR. Never invent volume,
difficulty, rankings, quotations or access dates. Synthesise a 250-word brief:
our angle, the gap, 3–5 anchoring facts, 2–3 cultural references.

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
`run-log.md` and abort the article; do not ask the human to rescue a substandard draft.

## STEP 7 — Images  (skill: arahkaii-featured-image-prompt)
Density per `content-strategy.md` (hero always; per-H2 1/H2 or every-other by
type; listicle = per entry). **Editorial** images → generate
(`node scripts/image-gen.mjs`, OpenRouter/OpenAI). If no image key is available,
use a repository-owned placeholder for the PR preview and label the PR
`image-review-needed` when that label exists; otherwise mark the blocker at the
top of the PR body. It must not be merged until a final approved image exists.
**Listicle/real-entity** → Firecrawl-source 2–3 candidates with source URLs +
licence notes → list them in the PR for the human pick, but do not download or
commit a sourced image before human approval. Modest-luxury + licence gate on
every image; every committed image carries a credit.

## STEP 8 — Write  (skill: arahkaii-publisher)
`node scripts/new-post.mjs …` → MDX in `src/content/posts/<year>/`, hero into
`src/assets/images/<slug>/`. Do **not** pass `--draft`: the feature branch and
human merge are the publishing gate, and the Vercel PR preview must render the
article. Place approved inline images + `<Figure>`s.

## STEP 9 — Validate
`npm run verify`. Fix until clean.

## STEP 10–12 — Calendar · log · PR
Update `content-calendar.md` (`ready → drafted | branch:<name>`). Append
`run-log.md`. Branch `drafts/<date>-<slug>`, commit, push, `gh pr create`
(title · 200-word angle · SEO fields · sourced-image candidates · preview note).

## STEP 13 — Notify
The GitHub PR is the notification and review surface. Include the Vercel
preview, research limitations, image/licence status and any blocking labels.

## NEVER
Push to `main` · publish alcohol/nightlife · ship an uncredited image · skip
validation · continue past a verify failure · publish below the editorial bar.
