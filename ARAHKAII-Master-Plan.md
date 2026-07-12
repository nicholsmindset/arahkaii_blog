# ARAHKAII — Master Build Plan
### WordPress → Astro · "The Quiet Authority" · Full Automation Stack

---

> **⚠️ Historical vision document — not current state.** This is the original
> blueprint and records direction, not the live build. Where it diverges from
> reality, **[CLAUDE.md](./CLAUDE.md) and [README.md](./README.md) are the source
> of truth.** Key divergences since:
> - **Hosting is Vercel**, not Netlify (`@astrojs/vercel` adapter + `vercel.json`;
>   301s via `astro.config.mjs`, no `netlify.toml`).
> - **Design is the bright-white "arahkaii-blog-v2" system** (Bodoni Moda +
>   Source Serif 4 + Inter), not the warm-paper "Quiet Authority" look.
> - **Keystatic** provides a Git-based CMS at `/keystatic` (the "no CMS" line is
>   superseded).
> - Posts are **`.md`** (`.mdx` supported); **Cloudflare R2** and **MailerLite
>   digest automation** remain deferred (local-first images; capture via
>   `/api/subscribe`).

---

## 0. The One-Paragraph Summary

Rebuild arahkaii.com in **Astro 6** (MDX content collections, Tailwind, View Transitions), deploy on **Netlify**, store posts as **MDX files in Git edited entirely through Claude Code** (no CMS). Images come from two sources behind one human-approval gate: **generated** via **OpenRouter** (flip between GPT Image, Flux, Gemini per-image to balance cost/quality) and **sourced** via **Firecrawl** (real photos for listicles, with a mandatory licence-review step). Generated assets land on **Cloudflare R2**. Email capture and list-building automation run on **MailerLite**. The creative direction is **"The Quiet Authority"** — warm, literary, serif-led, almost bookish, with subtle motion — using Tatler Asia only as a *tier reference*, never a template. The goal: a small site that reads as more considered and better-crafted than titles with far more authority.

---

## 1. Creative Direction — "The Quiet Authority"

**Governing idea:** a publication that feels like a beautifully made book that happens to live on the web. Tatler signals status through gloss and volume; Arahkaii signals it through editorial calm — space, restraint, literary type, unhurried motion. "Modestly told" is an *aesthetic of considered quiet*, not a list of restrictions.

**Why this beats copying Tatler:** Tatler is sans-led, cool, busy. A warm, bookish, serif-led publication with obsessive craft feels calmer and more expensive, and it can't be traced back to anyone. Being small is the advantage — you can be detail-obsessive in ways a legacy publisher can't.

### 1.1 Typography (the spine of the brand)

| Role | Primary (licensed) | Free fallback | Rule |
|---|---|---|---|
| Display / headlines | **GT Sectra** or **Canela Deck** — literary contemporary serif | **Fraunces** (high optical size) | Serif speaks. This inversion of Tatler's sans-display is half the differentiation. |
| Body / long-form | **Tiempos Text** or **Lyon Text** — warm reading serif | **Newsreader** or **Source Serif 4** | Bookish signature: serif body, not sans. |
| UI / eyebrows / captions / meta | **Söhne** or **Suisse Int'l** | **Inter** | Sans only signposts — navigation, labels, bylines. Never carries editorial content. |

The hierarchy *serif speaks, sans signposts* is itself a point of view. **Do not use Forma DJR** — that is Tatler's commissioned typeface and would make Arahkaii a literal copy.

### 1.2 Palette — warm, materially rich (uncoated-paper, not screen-white)

```
Surface (paper white):   #F6F1E9   — never #FFFFFF
Text (warm ink):         #1C1815   — never pure black
Quiet surface (cards):   #EFE8DB
Muted (meta):            #7A7065
Hairline (rules):        #E2D9CA
Accent (rare):           #4A2C3A  aubergine   OR  #2E3D34 forest ink
Highlight (very rare):   #B06B4E  soft clay / terracotta
```

