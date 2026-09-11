import assert from 'node:assert/strict';
import test from 'node:test';
import { postOnlyResponse } from '../../src/lib/api-guard.ts';

test('POST-only endpoints advertise the accepted method without caching the error', () => {
	const response = postOnlyResponse();

	assert.equal(response.status, 405);
	assert.equal(response.headers.get('allow'), 'POST');
	assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('POST-only responses can preserve a route response content type', () => {
	const response = postOnlyResponse('{}', 'application/json; charset=utf-8');

	assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
});
