# Schema map — what JSON-LD each page emits

All JSON-LD is generated from data by `src/lib/seo.ts` + `Seo.astro`. Never
hand-write `<script type="application/ld+json">` in a post body — set frontmatter
fields and the right schema emits automatically. Validate with
`node scripts/validate-schema.mjs` (run after `npm run build`).

## Always-on (every page)
- **Organization** (+ logo ImageObject, `sameAs`) and **WebSite** — from `SITE` in `lib/seo.ts`.

## Per page type
| Page | Schema emitted | Driven by |
|---|---|---|
| Article (`/<cat>/<slug>/`) | **Article** (Person author, ImageObject hero, articleSection, publisher) + **BreadcrumbList** | frontmatter (auto via `ArticleLayout`) |
| Article — explainer | **+ FAQPage** | `faq: [{ q, a }]` |
| Article — step guide | **+ HowTo** | `howToName` + `howTo: [{ name, text }]` |
| Article — ranked listicle | **+ ItemList** | `listName` + `listItems: [string]` |
| Author (`/authors/<id>/`) | **Person** (jobTitle, description, image, worksFor → Org) + BreadcrumbList | author collection |
| Category / Contributors / Latest | **CollectionPage** | page route |
| Home / About / Contact | Organization + WebSite (WebPage optional) | default |

## Content-type → fields (the routine sets these)
- **Explainer / "what is X" / question intent** → add `faq` (3–6 Q&As pulled from the piece).
- **"How to …" / step-by-step** → add `howToName` + `howTo`.
- **"N best …" / ranked** → add `listName` + `listItems` (the ordered names).
- A post may carry more than one (e.g., a guide with both a list and an FAQ).

## Open items
- `SITE.sameAs` (Organization) + per-author `sameAs` are empty until real social URLs are supplied.
- Add `SearchAction` to WebSite once on-site search ships.
