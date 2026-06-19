# Content calendar

The managed topic queue. `/trend-scan` appends `status:proposed`; you flip chosen
ones to `status:ready`; `/draft-daily` drafts the first `ready` and marks it
`drafted`; `/approve` (PR merge) marks it `published`. See `references/content-strategy.md`.

**Entry format** (one `###` block per topic):
```
### <date> | status:proposed|ready|drafted|published | type:trending|evergreen | pillar:<p> | format:guide|pillar|feature|profile|essay|explainer | words:<n> | score:<0-100>
keyword: <primary keyword>
angle: <one-line editorial angle — what makes ours different>
links: <2–3 internal-link suggestions from references/url-database.md>
source: <where this came from: trend-scan / manual / refresh>
```
After drafting, the routine appends `| branch:<name>` and after publishing `| url:</cat/slug/>`.

> **`format:` is MANDATORY and dictates the article skeleton — see
> `references/format-templates.md`.** In particular, a **`format:guide`** post MUST
> render every item (shop, restaurant, hotel, label) as its own named `###` (H3)
> under thematic `##` groups, with a **halal-status line inside each F&B entry** —
> never as bold-lead paragraphs. This is a brand-protection rule, enforced by the
> editorial reviewer. Worked reference: `/style/new-bahru/`.

> **This queue = the 90-day H2-2026 calendar (~64 posts, Jun 22 – Sep 18).** Backed by
> live Ahrefs keyword research + competitor content-gap in
> `references/keyword-research-2026-h2.md`; ChatGPT/DALL·E image prompts in
> `references/image-prompts-2026-h2.md`. Strategy: arahkaii.com is **DR 0**, so we
> lead with KD ≤ ~5 long-tail on thin SERPs and win the **halal/modest reframe** of
> lists competitors rank for but never halal-filter. ⊛ = AI-Overview present (add a
> question-H2 + standalone answer sentence). Replaces the earlier 5 Jun 9–13 placeholders.

---

### 2026-06-22 | status:drafted | type:evergreen | pillar:style | format:guide | words:1900 | score:90 | branch:drafts/2026-06-22-new-bahru
keyword: new bahru
angle: Inside New Bahru — the homegrown Singapore labels (Beyond The Vines, GINLEE, rye…) worth the trip; the place as a map of modern-luxury local design. (head term 20k/KD2, build authority)
links: /style/korean-heritage-brands-renaissance/, /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/
source: keyword-research-2026-h2

### 2026-06-23 | status:ready | type:evergreen | pillar:dining | format:guide | words:1800 | score:86
keyword: best brunch singapore
angle: The alcohol-free brunch edit — where to linger over coffee, no mimosas; halal status per venue. Distinct from (and links to) the existing halal-sunday-brunch piece by going broad/weekday. ⊛
links: /dining/halal-fine-dining-singapore-2026/, cluster: halal-sunday-brunch-singapore
source: keyword-research-2026-h2

### 2026-06-24 | status:ready | type:evergreen | pillar:travel | format:guide | words:1900 | score:90
keyword: things to do in johor bahru
angle: 24 hours in JB — eat, spa, shop, pray; halal-first, no nightlife. ⊛ (KD1, SERP beatable)
links: /travel/singapore-stopover-guide-48-hours/, cluster: binchotan-jb-dining
source: keyword-research-2026-h2

### 2026-06-25 | status:ready | type:evergreen | pillar:beauty | format:pillar | words:2000 | score:82
keyword: japanese skincare brands
angle: After K-beauty — the J-beauty skin-wardrobe for the tropics; slow, barrier-first formulas. ⊛
links: /beauty/k-beauty-broke-the-algorithm/, /beauty/c-beauty-vs-k-beauty-2026/
source: keyword-research-2026-h2

### 2026-06-26 | status:ready | type:evergreen | pillar:living | format:guide | words:1900 | score:90
keyword: staycation singapore
angle: The 2026 staycation edit — design-led hotels worth booking, modest-traveller notes. (KD1, vol 3.5k)
links: /guides/the-complete-guide-to-quiet-luxury/, cluster: staycation-deals-singapore
source: keyword-research-2026-h2

