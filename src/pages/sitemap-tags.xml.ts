// Tag archives remain useful navigation, but they intentionally stay out of
// the search index while the publication is small. Keep this legacy endpoint
// valid and empty so an old direct Search Console submission does not send a
// mixed signal by listing pages whose robots directive is `noindex`.
import type { APIRoute } from 'astro';
import { urlset } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = () => urlset([]);
