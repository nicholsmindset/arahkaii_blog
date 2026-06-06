# Sources — the trend watchlist

Inputs for `/trend-scan`. Firecrawl scrapes the **reference sites**; ahrefs reads
the **competitor domains**; Google Trends gives rising-query signal. Everything
is filtered through `halal-substitutions.md` and `content-strategy.md` before a
topic is proposed. Edit this file freely — it's the dial for what we watch.

## Reference / competitor sites (Firecrawl scrape + map)
Watch recent headlines and section fronts; we want *the angle they took and what
they missed*, never to copy.

| Site | URL | Watch for |
|---|---|---|
| Tatler Asia | https://www.tatlerasia.com | Dining, style, people, travel — the tier reference |
| CNA Lifestyle | https://www.channelnewsasia.com/lifestyle | SG/Asia lifestyle, dining, beauty, what's trending locally |
| CNA Luxury | https://cnaluxury.channelnewsasia.com | Highest-ROI competitor: dining, travel, watches, living |
| Vogue Singapore | https://vogue.sg | Style, beauty, culture (SG lens) |
| Vogue Arabia | https://en.vogue.me | Modest fashion, beauty, regional luxury |
| Business of Fashion | https://www.businessoffashion.com | Industry/Asia plays, the analytical fashion angle |
| Harper's Bazaar SG | https://harpersbazaar.com.sg | Style, beauty, culture |
| The Infatuation (Asia) | https://www.theinfatuation.com | Dining intelligence (filter for halal) |
| Eater | https://www.eater.com | Dining trends (filter for halal) |
| Kinfolk | https://www.kinfolk.com | Living, slow culture, tone reference |
| NYT T Magazine | https://www.nytimes.com/section/t-magazine | Culture, design, the long view |

## Google Trends (Firecrawl scrape)
- Regions: **SG** (primary), MY, ID, AE. Categories: Beauty & Fitness, Food & Drink, Shopping, Travel.
- Rising/breakout queries that map to a pillar and survive the guardrail.

## ahrefs competitor domains (content-gap signal)
`site-explorer top-pages` + `organic-keywords` to see what drives their traffic:
- `cnaluxury.channelnewsasia.com` · `tatlerasia.com` · `vogue.sg` · `theinfatuation.com`
- Validated clusters live in `seo-optimizer` / the keyword map; refresh quarterly.

## Hard rules
- Never propose alcohol/nightlife/bar topics — apply `halal-substitutions.md`.
- Dedupe every candidate against `url-database.md` (don't repeat what we've published).
- A source angle is a *seed*, not a brief — we always find the Arahkaii take.
