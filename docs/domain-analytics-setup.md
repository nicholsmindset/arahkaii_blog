# arahkaii.com — domain, Search Console & GA4 setup

The three dashboard tasks only an account owner can do, in the order that
avoids re-work: domain first (GSC and GA4 both key off it), then Search
Console, then analytics. Everything code-side is already in the repo.

---

## 1 · Attach arahkaii.com to Vercel

**In Vercel** (dashboard → the arahkaii project → **Settings → Domains**):

1. Add `www.arahkaii.com` and make it the production domain (the site's
	canonicals use `www`).
2. Add `arahkaii.com` and redirect it permanently to `www.arahkaii.com`.

**At your DNS registrar** (wherever arahkaii.com is registered):

| Host | Type | Value |
|---|---|---|
| `@` (apex) | `A` | `76.76.21.21` |
| `www` | `CNAME` | `cname.vercel-dns.com` |

If your registrar supports `ALIAS`/`ANAME` records, you can use
`cname.vercel-dns.com` for the apex instead of the A record — Vercel accepts
either. Delete any old A/CNAME records pointing at the previous host first.

3. Back in Vercel, wait for the domain rows to show **Valid Configuration**.
   TLS certificates are issued automatically (usually < 5 minutes after DNS
   propagates; check with `dig arahkaii.com +short`).
4. Confirm `https://arahkaii.com` redirects once to
	`https://www.arahkaii.com/`.

**After cutover — three checks:**

- The Keystatic GitHub App: update its **Homepage URL / callback URLs** from
  `arahkaiiblog.vercel.app` to `arahkaii.com` (GitHub → Settings → Developer
  settings → GitHub Apps). The `KEYSTATIC_*` env vars themselves don't change.
- The old `arahkaiiblog.vercel.app` URL keeps working and auto-redirects to
  the primary domain once the custom domain is primary — nothing to do.
- When you later wire Resend/MailerLite, use `@arahkaii.com` sender addresses
  and verify the domain in those dashboards (SPF/DKIM records).

---

## 2 · Google Search Console + XML sitemap

The sitemap is already built and served on every deploy — nothing to code:

- `https://www.arahkaii.com/sitemap-index.xml` links the separate pages,
  posts, categories, hubs and authors segments.
- Tag archives and remediation-queue articles are excluded by design.
- `robots.txt` declares the canonical `www` sitemap URLs.

**Steps** (do after the domain is live):

1. [search.google.com/search-console](https://search.google.com/search-console)
   → **Add property** → choose **Domain** (not URL-prefix) → `arahkaii.com`.
   The Domain property covers apex + www + http/https in one.
2. Verify via the **DNS TXT record** it gives you (`google-site-verification=…`)
   — add at the registrar, same place as step 1's records. Verification can
   take a few minutes after the TXT propagates.
3. **Sitemaps** (left nav) → enter `sitemap-index.xml` → Submit. The domain
   property was verified and the sitemap resubmitted on 3 September 2026; its
   existing report showed *Success* with 103 discovered URLs.
4. **URL Inspection** → paste the homepage, one repaired legacy URL and the halal-dining pillar
   (`/dining/halal-fine-dining-singapore-2026/`) → **Request indexing** for
   each. This jump-starts the crawl on a DR-0 domain.
5. The legacy WordPress 301s are generated into `vercel.json`; watch
	**Pages → Not indexed → Page with redirect** to confirm consolidation.

---

## 3 · GA4 + Google Tag Manager

Code side (already in this repo): the site loads GTM **only when
`PUBLIC_GTM_ID` is set** — no analytics ships otherwise — and never on
`/keystatic`. The site pushes two custom events GTM listens for:
`virtual_page_view` (every navigation, view-transition aware) and
`newsletter_signup` (successful subscribe, with `source`).

### 3.1 Create the GA4 property
1. [analytics.google.com](https://analytics.google.com) → Admin → **Create
   property** → name "Arahkaii", timezone Singapore, currency SGD.
2. The **Arahkaii web** stream for `https://www.arahkaii.com` uses Measurement
   ID `G-R0L8CF0K5N` (created 3 September 2026).
3. Leave "Enhanced measurement" ON but disable its **Page views** *scroll*
   and *outbound clicks* toggles (the GTM container tracks those with better
   parameters — leaving both on double-counts).

### 3.2 Create + import the GTM container
1. The dedicated Arahkaii web container is `GTM-KPXTJKGD` (created 3 September
   2026).
2. **Admin → Import Container** → upload `docs/gtm-arahkaii-ga4.json` from
   this repo → choose the **Default Workspace** → **Overwrite** → Confirm.
3. The imported `GA4 Measurement ID` constant is already set to
   `G-R0L8CF0K5N`.
4. **Preview** (Tag Assistant) against `https://www.arahkaii.com` — check the GA4
   Configuration + page_view tags fire on load and again when you click into
   an article (view transition), and that `newsletter_signup` fires when you
   subscribe with a test address.
5. **Submit → Publish** the container version.

### 3.3 Point the site at the container
1. Vercel production has `PUBLIC_GTM_ID = GTM-KPXTJKGD`; Preview remains unset
   so test traffic does not pollute production reporting.
2. **Redeploy** (env vars are baked in at build time).
3. Verify in **GA4 → Reports → Realtime** while browsing the live site.

### 3.4 What the container tracks

| GA4 event | Fires when | Parameters |
|---|---|---|
| `page_view` | every navigation incl. Astro view transitions | page_location, page_path, page_title |
| `newsletter_signup` | successful subscribe (any form) | `source` — homepage / category-style / subscribe-page / … |
| `contact_submit` | contact form success (`/contact?sent=1`) | — |
| `outbound_click` | click on any non-arahkaii.com link | link_url, link_text |
| `scroll_depth` | 50 / 90 % of an article | percent_scrolled |
| `recirculation_click` | an internal article click from an article | link_path, link_text |
| `subscribe_cta_click` | any click on a `/subscribe` link | link_text |

Nothing fires on `/keystatic*` (blocking exception in the container **and**
the snippet is never rendered there).

### 3.5 Recommended GA4 follow-ups (5 minutes)
- **Admin → Events**: mark `newsletter_signup` and `contact_submit` as
  **key events** (conversions).
- **Admin → Data settings → Data retention**: set to 14 months.
- **Admin → Product links → Search Console**: link the GSC property so
  queries appear in GA4's Acquisition reports.
- Create one exploration: `scroll_depth` (90%) by page_path — your true
  "read to the end" report, the metric that matters for an editorial site.
