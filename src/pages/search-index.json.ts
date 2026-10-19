import type { APIRoute } from 'astro';
import { getSearchIndex } from '../lib/articles';

export const prerender = true;

export const GET: APIRoute = async () => {
	const index = await getSearchIndex();
	return new Response(JSON.stringify(index), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// The index is prerendered and only changes with a deployment. Keep repeat
			// searches off the network while allowing the CDN to refresh it in the
			// background after a new release.
			'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
		},
	});
};
