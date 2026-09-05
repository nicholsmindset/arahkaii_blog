import { validateBrief, formatBrief } from './partnerships.ts';
import { isSameOrigin, withinRateLimit, clientIp } from './api-guard.ts';

interface Options { endpoint?: string; fetcher?: typeof fetch; address?: string; }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The intake acknowledges only after durable storage. A timeout is never treated as a receipt. */
export async function deliverPartnership(request: Request, options: Options): Promise<Response> {
	if (!isSameOrigin(request)) return json({ error: 'Please submit from the Arahkaii website.' }, 403);
	if (!withinRateLimit(`partnership:${clientIp(request, options.address)}`, 3, 60_000)) return json({ error: 'Please wait a minute before trying again.' }, 429);
	if (Number(request.headers.get('content-length')) > 24_000) return json({ error: 'The brief is too long.' }, 413);
	let input: Record<string, unknown>;
	try {
		const text = await request.text();
		if (text.length > 24_000) return json({ error: 'The brief is too long.' }, 413);
		if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ error: 'Use the brief form to submit.' }, 415);
		input = JSON.parse(text);
		if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error();
	} catch { return json({ error: 'We could not read the brief. Your text is still in the form.' }, 400); }
	if (input.company_fax) return json({ error: 'Please use the contact email to reach the desk.' }, 422);
	const result = validateBrief(input);
	if (!result.ok) return json({ error: 'Check the highlighted fields.', errors: result.errors }, 422);
	if (!options.endpoint) return json({ error: 'Online delivery is unavailable. You can copy or download your brief and email it to the desk.' }, 503);
	const submissionId = typeof input.submission_id === 'string' && /^ara-[a-f0-9-]{36}$/.test(input.submission_id) ? input.submission_id : `ara-${crypto.randomUUID()}`;
	try {
		const response = await (options.fetcher ?? fetch)(options.endpoint, {
			method: 'POST', signal: AbortSignal.timeout(15_000),
			headers: { 'Content-Type': 'application/json', Origin: 'https://www.arahkaii.com' },
			body: JSON.stringify({ ...result.brief, submission_id: submissionId, brief_text: formatBrief(result.brief), schema_version: 1 }),
		});
		const receipt = await response.json();
		if (!response.ok || receipt.ok !== true || receipt.application_id !== submissionId) throw new Error('Unconfirmed receipt');
		return json({ ok: true, application_id: submissionId });
	} catch {
		// Do not log submissions or provider bodies containing personal details.
		return json({ error: 'We could not confirm delivery. Keep this reference and your brief; email the desk before resending.', reference: submissionId }, 502);
	}
}
