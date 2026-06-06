# Content calendar

The managed topic queue. `/trend-scan` appends `status:proposed`; you flip chosen
ones to `status:ready`; `/draft-daily` drafts the first `ready` and marks it
`drafted`; `/approve` (PR merge) marks it `published`. See `references/content-strategy.md`.

**Entry format** (one `###` block per topic):
```
### <date> | status:proposed|ready|drafted|published | type:trending|evergreen | pillar:<p> | words:<n> | score:<0-100>
keyword: <primary keyword>
angle: <one-line editorial angle — what makes ours different>
links: <2–3 internal-link suggestions from references/url-database.md>
source: <where this came from: trend-scan / manual / refresh>
```
After drafting, the routine appends `| branch:<name>` and after publishing `| url:</cat/slug/>`.

---

### 2026-06-09 | status:ready | type:evergreen | pillar:dining | words:1800 | score:88
keyword: halal fine dining singapore
angle: The definitive halal fine-dining list — every entry halal-certified, reservable, open this month; rooms ranked by the experience, not the hype.
links: /dining/halal-fine-dining-singapore-2026/, /guides/the-complete-guide-to-investment-dressing/
source: manual (validated cluster A)

### 2026-06-10 | status:ready | type:evergreen | pillar:beauty | words:1400 | score:82
keyword: halal skincare brands
angle: The halal-certified skincare worth buying in 2026 — what certification actually means, and the brands clearing the bar.
links: /beauty/c-beauty-vs-k-beauty-2026/, /beauty/beauty-best-chinese-makeup-brands/
source: manual (validated cluster E)

### 2026-06-11 | status:ready | type:evergreen | pillar:travel | words:1600 | score:80
keyword: muslim friendly bali
angle: Bali for the modest traveller — where to pray, eat halal, and stay; the quiet north and east over the crowded south.
links: /travel/southeast-asian-cities-digital-nomad-luxury-lifestyle-2/
source: manual (validated cluster C)

### 2026-06-12 | status:ready | type:evergreen | pillar:style | words:1500 | score:78
keyword: modest luxury fashion
angle: What "modest luxury" actually means in 2026 — the Asian designers defining it, beyond the trend label.
links: /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/, /style/korean-heritage-brands-renaissance/
source: manual (validated cluster D)

### 2026-06-13 | status:ready | type:evergreen | pillar:guides | words:1600 | score:75
keyword: things to do at night singapore
angle: The Arahkaii Evening Edit — late dessert, skyline walks, night markets, cultural shows; an after-dark guide without a single bar.
links: /dining/halal-fine-dining-singapore-2026/
source: manual (validated cluster B)
