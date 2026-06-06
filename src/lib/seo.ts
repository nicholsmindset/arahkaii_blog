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

export interface PersonSchemaInput {
	name: string;
	jobTitle?: string;
	description?: string;
	url: string; // author page URL
	image?: string; // absolute avatar URL
	sameAs?: string[];
}

/** Person — author pages + citable byline identity. worksFor → publisher. */
export function personSchema(input: PersonSchemaInput): JsonLd {
	const person: JsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${input.url}#person`,
		name: input.name,
		url: input.url,
		worksFor: { '@id': ORG_ID },
	};
	if (input.jobTitle) person.jobTitle = input.jobTitle;
	if (input.description) person.description = input.description;
	if (input.image) person.image = { '@type': 'ImageObject', url: input.image };
	if (input.sameAs?.length) person.sameAs = input.sameAs;
	return person;
}

/** CollectionPage — category / author / index listing pages. */
export function collectionPageSchema(input: {
	name: string;
	url: string;
	description?: string;
}): JsonLd {
	const page: JsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: input.name,
		url: input.url,
		isPartOf: { '@id': WEBSITE_ID },
		inLanguage: 'en-GB',
	};
	if (input.description) page.description = input.description;
	return page;
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

// — GEO / AIO builders: explicit, citable structure for AI Overviews, AI Mode
//   and LLM answer engines. Driven by additive post frontmatter. —

export interface FaqItem {
	q: string;
	a: string;
}

/** FAQPage — for guides/explainers with genuine question intent. */
export function faqSchema(items: FaqItem[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: { '@type': 'Answer', text: item.a },
		})),
	};
}

export interface HowToStep {
	name: string;
	text: string;
}

/** HowTo — for step-by-step guides. */
export function howToSchema(name: string, steps: HowToStep[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name,
		step: steps.map((s, i) => ({
			'@type': 'HowToStep',
			position: i + 1,
			name: s.name,
			text: s.text,
		})),
	};
}

/** ItemList — for "ranked"/numbered listicles. Items are ordered names. */
export function itemListSchema(name: string, items: string[], url: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name,
		itemListOrder: 'https://schema.org/ItemListOrderDescending',
		numberOfItems: items.length,
		url,
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item,
		})),
	};
}
