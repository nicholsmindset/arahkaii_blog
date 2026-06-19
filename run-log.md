# Run log

Append-only. One line per automation run (trend-scan / draft-daily / approve /
weekly / monthly / quarterly). Format:

```
<ISO timestamp> | <routine> | <success|skip|fail> | <summary> | <details>
```

---
2026-06-19 | draft-daily | success | Drafted "Inside New Bahru: the homegrown labels worth the trip" (style, slug new-bahru) | Grounded via Firecrawl (no-hallucination pass: corrected false "Mori hotel" premise → Alma House; verified tenants Beyond The Vines, rye, MAKE by GINLEE, Curious Creatures, Good Addition, Crafune, SOJAO, BEAMS; halal notes Kios Minang Muslim-owned, Coconut Club no-pork/no-lard not certified). 7 internal links, 0 Tier-1 banned phrases, astro check 0 errors, build green. FLAGS for human: (1) hero is a PLACEHOLDER — generate/source real New Bahru image (prompt in references/image-prompts-2026-h2.md #1) + log licence before publish; (2) body ~1,400w vs 1,900 target — deliberately tight, expandable on request; (3) no inline images yet — source 2–3 real-entity candidates with licence. draft:true. branch drafts/2026-06-22-new-bahru.
2026-06-20 | draft-daily (revise) | success | Restructured New Bahru into format:guide + established mandatory format templates | Per editor feedback (brand risk): every shop/venue now a named ### (H3) under thematic ## groups; halal-status line in each of 5 F&B entries; body word count 1,138→1,657; 0 body H1, no orphan H3, banned-scan clean, build green. NEW canonical rule: references/format-templates.md (5+1 formats, MUST-FOLLOW). Added format: field to all 72 calendar entries (guide 51 / feature 10 / profile 5 / essay 4 / explainer 3 / pillar 1). Enforced in draft-daily.md (STEP 1/4/6) + arahkaii-editorial-writer + arahkaii-editorial-reviewer skills. Hero still PLACEHOLDER (human gate).
