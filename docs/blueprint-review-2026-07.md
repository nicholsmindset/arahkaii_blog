# Arahkaii Blueprint Review — July 2026

## Decision

Proceed, with the blueprint treated as a direction rather than a literal rebuild.
The approved visual identity, content model, URLs and existing structured data
remain intact. Work ships in small verified phases.

## Already present

- Astro, Keystatic GitHub editing, Vercel deployment and self-hosted fonts.
- A shared token file, responsive editorial grid and compact navigation/footer.
- Article, Person, Organization, Breadcrumb, FAQ, HowTo and ItemList JSON-LD.
- Author pages, visible dates, related stories, newsletter placements, RSS,
  sitemap, canonical URLs and build-time schema/link/landmark validation.
- A halal Sunday brunch article; the blueprint's “broken link” note is outdated.

## Approved adjustments

1. Extend tokens without replacing the current Source Serif, Inter, Bodoni,
   emerald and aubergine identity.
2. Do not force eight stories above the desktop fold if legibility or Core Web
   Vitals suffers. Treat this as a visual benchmark, not a release gate.
3. Treat quoted AI-citation percentages, traffic forecasts and keyword volumes
   as hypotheses until the underlying sources and current Search Console data
   are available.
4. Use `NewsArticle` only for genuine news reporting, not simply content younger
   than 30 days. Do not add unsupported markup solely for AI visibility.
5. Keep FAQ and ItemList schema only when identical content is visible. Schema is
   descriptive metadata, not a ranking shortcut.
6. Do not block AI or search crawlers until each current user-agent policy is
   verified from the provider's official documentation and the business tradeoff
   is approved.
7. Run Lighthouse as a monitored budget with controlled baselines. A hard 2.0s
   CI threshold is too environment-sensitive to be the only deployment gate.
8. Require halal status only when an article makes a venue/product halal claim;
   a generic travel essay may legitimately be not applicable.

## Delivery sequence

- **Foundation:** semantic token aliases and private `/styleguide`.
- **Release gates:** extend validation for visible FAQ/list parity, image
  dimensions, authors and content-model integrity.
- **CMS:** add optional article type, verification, at-a-glance and review fields
  without rewriting existing frontmatter.
- **Article product:** render at-a-glance and halal-evidence modules from the same
  data that generates schema.
- **Trust layer:** editorial standards, corrections and verification policy.
- **Discovery:** franchise and cluster hubs, then homepage density refinements.
- **Content:** strengthen Dining and Travel with commissioned, verified reporting.

Each phase must pass the complete verification suite and visual review at desktop
and mobile widths before merging.
