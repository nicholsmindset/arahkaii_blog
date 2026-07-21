# Arahkaii technical audit — archive blocks & the publishing platform (July 2026)

A full front-end and back-end audit of every archive/listing surface, the
content schema and CMS wiring, the SEO infrastructure, and the editorial
automation layer — with a prioritised roadmap towards a Tatler-Asia-grade
publishing operation. This is the **code-level companion** to
[`publishing-audit-2026-07.md`](./publishing-audit-2026-07.md), which covers
strategy and competitor benchmarks. Every finding below carries the exact file
(and line, at time of audit) where the fix lives.

Audited: 2026-07-21 · branch `main` @ head · 49 post files (42 published,
7 drafts) · 5 authors · 4 franchises · 3 clusters.

---

## 1. Executive summary

**The foundation is genuinely strong — stronger than most independent
publications.** One card factory feeds every listing surface; sitemaps are
segmented and CI-parity-enforced; JSON-LD is a proper builder library with a
stable `@id` graph; halal-status claims are validated at build time; the CMS
publishes only through PRs behind a quality gate; fonts are self-hosted and
preloaded; robots.txt carries a deliberate AI-crawler policy alongside
`llms.txt`.

**Three things hold it back:**

1. **The archive layer does not scale.** There is no pagination anywhere — the
   `/latest` page renders the entire corpus on one page, and category pages'
   "Load more" is a static link, not a loader. Two content flags (`noindex`,
   future `date`) leak into every listing, the search index and RSS. The
   homepage can show the same story in several modules at once.
2. **Several SEO signals are collected but dropped, or missing on the biggest
   pages.** No `ItemList` on category pages or `/latest`; no `SearchAction`
   although search is live; `reviewedBy` is captured in the CMS but never
   rendered; no per-tag archive URLs; no sponsored/disclosure flag despite live
   AdSense.
3. **The editorial engine is built but dormant.** The drafting brain
   (references, nine skills, ten commands, a 90-day Ahrefs-backed calendar with
   ~55 `ready` topics, a weekday cron) is complete — yet the run log shows
   nothing since 2026-06-20. The bottleneck is everything downstream of the
   draft: images, newsletter, social, and the analytics feedback loop.

The roadmap in §5 sequences the work: correctness and archive scale first,
platform maturity second, and the publishing-company ambitions third.

---

## 2. Front-end audit — the archive blocks

### 2.1 The data spine

`src/lib/articles.ts` is the single source of truth for every listing surface
(home, category, latest, hubs, authors, search, RSS):

- `getPosts()` (`src/lib/articles.ts:48`) — `getCollection('posts', ({data}) => !data.draft)`,
  sorted date-descending. **Draft exclusion happens here, once. Nothing else is
  filtered here — that is the root of findings F1 and F2.**
- `getCards()` (`:56`) — memoised card factory; joins author names, builds
  URLs, computes reading time.
- `getSearchIndex()` (`:93`) — slim JSON index for the client search overlay,
  inlined into **every** page by `BaseLayout`.

### 2.2 Surface inventory

| Surface | File | Paginates? | ItemList schema? |
| --- | --- | --- | --- |
| Homepage (8 listing modules) | `src/pages/index.astro` | — | No (Org/WebSite only) |
| Category index ×8 | `src/pages/[category]/index.astro` | **No** — "Load more" is a static link to `/latest` | No |
| Latest | `src/pages/latest.astro` | **No** — whole corpus on one page | No |
| Franchise hub ×4 | `src/pages/franchises/[slug].astro` | No | **Yes** + empty→noindex |
| Topic hub ×3 | `src/pages/topics/[slug].astro` | No | **Yes** + empty→noindex |
| Author ×5 | `src/pages/authors/[id].astro` | No | Person schema (strong) |
| Contributors | `src/pages/contributors.astro` | No | CollectionPage |
| Reading list | `src/pages/reading-list.astro` | client-only, noindex | — |
| RSS | `src/pages/rss.xml.ts` | all posts | — |
| Search | inline in `src/layouts/BaseLayout.astro` | — | No SearchAction |

