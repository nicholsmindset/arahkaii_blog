const fs = require('fs');
const d = JSON.parse(fs.readFileSync('docs/_audit-data/audit.json', 'utf8'));
const posts = (d.posts || []).slice();
const comps = d.competitors || [];
const winW = { high: 1, medium: 0.5, low: 0.2 };
const score = (p) => (p.globalVolume || 0) * (winW[p.winnability] ?? 0.3);
posts.sort((a, b) => score(b) - score(a));
const esc = (s) => (s == null ? '' : String(s).replace(/\|/g, '\\|'));
const N = posts.length;
const drafts = posts.filter((p) => p.draft).length;
const cut = posts.filter((p) => p.verdict === 'cut');
const cons = posts.filter((p) => p.verdict === 'consolidate');
const faqP = posts.filter((p) => p.schemaOpportunity === 'FAQPage');
const listP = posts.filter((p) => p.schemaOpportunity === 'ItemList');
const howP = posts.filter((p) => p.schemaOpportunity === 'HowTo');
const byParent = {};
for (const p of posts) { const k=(p.parentTopic||'').toLowerCase().trim(); if(!k) continue; (byParent[k]=byParent[k]||[]).push(p); }
const clusters = Object.entries(byParent).filter(([,v]) => v.length > 1);
let o = '';
o += `# Arahkaii — Content & SEO Audit\n\n`;
o += `_Generated June 2026 · Coverage: **${N}/48 posts** (${drafts} drafts) + ${comps.length} competitors._\n\n`;
o += `> **Method & caveats.** Research via Ahrefs MCP (live). arahkaii.com is brand-new: **Domain Rating 0**, no organic history, **GSC not connected** — a *forward-looking* audit. With DR 0, **low-KD keywords are winnable now**; **global English volume is primary**, Singapore secondary. Title/meta rewrites are British English, "Quiet Authority".\n\n`;
o += `## Executive summary\n\n`;
const top = posts.filter((p) => !p.draft).slice(0, 10);
o += `Strong, on-brand corpus. Gap is the optimisation layer. Highest-value winnable opportunities (low KD × global volume):\n\n`;
for (const p of top) o += `- **${esc(p.targetKeyword)}** — ${p.globalVolume} global, KD ${p.difficulty} (${p.winnability}) → \`${p.slug}\`\n`;
o += `\n- **Schema:** ${faqP.length} FAQPage · ${listP.length} ItemList · ${howP.length} HowTo.\n`;
o += `- **Cannibalisation clusters:** ${clusters.length}.\n- **Consolidate/cut candidates:** ${cons.length} / ${cut.length}.\n\n`;
o += `## Priority ranking (volume × winnability)\n\n| # | Post | Target keyword | Global | KD | Win | Intent | Verdict |\n|---|------|------|-----:|---:|-----|--------|---------|\n`;
posts.forEach((p,i)=>{ o += `| ${i+1} | \`${p.slug}\`${p.draft?' _(draft)_':''} | ${esc(p.targetKeyword)} | ${p.globalVolume??'–'} | ${p.difficulty??'–'} | ${p.winnability??'–'} | ${esc(p.intent)} | ${p.verdict} |\n`; });
o += `\n## Per-post recommendations & internal-link plan\n\n`;
for (const p of posts) {
  o += `### \`${p.slug}\`${p.draft?' _(draft)_':''}\n`;
  o += `- **Target:** ${esc(p.targetKeyword)} — ${p.globalVolume??'–'} global / ${p.usVolume??'–'} US${p.sgVolume!=null?` / ${p.sgVolume} SG`:''} · KD ${p.difficulty??'–'} · **${p.winnability}** · ${esc(p.intent)}\n`;
  o += `- **seoTitle:** ${esc(p.recommendedTitle)}\n- **metaDescription:** ${esc(p.recommendedMetaDescription)}\n`;
  if (p.internalLinkTargets?.length){ o += `- **Internal links to add:**\n`; for(const l of p.internalLinkTargets) o += `  - → \`${l.url}\` — ${esc(l.anchorIdea)}\n`; }
  o += `- **Schema:** ${p.schemaOpportunity}`;
  if(p.schemaOpportunity==='FAQPage'&&p.faq?.length){ o += ` (${p.faq.length} Q&A)\n`; for(const f of p.faq) o += `  - _Q:_ ${esc(f.q)}\n`; } else o += `\n`;
  if(p.verdict!=='keep') o += `- **Verdict: ${p.verdict.toUpperCase()}**${p.consolidateInto?` → \`${p.consolidateInto}\``:''}\n`;
  if(p.notes) o += `- _Notes:_ ${esc(p.notes).slice(0,500)}\n`;
  o += `\n`;
}
o += `## Cannibalisation & consolidation map\n\n`;
if(clusters.length){ for(const [parent,ps] of clusters) o += `- **"${parent}"** — ${ps.map(x=>`\`${x.slug}\``).join(', ')}\n`; o+='\n'; }
if(cons.length||cut.length){ o += `**Flagged (your call — nothing deleted):**\n\n`; for(const p of [...cons,...cut]) o += `- \`${p.slug}\` → **${p.verdict}**${p.consolidateInto?` into \`${p.consolidateInto}\``:''} — ${esc(p.notes).slice(0,180)}\n`; o+='\n'; }
o += `## Competitor content-gap backlog (net-new ideas — not built here)\n\n`;
for(const c of comps){ o += `### ${c.domain}\n`; for(const g of (c.topGaps||[]).slice(0,8)) o += `- **${esc(g.keyword)}** — ${g.globalVolume} vol, KD ${g.difficulty} — ${esc(g.whyWinnable).slice(0,120)}\n`; o+='\n'; }
o += `## GEO / AIO infrastructure (shipped)\n\nFAQPage / ItemList / HowTo builders in \`src/lib/seo.ts\`, driven by additive \`faq\`/\`listItems\`/\`howTo\` frontmatter, wired through both article layouts alongside the Article + Breadcrumb + Organization + Person graph — explicit, citable structure for AI Overviews, AI Mode and LLM answer engines.\n`;
fs.writeFileSync('docs/content-seo-audit-2026-06.md', o);
console.log(`Wrote audit doc: ${N} posts, ${comps.length} competitors, ${o.length} bytes`);
