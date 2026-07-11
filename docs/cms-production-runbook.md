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

## One-time GitHub App setup

1. Set `KEYSTATIC_STORAGE_KIND=github` locally, run the site and open
   `/keystatic`.
2. Complete Keystatic's GitHub App setup for `https://www.arahkaii.com` and
   grant access only to `nicholsmindset/arahkaii_blog`.
3. Add the generated callback URL for both the production custom domain and the
   Netlify deploy-preview domain in the GitHub App settings.
4. Add these values to Netlify, never to Git:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
5. Trigger a Netlify deploy, sign into `/keystatic`, and create a test draft on
   a `cms/` branch.

## Publishing boundary

Keystatic can only work with branches beginning `cms/`. Editors do not publish
directly to `main`. Open a pull request, confirm image rights and credits, run
the Quality gates check, review the deploy preview, then merge with human
approval. Netlify publishes the merge.

## Release checklist

- Keep new articles as drafts until copy, links, imagery and credits are final.
- Never use the Verified label without evidence and a review date.
- Confirm the canonical category and URL slug before the first publication.
- Run `npm run verify` before merging.
- Confirm `/keystatic` and `/api/keystatic/*` return `X-Robots-Tag: noindex` in
  production.
