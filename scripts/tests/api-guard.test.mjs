import test from 'node:test';
import assert from 'node:assert/strict';
import { readLimitedBody, RequestBodyTooLargeError } from '../../src/lib/api-guard.ts';

test('bounded request reader accepts bodies within the byte limit', async () => {
	const request = new Request('https://www.arahkaii.com/api/test', { method: 'POST', body: 'considered' });
	assert.equal(await readLimitedBody(request, 10), 'considered');
});

test('bounded request reader rejects declared and streamed oversized bodies', async () => {
	const declared = new Request('https://www.arahkaii.com/api/test', {
		method: 'POST',
		headers: { 'content-length': '11' },
		body: 'short',
	});
	await assert.rejects(readLimitedBody(declared, 10), RequestBodyTooLargeError);

	const streamed = new Request('https://www.arahkaii.com/api/test', {
		method: 'POST',
		body: new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode('123456'));
				controller.enqueue(new TextEncoder().encode('78901'));
				controller.close();
			},
		}),
		duplex: 'half',
	});
	await assert.rejects(readLimitedBody(streamed, 10), RequestBodyTooLargeError);
});

test('bounded request reader measures UTF-8 bytes rather than characters', async () => {
	const request = new Request('https://www.arahkaii.com/api/test', { method: 'POST', body: 'éé' });
	await assert.rejects(readLimitedBody(request, 3), RequestBodyTooLargeError);
});
