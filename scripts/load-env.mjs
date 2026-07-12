// load-env.mjs — side-effect module: load .env into process.env if present.
// Import this FIRST (before image-gen.mjs etc.) so keys + AR_MODEL_* overrides
// are available at module-eval time. No dependency — uses Node's built-in loader.
import fs from 'node:fs';
import path from 'node:path';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
	try {
		process.loadEnvFile(envPath); // Node 20.12+/21.7+/24
	} catch {
		// Fallback: minimal KEY=VALUE parser (ignores comments/blank lines).
		for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
			const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
			if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
		}
	}
}
