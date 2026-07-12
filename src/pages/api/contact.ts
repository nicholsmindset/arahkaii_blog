import type { APIRoute } from 'astro';

export const prerender = false;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clean = (value: FormDataEntryValue | null, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export const POST: APIRoute = async ({ request, redirect }) => {
	const origin = request.headers.get('origin');
	if (origin && new URL(origin).host !== new URL(request.url).host) return new Response('Forbidden', { status: 403 });
	const form = await request.formData();
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
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ from, to: [to], reply_to: email, subject: `[Arahkaii] ${subject}`, text: `From: ${name} <${email}>\n\n${message}` }),
	});
	if (!response.ok) {
		console.error('Contact delivery failed', response.status, await response.text());
		return new Response('Delivery failed. Please email hello@arahkaii.com.', { status: 502 });
	}
	return redirect('/contact?sent=1', 303);
};

export const ALL: APIRoute = () => new Response('Method not allowed', { status: 405 });