There are **no tag archive pages**, no `/franchises`, `/topics` or `/authors`
index pages, and `/topics/*` is reachable only from `ClusterNav` inside
articles — orphaned from the global nav and footer.

### 2.3 Findings — load-bearing defects (P0)

- **F1 — `noindex` posts appear everywhere except their own meta.** The
  `noindex` frontmatter flag only sets the article's robots meta and excludes
  it from the sitemap. It does **not** remove the post from any listing, the
  client search index, or RSS. Fix point: filter in `getPosts()`
  (`src/lib/articles.ts:48`).
- **F2 — no future-date guard.** Nothing filters `date > now`, so a post dated
  ahead of today goes live on the next build. Given the content calendar
  schedules posts weeks ahead, this makes accidental early publication a
  one-typo event. Same fix point as F1.
- **F3 — no real pagination.** `/latest` slices the full corpus onto a single
  page (`src/pages/latest.astro:9-11`); the category river's "Load more" is a
  static `<a href="/latest">` (`src/pages/[category]/index.astro:237-239`).
  Fine at 42 posts; at 200+ this means multi-megabyte listing pages and diluted
  crawl signals. Astro's `paginate()` is the native fix.
- **F4 — homepage module duplication.** `fill()` (`src/pages/index.astro:11-14`)
  excludes only the set passed to it — every module excludes just the hero, so
  the same story can sit in the Friday edit **and** Modest wardrobe **and**
  The Majlis simultaneously. Fix: thread a running `used` set through the
  module assignments (`:17-26`).
- **F5 — thin-category cross-contamination.** When a category has fewer than 4
  stories, the river silently injects up to 6 stories **from other
  categories** with no visual signal (`src/pages/[category]/index.astro:53`).
  With dining/travel/people/living all near-empty today, most of those four
  pages are currently showing mostly off-category content under an on-category
  masthead. Either label the injected block ("Elsewhere in Arahkaii") or drop
  the top-up.

### 2.4 Findings — SEO / structured data on archives (P1)

- **F6 — no `ItemList` on the two biggest list surfaces.** Franchise and topic
  hubs emit ItemList; category pages and `/latest` do not. `/latest` also
  renders visual breadcrumbs with no `BreadcrumbList` schema; the homepage
  falls back to Organization + WebSite only.
- **F7 — search is live but schema says it isn't.** `websiteSchema()` omits
  `potentialAction`/`SearchAction` with the comment "on-site search is
  deferred" (`src/lib/seo.ts:75`) — written before the search overlay shipped.
- **F8 — empty category pages are never `noindex`.** Hubs correctly de-index
  when empty (`noindex={cards.length === 0}`); category pages render "No
  stories here yet" (`src/pages/[category]/index.astro:235`) but stay
  indexable.

### 2.5 Findings — missing surfaces & linking (P1/P2)

- **F9 — tags have no URLs.** Tags drive filter chips, RSS categories and
  article keywords, but there is no `/tags/<tag>/` (or `/<category>/<tag>/`)
  page — tag-intent queries have nothing to rank.
- **F10 — hub index pages missing.** No `/franchises/`, `/topics/` or
  `/authors/` index; `contributors.astro` doubles as the author index but the
  franchise/topic systems have no front door, and `/topics/*` is absent from
  nav and footer entirely.
- **F11 — no related-stories/prev-next on any archive**, and the author page
  renders an empty grid with no empty state if an author has no stories.

### 2.6 Findings — maintainability & accessibility

- **F12 — the taxonomy is declared three times**: the schema enum
  (`src/content.config.ts`), `BaseLayout.astro:74-83`, and the category
  `getStaticPaths` (`src/pages/[category]/index.astro:38`) — plus curated
  subsets in the masthead and footer. Adding a ninth category means five
  touch-points. Centralise in one `src/lib/taxonomy.ts` module.
- **F13 — a11y is mostly good** (dialog semantics on the overlay, `aria-pressed`
  chips, decorative thumbnails correctly `alt=""` + `aria-hidden`). Gap: the
  tag-filtered grids announce nothing on filter — no `aria-live` region with a
  result count.

