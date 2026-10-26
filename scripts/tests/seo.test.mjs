import assert from 'node:assert/strict';
import test from 'node:test';
import { itemListSchema } from '../../src/lib/seo.ts';

test('itemListSchema describes its one-based item order as ascending', () => {
	const schema = itemListSchema('The edit', ['First', 'Second'], 'https://www.arahkaii.com/edit/');

	assert.equal(schema.itemListOrder, 'https://schema.org/ItemListOrderAscending');
	assert.deepEqual(
		schema.itemListElement.map(({ position, name }) => ({ position, name })),
		[
			{ position: 1, name: 'First' },
			{ position: 2, name: 'Second' },
		],
	);
});
