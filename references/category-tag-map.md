# Category & tag map — Astro

No WordPress term IDs. `category` is a single value from the schema enum; `tags`
is a free array of lowercase-hyphenated strings in frontmatter.

## Categories (the 8 pillars → enum → URL)

| Pillar | `category:` | URL |
|---|---|---|
| Style | `style` | `/style/<slug>/` |
| Beauty | `beauty` | `/beauty/<slug>/` |
| Dining | `dining` | `/dining/<slug>/` |
| Travel | `travel` | `/travel/<slug>/` |
| Living | `living` | `/living/<slug>/` |
| People | `people` | `/people/<slug>/` |
| Culture | `culture` | `/culture/<slug>/` |
| Guides | `guides` | `/guides/<slug>/` |

A post has **exactly one** category (its pillar). Format (listicle, guide,
profile) is conveyed by structure + tags, not category.

## Tag conventions
- lowercase, hyphenated, singular where natural (`muslim-owned`, `k-beauty`, `singapore`).
- 2–5 tags per post. First tag is the most specific sub-topic.
- Cross-cutting tags (apply across pillars): `halal` · `muslim-owned` · `alcohol-free` · `modest-fashion` · `asian-craft` · `sustainable` · `singapore` · `kl` · `jakarta` · `dubai`.

## Mandatory / recommended tags by pillar
| Pillar | Mandatory | Common |
|---|---|---|
| Style | regional tag | `modest-luxury`, `asian-designers`, `fashion-week`, `hijab` |
| Beauty | — | `halal-certified`, `k-beauty`/`j-beauty`/`c-beauty`, ingredient (`pdrn`, `niacinamide`) |
| Dining | **`halal`** | `muslim-owned`, neighbourhood, `omakase`, `dessert` |
| Travel | **`modest-traveller`** | city tag, `halal-food`, `slow-travel` |
| Living | — | architect/designer, material (`travertine`), `quiet-luxury` |
| People | — | subject's brand, `muslim-owned` |
| Culture | — | `modest-movement`, `asian-identity` |
| Guides | — | topic + region (`halal-fine-dining`, `singapore`) |

Tag pages aren't built yet; tags drive on-site filtering (category page chips)
and future taxonomy. Keep them clean so they're reusable.
