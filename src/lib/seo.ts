// Central SEO identity + JSON-LD builders. Single source of truth so layouts
// pass *data*, not markup. British-English brand → og:locale en_GB.

export const SITE = {
	name: 'Arahkaii',
	tagline: "Asia's modern-luxury edit — modestly told.",
	url: 'https://arahkaii.com',
	locale: 'en_GB',
	// Raster logo for Organization schema (Google prefers raster over SVG).
	// Falls back to the favicon if public/logo.png is not yet added.
	logoUrl: 'https://arahkaii.com/logo.png',
	// Leave empty until real accounts are confirmed — tags are omitted gracefully.
	twitter: '', // e.g. '@arahkaii'
	sameAs: [] as string[], // social profile URLs
} as const;

type JsonLd = Record<string, unknown>;

/** Stable @id for the publisher node so other schemas can reference it. */
const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationSchema(): JsonLd {
	const org: JsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: SITE.name,
		url: SITE.url,
		logo: {
			'@type': 'ImageObject',
			url: SITE.logoUrl,
		},
	};
	if (SITE.sameAs.length) org.sameAs = SITE.sameAs;
	return org;
}

export function websiteSchema(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE.name,
		url: SITE.url,
		publisher: { '@id': ORG_ID },
		inLanguage: 'en-GB',
		// No SearchAction yet — on-site search is deferred. Add when /search exists.
	};
}

export interface ArticleSchemaInput {
	headline: string;
	description: string;
	/** Absolute URL(s) to the social/hero image. */
	image: string | string[];
	datePublished: string; // ISO 8601
	dateModified?: string; // ISO 8601
	authorName: string;
	authorUrl?: string;
	section: string;
	url: string; // canonical article URL
}

export function articleSchema(input: ArticleSchemaInput): JsonLd {
	const author: JsonLd = { '@type': 'Person', name: input.authorName };
	if (input.authorUrl) author.url = input.authorUrl;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: input.headline,
		description: input.description,
		image: Array.isArray(input.image) ? input.image : [input.image],
		datePublished: input.datePublished,
		dateModified: input.dateModified ?? input.datePublished,
		author,
		publisher: { '@id': ORG_ID },
		articleSection: input.section,
		inLanguage: 'en-GB',
		mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
	};
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