---

## 3. Back-end / platform audit

### 3.1 What is already strong

- **Sitemaps**: hand-rolled, segmented (`sitemap-index.xml` → pages / posts /
  categories / hubs / authors), with build-time parity enforcement — every
  sitemap URL must resolve and every indexable page must appear in exactly one
  segment (`scripts/validate-build.mjs`).
- **JSON-LD**: a real builder library (`src/lib/seo.ts`) with a stable `@id`
  graph (Organization with legal identity, WebSite, Article/NewsArticle,
  Person→worksFor, FAQ/HowTo/ItemList), plus an anti-cloaking check that
  FAQ/ItemList text is actually visible on the page (`scripts/validate-schema.mjs`).
- **Editorial gates**: `scripts/validate-content.mjs` enforces author-id
  resolution, halal-status freshness (<6 months) on dining/travel, exactly one
  pillar per cluster, no orphaned cluster posts, no placeholder hero credits.
- **API hardening**: `/api/subscribe` and `/api/contact` carry same-site
  checks, honeypots, per-IP rate limits and clean upstream error mapping
  (`src/lib/api-guard.ts`).
- **Publishing discipline**: Keystatic writes to `cms/*` branches → PR →
  `quality.yml` runs `npm run verify` → human merge is the only publish action.
- **AI-era SEO posture**: robots.txt allows retrieval bots (OAI-SearchBot,
  Claude-SearchBot, Perplexity) while blocking training crawlers (GPTBot,
  ClaudeBot, CCBot); `llms.txt` is a curated manifest.
- **Performance basics**: self-hosted variable fonts with two preloaded
  critical faces, responsive `astro:assets` images with CI-enforced explicit
  dimensions (CLS), a Lighthouse LCP budget script (`scripts/perf-budget.mjs`,
  median <2000 ms).

### 3.2 Findings — platform gaps (P1)

- **B1 — no dynamic OG images.** Social cards are 1200×630 crops of the hero;
  there is no title-card system. A Satori/`@vercel/og`-style endpoint (or
  build-time generation) would give every story a branded, headline-bearing
  share card — table stakes for a publication whose distribution is social.
- **B2 — search is a client-side substring match, shipped everywhere.** The
  whole index is inlined into every HTML page (`BaseLayout.astro`), growing
  linearly with the corpus, and matching is naive substring over
  title/category/author. **Pagefind** (static, index-on-build, loads on
  demand) is the natural Astro fit, plus a crawlable `/search` page and the F7
  SearchAction.
- **B3 — three parallel redirect systems.** `legacyRedirects()` in
  `astro.config.mjs` + `src/data/legacy-redirects.json` + a 376-line
  `vercel.json` map overlap. Consolidate to one generated source (keep the
  apex→www rule in `vercel.json`).
- **B4 — no draft preview URLs.** Drafts are excluded from every build, so an
  editor cannot share a preview without merging. Vercel already builds PR
  previews — build drafts when `context !== 'production'` (env-gated in
  `getPosts()`) and the CMS gains shareable previews for free.
- **B5 — rate limiting is per-instance memory** (documented as such in
  `api-guard.ts`) — swap to Vercel KV/Upstash when subscribe volume matters.
- **B6 — `reviewedBy` is collected and dropped.** It exists in the Zod schema
  (`src/content.config.ts:66`) and as a Keystatic relationship field, but no
  layout or JSON-LD renders it. Wiring it into the byline row and
  `reviewedBy`/`Person` schema is a cheap E-E-A-T win — especially for
  halal-verified dining/travel content, where "reviewed by" is the brand.
- **B7 — schema fields missing for a serious publication**: no
  `sponsored`/disclosure flag (AdSense and `/advertise` are live — paid
  content cannot be declared), no canonical override (syndication), no
  co-authors, no `ogImage` override, no `hreflang`/`translationOf`.
- **B8 — Keystatic year collections are hard-coded** (`posts2026`/`posts2025`
  in `keystatic.config.ts`) — the first 2027 post needs a code change. Generate
  the year collections programmatically.
