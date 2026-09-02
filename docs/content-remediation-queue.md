# Content remediation queue

These articles are intentionally retained at their historical URLs with
`noindex,follow`, but excluded from home/category listings, search, RSS and
sitemaps. This is reversible: remove `noindex: true` only after the article
passes the evidence checklist below.

## Re-report before re-indexing

- `beauty-best-chinese-makeup-brands.mdx`
- `c-beauty-guide-chinese-beauty-brands.mdx`
- `k-beauty-broke-the-algorithm.mdx`
- `korean-fashion-brands-2026.mdx`
- `korean-heritage-brands-renaissance.mdx`
- `the-art-of-asian-minimalism-2.mdx`
- `the-complete-guide-to-investment-dressing.mdx`
- `brightspot-supermrkt-2025-where-jakartas-creative-economy-comes-to-shop.mdx`
- `from-followers-to-founders-3-content-creators-building-empires-beyond-the-algorithm.mdx`
- `from-foundation-to-house.mdx`
- `southeast-asian-cities-digital-nomad-luxury-lifestyle-2.mdx`
- `the-conscious-luxury-manifesto-sustainable-living.mdx`

## Evidence gate

- Give the URL one distinct search intent; merge or redirect true duplicates.
- Replace unsupported figures and superlatives with a named primary or
  authoritative source, or remove them.
- Add first-hand reporting where the story promises it: an interview, visit,
  product test, original photography, dataset or documented expert review.
- Add `method` and `sources` frontmatter. Never imply a visit or test that did
  not happen.
- Add `reviewedBy`, `updatedDate` and `correctionNote` only when those events
  actually occurred.
- Credit images as photographer/agency, supplied image, illustration, or
  AI-assisted artwork; retain the rights decision.
- Run `npm run verify`, inspect the article on mobile and desktop, then obtain
  editorial approval through the normal PR merge.
