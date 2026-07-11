import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function reply(status: number, body: Record<string, unknown>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});
}

export const POST: APIRoute = async ({ request }) => {
	const origin = request.headers.get('origin');
	if (origin) {
		const originUrl = new URL(origin);
		const requestUrl = new URL(request.url);
		const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
		const sameSite =
			originUrl.host === requestUrl.host ||
			(loopback.has(originUrl.hostname) && loopback.has(requestUrl.hostname));
		if (!sameSite) return reply(403, { error: 'Forbidden' });
	}

	let payload: { email?: unknown; source?: unknown; website?: unknown };
	try {
		payload = await request.json();
	} catch {
		return reply(400, { error: 'Invalid request' });
	}

	// Honeypot submissions return success without touching MailerLite.
	if (typeof payload.website === 'string' && payload.website.trim()) {
		return reply(200, { ok: true });
	}

	const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
	if (!EMAIL_PATTERN.test(email) || email.length > 254) {
		return reply(422, { error: 'Enter a valid email address' });
	}

	const apiKey = import.meta.env.MAILERLITE_API_KEY;
	if (!apiKey) {
		return reply(503, { error: 'Newsletter service is not configured' });
	}

	const groupId = import.meta.env.MAILERLITE_GROUP_ID?.trim();
	const subscriber: { email: string; groups?: string[] } = { email };
	if (groupId) subscriber.groups = [groupId];

	try {
		const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(subscriber),
		});

		if (!response.ok) {
			console.error('MailerLite subscription failed', response.status, await response.text());
			return reply(502, { error: 'Newsletter service rejected the request' });
		}
	} catch (error) {
		console.error('MailerLite subscription unavailable', error);
		return reply(502, { error: 'Newsletter service is unavailable' });
	}

	return reply(200, { ok: true });
};

export const ALL: APIRoute = () => reply(405, { error: 'Method not allowed' });
