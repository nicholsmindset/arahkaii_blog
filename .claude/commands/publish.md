---
description: Publish a finished draft as a schema-valid Arahkaii post — write MDX, source/place images behind a human gate, validate, commit.
---

# /publish — Arahkaii's CMS-less publishing runbook

Claude Code _is_ the CMS. When the user runs `/publish` (optionally pasting or
pointing at a finished draft), execute this flow. **Stop at the human gate.**

## 0. Gather the post
From the draft, settle: **title** (≤110), **category** (one of
style · beauty · dining · travel · culture · living · people · guides), **author** (an id
in `src/content/authors/` — create the profile first if new), **tags**, and the
**body** in British English, em-dashes, on the "Quiet Authority" voice.

Write a **standfirst** (25–40 words, ≤220 chars) as an italic epigraph. Open the
body with `<DropCap>…</DropCap>`; use `<PullQuote>`, `<Figure>`, `## subheads`,
and chapter breaks (`<div class="chapter"><span>02</span></div>`) for rhythm.
MDX bodies must `import` the components they use from `../../../components/article/`.

## 1. Images — two sources, ONE human gate
Per image (hero + inline), choose a source:

- **SOURCE (real entities / listicles)** — use the **Firecrawl MCP**: scrape the
  entity's **official site first** (never GMB — those are visitor uploads, only
  leads). Collect candidate image URLs **with their source URL**.
- **GENERATE (conceptual/mood)** — `node scripts/image-gen.mjs` (needs
  `OPENROUTER_API_KEY`; if absent, source instead or ask the user).

**HUMAN REVIEW GATE — do not skip.** Present each candidate to the user:
thumbnail/URL · detected source/credit · proposed licence decision. Wait for:
`[Approve & use]` · `[Reject]` · `[Generate instead]`. For every approved image
record a **licence decision**: _own/brand-supplied_ ("Courtesy of <name>") ·
_credited editorial use_ · _needs permission — hold_ · _reject → generate_.
**When rights are unclear → generate instead.** Apply the modest-luxury
guardrail to sourced photos too (a restaurant shot may contain a bar).

Download approved images locally; pass the hero file path to `new-post.mjs`.
(Inline images: place under `src/assets/images/<slug>/` and reference relatively
in the MDX via `<Figure src={…} credit="…" />`.)

## 2. Write the post (deterministic)
```bash
node scripts/new-post.mjs \
  --title "…" --category <cat> --author <id> \
  --standfirst "…" --tags "Tag1,Tag2" \
  --hero /path/to/cover.jpg \
  --hero-caption "…" --hero-credit "Courtesy of <name>" \
  --body /path/to/body.mdx           # or --body-stdin
  [--date YYYY-MM-DD] [--draft]
```
`new-post.mjs` validates the schema rules (category enum, lengths, required
caption/**credit**, author exists), copies the hero into
`src/assets/images/<slug>/`, and writes `src/content/posts/<year>/<slug>.mdx`.
Use `--dry-run` first to preview. **credit is mandatory** — the script refuses
without it, and the build fails on it too.

## 3. Validate (the gate that matters)
```bash
npm run verify
```
A green build means every required field is present and valid. Fix anything the
Zod schema rejects, re-run until clean.

## 4. Commit
Show the user the new file + image, then (only when they confirm) conventional
commit and push:
```bash
git add src/content/posts src/assets/images && git commit -m "post: <title>" && git push
```
Netlify rebuilds (~60–90s) → live at `/<category>/<slug>/`. The `legacyWpSlug`
field is for migrated posts only; new posts omit it.

## Not yet wired
- **R2 hosting** — local-first for now (images committed to `src/assets`).
- **MailerLite RSS digest** — capture is live through `/api/subscribe`; automated
  digest creation remains deferred.
- **AI generation** — `scripts/image-gen.mjs` is ready; add `OPENROUTER_API_KEY`.
