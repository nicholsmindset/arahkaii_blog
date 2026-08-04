import type { APIRoute } from 'astro';
import newsletterSettings from '../../content/settings/newsletter.json';
import {
	isSameSite,
	withinRateLimit,
	clientIp,
	providerRequestSignal,
} from '../../lib/api-guard';

export const prerender = false;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
type NewsletterProvider = 'mailerlite' | 'beehiiv' | 'disabled';
const provider = newsletterSettings.provider as NewsletterProvider;

function reply(status: number, body: Record<string, unknown>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	if (!isSameSite(request)) return reply(403, { error: 'Forbidden' });
	if (!withinRateLimit(`subscribe:${clientIp(request, clientAddress)}`, 5, 60_000)) {
		return reply(429, { error: 'Too many requests — please try again shortly' });
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

	if (provider === 'disabled') return reply(503, { error: 'Newsletter signups are paused' });

	try {
		let response: Response;
		if (provider === 'beehiiv') {
			const apiKey = import.meta.env.BEEHIIV_API_KEY;
			const publicationId = import.meta.env.BEEHIIV_PUBLICATION_ID?.trim();
			if (!apiKey || !publicationId) return reply(503, { error: 'Beehiiv is not configured' });
			const source = typeof payload.source === 'string' ? payload.source.slice(0, 80) : 'website';
			response = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`, {
				method: 'POST',
				signal: providerRequestSignal(),
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					reactivate_existing: false,
					send_welcome_email: newsletterSettings.sendWelcomeEmail,
					utm_source: 'arahkaii',
					utm_medium: source,
					referring_site: new URL(request.url).origin,
				}),
			});
		} else {
			const apiKey = import.meta.env.MAILERLITE_API_KEY;
			if (!apiKey) return reply(503, { error: 'MailerLite is not configured' });
			const groupId = import.meta.env.MAILERLITE_GROUP_ID?.trim();
			const subscriber: { email: string; groups?: string[] } = { email };
			if (groupId) subscriber.groups = [groupId];
			response = await fetch('https://connect.mailerlite.com/api/subscribers', {
				method: 'POST',
				signal: providerRequestSignal(),
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(subscriber),
			});
		}

		if (!response.ok) {
			console.error(`${provider} subscription failed`, response.status, await response.text());
			return reply(502, { error: 'Newsletter service rejected the request' });
		}
	} catch (error) {
		console.error(`${provider} subscription unavailable`, error);
		return reply(502, { error: 'Newsletter service is unavailable' });
	}

	return reply(200, { ok: true });
};

export const ALL: APIRoute = () => reply(405, { error: 'Method not allowed' });
