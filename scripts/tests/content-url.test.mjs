import assert from 'node:assert/strict';
import test from 'node:test';
import { isHttpUrl } from '../../src/lib/content-url.ts';

test('content URLs allow ordinary HTTP and HTTPS links', () => {
	assert.equal(isHttpUrl('https://example.com/report?q=1'), true);
	assert.equal(isHttpUrl('http://localhost:4321/preview'), true);
});

test('content URLs reject non-web and relative schemes', () => {
	assert.equal(isHttpUrl('javascript:alert(1)'), false);
	assert.equal(isHttpUrl('data:text/html,unsafe'), false);
	assert.equal(isHttpUrl('mailto:editor@example.com'), false);
	assert.equal(isHttpUrl('/relative/path'), false);
	assert.equal(isHttpUrl('not a URL'), false);
});
