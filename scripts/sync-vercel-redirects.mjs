import fs from 'node:fs';
import { vercelRedirects } from './lib/redirects.mjs';

const file = new URL('../vercel.json', import.meta.url);
const config = JSON.parse(fs.readFileSync(file, 'utf8'));
const expected = { ...config, redirects: vercelRedirects() };
const output = `${JSON.stringify(expected, null, '\t')}\n`;
const current = fs.readFileSync(file, 'utf8');

if (process.argv.includes('--check')) {
	if (current !== output) {
		console.error('✗ vercel.json redirects are stale. Run npm run sync:redirects.');
		process.exit(1);
	}
	console.log(`✓ vercel.json contains ${expected.redirects.length} generated redirect rules.`);
} else {
	fs.writeFileSync(file, output);
	console.log(`✓ Wrote ${expected.redirects.length} redirect rules to vercel.json.`);
}
