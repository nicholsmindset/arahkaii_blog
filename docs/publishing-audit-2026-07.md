# Arahkaii Publishing Audit — July 2026

## Executive assessment

Arahkaii now has a credible premium-publication foundation: a distinctive
identity, consistent article and category templates, Git-backed editorial CMS,
author pages, responsive imagery, structured data, newsletter capture points,
search, RSS, sitemap, redirects and human review gates. The next gains come
from trust, operations and audience infrastructure—not more decoration.

## Competitor benchmark: what to adapt

The useful comparison set is broader than Tatler Asia: **Tatler Asia** for
premium regional curation, **SCMP Style/PostMag** for repeatable editorial
products, **Vogue Arabia** and **Harper's Bazaar Arabia** for culturally specific
luxury authority, **Mille World** for youth and creator relevance, and
**HalalTrip** for practical Muslim utility. Arahkaii should combine their best
product habits without imitating their visual identities.

- **Tatler Asia:** adapt strong recurring franchises, editor-led selection and
  authoritative destination/dining packages. Avoid celebrity volume and an
  advertising-heavy page rhythm.
- **SCMP:** adapt newsletter bundles, clear publishing frequency, previews and
  topic-led retention. Start with one excellent weekly edition, then add a
  Travel or Style edition only when the list supports it.
- **Vogue/Bazaar Arabia:** adapt visible editorial leadership, recognizable
  seasonal issues, expert voices and original shoots. Arahkaii's defensible
  angle is modern Asian Muslim life—not generic luxury with modest imagery.
- **Mille World:** adapt contributor discovery, first-person cultural reporting,
  interviews and platform-native video. Keep commissioning standards and fact
  checking stronger than a creator feed.
- **HalalTrip:** adapt useful city assets: prayer-space details, halal evidence,
  neighbourhood maps, downloadable guides and review dates. This is the clearest
  opportunity to turn editorial authority into a product readers save and share.

### Distinctive products to build

1. **Arahkaii Verified directory:** restaurants, hotels, spas and products with
   verification method, evidence, reviewer, date checked and correction route.
2. **Prayer-aware city guides:** beautiful editorial guides plus maps, prayer
   spaces, verified dining, seasonal advice and downloadable versions.
3. **The Sunday Edit:** a consistent editor's letter, five essential stories
   and one useful guide; show an archive and a sample before signup.
4. **The Majlis:** recurring essays, interviews and salons that establish an
   intellectual and community identity beyond shopping content.
5. **Annual signature packages:** Ramadan/Eid, modest-fashion month, Muslim-
   friendly summer travel and an Arahkaii Best of Asia selection.

Do not add all five to navigation immediately. Prove each as a recurring series,
then promote the products that earn repeat visits, saves and subscriptions.

## Launch-critical

1. **Finish owned-channel delivery.** Add MailerLite or Beehiiv credentials,
   submit a controlled address, verify consent and welcome/unsubscribe flows,
   and record the chosen processor in the privacy policy.
2. **Replace the Netlify contact form.** Use a Vercel-compatible transactional
   provider, rate limiting, honeypot protection and a monitored editorial inbox.
3. **Remove visible placeholders.** Commission final artwork for About and
   Subscribe; confirm every published image has an accurate caption, source,
   licence decision and non-deceptive AI credit.
4. **Complete domain cutover safely.** Preserve legacy WordPress redirects,
   verify canonical URLs, SSL, sitemap access and Search Console before removing
   the old host.
5. **Add privacy-respecting measurement.** Track article depth, newsletter
   conversion, internal-search terms, outbound clicks and Core Web Vitals. Do
   not load marketing trackers before the consent and privacy language match.

## Trust and newsroom standards

- Publish an **Editorial Standards** page covering sourcing, corrections,
  conflicts, sponsored content, affiliate links, halal verification and AI use.
- Add a visible correction/update note when an article materially changes;
  retain `datePublished` and maintain an accurate `dateModified`.
- Expand author profiles with beats, credentials and verified profile links.
  Google recommends linking article authors to unique profile pages and using
  clear Person markup: <https://developers.google.com/search/docs/appearance/structured-data/article>.
- Add per-article source notes for health, finance, sustainability and halal
  claims. “Arahkaii Verified” should include scope, evidence and review date.

## Discovery and retention

- Create curated landing pages for recurring franchises: **Arahkaii Verified**,
  **The Majlis**, city guides, modest wardrobe and tropical beauty.
- Add a dedicated search results URL once search volume justifies it; the
  current overlay is useful but cannot be linked or indexed.
- Introduce topic follow buttons and newsletter preference groups after the
  core weekly newsletter proves demand.
- Build the thin Dining, Travel, Living, People and Guides inventories before
  adding more top-level navigation.

## Search and distribution

- Keep the standard sitemap in Search Console. If Arahkaii begins publishing
  timely news frequently, add a separate Google News sitemap containing only
  articles from the previous two days:
  <https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap>.
- Consider `NewsArticle` only for genuinely time-sensitive reporting; retain
  `Article` for evergreen essays and guides.
- Add image licensing metadata where rights allow and validate social crops on
  every major release.

## Monetisation readiness

- Delay display advertising until traffic and reading-depth baselines exist.
  Start with reserved, labelled placements after the first paragraphs and
  between recommendation modules; never interrupt the headline or opening image.
- When AdSense is approved, publish the exact account entry at root `ads.txt`.
  Google recommends a crawlable root file and correct publisher identifier:
  <https://support.google.com/adsense/answer/12171612>.
- Create campaign briefs, sponsored-content labels and an advertiser disclosure
  before accepting paid editorial work.

## Recommended operating dashboard

Review weekly: publishing cadence, indexed pages, search impressions, engaged
reading time, 50%/90% scroll depth, recirculation, newsletter conversion,
unsubscribes, broken links, Core Web Vitals and image-rights exceptions.