### 2026-06-29 | status:ready | type:evergreen | pillar:dining | format:guide | words:1900 | score:88
keyword: afternoon tea singapore
angle: The most beautiful afternoon-tea settings in Singapore right now — halal status stated; the modest hotel-luxury ritual (substitutes the hotel bar). (high tea 5.8k/KD2)
links: /dining/halal-fine-dining-singapore-2026/, cluster: halal-high-tea-singapore
source: keyword-research-2026-h2

### 2026-06-30 | status:ready | type:evergreen | pillar:travel | format:guide | words:1900 | score:90
keyword: things to do in penang
angle: Penang for the modest traveller — eat, walk, pray, stay; George Town heritage. ⊛ (KD2, SERP beatable)
links: /travel/singapore-stopover-guide-48-hours/, cluster: things-to-do-johor-bahru
source: keyword-research-2026-h2

### 2026-07-01 | status:ready | type:evergreen | pillar:style | format:feature | words:1800 | score:84
keyword: kebaya
angle: The kebaya, re-read — heritage dress as modern luxury; the makers reviving it. ⊛ (3.6k/KD5)
links: /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/, cluster: nyonya-kebaya
source: keyword-research-2026-h2

### 2026-07-02 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1800 | score:82
keyword: best perfume store singapore
angle: The scent-wardrobe guide — layering, oils, alcohol-free houses; fragrance as editorial, not transaction. (best perfume store 5.4k/KD0)
links: /beauty/c-beauty-vs-k-beauty-2026/, cluster: oud-attar-fragrance
source: keyword-research-2026-h2

### 2026-07-03 | status:ready | type:evergreen | pillar:dining | format:guide | words:1800 | score:88
keyword: best dim sum singapore
angle: The best halal dim sum in Singapore — the gap nobody fills (Tatler ranks, not halal-filtered).
links: /dining/halal-fine-dining-singapore-2026/, cluster: afternoon-tea-singapore
source: keyword-research-2026-h2

### 2026-07-06 | status:ready | type:evergreen | pillar:living | format:guide | words:1800 | score:85
keyword: spa singapore
angle: The best spa & hammam rituals — women-only & private rooms, Middle-Eastern hammam, modest comfort.
links: /guides/the-complete-guide-to-quiet-luxury/, cluster: head-spa-singapore
source: keyword-research-2026-h2

### 2026-07-07 | status:ready | type:evergreen | pillar:travel | format:guide | words:1900 | score:86
keyword: things to do in bali
angle: Bali done modestly — villa-pool privacy, halal kitchens, quiet north and east over the crowded south. ⊛
links: /travel/southeast-asian-cities-digital-nomad-luxury-lifestyle-2/, cluster: things-to-do-penang
source: keyword-research-2026-h2

### 2026-07-08 | status:ready | type:evergreen | pillar:dining | format:guide | words:1700 | score:86
keyword: matcha singapore
angle: The matcha rooms — Singapore's alcohol-free social ritual; specialty matcha cafés. (KD0, SERP all DR<35)
links: /dining/halal-fine-dining-singapore-2026/, cluster: best-cafe-singapore
source: keyword-research-2026-h2

### 2026-07-09 | status:ready | type:evergreen | pillar:style | format:guide | words:1700 | score:78
keyword: singapore fashion brands
angle: The SG modest-luxury & Muslim-owned labels to know — distinct from New Bahru's place-led angle (the labels, not the building).
links: cluster: new-bahru, /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/
source: keyword-research-2026-h2

### 2026-07-10 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1700 | score:82
keyword: hair salon singapore
angle: The best salons for hijabi & textured/covered hair — privacy, women-only rooms, the care the niche needs.
links: cluster: best-facials-singapore, /beauty/k-beauty-broke-the-algorithm/
source: keyword-research-2026-h2

### 2026-07-13 | status:ready | type:evergreen | pillar:dining | format:guide | words:1800 | score:84
keyword: mookata
angle: The best halal mookata & Thai BBQ in Singapore — 11k-volume head, no halal-filtered incumbent.
links: cluster: best-dim-sum-singapore, /dining/halal-fine-dining-singapore-2026/
source: keyword-research-2026-h2

