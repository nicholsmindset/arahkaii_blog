# SEO fields — Astro mapping (replaces RankMath)

The old WordPress pipeline wrote `rank_math_*` meta. On Astro, SEO lives in
**post frontmatter** (validated by `src/content.config.ts`) and is rendered by
`src/components/Seo.astro` + `src/lib/seo.ts`. No plugin, no meta keys.

## Field map

| Old RankMath key | Astro frontmatter / source | Rule |
|---|---|---|
| `rank_math_title` | `seoTitle` | ≤70 chars. If omitted, `<title>` = `"<title> — Arahkaii"`. Lead with the primary keyword, phrased naturally. |
| `rank_math_description` | `metaDescription` | ≤160 chars, soft pull (not a CTA). If omitted, falls back to `standfirst`. |
| `rank_math_focus_keyword` | (not stored) | Used during research/writing for on-page placement; not a rendered field. |
| `post_name` / slug | file name `…/<slug>.mdx` | 3–5 words, lowercase, hyphenated, keyword-first, no stop words. URL = `/<category>/<slug>/`. |
| `post_excerpt` | `standfirst` (and optional `excerpt`) | The standfirst is the public dek; `excerpt` is an optional 50–75-word search/OG hook. |
| `rank_math_robots` | `noindex` (bool) | `noindex: true` → `<meta name="robots" content="noindex,follow">`. Default index,follow. |
| `rank_math_advanced_robots` | automatic | `max-image-preview:large` etc. handled in `Seo.astro`. |
| `rank_math_schema_BlogPosting` | **automatic** | `articleSchema()` emits Article JSON-LD from frontmatter — never hand-write it. |
| `rank_math_rich_snippet` | driven by content type | FAQ/HowTo/ItemList via the fields below. |
| canonical | automatic | `<link rel="canonical">` from the route in `Seo.astro`. |
| OG / Twitter | automatic | Built from title/description/hero in `BaseLayout` + `Seo.astro`. |

## Structured-data frontmatter (drives JSON-LD — see `schema-map.md`)
- `faq: [{ q, a }]` → **FAQPage** (explainers/guides with genuine question intent).
- `howToName` + `howTo: [{ name, text }]` → **HowTo** (step guides).
- `listName` + `listItems: [string]` → **ItemList** (ranked/numbered listicles).
- Article + Person(author) + BreadcrumbList + Organization + WebSite are always automatic.

## Title/description craft (unchanged from RankMath discipline)
- Title in the pillar voice (see `brand-voice.md` §4); never keyword-stuffed.
- Description: one sentence of pull, concrete, on-voice; no "Discover…", no "In this article".
- Run the keyword through `halal-substitutions.md` first — never optimise for alcohol/nightlife terms.

## Validation
`npm run build` enforces lengths (`seoTitle` ≤70, `metaDescription` ≤160) via the Zod schema; `node scripts/validate-schema.mjs` checks the emitted JSON-LD.
