# Arahkaii Weekly — Sunday digest setup

The code side of the Sunday "Arahkaii Weekly" digest is built: a dedicated,
image-rich feed at **`/digest.xml`** (`src/pages/digest.xml.ts`). The send
itself is a MailerLite campaign you wire up once in the dashboard — these are
the steps only you can do (they need the Arahkaii MailerLite account).

## What the feed gives you

`https://www.arahkaii.com/digest.xml` — separate from the reader-facing
`/rss.xml`, and tuned for RSS-to-email:

- **Latest 12 stories**, newest first (drafts, `noindex` and future-dated posts
  excluded — same rules as the site).
- Each item carries a **hero thumbnail + dek + "Read the full story" link**
  inside `<content:encoded>`, plus an `<enclosure>` image — so a MailerLite
  template can render the master-plan §8 layout (hero + three story blocks:
  thumb · headline · one-line dek · read link).
- `guid` = the canonical article URL, so MailerLite **only sends items new
  since the last Sunday send** — a quiet week sends nothing, a busy week sends
  all the new pieces.

## 1. Create the RSS campaign in MailerLite

1. **Tier:** RSS campaigns require the **Growing Business** plan ($10/mo).
   They are not available on the free tier. (Free is fine up to ~500 subs for
   capture; upgrade when you want the automated digest.)
2. MailerLite → **Campaigns → Create campaign → RSS campaign**.
3. **Feed URL:** `https://www.arahkaii.com/digest.xml`
4. **Schedule:** weekly, **Sunday** (morning SGT). Choose "send only when the
   feed has new items" so a slow week doesn't send an empty edit.
5. **Recipients:** your main subscriber group (or a segment — see §3).

## 2. Template (match the site — master-plan §8)

Make the inbox indistinguishable from arahkaii.com:

- Background paper `#F6F1EA`; ink `#111111`; emerald `#0F3D33` for links/eyebrow.
- Serif headline + body; the wordmark "ARAHKAII" as the header.
- Per story block, map from the feed:
  - **image** → the hero from `<content:encoded>` / `<enclosure>`
  - **headline** → `<title>`
  - **dek** → `<description>`
  - **link** → `<link>` ("Read the full story →")
- Footer: unsubscribe + "Sundays. One edit. Unsubscribe anytime."

## 3. Next steps (provider-side, not yet built in code)

- **Welcome sequence (3 emails)** — MailerLite automation triggered on signup:
  instant welcome + best evergreen → day 3 top stories → day 7 brand note +
  reply prompt. This is a dashboard automation; no code change needed.
  (Note: the `sendWelcomeEmail` flag in Keystatic → Newsletter settings is
  **Beehiiv-only**; MailerLite welcomes are handled by the automation above.)
- **Pillar segmentation** — every signup already sends a `source`
  (`footer` / `article` / `category-<pillar>` / `subscribe-page`) to
  `/api/subscribe`. Today the MailerLite branch drops it and only supports one
  static `MAILERLITE_GROUP_ID`. When you want per-pillar segments, the code
  change is: map `source`/category → MailerLite group IDs in
  `src/pages/api/subscribe.ts` (the Beehiiv branch already threads `source` as
  `utm_medium` for reference). Ask and I'll wire it.

## Provider switch

The active provider is set in **Keystatic → Newsletter settings**
(`src/content/settings/newsletter.json`, currently `mailerlite`). Credentials
live in Vercel env (`MAILERLITE_API_KEY`, optional `MAILERLITE_GROUP_ID`), never
in the CMS. Changing provider needs the matching env vars + a normal deploy.
