---
description: Auto-illustrate a finished draft — generate the hero + one image per H2 via OpenRouter (Flux for mood, Gemini 3 Pro for heroes/people) and inject <Figure> blocks so the post builds fully illustrated.
---

# /illustrate — one-shot article illustration

Turns a finished **text** draft into a fully illustrated MDX post: a featured
hero plus one image per `##` (H2) section, generated through **OpenRouter** and
injected as `<Figure>` blocks. No manual ChatGPT/Flux round-trips. The engine is
`scripts/illustrate-post.mjs`; this runbook drives it. Run **after** the body is
written (e.g. after `new-post.mjs` or alongside `/publish`).

Images stay **text-free editorial photography** (image-system.md §2 rule 7) — the
model routing is by *fidelity*, not words:
- **heroes + people/hands templates** → `AR_MODEL_TEXT` (`google/gemini-3-pro-image-preview`)
- **mood / still-life templates** → `AR_MODEL_MOOD` (`black-forest-labs/flux.2-pro`)

## 0. Resolve + load
Take a **slug** or path as the argument. Confirm the post's pillar = its
`category`. Load `references/image-system.md` for the post-generation sanity check
(§8). For **listicle / real-entity** pieces where each entry needs a *real* named
product/place, prefer Firecrawl sourcing via `/publish` instead — `/illustrate`
generates conceptual/editorial imagery, not real entities.

## 1. Preview the plan (free — no API calls)
```bash
node scripts/illustrate-post.mjs --post <slug> --hero --sections all --only-prompts
```
Read every prompt + chosen model + filename. Two things to fix here:
- **Weak auto-subjects.** The v1 subject heuristic distils each H2 heading; for
  craft pieces it can read thin ("a handbag quiet luxury"). Supply concrete
  subjects with `--subjects "0=<hero subj>;2=<section-2 subj>;…"` (index `0` =
  hero, then the H2 ordinal). Write them in the locked-template voice.
- **Skip non-visual H2s** (e.g. "Common questions" / FAQ). Use
  `--sections 1,2,3` to name only the sections worth an image, or `--max-images N`.

## 2. Generate + inject (one pass)
```bash
node scripts/illustrate-post.mjs --post <slug> --hero --sections <list> \
  --subjects "0=…;2=…;4=…"
```
- Needs `OPENROUTER_API_KEY` in `.env`. Writes PNGs to
  `src/assets/images/<slug>/` (`hero.png`, `section-NN-<slug>.png`), injects the
  imports + `<Figure>` blocks, flips `.md → .mdx`, and rewrites the hero
  frontmatter. Every image carries `credit="Arahkaii"` (override `--credit`).
- **Idempotent.** Re-running skips images that exist (add `--force` to redo one)
  and never double-injects. Failed images leave their section figure-less so the
  build stays green — re-run `--force --sections N` to retry just that one.
- Fully automatic by design — no interactive approval. (Use `--dry-run` first if
  you want to see the exact edits without spending tokens.)

## 3. 60-second review (image-system.md §8)
Open each new PNG. Editorial or AI-slop? Hands/faces correct? Palette inside the
locked tokens? ≥30% breathing room? Hero subject centred in the safe zone? No
alcohol / club lighting / banned subject? Regenerate any failure:
`node scripts/illustrate-post.mjs --post <slug> --sections <N> --force --subjects "<N>=<better subj>"`.

## 4. Build gate (the test that matters)
```bash
npx astro check && npm run build
```
A green build proves every injected static import resolved to an `ImageMetadata`
and each `<Figure>` rendered. Then hand back to **`/publish`** for the commit —
`/illustrate` never commits.

## Flags
`--hero` regenerate hero · `--sections all|none|1,3` · `--density per-h2|every-other|hero-only` ·
`--subjects "i=text;…"` · `--credit "Arahkaii"` · `--max-images N` · `--force` ·
`--dry-run` (plan only) · `--only-prompts` (prompts only). Model routing is
env-overridable (`AR_MODEL_TEXT` / `AR_MODEL_MOOD` / `AR_MODEL_HERO`) — see `.env.example`.