- **B9 — AdSense loads unconditionally** (`BaseLayout.astro:130-136`) while
  GTM is carefully env-gated — an inconsistent performance posture; the one
  render-blocking third party on every page. Gate or lazy-load it.
- **B10 — images live in git; the CDN is stubbed.** `cdn.arahkaii.com` is
  declared in `astro.config.mjs` and the R2 env block is commented out. At
  ~5 posts/week with multiple images each, repo bloat arrives within months.
- **B11 — minor**: `llms.txt` uses the apex domain where the canonical host is
  `www`; `public/_headers` is a dormant Cloudflare-style artefact on Vercel.

---

## 4. The editorial engine — CMS and automation

### 4.1 State of play

- **The drafting brain is complete and sophisticated**: 13 reference docs
  (voice, pillars, halal substitutions, image system, keyword research,
  format templates, a generated-and-current `url-database.md`), nine
  `arahkaii-*` skills, ten `.claude/commands/` routines, and a 90-day
  H2-2026 calendar (~64 topics, ~55 `status:ready`, Ahrefs-backed) with a
  weekday 08:30 SGT cron in `.github/workflows/editorial.yml` that drafts to a
  PR and can never touch `main`.
- **But it is dormant.** `run-log.md` has two entries, both June (the New
  Bahru draft on 2026-06-19/20). Nothing since — five weeks of scheduled runs
  with ~55 ready topics queued and several `ready` dates now in the past.
  Recent commits are all infrastructure, not editorial.
- **Root bottleneck: images.** The CI runner deliberately carries no image
  secrets, so every automated draft stalls at a placeholder hero awaiting
  manual generation + licence log. The pipeline can write a Tatler-grade draft
  autonomously and then cannot finish it.
- **Content mix is lopsided**: style 21 / beauty 10 versus dining 2, travel 2,
  people 2, living 3 — while `references/editorial-pillars.md` flags dining as
  the highest-ROI pillar. Four of the eight category pages are running mostly
  on the F5 cross-category top-up.
- **Downstream is unbuilt**: newsletter is capture-only (`/api/subscribe`
  works; no Sunday digest, no welcome sequence), social distribution is built
  but deliberately gated off, and the weekly/monthly analytics reviews are
  read-only reports with no loop back into `/trend-scan` scoring.
- **Debt**: several command files still carry WordPress/RankMath framing under
  "ASTRO ADAPTATION" banners; skills reference `VOICE.md`-style CAPS filenames
  where the repo uses lowercase `references/*.md`.

### 4.2 The 7 hidden drafts

`from-foundation-to-house`, `capsule-wardrobe-guide-2026`,
`halal-sunday-brunch-singapore`, `c-beauty-guide-chinese-beauty-brands`,
`c-beauty-brands-southeast-asia`, `new-bahru`, `the-art-of-asian-minimalism-2`.
Three contain placeholder markers; two still use `blog-placeholder-1.jpg`
heroes. Finishing these is the cheapest way to feed the thin categories.

---

## 5. Roadmap — becoming a Tatler-grade publishing company

### Tier 1 — correctness & archive scale (this quarter, mostly small PRs)

| # | Item | Fix point | Effort |
| --- | --- | --- | --- |
| 1 | Filter `noindex` + future-dated posts at the source (F1, F2) | `src/lib/articles.ts:48` | XS |
| 2 | Homepage module de-duplication (F4) | `src/pages/index.astro:11-26` | XS |
| 3 | Real pagination on `/latest` and category rivers via `paginate()` (F3) | `latest.astro`, `[category]/index.astro` | M |
| 4 | Label or remove the thin-category top-up (F5) | `[category]/index.astro:53` | XS |
| 5 | ItemList + BreadcrumbList on category/`/latest`/home; SearchAction (F6, F7) | `src/lib/seo.ts`, the three pages | S |
| 6 | `noindex` empty category pages (F8) | `[category]/index.astro` | XS |
| 7 | Centralise the taxonomy in one module (F12) | new `src/lib/taxonomy.ts` | S |
| 8 | Tag archive pages + `/franchises` `/topics` index pages; footer/nav links (F9, F10) | new pages | M |
| 9 | Render `reviewedBy` in bylines + schema (B6) | `ArticleLayout`, `seo.ts` | S |
| 10 | `aria-live` result counts on filters; author empty state (F11, F13) | filter scripts | XS |

