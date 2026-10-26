import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateReadingMinutes } from '../../src/lib/reading-time.ts';

const words = (count) => Array.from({ length: count }, (_, index) => `word${index}`).join(' ');

test('reading time counts visible Markdown prose', () => {
	assert.equal(estimateReadingMinutes(words(224)), 1);
	assert.equal(estimateReadingMinutes(words(338)), 2);
	assert.equal(estimateReadingMinutes(), 1);
});

test('MDX implementation details do not inflate reading time', () => {
	const body = `
import Figure from '../../../components/article/Figure.astro';
import hero from '../../../assets/images/a-long-editorial-image-name.jpg';

# A visible heading

${words(220)}

<Figure
	src={hero}
	alt="A long description that is useful to assistive technology but is not article prose"
	caption="A detailed caption supplied separately by the rendered component"
	credit="Arahkaii editorial studio"
/>

<!-- This production note should not be presented as reading copy. -->
`;
	assert.equal(estimateReadingMinutes(body), 1);
});

test('link labels count as prose while image markup and destinations do not', () => {
	const body = `${words(220)} [five useful words remain right here](https://example.com/a/long/path) ![image description](https://example.com/image.jpg)`;
	assert.equal(estimateReadingMinutes(body), 1);
});