### 2026-07-14 | status:ready | type:evergreen | pillar:travel | format:guide | words:1900 | score:84
keyword: penang hill
angle: Penang's heritage-luxury — restored Straits mansions, Peranakan tables, the hill; for the art-collecting family. ⊛ (penang hill 2.1k / penang culture 2.5k)
links: cluster: things-to-do-penang, /travel/southeast-asian-cities-digital-nomad-luxury-lifestyle-2/
source: keyword-research-2026-h2

### 2026-07-15 | status:ready | type:evergreen | pillar:people | format:profile | words:1500 | score:74
keyword: halal fine dining founder singapore
angle: The Modest Leaders — the founder building modern halal fine dining (verify named subject before draft).
links: /dining/halal-fine-dining-singapore-2026/, cluster: best-brunch-singapore
source: keyword-research-2026-h2

### 2026-07-16 | status:ready | type:evergreen | pillar:living | format:guide | words:1600 | score:82
keyword: head spa singapore
angle: The head-spa ritual — Japan's quiet wellness import; where to book, what it does. (KD1, trending niche)
links: cluster: spa-singapore, /guides/the-complete-guide-to-quiet-luxury/
source: keyword-research-2026-h2

### 2026-07-17 | status:ready | type:evergreen | pillar:beauty | format:explainer | words:1300 | score:80
keyword: retinal vs retinol
angle: Retinal vs retinol — the explainer; pure editorial, GEO/AI-Overview citation play. ⊛
links: /beauty/k-beauty-broke-the-algorithm/, cluster: halal-skincare-brands
source: keyword-research-2026-h2

### 2026-07-20 | status:ready | type:evergreen | pillar:dining | format:guide | words:1800 | score:82
keyword: best steakhouse singapore
angle: The best halal steakhouses & grills (ASAP & Co et al.) — halal reframe of a proven Tatler list.
links: cluster: best-dim-sum-singapore, /dining/halal-fine-dining-singapore-2026/
source: keyword-research-2026-h2

### 2026-07-21 | status:ready | type:evergreen | pillar:style | format:feature | words:1600 | score:78
keyword: nyonya kebaya
angle: The Peranakan kebaya — craft, lineage, the makers reviving it by hand. (KD1, heritage)
links: cluster: kebaya, /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/
source: keyword-research-2026-h2

### 2026-07-22 | status:ready | type:trending | pillar:travel | format:guide | words:1700 | score:80
keyword: the singapore edition
angle: New luxury hotels through a modest-traveller lens (Raffles Sentosa, The Singapore EDITION) — CNA ranks only pos 16; beatable.
links: cluster: staycation-singapore, /travel/singapore-stopover-guide-48-hours/
source: keyword-research-2026-h2

### 2026-07-23 | status:ready | type:evergreen | pillar:culture | format:essay | words:1500 | score:80
keyword: modest fashion
angle: The $90bn quiet revolution — modest fashion as a luxury force, not a label; 3+ named examples. (parent vol 9.3k global)
links: /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/, cluster: new-bahru
source: keyword-research-2026-h2

### 2026-07-24 | status:ready | type:evergreen | pillar:dining | format:guide | words:1700 | score:84
keyword: dessert singapore
angle: The dessert bars insiders know — a sober date-night map; late-night dessert without a bar. (KD0)
links: cluster: matcha-singapore, /dining/halal-fine-dining-singapore-2026/
source: keyword-research-2026-h2

### 2026-07-27 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1600 | score:78
keyword: colour analysis singapore
angle: Colour analysis for Southeast Asian & deeper skin tones — pairs with our foundation-shade authority.
links: /beauty/the-ultimate-guide-to-finding-the-perfect-foundation-shade-for-southeast-asian-skin-tones/, /beauty/k-beauty-broke-the-algorithm/
source: keyword-research-2026-h2

### 2026-07-28 | status:ready | type:evergreen | pillar:travel | format:guide | words:1900 | score:80
keyword: labuan bajo
angle: Labuan Bajo & Flores for the modest traveller — the CNA-validated Indonesia gap (9.2k head). Prayer, halal food, modest swim.
links: cluster: things-to-do-bali, /travel/southeast-asian-cities-digital-nomad-luxury-lifestyle-2/
source: keyword-research-2026-h2

### 2026-07-29 | status:ready | type:evergreen | pillar:dining | format:guide | words:1700 | score:85
keyword: halal omakase singapore
angle: The halal omakase counters worth booking — tea-paired tasting menus (substitutes wine pairing). (best omakase 1.2k)
links: /dining/halal-fine-dining-singapore-2026/, cluster: afternoon-tea-singapore
source: keyword-research-2026-h2

