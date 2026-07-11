---
name: arahkaii-publisher
description: Publish a drafted Arahkaii article to the Astro/Git site (replaces the old WordPress publisher). Use whenever a finished, reviewed draft needs to become a post — writes the MDX + frontmatter, places images locally, validates against the Zod schema + JSON-LD, and opens a PR (merge = live via Netlify). Loads references/brand-voice.md, editorial-pillars.md, halal-substitutions.md, image-system.md, seo-fields.md, schema-map.md, url-database.md before any write. Refuses to publish alcohol/nightlife content, anything missing halal status in Dining/Travel/Guides, an uncredited image, or a draft that fails the AI-slop checklist. Never pushes to main directly — humans merge the PR.
---

# Arahkaii Publisher (Astro/Git)

The final gate between a draft and the live site. Astro is the destination — no
WordPress, no RankMath, no `wp_*` MCP. Content is MDX in Git; merging a PR to
`main` triggers the Netlify build.

## Step 0 — Load the foundation
`references/brand-voice.md` · `editorial-pillars.md` · `halal-substitutions.md` ·
`image-system.md` · `seo-fields.md` · `schema-map.md` · `url-database.md`.

## Step 1 — Pre-publish checks (REJECT if any fail)
| Check | Pass |
|---|---|
| Reviewed by `arahkaii-editorial-reviewer` | ✅ verdict attached |
| Pillar = one of the 8 (`category` enum) | yes |
| Halal status stated (Dining/Travel/Guides) | plainly, per entry |
| Alcohol/nightlife scan | zero hits |
| AI-slop checklist (`brand-voice.md` §6) | ≤1 box |
| Banned-phrase scan (§2 Tier-1) | zero |
| Word count ≥ 800 | yes |
| Internal links 5–8 from `url-database.md` | yes |
| Hero + per-H2 images present, **every image credited** | yes |
| `seoTitle` ≤70, `metaDescription` ≤160 | yes |
| Schema fields set per `schema-map.md` (faq/howTo/listItems as applicable) | yes |

## Step 2 — Write the post
Run the deterministic writer (see also the `/publish` and `/draft-daily` commands):
```bash
node scripts/new-post.mjs --title "…" --category <pillar> --author <id> \
  --standfirst "…" --tags "…" --seo-title "…" --meta-description "…" \
  --hero <file> --hero-caption "…" --hero-credit "…" --body <file.mdx>
```
Do not pass `--draft` for a PR-bound article. The feature branch is the draft
boundary; the article must render in the Netlify preview before human approval.
Inline images: place under `src/assets/images/<slug>/` and reference via
`<Figure src={…} caption credit ratio>` in the MDX (density per `content-strategy.md`).
FAQ/HowTo/ItemList → frontmatter fields (`schema-map.md`).

## Step 3 — Validate (round-trip)
```bash
npm run verify
```
Green build = schema satisfied (category, hero, caption, **credit**, lengths).
Fix anything rejected; re-run until clean.

## Step 4 — Open a PR (never push main)
```bash
git switch -c drafts/<date>-<slug>
git add src/content/posts src/assets/images
git commit -m "post: <title>"
git push -u origin HEAD
gh pr create --title "post: <title>" --body "<angle · SEO · sourced-image candidates · preview note>"
```
Netlify builds a deploy preview on the PR. The PR is the human notification and
review surface. **Approval = merge** (see `/approve`) → live at
`/<category>/<slug>/`.

## NEVER
Push to `main` without a merged PR · publish alcohol/nightlife · ship an
uncredited image · skip `validate-schema` · continue past a build/verify failure.
