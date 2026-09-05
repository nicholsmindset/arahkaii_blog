import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBrief, formatBrief } from '../../src/lib/partnerships.ts';
import { deliverPartnership } from '../../src/lib/partnership-delivery.ts';

const sample = {
	route: 'pitch', brand: 'Example studio', name: 'Sample founder', email: 'founder@example.com',
	location: 'Singapore', website: '@example.studio', story: 'We can show how a material choice changes the repairability of a garment.',
	consent: true, rights: false, assets: '', access: 'A material demonstration', budget: '',
	submission_id: 'ara-9f7b2254-7594-4fae-a5df-0f91e6f4a0ba',
};
let counter = 0;
const request = (body = sample, origin = 'https://www.arahkaii.com') => new Request('https://www.arahkaii.com/api/partnership/', {
	method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': `test-${++counter}` }, body: JSON.stringify(body),
});

test('editorial pitch can be submitted without photos, publication rights or a budget', () => {
	const result = validateBrief({ ...sample, budget: 'Should not be retained' });
	assert.equal(result.ok, true); assert.equal(result.brief.budget, '');
	assert.match(formatBrief(result.brief), /Publication rights, quotation permissions and commercial terms must be agreed separately/);
});
test('material links require specific review permission; unsafe links and oversized fields fail', () => {
	assert.equal(validateBrief({ ...sample, assets: 'https://example.com/press' }).ok, false);
	assert.equal(validateBrief({ ...sample, assets: 'javascript:alert(1)', rights: true }).ok, false);
	assert.equal(validateBrief({ ...sample, assets: 'https://user:pass@example.com/press', rights: true }).ok, false);
	assert.equal(validateBrief({ ...sample, story: 'x'.repeat(1601) }).ok, false);
	assert.equal(validateBrief({ ...sample, assets: 'https://example.com/press', rights: true }).ok, true);
});
test('invalid routes, missing consent and malformed emails never reach delivery', async () => {
	for (const patch of [{ route: '__proto__' }, { consent: false }, { email: 'bad' }]) {
		const response = await deliverPartnership(request({ ...sample, ...patch }), { endpoint: 'https://example.com/intake', fetcher: () => { throw new Error('Must not deliver'); } });
		assert.equal(response.status, 422);
	}
});
test('cross-origin submissions are rejected before parsing or delivery', async () => {
	const response = await deliverPartnership(request(sample, 'https://other.example'), {});
	assert.equal(response.status, 403);
});
test('missing backend offers a truthful fallback', async () => {
	assert.equal((await deliverPartnership(request(), {})).status, 503);
});
test('only a matching durable receipt is acknowledged; failed and false receipts are not success', async () => {
	for (const receipt of [{ ok: false }, { ok: true, application_id: 'wrong' }]) {
		const response = await deliverPartnership(request(), { endpoint: 'https://example.com/intake', fetcher: async () => Response.json(receipt) });
		assert.equal(response.status, 502); assert.equal((await response.json()).reference, sample.submission_id);
	}
  const response = await deliverPartnership(request(), { endpoint: 'https://example.com/intake', fetcher: async (_url, options) => {
		const sent = JSON.parse(options.body); assert.equal(sent.submission_id, sample.submission_id);
		assert.match(sent.brief_text, /Example studio/);
		return Response.json({ ok: true, application_id: sent.submission_id });
	} });
	assert.equal(response.status, 200); assert.equal((await response.json()).application_id, sample.submission_id);
});
test('timeout is uncertain delivery, not an invented receipt', async () => {
	const response = await deliverPartnership(request(), { endpoint: 'https://example.com/intake', fetcher: async () => { throw new Error('timeout'); } });
	assert.equal(response.status, 502);
});