### 2026-07-30 | status:ready | type:evergreen | pillar:living | format:feature | words:1800 | score:84
keyword: condo interior design singapore
angle: A quiet-luxury condo tour — named designer, materials, light; fills the near-empty Living pillar. (KD2, SERP beatable)
links: /guides/the-complete-guide-to-quiet-luxury/, /living/the-conscious-luxury-manifesto-sustainable-living/
source: keyword-research-2026-h2

### 2026-07-31 | status:ready | type:evergreen | pillar:style | format:feature | words:1700 | score:78
keyword: abaya
angle: The abaya as luxury — cut, cloth, the houses redefining it; styling for Singapore's climate. (1.5k/KD12)
links: cluster: kebaya, /style/modest-fashion-streetwear-southeast-asia-muslim-fashion-2025/
source: keyword-research-2026-h2

### 2026-08-03 | status:ready | type:evergreen | pillar:dining | format:guide | words:1800 | score:82
keyword: peking duck singapore
angle: Muslim-friendly roast duck & modern Chinese in Singapore — halal reframe of a 2.3k list.
links: cluster: best-dim-sum-singapore, cluster: mookata
source: keyword-research-2026-h2

### 2026-08-04 | status:ready | type:evergreen | pillar:travel | format:guide | words:1700 | score:80
keyword: binchotan jb
angle: The Singapore→Johor dining run — halal omakase & premium dining across the causeway. (Tatler ranks #4; cross-border)
links: cluster: things-to-do-johor-bahru, cluster: halal-omakase-singapore
source: keyword-research-2026-h2

### 2026-08-05 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1600 | score:74
keyword: korean skincare singapore
angle: Where to buy K-beauty in Singapore — and what's actually worth it (localised buyer's guide, not a brand round-up).
links: /beauty/k-beauty-broke-the-algorithm/, /beauty/c-beauty-vs-k-beauty-2026/
source: keyword-research-2026-h2

### 2026-08-06 | status:ready | type:evergreen | pillar:people | format:profile | words:1500 | score:72
keyword: modest fashion designer southeast asia
angle: The atelier reviving songket/kebaya by hand — a day in the studio (verify named subject before draft).
links: cluster: new-bahru, cluster: nyonya-kebaya
source: keyword-research-2026-h2

### 2026-08-07 | status:ready | type:evergreen | pillar:guides | format:guide | words:2000 | score:88
keyword: things to do in singapore this weekend
angle: The Arahkaii weekend edit — alcohol-free things to do, refreshed; clones HB SG's 5.8k-traffic format with a modest lens.
links: cluster: best-brunch-singapore, cluster: dessert-singapore
source: keyword-research-2026-h2

### 2026-08-10 | status:ready | type:evergreen | pillar:dining | format:guide | words:1900 | score:84
keyword: michelin star restaurants singapore
angle: The Muslim-friendly Michelin guide to Singapore — which starred rooms a Muslim diner can actually book.
links: /dining/halal-fine-dining-singapore-2026/, cluster: best-restaurants-singapore
source: keyword-research-2026-h2

### 2026-08-11 | status:ready | type:evergreen | pillar:style | format:guide | words:1700 | score:76
keyword: bespoke jewellery singapore
angle: Fine jewellery as adornment — the bespoke SG ateliers; investment & modest styling. (jewellery 350/200)
links: /guides/the-complete-guide-to-investment-dressing/, cluster: new-bahru
source: keyword-research-2026-h2

### 2026-08-12 | status:ready | type:evergreen | pillar:travel | format:essay | words:1600 | score:78
keyword: things to do in dubai
angle: Dubai vs Singapore — two visions of Muslim-friendly luxury; the comparison only a Muslim-owned title can land. ⊛
links: cluster: things-to-do-bali, cluster: the-singapore-edition
source: keyword-research-2026-h2

### 2026-08-13 | status:ready | type:evergreen | pillar:beauty | format:explainer | words:1500 | score:76
keyword: halal skincare brands
angle: Halal-certified skincare — what certification actually means, and the brands clearing the bar (authority/FAQ). ⊛-ready
links: cluster: japanese-skincare-brands, cluster: retinal-vs-retinol
source: keyword-research-2026-h2

