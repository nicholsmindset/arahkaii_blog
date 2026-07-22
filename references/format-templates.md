# Format templates — MANDATORY article skeletons

> **This file is a hard rule, not a suggestion. Every article MUST follow the
> skeleton for its `format:` (set on the `content-calendar.md` entry).** The
> brand's credibility — and its SEO/AI-Overview surface — depends on consistent,
> scannable structure. Loaded by `arahkaii-editorial-writer`,
> `arahkaii-editorial-reviewer`, and `/draft-daily` (STEP 4). Voice still comes
> from `brand-voice.md`; this file governs **structure only**.

## The five formats

| `format:` | Used for | Heading rule |
|---|---|---|
| **guide** | "best X", roundups, place/venue directories, city edits, gift edits | **Every item = a named `###` (H3) under a thematic `##` (H2) group.** Item name IS the heading. Each entry block carries the facts (below). |
| **pillar** | big evergreen explainers / category overviews | Thematic `##` H2s (concepts); named brands/ingredients in prose. May use `###` for sub-points, not per-item. |
| **feature** | one subject, trend, or place told as a narrative arc | Thematic `##` H2s, prose. No per-item H3 directory. |
| **profile** | one person | Thematic `##` H2s (scene → backstory → work today → what's next), prose. |
| **essay** | argument / culture / opinion | Thematic `##` H2s, prose; ≥3 concrete named examples per claim. |
| **explainer** | short definitional / "X vs Y" / how-does-it-work pieces | **Question-led `##` H2s**, each with a standalone answer sentence beneath; usually carries a `faq:` block (FAQPage schema). Prose, not a directory. |

## Universal rules (all formats)

1. **One H1 only** — the post `title` (rendered by the layout). **Never** put an H1 in the body.
2. Body sections are `##` (H2). Sub-items/entries are `###` (H3). Never skip a level (no H3 without a parent H2).
3. **Headings name things.** Prefer entity/answer headings ("Beyond The Vines", "What is New Bahru?") over vague ones ("The Experience", "The Vibe", "The Verdict"). Banned vague headings per `brand-voice.md` §6.
4. **Scene-led opening** (2–3 paragraphs, no heading) before the first `##`. Empowering close (a final `##`).
5. **Internal links:** 5–10, from `url-database.md`, category-prefixed (`/style/<slug>/`).
6. **AI-Overview (⊛) topics:** at least one `##` is a **question** with a standalone, quotable answer sentence directly beneath it.
7. `halalStatus:` recorded in frontmatter for every Dining / Travel / Guides piece (internal QA record — not rendered on the page).

## GUIDE — the entry block (MANDATORY)

A guide/listicle is a directory. **Each item gets its own `###` heading (the item's name)** grouped under thematic `##` H2s (e.g. "The fashion labels", "Where to eat and drink", "Where to recover"). Every entry block must contain, in prose or as labelled lines:

- **What it is / makes / serves** — one concrete, specific detail (not "great vibes").
- **Why it's here** — the one reason it earns the slot.
- **Location** — neighbourhood / block / address where known (do not invent unit numbers).
- **Price tier or reservation note** — where relevant.
- **Dietary detail (optional, neutral)** — where it genuinely helps the reader,
  a plain, inclusive note inside the entry — `No alcohol served` · `Pork-free
  kitchen` · `Verify ingredients on the day`. Do **not** write a religious
  "Halal status" line or use "Muslim-owned"/"halal-certified" as on-page copy —
  the venue's status is recorded in the post's internal `halalStatus:`
  frontmatter (QA record), not broadcast in the body.

**Guide skeleton:**
```
[scene-led open, 2–3 paras]
## What is <X>? / Why this list now?
## <Thematic group A>
### <Item 1>      (name as heading + entry block)
### <Item 2>
## <Thematic group B>
### <Item 3>
### <Item 4>
## Editor's pick  (optional)
## <Forward-looking close>
```
Worked reference: `src/content/posts/2026/new-bahru.md`.

## PILLAR / FEATURE / PROFILE / ESSAY

Thematic `##` H2s, narrative prose. Named entities live in the sentences, not as
per-item H3 directories. Still obey the universal rules (one H1, scene open,
question-H2 for ⊛; `halalStatus:` in frontmatter where Dining/Travel/Guides). Use `###`
only for genuine sub-sections, never to fake a directory.

## Reviewer gate (add to `arahkaii-editorial-reviewer`)

Reject the draft if:
- [ ] `format:guide` but items are bold-lead paragraphs instead of `###` headings.
- [ ] A Dining/Travel/Guides post lacks the internal `halalStatus:` frontmatter record, OR foregrounds religious labelling as on-page brand copy.
- [ ] A body H1 exists, or an H3 has no parent H2, or a heading is vague ("The Experience").
- [ ] A ⊛ topic has no question-H2 + answer sentence.
- [ ] Fewer than 5 internal links, or links are not category-prefixed.
