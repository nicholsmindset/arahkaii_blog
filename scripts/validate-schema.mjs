// validate-schema.mjs — parse every JSON-LD block in dist/ and assert the
// required fields per @type. Run after `npm run build`. Exits non-zero on any
// invalid/missing schema so the publish routine can gate on it.
//
//   npm run build && node scripts/validate-schema.mjs

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) {
	console.error('✗ dist/ not found — run `npm run build` first.');
	process.exit(1);
}

const walk = (d) =>
	fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(d, e.name);
		return e.isDirectory() ? walk(p) : p;
	});

// Minimum required keys per @type we emit.
const REQUIRED = {
	Organization: ['name', 'url'],
	WebSite: ['name', 'url'],
	Article: ['headline', 'image', 'datePublished', 'author', 'publisher'],
	BlogPosting: ['headline', 'image', 'datePublished', 'author', 'publisher'],
	Person: ['name'],
	BreadcrumbList: ['itemListElement'],
	FAQPage: ['mainEntity'],
	HowTo: ['name', 'step'],
	ItemList: ['itemListElement'],
	CollectionPage: ['name', 'url'],
};

const htmlFiles = walk(DIST).filter((p) => p.endsWith('.html'));
const RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

let blocks = 0;
let withSchema = 0;
const errors = [];
const typeCounts = {};

for (const file of htmlFiles) {
	const html = fs.readFileSync(file, 'utf8');
	const rel = path.relative(DIST, file);
	let m;
	let fileHadSchema = false;
	while ((m = RE.exec(html))) {
		blocks++;
		fileHadSchema = true;
		let data;
		try {
			data = JSON.parse(m[1]);
		} catch (e) {
			errors.push(`${rel}: invalid JSON-LD — ${e.message}`);
			continue;
		}
		for (const node of [].concat(data)) {
			const type = node['@type'];
			if (!node['@context']) errors.push(`${rel}: ${type ?? '?'} missing @context`);
			if (!type) {
				errors.push(`${rel}: node missing @type`);
				continue;
			}
			typeCounts[type] = (typeCounts[type] ?? 0) + 1;
			for (const key of REQUIRED[type] ?? []) {
				if (node[key] == null || (Array.isArray(node[key]) && !node[key].length))
					errors.push(`${rel}: ${type} missing "${key}"`);
			}
		}
	}
	if (fileHadSchema) withSchema++;
}

console.log(`Scanned ${htmlFiles.length} pages · ${withSchema} carry JSON-LD · ${blocks} blocks`);
console.log('Types:', Object.entries(typeCounts).map(([t, n]) => `${t}×${n}`).join(' · '));

if (errors.length) {
	console.error(`\n✗ ${errors.length} schema problem(s):`);
	for (const e of errors.slice(0, 50)) console.error('  - ' + e);
	process.exit(1);
}
console.log('\n✓ All JSON-LD valid.');
