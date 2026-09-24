/** Return the one-based positions of articles containing an unsized image. */
export function articlesWithUnsizedImages(mainHtml) {
	const failures = [];
	let articleIndex = 0;

	for (const article of mainHtml.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)) {
		articleIndex += 1;
		for (const image of article[1].matchAll(/<img\b([^>]*)>/g)) {
			if (!/\bwidth="\d+"/.test(image[1]) || !/\bheight="\d+"/.test(image[1])) {
				failures.push(articleIndex);
				break;
			}
		}
	}

	return failures;
}
