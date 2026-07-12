// perf-budget.mjs — repeatable Lighthouse measurement of the performance
// budget (LCP < 2.0s on simulated 4G), per the blueprint review's correction:
// budgets are enforced on a MEDIAN of repeated runs, never a single result.
//
//   npm run build && node scripts/perf-budget.mjs
//
// Serves the prerendered output (dist/client) on a local port and runs
// Lighthouse N times per page via npx (lighthouse is not a project
// dependency; npx fetches it on demand). Exits non-zero when the median LCP
// of any audited page exceeds the budget.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const DIST = fs.existsSync(path.resolve('dist/client')) ? path.resolve('dist/client') : path.resolve('dist');
if (!fs.existsSync(DIST)) {
	console.error('✗ dist/ not found — run `npm run build` first.');
	process.exit(1);
}

const RUNS = Number(process.env.PERF_RUNS ?? 3);
const BUDGET_LCP_MS = Number(process.env.PERF_LCP_BUDGET_MS ?? 2000);
const PAGES = ['/', '/dining/halal-fine-dining-singapore-2026/', '/latest/'];
const PORT = 4173;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
	const url = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
	let file = path.join(DIST, url);
	if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
	if (!fs.existsSync(file)) file = `${path.join(DIST, url.replace(/\/$/, ''))}.html`;
	if (!fs.existsSync(file)) {
		res.writeHead(404).end('not found');
		return;
	}
	res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
	fs.createReadStream(file).pipe(res);
});

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

server.listen(PORT, async () => {
	console.log(`Serving ${path.relative(process.cwd(), DIST)} on :${PORT} · ${RUNS} runs/page · budget LCP<${BUDGET_LCP_MS}ms`);
	const failures = [];
	try {
		for (const page of PAGES) {
			const lcps = [];
			for (let i = 0; i < RUNS; i++) {
				const out = `/tmp/lh-${page.replaceAll('/', '_')}-${i}.json`;
				execFileSync('npx', ['--yes', 'lighthouse', `http://localhost:${PORT}${page}`,
					'--only-categories=performance', '--output=json', `--output-path=${out}`,
					'--chrome-flags=--headless --no-sandbox', '--quiet'], { stdio: 'inherit' });
				const report = JSON.parse(fs.readFileSync(out, 'utf8'));
				lcps.push(report.audits['largest-contentful-paint'].numericValue);
			}
			const med = Math.round(median(lcps));
			const ok = med < BUDGET_LCP_MS;
			console.log(`${ok ? '✓' : '✗'} ${page} — median LCP ${med}ms (runs: ${lcps.map((x) => Math.round(x)).join(', ')})`);
			if (!ok) failures.push(`${page}: ${med}ms`);
		}
	} finally {
		server.close();
	}
	if (failures.length) {
		console.error(`\n✗ LCP budget exceeded:\n${failures.map((f) => '  - ' + f).join('\n')}`);
		process.exit(1);
	}
	console.log('\n✓ All pages within the LCP budget.');
});