### 2026-08-14 | status:ready | type:trending | pillar:living | format:guide | words:1700 | score:82
keyword: staycation deals singapore
angle: The value-luxury staycation — best new-hotel offers, modestly; companion to the staycation edit. ⊛
links: cluster: staycation-singapore, /guides/the-complete-guide-to-quiet-luxury/
source: keyword-research-2026-h2

### 2026-08-17 | status:ready | type:evergreen | pillar:dining | format:guide | words:1700 | score:84
keyword: best cafe in singapore
angle: The halal café & specialty-coffee guide — brunch, beans, dessert; halal status per entry. (best cafe 1k / halal cafes 250)
links: cluster: best-brunch-singapore, cluster: matcha-singapore
source: keyword-research-2026-h2

### 2026-08-18 | status:ready | type:trending | pillar:travel | format:feature | words:1600 | score:74
keyword: national day singapore
angle: The National Day edit — a modern-luxury Singapore day (heritage, design, the table); no fireworks-bar. (seasonal, ~9 Aug)
links: /travel/singapore-stopover-guide-48-hours/, cluster: things-to-do-singapore-this-weekend
source: keyword-research-2026-h2

### 2026-08-19 | status:ready | type:evergreen | pillar:style | format:guide | words:1600 | score:76
keyword: modest swimwear
angle: The modest resortwear labels defining 2026 — investment frame; what to pack for Eid/holiday travel. (80 SG / 23k global / KD4)
links: cluster: new-bahru, cluster: abaya
source: keyword-research-2026-h2

### 2026-08-20 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1600 | score:78
keyword: best facials in singapore
angle: The facials & treatments worth the money — PDRN and beyond; modest, private-room options.
links: cluster: hair-salon-singapore, cluster: spa-singapore
source: keyword-research-2026-h2

### 2026-08-21 | status:ready | type:trending | pillar:dining | format:guide | words:1700 | score:82
keyword: best new restaurants singapore
angle: The new-openings hotlist — halal-aware; what just opened and who can eat there. ⊛
links: cluster: best-brunch-singapore, cluster: michelin-star-restaurants-singapore
source: keyword-research-2026-h2

### 2026-08-24 | status:ready | type:evergreen | pillar:people | format:profile | words:1500 | score:72
keyword: muslim owned brand founder singapore
angle: The Modest Leaders — a premium homegrown beauty/F&B founder (verify named subject before draft).
links: cluster: halal-fine-dining-founder-singapore, /beauty/k-beauty-brands-2026/
source: keyword-research-2026-h2

### 2026-08-25 | status:ready | type:evergreen | pillar:travel | format:guide | words:1800 | score:76
keyword: halal food tokyo
angle: Tokyo for the modest traveller — halal kaiseki, qibla-equipped hotels, private onsen etiquette. (low SG / global intent)
links: cluster: things-to-do-bali, cluster: things-to-do-dubai
source: keyword-research-2026-h2

### 2026-08-26 | status:ready | type:evergreen | pillar:living | format:feature | words:1700 | score:76
keyword: modern luxury interior design singapore
angle: What "modern luxury" looks like at home in Singapore — the exact brand-positioning term, as a home feature.
links: cluster: condo-interior-design-singapore, /guides/the-complete-guide-to-quiet-luxury/
source: keyword-research-2026-h2

### 2026-08-27 | status:ready | type:evergreen | pillar:style | format:guide | words:1500 | score:74
keyword: vintage shops singapore
angle: Vintage & pre-loved luxury in Singapore — ties to investment-dressing & conscious-luxury.
links: /guides/the-complete-guide-to-investment-dressing/, /living/the-conscious-luxury-manifesto-sustainable-living/
source: keyword-research-2026-h2

### 2026-08-28 | status:ready | type:evergreen | pillar:dining | format:guide | words:1700 | score:84
keyword: chilli crab singapore
angle: The best halal chilli crab & seafood in Singapore — iconic dish, Muslim-owned options. (red house 1.2k)
links: cluster: best-dim-sum-singapore, cluster: peking-duck-singapore
source: keyword-research-2026-h2

