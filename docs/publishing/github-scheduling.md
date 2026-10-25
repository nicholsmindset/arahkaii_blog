# Arahkaii: approve once, publish on the date

**Paused on 26 October 2026 at the user’s request.** The publishing workflow is disabled and all14 queued articles are drafts. Saved dates are preserved. Resume requires an explicit request, review of dates and draft flags, and re-enabling the workflow.

Setup checked 25 October 2026: Vercel is connected to `nicholsmindset/arahkaii_blog`, production branch `main`. The main-branch hook is stored as the Actions secret `VERCEL_DEPLOY_HOOK`. Workflow activation requires this reviewed change to be merged; verify its Actions run before treating scheduling as enabled.

## The team's routine

1. Create or paste the article in the existing Git-backed editor (`/keystatic`) on an editorial branch, or have the operator prepare a pull request. Keep **Draft** checked while editing. Add the images, credits, Nadra Nichols byline, sources and planned publication date.
2. Review the exact article, claims, links and images. A calendar entry is not approval of an article. The current editor uses a date-only field: `2026-11-01` becomes eligible at **08:00 Singapore time** (midnight UTC). For a precise time, an operator can use quoted frontmatter `date: '2026-11-01T09:00:00+08:00'`. Do not put a timezone-free timestamp in a post.
3. After editorial approval, uncheck **Draft** in the reviewed pull request and merge it to `main`. Leave `noindex: true` stories out of this public-release process. The merge approves the exact article for its future date. Before the date, the production article URL does not exist and it stays out of lists, search, RSS and sitemaps.
4. GitHub checks hourly at minute 17. After the date, it requests a Vercel rebuild only if a due article is missing from the live article sitemap. Allow the next hourly run plus build time; this is not exact-minute scheduling.
5. Open GitHub **Actions → Publish scheduled articles**. A successful publishing run confirms that every due article appears in the live sitemap. Then open the actual article URL to check its appearance. A failed run needs investigation; it does not mean the article is live.

A past date becomes eligible immediately on the next production deployment. Keep unfinished articles marked as drafts. Changing a live article back to draft requires merging that change and a new production deployment to remove it.

The existing preview route only renders articles whose date is already due, even on Vercel previews. Until that separate editor improvement is made, review future articles in the pull request/local editor rather than expecting their preview URLs to resolve. Verify the final scheduled date in the same reviewed PR.

## One-time operator setup

1. Review this change and run `npm run verify`. Merge through the existing reviewed PR process. Do not weaken protections on `main`; require review for article, image and workflow changes. This scheduler cannot independently prove a human approved a merge. At setup, `main` has no branch protection; editorial review and an authorised PR merge are an operational requirement, not an enforced technical gate.
2. In Vercel, confirm the project is connected to **nicholsmindset/arahkaii_blog**, its production branch is **main**, and the domain is **www.arahkaii.com**. The live project connection and main production branch were verified through the Vercel API on 25 October 2026.
3. In that project's **Settings → Git → Deploy Hooks**, create `GitHub scheduled articles` for **main**. Store the resulting URL directly as the repository Actions secret **VERCEL_DEPLOY_HOOK**. Treat it as a password; do not paste it in a chat, source file, issue or log. This setup needs no Vercel account API token, PAT, Airtable or n8n credential.
4. Verify Vercel does not skip rebuilds when a commit has already been deployed, and the hook targets the expected branch/project. `github.enabled = false` would disable hooks. A hook rebuild deploys the whole latest reviewed `main`, so all changes on main must be approved and deployable.
5. From **Actions → Publish scheduled articles → Run workflow**, choose `main` and leave the deployment checkbox off. This only compares eligible local posts with the live sitemap. Inspect every reported missing story before enabling the secret/first publishing run.
6. After the dry run and exact article approval, enable **Rebuild production for due, approved articles** for a controlled first test. Confirm the Vercel deployment and article URL. Future hourly runs are automatic while the workflow remains enabled and the secret is configured.

The workflow checks the sitemap before running the full release gate, so no-change hours do not build the site. It has read-only GitHub permissions, never edits content or merges PRs, limits deployment to the designated main branch, and keeps the hook out of checkout, install and validation steps. Failed/malformed sitemap responses stop the run. A successful hook response alone is not success: the job waits up to 10 minutes for due stories in the production sitemap, then fails visibly if they remain absent. The next hourly run can retry a failed rebuild. Disable this workflow during an intentional production rollback to avoid re-releasing removed stories.

## Limits and maintenance

- GitHub schedules can be delayed or dropped, and run only from the default branch. Public repositories with no activity for 60 days have scheduled workflows disabled automatically. With a long 2026–2027 calendar merged in one batch, check workflow activity monthly and re-enable if needed. Do not describe this as guaranteed unattended publishing for the entire year.
- The existing editor has a calendar date, not a time picker; date-only schedules release from 08:00 Singapore time, followed by the next available check/build.
- Automatic runs require GitHub Actions availability and allowance, successful repository verification and a working Vercel deployment. A future date alone does not rebuild a static site.
- The scheduler detects newly due public stories by URL, not updates to existing stories. Ordinary reviewed merges handle article corrections and removals through Vercel's Git integration.
- Images and claims still require editorial review. Scheduling provides no factual, rights or author-approval verification.

## Validation

Run `npm run test:publishing`, `npm run verify`, and the safe live comparison `node scripts/scheduled-publishing.mjs`. Never add `--deploy` locally; deployment is restricted to the designated GitHub main branch context.

Official references: [GitHub schedule behaviour](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks).
