// Static pages segment — homepage plus the indexable editorial/utility pages.
// Noindex routes (styleguide, reading-list, 404) are deliberately absent.
import type { APIRoute } from 'astro';
import { urlset, type SitemapEntry } from '../lib/sitemap';

export const prerender = true;

const PAGES: SitemapEntry[] = [
	{ path: '/', changefreq: 'daily', priority: 1.0 },
	{ path: '/about/', changefreq: 'monthly', priority: 0.5 },
	{ path: '/editorial-standards/', changefreq: 'monthly', priority: 0.5 },
	{ path: '/contributors/', changefreq: 'monthly', priority: 0.4 },
	{ path: '/subscribe/', changefreq: 'monthly', priority: 0.5 },
	{ path: '/contact/', changefreq: 'monthly', priority: 0.4 },
	{ path: '/advertise/', changefreq: 'monthly', priority: 0.3 },
	{ path: '/join-us/', changefreq: 'monthly', priority: 0.3 },
	{ path: '/faqs/', changefreq: 'monthly', priority: 0.4 },
	{ path: '/privacy-policy/', changefreq: 'yearly', priority: 0.2 },
	{ path: '/terms-conditions/', changefreq: 'yearly', priority: 0.2 },
];

export const GET: APIRoute = () => urlset(PAGES);