### Tier 2 — platform maturity (next quarter)

- **Pagefind search** + crawlable `/search` page; drop the inlined index (B2).
- **Dynamic OG title-cards** — Satori/`@vercel/og` endpoint or build-time
  generation with the Bodoni masthead (B1).
- **Draft preview deployments** — build drafts on non-production Vercel
  contexts so every CMS PR has a shareable preview (B4).
- **Redirect consolidation** to one generated source (B3).
- **R2/CDN migration** for images before repo bloat forces it (B10).
- **Schema additions**: `sponsored`/disclosure, canonical override, co-authors,
  `ogImage` override (B7).
- **Keystatic year-collection generation** (B8); **KV rate limiting** (B5);
  **AdSense loading strategy** (B9).

### Tier 3 — the publishing-company plays

1. **Restart the daily loop.** Either provide image secrets to the scheduled
   runner behind the existing human licence gate, or adopt a
   placeholder-then-replace flow (draft merges with a branded placeholder
   card; image lands in a follow-up PR). Rebalance the calendar towards
   dining/travel — the emptiest, highest-ROI pillars.
2. **Newsletter as a product.** The Sunday "Arahkaii Weekly" RSS-to-email
   digest and welcome sequence (MailerLite/Beehiiv are already wired for
   capture). Tatler-class publications are list businesses; capture-only is
   leaving the asset unbuilt.
3. **Analytics → calendar feedback loop.** Feed GSC/Ahrefs/seotesting data
   from the weekly review into `/trend-scan` scoring so the calendar learns
   what ranks — the compounding advantage of an automated newsroom.
4. **Programmatic city SEO.** "Halal fine dining in [city]" ×
   KL/Jakarta/Dubai/Istanbul/Doha/London/Tokyo — templated hubs fed by the
   verified-listings data model (`atAGlance`/`halalStatus` already exist in
   the schema).
5. **Translation lanes** (`zh`, `ms`) with `hreflang`/`translationOf` — the
   pan-Asian remit currently ships in one locale.
6. **Enable social distribution** once the daily loop has produced 7–10 good
   drafts (the gate already defined in `social-distribution.md`).
7. **Community/membership layer** (comments or a members' majlis) and the
   quarterly **print PDF** (Paged.js) as the long-game brand artefact.

### Suggested sequence

Tier 1 items 1–7 are one sprint and remove every correctness risk. Ship the
hidden drafts + restart the daily loop (Tier 3.1) in parallel — content volume
is the binding constraint on everything else. Pagination (Tier 1.3) and
Pagefind (Tier 2) become urgent as the corpus passes ~100 posts, which at the
calendar's 5/week cadence is roughly 12 weeks after the loop restarts.

---

## 6. Appendix — inventory

- **Posts**: 49 files (15 in `2025/`, 34 in `2026/`); 42 published, 7 drafts.
  Dates 2025-11-02 → 2026-06-22.
- **By category**: style 21 · beauty 10 · culture 5 · guides 4 · living 3 ·
  dining 2 · people 2 · travel 2.
- **Authors**: natalia-amir 30 · nadra-nichols 9 · robert 5 ·
  zara-chen-okafor 4 · lina 1.
- **Calendar**: ~64 topics (Jun 22 – Sep 18 + seasonal backlog to Mar 2027);
  1 drafted, ~55 ready, 8 proposed. **Run log**: last entry 2026-06-20.
- **Verify chain**: `astro check` → `validate:content` → build →
  `validate:schema` → `validate:build` (perf budget runs on schedule only).
- **Workflows**: `quality.yml` (PR gate), `editorial.yml` (weekday 08:30 SGT
  draft-daily + manual trend-scan), `perf.yml` (Monday Lighthouse budget).
