# Arahkaii Design Overhaul & CMS Plan

## Decision summary

**Approved direction: Concept B — The Modern Majlis.** Redesign the homepage
around **higher editorial density, clearer prioritisation,
and fewer oversized pauses** while preserving Arahkaii's quieter Muslim Asian
luxury identity. Use Tatler Asia as a benchmark for information density—not as
a visual template.

Adopt **Keystatic in GitHub mode** as the first CMS. It can manage the existing
Astro content inside the repository, supports Astro and MDX fields, and keeps
Git branches, previews, validation, and human PR approval intact. Do not build a
Convex CMS now: Convex supplies database, functions, file storage, and auth
primitives, but the editorial UI, permissions, media workflow, preview system,
SEO forms, revision history, and publishing controls would still need to be
built and maintained.

## What the audit found

At a 1280×720 viewport, the current Arahkaii homepage renders roughly 12,523px
tall with 22 images and 93 links. Tatler Asia renders roughly 10,690px with 76
images and 237 links. Arahkaii therefore asks readers to scroll farther while
showing substantially fewer choices. The first four Arahkaii modules alone use
about 4,500px of vertical space.

The redesign should target:

- 7–9 homepage modules instead of 12.
- 28–40 visible story entry points.
- 24–48px section spacing, with one or two 72–96px pauses for emphasis.
- A compact masthead, a clear lead story, and secondary stories visible in the
  first viewport.
- Stable server-rendered headings, links, image dimensions, metadata, and
  structured data; visual density must not depend on client JavaScript.

## Concept A — The Editorial Grid

A crisp, high-density daily publication. White canvas, Bodoni masthead, black
type, emerald rules, and tightly disciplined image crops.

1. Compact masthead and single-line category navigation.
2. Lead grid: dominant 7-column cover story plus three stacked secondary
   stories and a small “Today’s edit” list.
3. Four-item latest strip visible immediately below the fold.
4. Category bands using one lead + three compact cards.
5. Mid-page “Arahkaii 10” ranked module and one restrained newsletter band.
6. Mobile order follows editorial priority, not desktop column position.

Best for: search discovery, returning readers, news cadence, and maximum story
visibility. Risk: it can feel generic unless photography and Muslim-luxury
franchises are distinctive.

## Concept B — The Modern Majlis

A more ownable Arahkaii system: a dense modular salon built around deep emerald,
aubergine, bone, and white. It feels gathered and hospitable rather than purely
news-led.

1. Compact masthead followed by a three-image editorial triptych.
2. “The Friday Edit” rail combining a lead essay, five briefs, and a verified
   halal/prayer-aware service note.
3. Interlocking Style, Dining, Travel, Beauty, and People tiles with varied
   but controlled ratios.
4. Signature service modules: “Halal status checked”, “Prayer-aware stay”,
   “Modest wardrobe”, and “People shaping Asia”.
5. A dark Majlis reading room for long-form essays and newsletter conversion.

Best for: differentiation, brand memory, membership, and a clearly Muslim Asian
luxury position. Risk: requires stronger art direction and consistent service
metadata.

## SEO and user-experience rules

- Exactly one visible H1; every major module uses a descriptive H2.
- Use Source Serif 4 for all editorial headlines, including homepage features,
  article H1s, and section titles. Reserve Bodoni Moda for the ARAHKAII wordmark
  and very short brand marks; the high-contrast Didone becomes difficult to read
  across long, multi-line headlines on mobile.
- Story titles remain real anchor text; do not make entire oversized regions the
  only clickable target.
- Preserve category-first URLs, canonicals, schema, legacy redirects, and
  static HTML.
- Keep homepage story excerpts short; place full editorial depth on article
  pages to avoid duplicate intent.
- Prioritise the lead image, lazy-load everything below it, and use fixed image
  dimensions to protect Core Web Vitals.
- Add visible author/date information to high-priority cards and verified dates
  to halal/service guidance.
- Maintain keyboard focus, 44px mobile controls, logical reading order, and
  reduced-motion support.

## CMS recommendation

### Recommended now: Keystatic + GitHub mode

- Maps to the current repository and can save content through GitHub.
- Keeps MDX/content files, Netlify previews, GitHub automation, and rollbacks.
- Provides structured forms for SEO, category, author, dates, images, credits,
  FAQ, HowTo, and ItemList data.
- Use a `cms/` branch prefix and require the existing Quality Gates plus human
  review before merge.

Implementation caveat: configure Keystatic's MDX field and custom content
components for `<DropCap>`, `<PullQuote>`, `<Figure>`, and newsletter blocks.
Run it server-side through the existing Netlify adapter and protect
`/keystatic` with GitHub access.

### Alternative: Decap CMS

Choose Decap only if the priority is the smallest installation and a basic
Markdown form. Its editorial workflow creates Git branches and PRs, but its MDX
component editing experience will be less controlled for Arahkaii's structured
article layouts.

### Later-stage option: Sanity

Choose Sanity when several non-technical editors need rich collaboration,
visual editing, granular roles, or a larger media operation. It introduces a
second content system and more Astro preview complexity; Sanity's full visual
editing path requires server rendering.

### Not recommended now: custom Convex CMS

Convex is a good application backend, not a finished editorial CMS. Use it only
if Arahkaii later needs a bespoke member platform, real-time newsroom,
personalised reading, paid accounts, or data-heavy community features that
justify owning an admin product.

## Delivery plan

1. **Direction selection:** complete — Concept B, The Modern Majlis, is the
   approved desktop and mobile direction.
2. **Design system:** update spacing, grid, type scale, card hierarchy, image
   ratios, and new Muslim-luxury service metadata.
3. **Homepage implementation:** build new modules using existing content cards;
   do not migrate content again.
4. **Article/category pass:** tighten article openings, recirculation, and
   category indexes to match the selected direction.
5. **CMS pilot:** complete — Keystatic reads the existing 2025/2026 article
   archive and author records locally without migrating content.
6. **GitHub integration:** configured for `cms/` branches; production activation
   requires the one-time GitHub App and Netlify secret setup in the CMS runbook.
7. **QA:** desktop/mobile visual review, accessibility, structured data,
   internal-link crawl, performance budgets, and redirect verification.
8. **Release:** merge design and CMS separately so either can be rolled back
   without affecting the other.
