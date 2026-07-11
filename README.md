# Arahkaii

Arahkaii is a Muslim-owned Asian modern-luxury publication: **“Asia’s modern-luxury edit — modestly told.”** The site is built with Astro 6, stores editorial content as Markdown/MDX in Git, and deploys to Vercel.

## Local development

Requirements: Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

The local site opens at `http://localhost:4321`.

The editorial CMS opens at `http://localhost:4321/keystatic`. Development mode
writes directly to the working tree; the deployed CMS authenticates through
GitHub and limits editorial work to `cms/` branches.

## Verification

Run the complete release gate before opening a pull request:

```sh
npm run verify
```

`npm run preview` serves the production build locally.

## Project map

```text
src/pages/                 Routes and API endpoints
src/layouts/               Shared page and article layouts
src/components/            Reusable editorial components
src/content/posts/         Published and draft articles by year
src/content/authors/       Author profiles
src/assets/images/         Local-first editorial imagery
src/styles/                Design tokens and page/article styles
references/                Brand, editorial, SEO, and image rules
scripts/                   Publishing, migration, and validation tools
netlify/edge-functions/    Netlify-domain indexing safeguards
```

Read [CLAUDE.md](./CLAUDE.md) for the standing design and editorial rules and [AGENTS.md](./AGENTS.md) for contributor workflow.

## Publishing and deployment

Article frontmatter is validated by `src/content.config.ts`. Published posts require a category, author, credited hero image, caption, and other SEO fields. Legacy WordPress slugs generate permanent redirects automatically.

Vercel must provide `MAILERLITE_API_KEY` for newsletter capture. `MAILERLITE_GROUP_ID` is optional. Copy `.env.example` to `.env` for local secret configuration; never commit `.env`.

The production CMS additionally requires `KEYSTATIC_GITHUB_CLIENT_ID`,
`KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, and
`PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` in Vercel. Only collaborators with write
access to `nicholsmindset/arahkaii_blog` can sign in. CMS branches still pass
through pull-request checks and human approval before reaching `main`.

Use Conventional Commits and merge reviewed pull requests into `main`. Vercel builds the production site from the repository.

## GitHub editorial automation

`.github/workflows/quality.yml` runs the release gate on every pull request and
push to `main`. `.github/workflows/editorial.yml` runs `/draft-daily` at 08:30
Singapore time on weekdays and can run `/draft-daily` or `/trend-scan` manually.
The agent may create a branch and PR, but it is explicitly prohibited from
pushing to `main` or merging.

Configure these GitHub Actions repository secrets before enabling editorial
runs:

- `ANTHROPIC_API_KEY` — required by Claude Code Action.

Install the official Claude GitHub App on the repository so branches and PRs
use an App token and can trigger the separate quality workflow. Scheduled runs
do not receive image-generation secrets: they use an owned placeholder and keep
the PR blocked until the final image passes human review.

Require the **Quality gates** check and a code-owner review in branch protection
for `main`. Keep `MAILERLITE_API_KEY` and the optional `MAILERLITE_GROUP_ID` in
Vercel rather than GitHub unless a workflow genuinely needs them.
