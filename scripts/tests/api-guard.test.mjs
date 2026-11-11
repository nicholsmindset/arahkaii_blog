import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanEmailHeader } from '../../src/lib/api-guard.ts';

test('email header values collapse newlines and control characters', () => {
	assert.equal(
		cleanEmailHeader('  Partnership\r\nBcc: reader@example.com\u0000  '),
		'Partnership Bcc: reader@example.com',
	);
});

test('email header values preserve ordinary reader-facing punctuation', () => {
	assert.equal(cleanEmailHeader('Question — autumn edit (2027)'), 'Question — autumn edit (2027)');
});