Ratios: surface ≥60%, ink ≥25%, muted ~8%, accent <2%, highlight <1%.

### 1.3 Structural signatures (what makes a layout recognizably Arahkaii)

- **Standfirst as epigraph** — italic display serif, generous, set like the opening of a book chapter.
- **Pull quotes as marginalia** — placed in the wide left/right margin beside the text column on desktop (book-like), not breaking the column. Tatler doesn't do this.
- **One drop cap** at the article open (and only there) — with a bookish serif this reinforces the literary-press feel rather than reading as a blog cliché.
- **Chapter-like section breaks** — generous space with a small centred numeral or ornament, not a hard rule.
- **Listicle rhythm** — numbered entries with a consistent, recognizable vertical cadence.

### 1.4 Motion — subtle, in service of calm

- View Transitions: soft cross-fades between pages (~400ms, unhurried).
- Images resolve gently on scroll (blur-up from AVIF placeholder). Never slide or bounce.
- Hairline reading-progress indicator, thin and quiet.
- Hover states *settle* (slow ease, small movement) rather than pop.
- The motion should be felt, not noticed.

---

## 2. Site Review — What Carries Over

Arahkaii today: *"Asia's Modern-luxury Edit — Modestly Told,"* Muslim-owned, on WordPress + Elementor, built by Onnifyworks. Seven pillars: **Style · Dining · Travel · Culture · Living · People · Guides**. Editorial voice is already strong (e.g. *Best Halal Fine Dining in Singapore 2026*, *The Quiet Renaissance of Korean Heritage Brands*, *The Complete Guide to Investment Dressing*). The content is Tatler-grade; the execution isn't yet.

| Carry over | Redesign / drop |
|---|---|
| All ~30 posts + their URL slugs (SEO) | Elementor homepage, post template, category pages |
| Seven-pillar taxonomy | Logo lockup (rebuild as crisp SVG) |
| Author profiles | Sidebars, "Bookmark" UI, widget cruft |
| Brand voice & "modestly told" positioning | Type system, colour, spacing, image treatment |

**Migration risk: very low** (few posts, no commerce, little traffic). Ideal time to rip and replace.

**Modest-luxury guardrails (positive identity, not just subtraction):** no alcohol, nightlife, bars, spirits; modest dress in imagery. Framed as *more restraint, more whitespace, warmer materiality* — a calmer sophistication mass-luxury titles lack.

---

## 3. Astro Architecture

```bash
npm create astro@latest arahkaii -- --template blog
cd arahkaii
npx astro add tailwind mdx sitemap netlify
npm install sharp @aws-sdk/client-s3
```

**File layout**
```
src/
  content.config.ts        # Zod schema (fails build on missing captions/credits)
  content/posts/2026/*.mdx
  content/authors/*.md
  components/article/   Headline · Standfirst · Byline · PullQuote · Figure · Gallery · DropCap
  components/home/      Hero · EditLane · Spotlight
  layouts/             ArticleLayout · CategoryLayout
  pages/index.astro · [category]/index.astro · [category]/[slug].astro
  styles/tokens.css
public/fonts/...
scripts/  publish.ts · publish-listicle.ts · image-gen.ts · image-source.ts · image-prompt.ts
```

**Content schema (sketch)**
```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string().max(110),
    standfirst: z.string().max(220),
    category: z.enum(['style','dining','travel','culture','living','people','guides']),
    tags: z.array(z.string()).optional(),
    author: z.string(),
    date: z.coerce.date(),
    readingMinutes: z.number().optional(),
    heroImage: image(),
    heroCaption: z.string(),         // required — magazine discipline
    heroCredit: z.string(),          // required
    draft: z.boolean().default(false),
    legacyWpSlug: z.string().optional()
  })
});
```

