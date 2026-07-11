# Arahkaii CMS Production Runbook

## Editorial access

The CMS is available locally and, after deployment, at `/keystatic`. Local
development writes Markdown and images directly to the working tree. Production
uses the GitHub repository `nicholsmindset/arahkaii_blog`; only GitHub users
with repository write access can authenticate.

The editor manages:

- 2025 and 2026 articles, including body copy, approved imagery, credits, SEO,
  FAQ, HowTo and list structured data.
- Author names, roles, biographies and portraits.
- Draft and search-index visibility controls.
- Newsletter provider selection (MailerLite, Beehiiv or temporarily paused).

## Newsletter provider

Choose the active service under **Settings → Newsletter settings**. The CMS
stores only the provider choice; API credentials remain encrypted in Vercel.

- **MailerLite:** set `MAILERLITE_API_KEY`; optionally set
  `MAILERLITE_GROUP_ID`.
- **Beehiiv:** set `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID`. Beehiiv
  publication IDs begin with `pub_`. Enable the welcome-email option only when
  a Beehiiv automation is not already sending one.

Provider changes follow the same `cms/` branch, review and deployment process
as editorial changes. Configure the destination credentials before switching,
then submit one controlled test address after production deploy. The website
form and `/api/subscribe` endpoint do not change.

## Images in the editor

The **Hero image** field accepts JPG, PNG and WebP uploads and commits them to
`src/assets/images/uploads/` with the article change. Prepare a landscape image
at roughly 2400px wide, keep faces and the primary subject inside the centre
60%, and use a descriptive filename such as `seoul-atelier-natural-dye.webp`.
Always complete both **Hero caption** and **Hero credit / licence**. Article-body
images use the same upload library. Image changes remain subject to the pull
request image-rights checklist; GitHub login is not permission to publish an
unlicensed image.

For original AI-assisted artwork, generate a candidate locally before upload:

```bash
node scripts/image-gen.mjs \
  --kind hero \
  --subject "a Kuala Lumpur textile conservator examining handwoven songket" \
  --extra "Documentary working environment; no ceremonial staging" \
  --out /tmp/songket-conservator.png
```

The script applies Arahkaii art direction and modesty guardrails. Human review
is mandatory for anatomy, cultural accuracy, misleading documentary cues,
brand marks and rights. Credit approved generated work as
`Arahkaii Studio · AI-assisted original` rather than presenting it as reportage.

## One-time GitHub App setup

1. Set `KEYSTATIC_STORAGE_KIND=github` locally, run the site and open
   `/keystatic`.
2. Complete Keystatic's GitHub App setup for `https://www.arahkaii.com` and
   grant access only to `nicholsmindset/arahkaii_blog`.
3. Add the generated callback URL for both the production custom domain and the
   Vercel production domain in the GitHub App settings.
4. Add these values to Vercel Production and Preview, never to Git:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
5. Trigger a Vercel deploy, sign into `/keystatic`, and create a test draft on
   a `cms/` branch.

## Publishing boundary

Keystatic can only work with branches beginning `cms/`. Editors do not publish
directly to `main`. Open a pull request, confirm image rights and credits, run
the Quality gates check, review the deploy preview, then merge with human
approval. Vercel publishes the merge.

## Release checklist

- Keep new articles as drafts until copy, links, imagery and credits are final.
- Never use the Verified label without evidence and a review date.
- Confirm the canonical category and URL slug before the first publication.
- Run `npm run verify` before merging.
- Confirm `/keystatic` and `/api/keystatic/*` return `X-Robots-Tag: noindex` in
  production.
