# Publication and reader experience release — 5 September 2026

This release makes the homepage a coherent editorial cover and reduces unnecessary space on article pages. It improves discovery, return visits and partnership enquiries while preserving canonical URLs, publication holds and the existing advertising/consent configuration.

## Reader experience

- One current cover story and six dated latest stories; each desk contains only its own eligible articles.
- A compact article masthead, wider introduction and shorter lead-image band.
- A 700px reading column with a 72px desktop gap to a genuinely sticky sidebar; section links replace the repeated hero thumbnail. Breakout images stay clear of the rail.
- Save, copy-link, reading-list and section controls on both article and guide templates, including mobile.
- One newsletter form per article or guide, with a sample-edition link on articles. Related recommendations prioritise the same topic or series. The large next-story card is not repeated again in the following grid.
- Partnership formats, a clear brief CTA, prefilled enquiry subject, appropriate field limits and a visible contact confirmation after the existing successful-delivery redirect.
- Search includes tags and standfirst text, retries failed index requests, and avoids duplicate listeners. Closed navigation panels and the offscreen sticky bar are inert; modal focus is restored on close.

## Source and dependencies

The already-live console-table guide, its three existing images and quiet-luxury cross-link are reconciled into Git. The existing Source Serif typography and neutral image credit labels are preserved. No held draft is newly released. Compatible dependency updates resolve the advisories found in the audit. The Lighthouse harness now runs asynchronously so its HTTP server can respond during measurements.

## Validation

`npm run verify` covers five regression tests, Astro diagnostics, redirect and content checks, production build, JSON-LD and generated-page semantics/links/sitemaps. Targeted browser checks cover article and guide layouts at 320/390/1440px, sidebar positioning, section anchors, reading-list persistence, search/menu focus and partnership form behaviour. The dependency audit reports zero known vulnerabilities at verification time.

For the console-table article, the body begins at approximately 1,180px on a 1440px viewport (previously 1,566px), and 1,035px at 390px (previously 1,255px). Measurements use the local production output without third-party ad injection. The text column is 700px wide on desktop and the sidebar begins 72px after it. These are layout measurements, not conversion or Core Web Vitals results.

## Revenue priorities after this release

1. Refresh the high-opportunity search articles with claim-level primary sources, specific titles and useful original comparisons. Resolve known factual and dining-status contradictions before expanding commercial recommendations.
2. Establish reliable newsletter delivery and a sustained editorial cadence; measure successful signups, returning readers and article-to-article clicks. Existing signup/recirculation events are retained; partnership enquiry clicks receive a dedicated event.
3. Sell clearly scoped paid features and newsletter placements using dated, verified audience figures. Add affiliate links only for actual commercial relationships, with visible disclosure and appropriate link attributes.
4. Measure production ad yield against reader experience and improve the loading path. No additional advertising slots or speculative revenue promises are introduced here.

## Remaining limitations

The pre-release performance audit did not pass the existing 2-second mobile LCP budget. Local uncompressed measurements and production runs with third-party scripts are not directly comparable. This release does not claim that performance, editorial verification or revenue is solved. Backend email delivery, CMS authentication, revenue and GA4 conversions are not established by frontend checks. Private analytics exports and the detailed working audit remain local and are excluded from the public repository.
