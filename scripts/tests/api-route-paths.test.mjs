import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('public forms submit directly to canonical trailing-slash API routes', () => {
	const contact = read('src/pages/contact.astro');
	const chrome = read('src/layouts/BaseLayout.astro');

	assert.match(contact, /action="\/api\/contact\/"/);
	assert.doesNotMatch(contact, /action="\/api\/contact"/);
	assert.match(chrome, /fetch\('\/api\/subscribe\/'/);
	assert.doesNotMatch(chrome, /fetch\('\/api\/subscribe'/);
});