### 2026-08-31 | status:ready | type:evergreen | pillar:culture | format:essay | words:1500 | score:74
keyword: asian luxury trends 2026
angle: The new codes of Asian luxury — personal over prestigious, legacy dressing, hyper-local tastemakers; the site's thesis.
links: cluster: modest-fashion, /culture/asian-billionaire-philanthropy-quiet-revolution/
source: keyword-research-2026-h2

### 2026-09-01 | status:ready | type:evergreen | pillar:beauty | format:guide | words:1500 | score:76
keyword: halal japanese skincare
angle: Halal-conscious J-beauty — wudu-friendly, fragrance-light Japanese formulas; the buyer's guide nobody writes.
links: cluster: japanese-skincare-brands, cluster: halal-skincare-brands
source: keyword-research-2026-h2

### 2026-09-02 | status:ready | type:evergreen | pillar:travel | format:guide | words:1600 | score:78
keyword: rooftop restaurants singapore
angle: Singapore skyline dining without the bar — the alcohol-free rooftop & view-table edit. ⊛
links: cluster: things-to-do-singapore-this-weekend, cluster: best-brunch-singapore
source: keyword-research-2026-h2

### 2026-09-03 | status:ready | type:evergreen | pillar:dining | format:guide | words:1600 | score:84
keyword: halal high tea singapore
angle: The halal high-tea edit — the halal-specific companion to the afternoon-tea piece. (800/KD0, SERP DR1/0)
links: cluster: afternoon-tea-singapore, /dining/halal-fine-dining-singapore-2026/
source: keyword-research-2026-h2

### 2026-09-04 | status:ready | type:evergreen | pillar:people | format:profile | words:1500 | score:72
keyword: pastry chef singapore
angle: The pastry/matcha/tea-masters quietly defining 2026 — substitutes the bartender profile (verify named subjects).
links: cluster: dessert-singapore, cluster: matcha-singapore
source: keyword-research-2026-h2

### 2026-09-07 | status:ready | type:evergreen | pillar:style | format:feature | words:1600 | score:76
keyword: asian watch brands
angle: Asian watchmaking & the SEA fashion houses as 2026's quiet-luxury investment; adornment as inheritance.
links: /guides/the-complete-guide-to-investment-dressing/, cluster: bespoke-jewellery-singapore
source: keyword-research-2026-h2

### 2026-09-08 | status:ready | type:evergreen | pillar:travel | format:feature | words:1800 | score:82
keyword: penang culture
angle: Peranakan Penang — heritage, craft, the modest table; the culture/travel crossover (2.5k/KD7).
links: cluster: penang-hill, /travel/southeast-asian-cities-digital-nomad-luxury-lifestyle-2/
source: keyword-research-2026-h2

### 2026-09-09 | status:ready | type:evergreen | pillar:living | format:feature | words:1500 | score:74
keyword: prayer room home design
angle: The prayer-ready home — discreet musalla corners, oud/hinoki scent, Fajr/Maghrib lighting; an original interiors angle.
links: /guides/the-complete-guide-to-quiet-luxury/, cluster: condo-interior-design-singapore
source: keyword-research-2026-h2

### 2026-09-10 | status:ready | type:evergreen | pillar:dining | format:guide | words:2000 | score:85
keyword: best restaurants singapore
angle: The definitive halal fine-dining guide to Singapore — the Infatuation gap (incumbent ranks pos 26–46). Cluster capstone.
links: /dining/halal-fine-dining-singapore-2026/, cluster: michelin-star-restaurants-singapore
source: keyword-research-2026-h2

### 2026-09-11 | status:ready | type:evergreen | pillar:beauty | format:feature | words:1500 | score:74
keyword: oud perfume
angle: The attar revival — alcohol-free fine fragrance; oud, attar, the Gulf-to-Asia scent language.
links: cluster: best-perfume-store-singapore, cluster: things-to-do-dubai
source: keyword-research-2026-h2

### 2026-09-14 | status:ready | type:evergreen | pillar:guides | format:guide | words:1800 | score:80
keyword: things to do at night singapore
angle: The Arahkaii Evening Edit — late dessert, skyline walks, night markets; an after-dark guide without a single bar. (KD0)
links: cluster: things-to-do-singapore-this-weekend, cluster: dessert-singapore
source: keyword-research-2026-h2

