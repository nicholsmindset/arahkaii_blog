import type { APIRoute } from 'astro';
import {
	isSameSite,
	withinRateLimit,
	clientIp,
	providerRequestSignal,
} from '../../lib/api-guard';

export const prerender = false;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clean = (value: FormDataEntryValue | null, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
	if (!isSameSite(request)) return new Response('Forbidden', { status: 403 });
	if (!withinRateLimit(`contact:${clientIp(request, clientAddress)}`, 3, 60_000)) {
		return new Response('Too many requests — please try again shortly.', { status: 429 });
	}
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return new Response('Invalid form submission.', { status: 400 });
	}
	if (clean(form.get('bot-field'), 200)) return redirect('/contact?sent=1', 303);
	const name = clean(form.get('name'), 120);
	const email = clean(form.get('email'), 254).toLowerCase();
	const subject = clean(form.get('subject'), 160) || 'Website enquiry';
	const message = clean(form.get('message'), 8000);
	if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) return new Response('Please complete the required fields.', { status: 422 });

	const apiKey = import.meta.env.RESEND_API_KEY;
	const to = import.meta.env.CONTACT_TO_EMAIL ?? 'hello@arahkaii.com';
	const from = import.meta.env.CONTACT_FROM_EMAIL ?? 'Arahkaii Website <website@arahkaii.com>';
	if (!apiKey) return new Response('Contact delivery is not configured. Please email hello@arahkaii.com.', { status: 503 });
	let response: Response;
	try {
		response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			signal: providerRequestSignal(),
			headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ from, to: [to], reply_to: email, subject: `[Arahkaii] ${subject}`, text: `From: ${name} <${email}>\n\n${message}` }),
		});
	} catch (error) {
		console.error('Contact delivery unavailable', error);
		return new Response('Delivery failed. Please email hello@arahkaii.com.', { status: 502 });
	}
	if (!response.ok) {
		console.error('Contact delivery failed', response.status, await response.text());
		return new Response('Delivery failed. Please email hello@arahkaii.com.', { status: 502 });
	}
	return redirect('/contact?sent=1', 303);
};

export const ALL: APIRoute = () => new Response('Method not allowed', { status: 405 });
