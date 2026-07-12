// Rewrite broken legacy WordPress internal links to correct relative routes.
// Maps each linked slug to its CURRENT frontmatter category (handles the new
// `beauty` category and any recategorisation). External links untouched.
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/robertnichols/Desktop/arahkaii_blog/src/content/posts';

const files = [];
for (const y of ['2025', '2026']) {
  const dir = path.join(ROOT, y);
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.md') || f.endsWith('.mdx')) files.push(path.join(dir, f));
}

// slug -> current category (from frontmatter)
const cat = {};
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  const c = m[1].match(/^category:\s*["']?([a-z]+)["']?/m);
  const slug = path.basename(file).replace(/\.mdx?$/, '');
  if (c) cat[slug] = c[1];
}

const lastSeg = (u) => {
  try {
    const p = new URL(u, 'https://arahkaii.com').pathname.replace(/\/+$/, '');
    return p.split('/').pop();
  } catch { return null; }
};

let filesChanged = 0, linksFixed = 0, catArchive = 0, unresolved = 0;
const unresolvedSlugs = new Set();

for (const file of files) {
  let raw = fs.readFileSync(file, 'utf8');
  let changed = false;
  // Match markdown link targets that point at arahkaii.com (any scheme/host form)
  raw = raw.replace(/\]\((https?:\/\/(?:www\.)?arahkaii\.com[^)]*)\)/g, (full, url) => {
    // category archive pages -> not a post; leave for manual mapping but count
    if (/\/category\//.test(url)) { catArchive++; return full; }
    const slug = lastSeg(url);
    if (slug && cat[slug]) {
      linksFixed++; changed = true;
      return `](/${cat[slug]}/${slug}/)`;
    }
    unresolved++; if (slug) unresolvedSlugs.add(slug);
    return full;
  });
  if (changed) { fs.writeFileSync(file, raw); filesChanged++; }
}

console.log(`Files changed: ${filesChanged} · links fixed: ${linksFixed} · /category/ archive links left: ${catArchive} · unresolved post links: ${unresolved}`);
if (unresolvedSlugs.size) console.log('Unresolved slugs (not a current post — likely deleted/renamed):\n  ' + [...unresolvedSlugs].join('\n  '));
