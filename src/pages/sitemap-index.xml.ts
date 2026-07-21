// Sitemap index — the URL robots.txt declares. Points at the per-type
// segments so GSC reports indexing per content type.
import type { APIRoute } from 'astro';
import { sitemapIndex } from '../lib/sitemap';

export const prerender = true;

const SEGMENTS = [
	'/sitemap-pages.xml',
	'/sitemap-posts.xml',
	'/sitemap-categories.xml',
	'/sitemap-hubs.xml',
	'/sitemap-authors.xml',
	'/sitemap-tags.xml',
];

export const GET: APIRoute = () => sitemapIndex(SEGMENTS, new Date());
