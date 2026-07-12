# CLAUDE.md — ARAHKAII

Standing rules for working in this repo. The full reasoning lives in
[ARAHKAII-Master-Plan.md](./ARAHKAII-Master-Plan.md); this file is the
distilled, always-on guidance.

**Design system (v2, June 2026):** the live design is the bright-white,
single-emerald-accent, Didone-display "arahkaii-blog-v2" system. The source of
truth is the ported CSS in `src/styles/` (`tokens.css` · `global.css` ·
`pages.css` · `article.css`) — these mirror the v2 prototype bundle. The earlier
warm-paper / aubergine / Fraunces look ("The Quiet Authority") has been retired.

## What this is

Arahkaii is a Muslim-owned Asian modern-luxury / modest-luxury publication —
**"Asia's modern-luxury edit — modestly told."** It is an Astro 6 site; posts
are Markdown/MDX files in Git. Keystatic provides the non-technical editor at
`/keystatic`; Claude Code and the publishing commands remain the automation
layer. Both routes preserve Git review and human approval.

## Brand voice

- **British English.** Em-dashes, not hyphens, for parenthetical breaks.
- Quiet, literary, considered. A bright-white, Tatler-grade editorial that aims
  to read as more disciplined and engaging than mass-luxury titles.
- **Restraint over decoration.** Whitespace is the brand. No filled buttons, no
  drop shadows, no gradients — all CTAs are emerald-underlined text links. The
  most luxurious thing the site can do is feel unhurried.
- Sentence case for headlines (never Title Case display).

## Modest-luxury guardrails (positive identity, not just subtraction)

- **No alcohol, bars, nightlife, or spirits** — in copy or imagery.
- **Modest dress** in all imagery (no exposed shoulders/knees).
- Frame as _more restraint, more whitespace, warmer materiality_ — a calmer
  sophistication mass-luxury titles lack. The guardrail applies to **both**
  generated and sourced images.

## The eight categories (this is the schema enum — do not invent others)

`style` · `beauty` · `dining` · `travel` · `culture` · `living` · `people` ·
`guides`

The masthead stays deliberately concise (six categories plus **"The Majlis"**
→ `/franchises/the-majlis/`); the full eight-category taxonomy lives in the
overlay menu and footer, alongside **"Latest stories"** (→ `/latest`). URLs are
`/<category>/<slug>/`. Preserve legacy WordPress slugs via `legacyWpSlug` for
301s.

## Typography — "Didone speaks, sans signposts" (one display + one serif + one sans)

