import test from 'node:test';
import assert from 'node:assert/strict';
import { isJsonRequest } from '../../src/lib/api-guard.ts';

function request(contentType) {
	return new Request('https://www.arahkaii.com/api/subscribe', {
		headers: contentType ? { 'content-type': contentType } : {},
	});
}

test('JSON media type accepts parameters and normalised casing', () => {
	assert.equal(isJsonRequest(request('application/json')), true);
	assert.equal(isJsonRequest(request(' Application/JSON ; charset=utf-8')), true);
});

test('JSON media type rejects missing and lookalike content types', () => {
	assert.equal(isJsonRequest(request()), false);
	assert.equal(isJsonRequest(request('application/jsonp')), false);
	assert.equal(isJsonRequest(request('text/application/json')), false);
});
