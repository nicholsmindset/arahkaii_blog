// Keep the permanent Netlify subdomain out of search results after the custom
// arahkaii.com domain goes live. Custom-domain responses remain indexable.
export default async function noindexNetlifyDomain(request, context) {
	const hostname = new URL(request.url).hostname;
	if (!hostname.endsWith('.netlify.app')) return;

	const response = await context.next();
	const headers = new Headers(response.headers);
	headers.set('X-Robots-Tag', 'noindex, nofollow');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export const config = { path: '/*' };