- **Display/headlines/masthead:** **Bodoni Moda** (variable, opsz). A modern
  Didone with high contrast — the v2 signature. (Supersedes the old "avoid
  Bodoni" rule; still avoid Playfair / Didot / Forma DJR.)
- **Body/long-form:** **Source Serif 4**. An editorial reading serif — _not_
  sans. Body is never set in sans.
- **UI / eyebrows / captions / bylines / meta:** **Inter**. Sans only signposts.
- All three are self-hosted via `@fontsource-variable/*`. Licensed registers
  later: GT Sectra / Canela (display), Tiempos / Lyon (body), Söhne (sans).
- One serif + one Didone + one sans — never introduce a fourth family.

## Palette (Tatler-bright white — never cream/off-white; single emerald accent)

| Token        | Hex       | Use                                   |
| ------------ | --------- | ------------------------------------- |
| bg           | `#FFFFFF` | the canvas, everywhere                |
| ink          | `#111111` | text                                  |
| ink-2        | `#5A5A5A` | deks, metadata, captions              |
| hairline     | `#E6E2DC` | rules                                 |
| emerald      | `#0F3D33` | cool UI-signpost accent — eyebrows, focus, footer top edge |
| accent2      | `#4A2D3A` | warm editorial accent (aubergine) — footer, drop cap, pull-quote rule, section ✦, headline/link hover |
| bone         | `#F6F1EA` | warm-bone tint card — max ~twice/page |
| footer-bg    | `#4A2D3A` | the one rich aubergine section        |

Two accents only, with a clear division of labour: **emerald** = cool UI
signposts (small eyebrows, focus rings, footer top hairline, chips); **aubergine
`#4A2D3A`** = warm editorial moments (footer field, drop cap, pull-quote rule,
section ✦, headline/link hover). No per-pillar colours. Tokens live
in `src/styles/tokens.css` (v1 token names are aliased there for back-compat);
primitives + chrome in `src/styles/global.css`.

## Structural signatures

- Article hero is **centred, no-image by default** (T-Magazine pattern): emerald
  eyebrow, Bodoni headline, italic dek, hairline byline row, lead image below.
- Standfirst set as an italic display-serif epigraph (`<Standfirst>`).
- Pull quotes as a **full-column breakout with a 2px emerald left rule**
  (`<PullQuote>`), italic Didone — max two per article.
- **One** drop cap, at the article open only (`<DropCap>`), in ink (not emerald).
- Section breaks: centred emerald **✦**, generous padding above/below.
- The homepage runs **twelve distinct modules** in a deliberate cadence — no two
  consecutive modules share a grid signature, image ratio or rhythm.
- Image ratios vary per module: 3:2, 4:5, 16:9, 1:1, 5:7, 3:4. Natural colour,
  no heavy filters. Captions below in italic serif micro.
- Motion is felt, not noticed: `cubic-bezier(.22,1,.36,1)`, scroll reveals
  (once, staggered, `prefers-reduced-motion`-aware), 1.02× image hover, emerald
  underline-from-left on links, Vogue-style hide/show sticky bar.

## Image pipeline (deferred — automation not yet built)

Two sources, **one human gate**:

- **Generate** via OpenRouter (conceptual/editorial/mood). **Source** via
  Firecrawl (real named entities — listicles).
- **Official site first** when sourcing; GMB photos are leads, not sources.
- **Never commit a sourced image without approval _and_ a logged licence
  decision.** When rights are unclear → **generate instead.**
- `<Figure>` requires `credit` (and the schema requires `heroCaption` /
  `heroCredit`) — the build fails on uncredited images, by design.

## Conventions

- **Conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`…).
- **Run `npm run verify` before opening or merging a PR** — it covers Astro
  diagnostics, the production build, JSON-LD, internal links, and page semantics.
- Don't auto-commit; commit when asked.
- Reuse the ported design system (`global.css` / `tokens.css` / `article.css`)
  and the article components in `src/components/article/` — match the prototype,
  don't reinvent it.

## Content engine (daily editorial automation)

Ported from `arahkaii-editorial` (WordPress) and re-pointed at this Astro/Git
pipeline. The brains are in `references/` — load them before generating content:
`brand-voice.md` (canonical voice + 8 pillar variants + banned phrases + AI-slop
checklist), `editorial-pillars.md`, `halal-substitutions.md`, `image-system.md`,
`content-strategy.md` (cadence/mix/scoring/image-density), `sources.md` (trend
watchlist), `seo-fields.md` (RankMath→our schema), `schema-map.md`,
`category-tag-map.md`, `url-database.md` (generated by `scripts/url-index.mjs`).

**Skills** (`.claude/skills/arahkaii-*`): editorial-writer, editorial-research,
editorial-reviewer, seo-optimizer, internal-linking, featured-image-prompt,
content-research, content-auditor, publisher (Astro). **Commands**
(`.claude/commands/`): `/trend-scan` (discover topics → calendar), `/draft-daily`
(draft one ready topic → PR), `/approve` (merge PR → live), plus weekly/monthly/
quarterly reviews, thin-content-rescue, social-distribution. Queue lives in
`content-calendar.md`; runs logged to `run-log.md`. **Approval = PR merge** —
the routine never pushes `main`.

GitHub Actions enforce the same boundary: `.github/workflows/quality.yml` runs
the release gate on PRs, while `.github/workflows/editorial.yml` schedules
guarded weekday drafts and exposes manual `draft-daily` / `trend-scan` runs.
Automation may create a branch and PR only; a human code-owner merge is the sole
publishing action.

## Publishing — `/publish`

Claude Code is the CMS. Run **`/publish`** (`.claude/commands/publish.md`) to
turn a finished draft into a live post: write the MDX, source/generate images
behind the **human review gate**, validate, commit. Helper scripts:

- `scripts/new-post.mjs` — writes a schema-valid post + places the hero into
  `src/assets/images/<slug>/` (local-first). Refuses without a `--hero-credit`.
- `scripts/image-prompt.mjs` — the editorial prompt base (modest-luxury, 4200K).
- `scripts/image-gen.mjs` — OpenRouter generation (key-gated; sourcing via the
  Firecrawl MCP works without a key).

Image rules unchanged: official site first; **never commit a sourced image
without approval + a logged licence**; generate when rights are unclear.

## Project layout

```
src/
  content.config.ts          # Zod schema (posts + authors)
  content/posts/2026/*.md     # articles (.mdx also supported when a body needs components)
  content/authors/*.md        # author profiles
  components/article/         # Headline · Standfirst · Byline · DropCap · PullQuote · Figure
  layouts/                    # BaseLayout (nav/footer/progress) · ArticleLayout
  pages/[category]/[...slug].astro
  styles/                     # tokens.css · global.css · article.css
scripts/                      # new-post.mjs · image-prompt.mjs · image-gen.mjs · migrate-wp.mjs
.claude/commands/publish.md   # the /publish runbook
```

## Not yet wired (deferred)

- **AI image generation** — `scripts/image-gen.mjs` ready; needs
  `OPENROUTER_API_KEY` in `.env` (sourcing via Firecrawl works now).
- **Cloudflare R2** — local-first today; migrate when volume justifies it.
- **MailerLite digest automation** — capture is wired through `/api/subscribe`
  and requires `MAILERLITE_API_KEY` in Vercel; the RSS digest remains deferred.
- **Content** — replacement images for the two placeholder drafts and completion
  of the remaining hidden drafts.
- **301 redirects** are generated from `legacyWpSlug` via `astro.config.mjs`
  (`legacyRedirects()`) and served by the Vercel adapter — there is no `netlify.toml`.