**Why this fixes the WordPress speed/caching pain:** Astro ships zero JS by default, builds static HTML at build time (no PHP, no MySQL per request), and optimizes images to AVIF/WebP via Sharp at build with width/height injected (no layout shift). Expect Lighthouse 95–100 on first deploy. View Transitions add SPA-feel navigation in two lines with no framework cost.

---

## 4. Content Storage / CMS Decision → **MDX in Git, edited by Claude Code (no CMS)**

You write in Claude. Any CMS just becomes a box you paste Claude's output into — the exact friction you're removing. So **Claude Code is the CMS.**

| Option | Verdict |
|---|---|
| **MDX in Git via Claude Code** | ✅ **Choose this** — lowest possible friction, zero context-switch |
| Custom CMS in Claude Code | ❌ Becomes software you maintain forever; solves no problem you have |
| Decap / Tina | ❌ Redundant step; Decap stagnant since 2023, Tina's Astro support experimental |
| Keystatic | ⚠️ Best Git-CMS for Astro — **add later only if a non-technical editor joins** |
| Sanity / Contentful / Payload | ❌ Overkill; Contentful starts ~$300/mo |

**Publishing workflow:** draft in Claude → open Claude Code in `/arahkaii`, run `/publish` → it writes the MDX, generates/sources images behind your approval, uploads to R2, commits, pushes → Netlify rebuilds in ~60–90s → live. No dashboard, no pasting.

---

## 5. Image System — Two Sources, One Human Gate

```
GENERATE (OpenRouter)              SOURCE (Firecrawl)
conceptual / editorial / mood      real, named entities (listicles)
   │                                   │
   └──────────────┬────────────────────┘
                  ▼
   ┌──────────────────────────────────────────────┐
   │  HUMAN-IN-THE-LOOP REVIEW (hard gate)          │
   │  per image: thumbnail · source/prompt ·        │
   │  detected credit/licence ·                     │
   │  [Approve & use] [Reject] [Generate instead]   │
   │  modest-luxury guardrail check applies to both │
   └──────────────────────────────────────────────┘
                  ▼ approved only
   Sharp (AVIF/WebP, 5 widths) → Cloudflare R2 → <Figure src credit> → commit → Netlify
```

### 5.1 Generation via OpenRouter (model-flexible)

One key, one integration, flip models per-image to balance cost vs. quality.

| Role | Model (via OpenRouter) | Use |
|---|---|---|
| Hero / featured | GPT-5 Image / GPT Image 2 | the defining image |
| Standard inline | Gemini 3.1 Flash Image ("Nano Banana 2") | most in-post images |
| Bulk / low-stakes | FLUX.2 [klein] | cheapest |

**Technical catch:** OpenRouter image gen uses `/v1/chat/completions` with `modalities: ["image","text"]` — *not* OpenAI's `/v1/images/generations`. Abstract behind `scripts/image-gen.ts` with a native-OpenAI fallback (flip one env var on outage). Keep both `OPENROUTER_API_KEY` and `OPENAI_API_KEY`.

**Editorial prompt base** (forces "not-AI-y" output): *"Editorial photograph, luxury Asian publication. Subject: [X]. Rule of thirds, generous negative space, narrow depth of field. Soft natural window light from left, warm 4200K. Muted, slightly desaturated grade, warm shadows, ivory highlights. Modest dress (no exposed shoulders/knees, no alcohol/bar/nightlife). 3:2. Photographic not illustrated. No text, logos, or watermarks."* Apply site-wide `filter: contrast(1.02) saturate(0.96)`.

### 5.2 Sourcing via Firecrawl (listicles & real entities)

For posts naming a real restaurant/product/place, readers expect the *actual* image. Firecrawl scrapes the entity's **official site first** (not GMB directly) and returns candidate images **with source URLs** into a review manifest — never committed automatically.

