# CLAUDE.md — ARAHKAII

Standing rules for working in this repo. The full reasoning lives in
[ARAHKAII-Master-Plan.md](./ARAHKAII-Master-Plan.md); this file is the
distilled, always-on guidance. The HTML/CSS in `design/arahkaii-blog/project/`
(especially `assets/arahkaii.css`) is the **design source of truth**.

## What this is

Arahkaii is a Muslim-owned Asian modern-luxury / modest-luxury publication —
**"Asia's modern-luxury edit — modestly told."** It is an Astro 6 site; posts
are **MDX files in Git, edited through Claude Code — there is no CMS.** Claude
Code _is_ the CMS.

## Brand voice

- **British English.** Em-dashes, not hyphens, for parenthetical breaks.
- Quiet, literary, considered — "The Quiet Authority." A publication that reads
  like a beautifully made book that happens to live on the web.
- **Restraint over decoration.** Whitespace is the brand. Nothing loud or
  flashy. The most luxurious thing the site can do is feel unhurried.
- Sentence case for headlines (never Title Case display).

## Modest-luxury guardrails (positive identity, not just subtraction)

- **No alcohol, bars, nightlife, or spirits** — in copy or imagery.
- **Modest dress** in all imagery (no exposed shoulders/knees).
- Frame as _more restraint, more whitespace, warmer materiality_ — a calmer
  sophistication mass-luxury titles lack. The guardrail applies to **both**
  generated and sourced images.

## The seven categories (this is the schema enum — do not invent others)

`style` · `dining` · `travel` · `culture` · `living` · `people` · `guides`

URLs are `/<category>/<slug>/`. Preserve legacy WordPress slugs via
`legacyWpSlug` for 301s.

## Typography — "serif speaks, sans signposts"

- **Display/headlines:** Fraunces (variable, opsz axis). Literary serif.
- **Body/long-form:** Newsreader. A bookish reading serif — _not_ sans. This is
  a signature; body is never set in sans.
- **UI / eyebrows / captions / bylines / meta:** Inter. Sans only signposts —
  navigation and labels. It never carries editorial content.
- These are the **free placeholder stack**. Licensed registers later: GT Sectra
  / Canela (display), Tiempos / Lyon (body), Söhne / Suisse (sans).
- **Never use Forma DJR** (Tatler's typeface). Avoid Playfair / Didot / Bodoni
  ("wedding invitation", not "literary press").

## Palette (warm uncoated paper — never pure white/black)

| Token        | Hex       | Use                       |
| ------------ | --------- | ------------------------- |
| surface      | `#F6F1E9` | paper background          |
| ink          | `#1C1815` | text                      |
| quiet        | `#EFE8DB` | cards / quiet surfaces    |
| muted        | `#6E6457` | meta                      |
| hairline     | `#E2D9CA` | rules                     |
| accent       | `#4A2C3A` | aubergine — **rare**      |
| clay         | `#B06B4E` | terracotta — **very rare**|

Ratios: surface ≥60%, ink ≥25%, muted ~8%, accent <2%, highlight <1%.
Tokens live in `src/styles/tokens.css`; primitives in `src/styles/global.css`.

## Structural signatures

- Standfirst set as an italic display-serif epigraph (`<Standfirst>`).
- Pull quotes as **marginalia** in the wide margin beside the column on desktop
  (`<PullQuote>`) — not breaking the column.
- **One** drop cap, at the article open only (`<DropCap>`).
- Chapter-like section breaks: generous space + small centred numeral/ornament.
- Photography filter `contrast(1.02) saturate(0.96)`; ratios only 16:9 hero,
  3:2 inline, 4:5 portrait, 1:1 carousel. Captions always below in sans micro.
- Motion is felt, not noticed: ~400ms cross-fades, blur-up on scroll, hairline
  reading-progress bar, hover states that settle slowly.

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
- **Run `npm run build` before pushing** — the Zod schema fails the build on
  missing captions/credits or a bad category, so a green build is the gate.
- Don't auto-commit; commit when asked.
- Reuse the ported design system (`global.css` / `tokens.css` / `article.css`)
  and the article components in `src/components/article/` — match the prototype,
  don't reinvent it.

## Project layout

```
src/
  content.config.ts          # Zod schema (posts + authors)
  content/posts/2026/*.mdx    # articles
  content/authors/*.md        # author profiles
  components/article/         # Headline · Standfirst · Byline · DropCap · PullQuote · Figure
  layouts/                    # BaseLayout (nav/footer/progress) · ArticleLayout
  pages/[category]/[...slug].astro
  styles/                     # tokens.css · global.css · article.css
scripts/                      # publish automation — NOT built yet
```

## Not yet built (deferred, in priority order)

Homepage + home components (Hero/EditLane/Spotlight), category index pages,
search/save/reading-list JS, RSS feed wiring, the `scripts/` publish automation
(OpenRouter / Firecrawl / Cloudflare R2 / MailerLite), and the WordPress import
of the remaining ~30 posts.
