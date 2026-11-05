import test from 'node:test';
import assert from 'node:assert/strict';
import { hasFormContentType } from '../../src/lib/api-guard.ts';

const request = (contentType) => new Request('https://www.arahkaii.com/api/contact', {
	method: 'POST',
	headers: contentType ? { 'content-type': contentType } : {},
	body: 'name=Arahkaii',
});

test('contact forms accept both browser form encodings', () => {
	assert.equal(hasFormContentType(request('application/x-www-form-urlencoded')), true);
	assert.equal(hasFormContentType(request('multipart/form-data; boundary=example')), true);
});

test('contact forms reject missing and unsupported media types', () => {
	assert.equal(hasFormContentType(request()), false);
	assert.equal(hasFormContentType(request('application/json')), false);
	assert.equal(hasFormContentType(request('text/plain; charset=utf-8')), false);
});