**Copyright discipline (built in, not optional):**
- Each candidate surfaces: source URL, any visible credit, and a logged licence decision — *own/brand-supplied* ("Courtesy of [Name]") · *credited editorial use* · *needs permission — hold* · *reject → generate instead*.
- **GMB photos are leads, not sources** — many are visitor uploads; use them to find the official source.
- **When rights are unclear → "Generate instead."** Having both sources in one pipeline means a rejected scrape instantly falls back to AI.
- Modest-luxury guardrail applies to scraped images too (a restaurant photo may contain a bar).
- `<Figure>` schema: `credit` **required**, `sourceUrl` optional → build fails on uncredited sourced images.

### 5.3 Hosting → Cloudflare R2

Free egress, first 10GB storage + 10M ops free, S3 API, free Cloudflare CDN. Point `cdn.arahkaii.com` at the bucket; allow it as a remote image domain in `astro.config.mjs`. Image bill ≈ a few dollars/month at your cadence.

---

## 6. Email & List-Building → MailerLite

List-building is a core goal, so this is first-class, not an afterthought.

- **Pricing path:** Free (up to 500 subs, 12k emails/mo, **automation included**) → **Growing Business $10/mo** once you pass 500 subs *or* want the RSS digest (RSS campaigns aren't on free) → Advanced $20/mo later for multi-trigger automations + AI assistant.
- **Capture, two paths:** (1) **API + Netlify function** for the homepage inline form, pixel-matched to your serif type system; (2) **hosted pop-up** for exit-intent and end-of-article (MailerLite handles triggers, consent, double opt-in).
- **Automations to build:**
  - *Welcome sequence* (3 emails): instant welcome + best evergreen → day 3 top stories → day 7 brand story + reply prompt. Highest-leverage list asset.
  - *RSS-to-email weekly digest* — auto-pulls Astro `/rss.xml` into the Sunday "Arahkaii Weekly" (requires Growing Business).
  - *Pillar segmentation* — tag subscribers by signup category for targeted sends.
- **Design the email template** in the same serif display/text hierarchy + paper palette so inbox = site. (Supersedes the earlier Beehiiv suggestion — MailerLite fits a website-first brand better.)

---

## 7. End-to-End Automation Pipeline

```
1. DRAFT (Claude.ai) — converse until final
        ▼
2. /publish or /publish-listicle (Claude Code)
   • write MDX + frontmatter
   • GENERATE (OpenRouter) and/or SOURCE (Firecrawl) images
   • HUMAN REVIEW GATE — approve/reject/generate-instead + set captions/credits
   • Sharp → AVIF/WebP → Cloudflare R2
   • validate vs Zod (fails on missing caption/credit)
   • git commit + push
        ▼
3. NETLIFY build (~60–90s) — RSS updates → MailerLite queues Sunday digest
        ▼
4. LIVE at arahkaii.com/<category>/<slug>
```

**CLAUDE.md (repo root)** encodes: brand voice (British English, em-dashes), modest-luxury guardrails, category enum, image-model table, sourcing rules ("official site first; never commit a sourced image without approval + logged licence; default to generate when unclear"), conventional commits, and "run `npm run build` before push."

---

## 8. WordPress → Astro Migration (a one-evening job for ~30 posts)

1. WP admin → Tools → Export → All content → `.xml` (WXR).
2. `npx wordpress-export-to-markdown` → MDX + frontmatter, downloads images.
3. Move legacy images to `src/assets/images/archive/`, find-replace `/wp-content/uploads/` paths.
4. Claude Code pass: normalize frontmatter to the Zod schema, strip Elementor shortcodes, generate missing standfirsts.
5. Preserve URL structure (`/<category>/<slug>/`); generate `netlify.toml` 301s from `legacyWpSlug` for any change.
6. `@astrojs/rss` → `/rss.xml`, redirect WP `/feed/`. `@astrojs/sitemap` auto.
7. Deploy to Netlify staging → Lighthouse-audit → DNS cutover.

---

## 9. Hosting → Netlify

Flat $19/mo Pro; **built-in Forms** (newsletter fallback), first-class Astro adapter with skew protection, Starter tier allows commercial use (Vercel Hobby forbids it). Configure a **build hook** for programmatic deploys from Claude Code. Optional `.github/workflows/build.yml` runs `astro check && astro build` on PRs to catch schema violations pre-deploy.

---

## 10. CLAUDE DESIGN PROMPT — All Pages

> Paste the block below into Claude's design/canvas tool. It is written to produce the full set of screens in the "Quiet Authority" direction.

---

### ⬇️ COPY FROM HERE ⬇️

**You are a senior editorial & product designer creating the complete visual system and all core screens for ARAHKAII — a Muslim-owned, Asian modern-luxury / modest-luxury publication ("Asia's modern-luxury edit — modestly told").**

**CREATIVE DIRECTION — "The Quiet Authority":** A publication that feels like a beautifully made book that happens to live on the web. Warm, literary, serif-led, almost bookish, with subtle restrained motion. Reference the *tier* of Tatler Asia, Kinfolk, Cereal, and Apartamento — but DO NOT imitate any of them. The brand's edge is editorial calm: space, restraint, literary type, and obsessive detail that makes a small publication feel more considered than titles with far more authority. Restraint is the highest virtue. Whitespace is the brand. Nothing loud, nothing flashy.

**TYPOGRAPHY (serif speaks, sans signposts):**
- Display/headlines: a literary contemporary serif (GT Sectra / Canela Deck register; use Fraunces at high optical size if substituting). Sentence case. Hero 60–76px, article headlines 44–56px, section heads 26–30px.
- Body/long-form: a warm reading serif (Tiempos/Lyon register; Newsreader if substituting), 18–19px, line-height 1.62, max-width 640px (~70 chars/line). This bookish serif body — not sans — is a signature.
- UI/eyebrows/captions/bylines/meta: ONE quiet neutral sans (Söhne/Suisse/Inter), 12–13px, tracked 0.06em. Sans NEVER carries editorial content.

**PALETTE (warm, uncoated-paper — never pure white/black):**
Surface #F6F1E9 · Ink #1C1815 · Quiet surface #EFE8DB · Muted #7A7065 · Hairline #E2D9CA · Accent (rare) #4A2C3A aubergine · Highlight (very rare) #B06B4E clay. Ratios: surface ≥60%, ink ≥25%, accent <2%.

**GRID & RHYTHM:** 12-col, 80px outer gutters ≥1280px (24px mobile). Article column 640px. 8px base unit; major spacing 48/96px. Photography filter: contrast(1.02) saturate(0.96). Aspect ratios only: 16:9 hero, 3:2 inline, 4:5 portrait, 1:1 carousel. Captions ALWAYS below in sans micro.

**STRUCTURAL SIGNATURES (use consistently across pages):**
- Standfirst set as an italic display-serif epigraph.
- Pull quotes placed in the WIDE MARGIN beside the text column on desktop (book marginalia), not breaking the column.
- ONE elegant drop cap at each article's first paragraph — nowhere else.
- Chapter-like section breaks: generous space + small centred numeral/ornament, not a hard rule.
- Subtle motion only: ~400ms cross-fade page transitions; images blur-up on scroll; hairline reading-progress bar; hover states settle slowly.

**Categories:** Style · Dining · Travel · Culture · Living · People · Guides.
**Modest-luxury imagery:** modest dress, soft natural 4200K light, muted grade, generous negative space. No alcohol/bars/nightlife.

---

**PRODUCE THESE SCREENS at desktop (1440px) AND mobile (390px):**

**1. HOMEPAGE**
- Sticky nav: SVG wordmark left, serif category links centre, search + newsletter icon right. Transparent over hero, settles to #F6F1E9 on scroll. Hairline progress bar at very top.
- Hero: one cover story, full-bleed 16:9, below it eyebrow + serif headline (72px) + italic epigraph standfirst + sans byline. No buttons; whole block clickable.
- "The Edit": three-up feature row, 4:5 portrait images, eyebrow + headline + byline.
- Five category lanes (Style, Dining, Travel, Culture, People): lane title in display serif 36px + 4 cards each (3:2 + headline + byline), gentle horizontal scroll.
- Long-form spotlight: 7-col image / 5-col type, eyebrow + headline + 3-line dek + byline.
- Newsletter line: single serif sentence "Sign up for Arahkaii Weekly. Sundays, in your inbox." + thin underlined email field (pixel-matched, not an iframe).
- Footer: four columns (Editorial / About / Legal / Follow) + copyright. No mega-footer.

**2. ARTICLE PAGE** — "The Quiet Renaissance of Korean Heritage Brands," by Nadra Nichols
- Sticky nav + hairline progress bar.
- Eyebrow `STYLE · FASHION` (sans micro, accent). Headline display serif 56px sentence case, line-height 1.05.
- Standfirst as italic display-serif epigraph, max-width 720px, muted ink.
- Byline row: `By Nadra Nichols · 16 May 2026 · 6 min read` (sans micro, middot separators).
- Hero full-bleed 16:9; caption below: "Above: Wooyoungmi FW26 backstage. (Photo: Courtesy of the brand)".
- Body: 640px column, warm reading serif 18px/1.62, ONE drop cap on first paragraph.
- Section subheads display serif 28px with 48px space above; chapter breaks use a small centred numeral.
- One pull quote in the wide RIGHT margin beside the column (marginalia), display serif ~28px, no quote marks, thin accent rule above.
- Two inline images: one column-width 3:2, one breaking out to 1024px; "Above:" captions.
- One sourced/credited block quote: 32px indent, 1px accent left border, italic serif.
- Inline "Read more: [headline]" cross-link, sans micro all-caps, thin top rule.
- End block: chapter-break ornament → author bio (avatar + 50 words + "Read more by Nadra Nichols") → "More from Style" 3-up row.
- Left-rail floating share column ≥1200px (X, Facebook, copy-link, save) with labels on hover.
- No drop cap clichés elsewhere; no mid-article related carousel.

**3. CATEGORY PAGE (Style)**
- Masthead: "Style" in display serif 96px + 1-line italic dek "Modern wardrobes, modestly told."
- Editor's pick: one large 16:9 story with eyebrow + headline + standfirst + byline.
- Sub-tag chips (sans): Investment Dressing · Fashion Week · K-Fashion · Heritage Brands · Modest Dressing.
- 2-column grid (3:2 thumbs + headline + byline), gentle blur-up on scroll. No sidebar, no widgets.

**4. LISTICLE PAGE** — "The 10 Best Halal Fine-Dining Restaurants in Singapore (2026)"
- Same masthead treatment; standfirst epigraph; hero.
- Signature numbered rhythm: each entry = large oversized serif numeral (01–10) in the margin, entry headline (restaurant name) display serif, a 3:2 REAL photo (sourced via Firecrawl, credited beneath), 2–3 sentence write-up in serif body, and a small sans meta row (neighbourhood · cuisine · price band).
- Consistent vertical cadence between entries; chapter-break numeral ornament between them.
- Sticky mini-index on the left ≥1200px listing 01–10, current entry highlighted.
- End block: newsletter line + "More Guides" row.

**5. AUTHOR PAGE** — Nadra Nichols
- Top: large serif name, sans role line, 60-word bio in serif body, social links (sans micro).
- Below: 2-column grid of their articles (3:2 + headline + date). Calm, no cover photo gimmicks.

**6. ABOUT PAGE**
- Editorial manifesto layout: a single centred serif column (max 640px) reading like a book's opening note — large opening line, drop cap, generous leading. One full-bleed brand image midway. Closes with the seven pillars listed as a quiet sans index and a newsletter line.

**7. NEWSLETTER / SUBSCRIBE PAGE**
- Centred, minimal: serif headline "Arahkaii Weekly", one italic epigraph line of promise, the email field (pixel-matched), a 2-line sans note on cadence ("Sundays. One edit. Unsubscribe anytime."). One quiet supporting image. Nothing else.

**8. EMAIL TEMPLATE (MailerLite)**
- Mirror the site: paper #F6F1E9 background, serif headline, serif body 16–17px, sans eyebrow/meta, hairline rules, one hero image, three story blocks (thumb + headline + 1-line dek + read link). The inbox should be indistinguishable from arahkaii.com.

**9. PUBLISHING PIPELINE DIAGRAM (illustrative, not a UI to build)**
- A calm editorial diagram in the same type/palette showing: Claude.ai chat → Claude Code (/publish) → [OpenRouter generate] + [Firecrawl source] → HUMAN REVIEW GATE → Cloudflare R2 → MDX commit → Netlify build → live. Hairline connectors, sans micro labels, paper background.

---

**DELIVERABLE:** Each screen as a high-fidelity mockup at 1440px and 390px. All editorial type in the literary serif; all UI/meta in the quiet sans. Strict palette ratios. Modest-luxury photography placeholders (soft natural light, warm grade, negative space, modest dress). Pixel-accurate 8px rhythm. Subtle motion notes annotated where relevant. RESTRAINT OVER DECORATION — the most luxurious thing the site can do is feel unhurried.

### ⬆️ COPY TO HERE ⬆️

---

## 11. Next-Level Ideas

- **Programmatic SEO:** extend "Halal Fine Dining in [City] 2026" across Kuala Lumpur, Jakarta, Dubai, Istanbul, Doha, London, Tokyo — templated MDX + editorial gloss + Firecrawl-sourced imagery.
- **OG share images:** Netlify function generates a 1200×630 card per post with the headline set in your display serif.
- **Auto internal-linking:** nightly Claude Code job proposes 3 internal links per new post via PR.
- **Translation lanes:** `posts/zh/` and `posts/ms/` collections with Claude first-pass translations for human review.
- **Trend-mining cron:** weekly job reads curated fashion/dining/travel RSS and proposes 5 Arahkaii-angle ideas in a draft branch.
- **Analytics:** Plausible (~$9/mo) or free Cloudflare Web Analytics — no cookie banner, GDPR-clean. Avoid GA4 for a luxury front door.
- **Print companion (long game):** the same MDX collection can drive a Paged.js quarterly PDF — publishing-house feel, not blog.

---

## 12. Caveats

- **Fonts:** GT Sectra / Canela / Tiempos / Söhne are licensed — budget web licences (typically a few hundred $/yr for a small publisher). Free placeholder stack: **Fraunces + Newsreader + Inter**. Avoid Playfair/Didot/Bodoni — they read "wedding invitation," not "literary press."
- **Image-model dates shift** — build against the OpenRouter/OpenAI SDKs so a model swap is one string. DALL·E 2/3 were removed from the API in May 2026; GPT Image 1 is slated for removal Dec 1 2026.
- **Firecrawl + copyright is the real risk** — the human review gate and logged licence decision are mandatory, not optional. GMB = lead, not source. Default to generate when unclear.
- **Modest-luxury moderation** — generated and sourced images both pass the manual guardrail check, especially early while you learn each model's tendencies.
- **AdSense** (current pub id on the live site): if ads matter, use one tasteful in-article native unit at ~60% scroll depth — no rail/anchor ads, which would damage the Quiet Authority feel most.
- **MailerLite free tier is a runway**, not a destination — plan for $10/mo at ~500 subs / when you turn on the RSS digest.
- **Keystatic, not a custom CMS**, if you ever need a non-technical editor.