### 2026-09-15 | status:ready | type:evergreen | pillar:culture | format:essay | words:1500 | score:72
keyword: muslim friendly luxury
angle: The Gulf-to-Singapore axis of modest luxury — how the two capitals are setting the codes; essay.
links: cluster: things-to-do-dubai, cluster: asian-luxury-trends-2026
source: keyword-research-2026-h2

### 2026-09-16 | status:ready | type:evergreen | pillar:people | format:profile | words:1500 | score:72
keyword: interior designer singapore
angle: The architect of the quiet-luxury home — a designer profile (verify named subject before draft).
links: cluster: condo-interior-design-singapore, cluster: modern-luxury-interior-design-singapore
source: keyword-research-2026-h2

### 2026-09-17 | status:ready | type:evergreen | pillar:style | format:guide | words:1600 | score:74
keyword: hijab styles 2026
angle: The modest capsule wardrobe & hijab styling for the year ahead — seasonal; distinct from (and links to) the existing capsule-wardrobe guide.
links: cluster: modest-swimwear, cluster: new-bahru
source: keyword-research-2026-h2

---

## Forward backlog (status:proposed — post-Sep dated hooks; verify dates near the time. NO Deepavali.)

### 2026-09-22 | status:proposed | type:trending | pillar:dining | format:guide | words:1600 | score:76
keyword: mid autumn festival singapore
angle: The mooncake edit — halal/alcohol-free mooncakes & tea pairings worth gifting. (Mid-Autumn ~25 Sep)
links: cluster: afternoon-tea-singapore, /dining/halal-fine-dining-singapore-2026/
source: keyword-research-2026-h2

### 2026-10-05 | status:proposed | type:trending | pillar:style | format:guide | words:1600 | score:74
keyword: what to wear to f1 singapore
angle: F1 weekend, modestly — heat-smart, no-nightlife styling; long-tail off f1 singapore 2026 (1.3k/KD56). (race 9–11 Oct)
links: cluster: modest-swimwear, /guides/the-complete-guide-to-investment-dressing/
source: keyword-research-2026-h2

### 2026-10-07 | status:proposed | type:trending | pillar:dining | format:guide | words:1600 | score:72
keyword: f1 singapore restaurants
angle: Where to eat & recover over F1 weekend — halal dining + day-spa recovery (substitutes the parties).
links: cluster: best-restaurants-singapore, cluster: head-spa-singapore
source: keyword-research-2026-h2

### 2026-11-16 | status:proposed | type:trending | pillar:guides | format:guide | words:1800 | score:74
keyword: christmas singapore
angle: Christmas on a Great Street — the Orchard Road festive guide, modest-family lens. (400/KD10)
links: cluster: things-to-do-singapore-this-weekend, /guides/the-complete-guide-to-quiet-luxury/
source: keyword-research-2026-h2

### 2026-12-07 | status:proposed | type:trending | pillar:style | format:guide | words:1700 | score:72
keyword: festive gift guide singapore
angle: The year-end modest-luxury gift edit — homegrown labels, jewellery, fragrance; boutiques hit-list.
links: cluster: bespoke-jewellery-singapore, cluster: new-bahru
source: keyword-research-2026-h2

### 2027-02-15 | status:proposed | type:trending | pillar:dining | format:guide | words:1800 | score:80
keyword: iftar buffet singapore
angle: The iftar tables worth booking — hotel iftar & suhoor programmes, halal status per entry. (Ramadan ~17 Feb–19 Mar)
links: /dining/halal-fine-dining-singapore-2026/, cluster: afternoon-tea-singapore
source: keyword-research-2026-h2

### 2027-02-22 | status:proposed | type:trending | pillar:beauty | format:explainer | words:1400 | score:74
keyword: ramadan skincare
angle: Skincare that survives suhoor — fasting-friendly hydration & barrier care. (Ramadan)
links: cluster: japanese-skincare-brands, cluster: retinal-vs-retinol
source: keyword-research-2026-h2

### 2027-03-15 | status:proposed | type:trending | pillar:style | format:guide | words:1700 | score:78
keyword: hari raya outfit 2027
angle: The Eid modest capsule — what to wear for Hari Raya; the festive modest wardrobe. (Eid ~20 Mar)
links: cluster: modest-swimwear, cluster: kebaya
source: keyword-research-2026-h2
