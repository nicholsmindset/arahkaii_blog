// Shared hardening for the public POST endpoints (/api/subscribe, /api/contact).
// Two cheap defences in front of paid third-party services (MailerLite/Beehiiv,
// Resend):
//
// 1. Same-origin check that REQUIRES a browser-supplied Origin (or Referer)
//    header. Browsers always attach Origin to POST requests, so requiring it
//    only turns away header-less scripts — the exact traffic the old
//    "check-only-if-present" version let through.
// 2. A fixed-window per-IP rate limit held in instance memory. Serverless
//    instances don't share state, so this is burst protection rather than a
//    global quota — adequate for a small editorial site, and easy to swap for
//    Vercel KV later without touching the routes.

const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);

const PROVIDER_TIMEOUT_MS = 10_000;

/** Abort a paid provider request before it exhausts the serverless invocation. */
export function providerRequestSignal(): AbortSignal {
	return AbortSignal.timeout(PROVIDER_TIMEOUT_MS);
}

/** True when the request carries a same-origin Origin (or, failing that, Referer). */
export function isSameOrigin(request: Request): boolean {
	const requestUrl = new URL(request.url);
	const source = request.headers.get('origin') ?? request.headers.get('referer');
	if (!source) return false;
	let sourceUrl: URL;
	try {
		sourceUrl = new URL(source);
	} catch {
		return false;
	}
	return (
		sourceUrl.origin === requestUrl.origin ||
		(loopback.has(sourceUrl.hostname) &&
			loopback.has(requestUrl.hostname) &&
			sourceUrl.protocol === requestUrl.protocol &&
			sourceUrl.port === requestUrl.port)
	);
}

interface Window {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Window>();
const MAX_BUCKETS = 5000; // memory guard for long-lived instances

/**
 * Fixed-window rate limit. Returns true when the caller is still within
 * `limit` requests per `windowMs` for the given key (route + client IP).
 */
export function withinRateLimit(key: string, limit: number, windowMs: number): boolean {
	const now = Date.now();
	const bucket = buckets.get(key);
	if (!bucket || bucket.resetAt <= now) {
		if (buckets.size >= MAX_BUCKETS) {
			for (const [k, w] of buckets) if (w.resetAt <= now) buckets.delete(k);
			if (buckets.size >= MAX_BUCKETS) buckets.clear();
		}
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	bucket.count += 1;
	return bucket.count <= limit;
}

/**
 * Best-effort client IP for rate-limit keying.
 *
 * Prefer the adapter-provided address: the left-most X-Forwarded-For value can
 * be supplied by the caller and must not override a trusted platform value.
 * Vercel's x-real-ip is the next-best source when the adapter has no address.
 */
export function clientIp(request: Request, fallback?: string): string {
	if (fallback?.trim()) return fallback.trim();
	const realIp = request.headers.get('x-real-ip')?.trim();
	if (realIp) return realIp;
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',').at(-1)?.trim() || 'unknown';
	return 'unknown';
}
