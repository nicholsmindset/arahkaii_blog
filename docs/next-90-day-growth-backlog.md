# Arahkaii next 90-day growth backlog

Updated 3 September 2026 after the Astro migration, publisher-readiness release,
AdSense resubmission and authenticated Search Console review.

## Current production baseline

- AdSense: review requested; production includes the publisher script, certified
  Google consent message and a valid `ads.txt` record.
- Search Console: domain ownership verified; sitemap index resubmitted
  successfully. The previous report showed 81 indexed URLs and 230 exclusions.
- The exclusion total is inflated by the former WordPress/shop installation:
  old feeds, product actions, plugin endpoints, theme files, moved categories
  and superseded article URLs.
- Repository QA: 49 posts, 34 eligible for indexing, 111 generated HTML pages,
  five focused sitemaps and complete structured-data validation.

## Priority 0 — protect the current review (now)

1. Publish the GA4/GTM container and verify `page_view`, newsletter, contact,
   outbound, recirculation, scroll and subscribe-CTA events in DebugView.
2. Keep navigation, indexable content, consent and ad code stable while the
   AdSense review is active. Do not add aggressive ad density or interstitials.
3. Deploy the targeted WordPress-era redirects in this release, then start
   Search Console validation for the historical 404 and redirect-error groups.
4. Review AdSense and Search Console once per week. Record the exact decision,
   affected URL group and date before making another material change.

## Priority 1 — improve index quality and authority (days 1–30)

5. Classify the 39 historical “Crawled – currently not indexed” examples into
   current articles, moved URLs and retired WordPress assets. Only current
   articles should be improved and requested for indexing; obsolete URLs should
   redirect to a close replacement or remain 404.
6. Reassess every intentional `noindex` post. Publish only pages that add a
   distinct thesis, original evidence, named author accountability and useful
   internal links; consolidate overlapping drafts rather than inflating volume.
7. Publish two strong articles per week across no more than three active topic
   clusters. Each article needs original reporting, first-hand testing, a named
   methodology or a defensible analysis—not a rewritten search-results summary.
8. Strengthen author entity pages with verifiable biographies, areas of
   expertise, selected work and real professional/social profiles where the
   contributor has approved publication. Never invent credentials.
9. Add a visible corrections trail to updated stories and use the editorial
   standards page consistently for sourcing, AI assistance, review and conflicts.
10. Improve internal links from every new story to one hub, two related stories
    and one conversion page. Add links from established pages back to important
    new work within 48 hours of publication.

## Priority 2 — increase demand and publisher credibility (days 31–60)

11. Produce one proprietary asset each month: a small reader survey, price
    tracker, Southeast Asian brand index, expert round-up or reported data set.
    Publish the method and downloadable findings so other publications can cite it.
12. Build a media kit from verified numbers only: audience geography, engaged
    sessions, newsletter opt-ins, top topic clusters, editorial principles and
    partnership formats. Keep advertising and editorial decision-making separate.
13. Run a focused digital-PR programme around proprietary assets. Target relevant
    journalists, brands, universities and trade publications; measure earned
    editorial links and qualified referral traffic, not directory-link volume.
14. Create a publisher pitch package with three flagship pieces, concise author
    bios, rights availability, high-resolution original photography and a clear
    commissioning contact. Tailor each pitch to the publication instead of mass
    syndicating identical copy.

## Priority 3 — compound growth (days 61–90)

15. Improve mobile LCP to below 2.5 seconds at the 75th percentile by measuring
    production field data, preloading only the true hero asset, sizing imagery,
    reducing unused client JavaScript and protecting ad-slot dimensions.
16. Build a weekly dashboard for organic landing pages, indexed-page ratio,
    non-brand clicks, engaged sessions, newsletter conversion, return readership
    and revenue per thousand sessions. Annotate launches and algorithm changes.
17. Add a content-decay review every quarter. Update factual service pieces,
    merge cannibalising URLs, preserve useful URLs and redirect only when the
    replacement answers the same reader intent.
18. Expand into a fourth topic cluster only after an existing cluster shows a
    repeatable pattern of impressions, engaged readers, newsletter sign-ups and
    earned references.

## Decision rules

- Quality gates beat publishing volume.
- A historical 404 is not automatically a defect; redirect it only when a close,
  useful replacement exists.
- Search indexing and AdSense approval cannot be guaranteed or bought. The goal
  is policy compliance, original value, crawl clarity and sustained reader trust.
- Never submit fabricated traffic, biographies, quotes, tests, reviews or sources
  to an advertiser, search engine or publisher.
