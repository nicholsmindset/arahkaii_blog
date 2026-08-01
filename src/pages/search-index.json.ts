import type { APIRoute } from 'astro';
import { getSearchIndex } from '../lib/articles';

export const prerender = true;

export const GET: APIRoute = async () => {
	const index = await getSearchIndex();
	return new Response(JSON.stringify(index), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=0, must-revalidate',
		},
	});
};
