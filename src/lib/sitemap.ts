// Shared builders for the segmented XML sitemaps (see src/pages/sitemap-*.xml.ts).
// Each segment is its own static endpoint so Search Console reports indexing
// per content type; sitemap-index.xml ties them together at the URL
// robots.txt already declares.

import { SITE } from './seo';

export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface SitemapEntry {
	/** Site-relative path, e.g. "/dining/halal-fine-dining-singapore-2026/". */
	path: string;
	lastmod?: Date;
	changefreq?: ChangeFreq;
	priority?: number;
}

const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll("'", '&apos;')
		.replaceAll('"', '&quot;');

const absolute = (path: string) => escapeXml(new URL(path, SITE.url).toString());

export function urlset(entries: SitemapEntry[]): Response {
	const body = entries
		.map((entry) => {
			const parts = [`<loc>${absolute(entry.path)}</loc>`];
			if (entry.lastmod) parts.push(`<lastmod>${entry.lastmod.toISOString()}</lastmod>`);
			if (entry.changefreq) parts.push(`<changefreq>${entry.changefreq}</changefreq>`);
			if (entry.priority != null) parts.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
			return `<url>${parts.join('')}</url>`;
		})
		.join('');
	return xmlResponse(
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
	);
}

export function sitemapIndex(paths: string[], lastmod: Date): Response {
	const body = paths
		.map((path) => `<sitemap><loc>${absolute(path)}</loc><lastmod>${lastmod.toISOString()}</lastmod></sitemap>`)
		.join('');
	return xmlResponse(
		`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`,
	);
}

function xmlResponse(body: string): Response {
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
