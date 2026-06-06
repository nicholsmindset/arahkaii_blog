---
description: Approve a drafted post — confirm the Netlify preview was reviewed, then merge its PR to main (publish) and log it. The single human gate before anything goes live.
---

# /approve — publish a reviewed draft

Usage: `/approve <slug or PR number>`.

1. **Locate the PR** (`gh pr list` / `gh pr view <n>`). Confirm it's a
   `drafts/<date>-<slug>` editorial PR with a green Netlify deploy preview.
2. **Confirm review.** The human has read the preview. If sourced images were
   offered, ensure the chosen one is committed on the branch (swap if needed,
   push, let the preview rebuild).
3. **Final gate:** `gh pr checks <n>` green; re-run `node scripts/validate-schema.mjs`
   against the preview build if in doubt; every image credited.
4. **Merge:** `gh pr merge <n> --squash --delete-branch`. Netlify builds `main`
   → live at `/<category>/<slug>/` in ~90s.
5. **Log:** append `run-log.md` (`<ts> | approved | <slug> | pr:<n> | live`).
   Update `content-calendar.md` (`drafted → published`).

**Reject instead:** comment the fixes on the PR (I revise on the branch, the
preview updates) or `gh pr close <n>` to drop it. Never merge a draft that fails
the editorial bar, lacks halal status (Dining/Travel/Guides), or has an
uncredited image.
