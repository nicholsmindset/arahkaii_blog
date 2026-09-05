import { collection, config, fields, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const categories = [
	{ label: 'Style', value: 'style' },
	{ label: 'Beauty', value: 'beauty' },
	{ label: 'Dining', value: 'dining' },
	{ label: 'Travel', value: 'travel' },
	{ label: 'Culture', value: 'culture' },
	{ label: 'Living', value: 'living' },
	{ label: 'People', value: 'people' },
	{ label: 'Guides', value: 'guides' },
] as const;

const articleSchema = {
	title: fields.slug({
		name: { label: 'Headline', validation: { isRequired: true, length: { max: 110 } } },
		slug: { label: 'URL slug', description: 'Changing this changes the article URL.' },
	}),
	standfirst: fields.text({
		label: 'Standfirst',
		multiline: true,
		description:
			'A complete, self-contained ANSWER to the article’s implied question — not a teaser. If an AI quoted only this paragraph, the reader should have the full answer. 40–60 words.',
		validation: { isRequired: true, length: { min: 80, max: 220 } },
	}),
	category: fields.select({ label: 'Category', options: categories, defaultValue: 'style' }),
	tags: fields.array(
		fields.text({
			label: 'Tag',
			validation: {
				pattern: {
					regex: /^[a-z0-9]+(-[a-z0-9]+)*$/,
					message: 'Lowercase, hyphenated (e.g. fashion-week) — keeps tag archives from splitting.',
				},
			},
		}),
		{
			label: 'Tags',
			itemLabel: (props) => props.value || 'New tag',
		},
	),
	author: fields.relationship({ label: 'Author', collection: 'authors', validation: { isRequired: true } }),
	date: fields.date({ label: 'Publication date', validation: { isRequired: true } }),
	updatedDate: fields.date({ label: 'Last updated' }),
	readingMinutes: fields.integer({ label: 'Reading time (minutes)', validation: { min: 1 } }),
	heroImage: fields.image({
		label: 'Hero image',
		description: 'Upload JPG, PNG or WebP (ideally 2400px wide, landscape). Keep the subject inside the centre safe area and complete the caption and credit below.',
		directory: 'src/assets/images/uploads',
		publicPath: '../../../assets/images/uploads/',
		validation: { isRequired: true },
	}),
	heroCaption: fields.text({
		label: 'Hero caption',
		multiline: true,
		description: 'Required before publication; some imported archive entries still need one.',
	}),
	heroCredit: fields.text({ label: 'Hero credit / licence', validation: { isRequired: true } }),
	draft: fields.checkbox({
		label: 'Draft',
		description: 'Draft articles are excluded from the public site. CMS changes still require a reviewed branch before publication.',
		defaultValue: false,
	}),
	legacyWpSlug: fields.text({ label: 'Legacy WordPress slug', description: 'Preserves the old URL as a permanent redirect.' }),
	seoTitle: fields.text({
		label: 'SEO title',
		description: 'Search-result headline. Aim for ≤60 characters, keyword first; falls back to the headline when empty.',
		validation: { length: { max: 70 } },
	}),
	metaDescription: fields.text({
		label: 'Meta description',
		multiline: true,
		description: '140–160 characters. A complete answer in the pillar voice — Google truncates beyond ~160.',
		validation: { length: { max: 160 } },
	}),
	noindex: fields.checkbox({ label: 'Hide from search engines', defaultValue: false }),
	faq: fields.array(fields.object({
		q: fields.text({ label: 'Question', validation: { isRequired: true } }),
		a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
	}), { label: 'FAQ structured data', itemLabel: (props) => props.fields.q.value || 'New question' }),
	howToName: fields.text({ label: 'How-to name' }),
	howTo: fields.array(fields.object({
		name: fields.text({ label: 'Step name', validation: { isRequired: true } }),
		text: fields.text({ label: 'Step instructions', multiline: true, validation: { isRequired: true } }),
	}), { label: 'How-to steps', itemLabel: (props) => props.fields.name.value || 'New step' }),
	listName: fields.text({ label: 'List name' }),
	listItems: fields.array(fields.text({ label: 'List item' }), { label: 'List items', itemLabel: (props) => props.value || 'New item' }),
	kicker: fields.text({ label: 'Editorial kicker' }),
	articleType: fields.select({
		label: 'Article type',
		options: [
			{ label: 'Feature', value: 'feature' }, { label: 'Listicle', value: 'listicle' },
			{ label: 'Guide', value: 'guide' }, { label: 'Profile', value: 'profile' },
			{ label: 'Long read', value: 'longread' }, { label: 'Brief', value: 'brief' },
		],
		defaultValue: 'feature',
	}),
	franchise: fields.relationship({ label: 'Franchise', collection: 'franchises' }),
	cluster: fields.relationship({ label: 'Topic cluster', collection: 'clusters' }),
	isPillar: fields.checkbox({ label: 'Pillar article', defaultValue: false }),
	timeliness: fields.select({ label: 'Timeliness', options: [
		{ label: 'Evergreen', value: 'evergreen' }, { label: 'Timely reporting', value: 'timely' },
	], defaultValue: 'evergreen' }),
	atAGlance: fields.array(fields.object({
		name: fields.text({ label: 'Name', validation: { isRequired: true } }),
		verdict: fields.text({ label: 'Short verdict', validation: { isRequired: true } }),
		halalStatus: fields.text({ label: 'Halal status' }),
		url: fields.url({ label: 'Optional link' }),
	}), { label: 'At a glance', itemLabel: (props) => props.fields.name.value || 'New entry' }),
	halalStatus: fields.object({
		status: fields.select({ label: 'Status', options: [
			{ label: 'Not applicable', value: 'not-applicable' },
			{ label: 'MUIS-certified', value: 'muis-certified' },
			{ label: 'Muslim-owned', value: 'muslim-owned' },
			{ label: 'Pork-free and no alcohol', value: 'pork-free-no-alcohol' },
			{ label: 'Mixed-status guide', value: 'mixed-status-guide' },
		], defaultValue: 'not-applicable' }),
		verifiedDate: fields.date({ label: 'Verified date' }),
		certificateRef: fields.text({ label: 'Certificate reference' }),
		sourceUrl: fields.url({ label: 'Verification source' }),
		note: fields.text({ label: 'Reader-facing note', multiline: true }),
	}, { label: 'Halal verification' }),
	reviewedBy: fields.relationship({ label: 'Reviewed by', collection: 'authors' }),
	lastVerified: fields.date({ label: 'Last editorial verification' }),
	body: fields.mdx({
		label: 'Article body',
		// .mdx so the editorial components below render (Astro only evaluates JSX
		// components in .mdx). new-post.mjs and the migrated posts all use .mdx too.
		extension: 'mdx',
		components: {
			// Full-column breakout quote (max two per article). DropCap is not
			// registered — the first paragraph already gets a drop cap via CSS
			// (article.css ::first-letter). Inline images use the image button
			// below (Astro optimises those); the credited <Figure> stays an
			// AI/hand-authoring component.
			PullQuote: block({
				label: 'Pull quote',
				description: 'A full-column italic breakout quote in the wide margin.',
				schema: {
					text: fields.text({
						label: 'Quote',
						multiline: true,
						validation: { isRequired: true },
					}),
				},
			}),
		},
		options: {
			bold: true,
			italic: true,
			strikethrough: false,
			code: false,
			blockquote: true,
			orderedList: true,
			unorderedList: true,
			heading: [2, 3, 4],
			link: true,
			image: {
				directory: 'src/assets/images/uploads',
				publicPath: '../../../assets/images/uploads/',
			},
		},
	}),
};

const posts = (year: number) => collection({
	label: `Articles — ${year}`,
	path: `src/content/posts/${year}/*`,
	slugField: 'title',
	columns: ['title', 'category', 'articleType', 'date', 'draft'],
	entryLayout: 'content',
	format: { contentField: 'body' },
	schema: articleSchema,
});

// One post collection per year, from the first content year through next year
// (so a January post in the new year has a home without a code change).
// Newest first for the nav; `postsCollections` spreads into `collections`.
const FIRST_CONTENT_YEAR = 2025;
const postYears = Array.from(
	{ length: new Date().getFullYear() + 1 - FIRST_CONTENT_YEAR + 1 },
	(_, i) => new Date().getFullYear() + 1 - i,
);
const postsCollections = Object.fromEntries(
	postYears.map((year) => [`posts${year}`, posts(year)]),
);
const postNavKeys = postYears.map((year) => `posts${year}`);

const githubStorage =
	process.env.NODE_ENV === 'production' || process.env.KEYSTATIC_STORAGE_KIND === 'github';

export default config({
	storage: githubStorage
		? { kind: 'github', repo: 'nicholsmindset/arahkaii_blog', branchPrefix: 'cms/' }
		: { kind: 'local' },
	ui: {
		brand: { name: 'Arahkaii Editorial' },
		navigation: {
			// postNavKeys is generated per year and matches the spread
			// `postsCollections` keys exactly; Object.fromEntries widens the key
			// literals to string, so the nav union can't see them. The runtime
			// keys are valid — cast past the lost inference.
			Content: postNavKeys as unknown as never[],
			Publication: ['franchises', 'clusters'],
			People: ['authors'],
			Settings: ['newsletter'],
		},
	},
	singletons: {
		newsletter: singleton({
			label: 'Newsletter settings',
			path: 'src/content/settings/newsletter',
			format: 'json',
			schema: {
				provider: fields.select({
					label: 'Email provider',
					description: 'Credentials stay in Vercel. Changing provider requires the matching environment variables and a normal production deploy.',
					options: [
						{ label: 'MailerLite', value: 'mailerlite' },
						{ label: 'Beehiiv', value: 'beehiiv' },
						{ label: 'Pause signups', value: 'disabled' },
					],
					defaultValue: 'disabled',
				}),
				sendWelcomeEmail: fields.checkbox({
					label: 'Send provider welcome email',
					description: 'Beehiiv only. Keep off if an automation already sends the welcome message.',
					defaultValue: false,
				}),
			},
		}),
	},
	collections: {
		...postsCollections,
		authors: collection({
			label: 'Authors',
			path: 'src/content/authors/*',
			slugField: 'name',
			columns: ['name', 'role'],
			format: { contentField: 'content' },
			schema: {
				name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
				role: fields.text({ label: 'Role', validation: { isRequired: true } }),
				bio: fields.text({ label: 'Biography', multiline: true, validation: { isRequired: true } }),
				avatar: fields.image({
					label: 'Portrait',
					directory: 'src/assets/authors',
					publicPath: '../../assets/authors/',
				}),
				sameAs: fields.array(fields.url({ label: 'Profile URL' }), { label: 'Verified profiles', itemLabel: (props) => props.value || 'New profile' }),
				expertise: fields.array(fields.text({ label: 'Expertise' }), { label: 'Areas of expertise', itemLabel: (props) => props.value || 'New area' }),
				content: fields.emptyContent({ extension: 'md' }),
			},
		}),
		franchises: collection({
			label: 'Editorial franchises', path: 'src/content/franchises/*', slugField: 'name',
			format: { contentField: 'content' },
			schema: {
				name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
				description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
				kicker: fields.text({ label: 'Kicker' }), cadence: fields.text({ label: 'Cadence' }),
				heroImage: fields.image({ label: 'Hero image', directory: 'src/assets/images/uploads', publicPath: '../../assets/images/uploads/' }),
				content: fields.emptyContent({ extension: 'md' }),
			},
		}),
		clusters: collection({
			label: 'Topic clusters', path: 'src/content/clusters/*', slugField: 'name',
			format: { contentField: 'content' },
			schema: {
				name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
				description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
				pillarPost: fields.text({
					label: 'Pillar article ID',
					description: 'Year-prefixed post ID, e.g. 2026/halal-fine-dining-singapore-2026 — the definitive ranked guide this cluster links up to. Must also carry “Pillar article” in its own entry.',
				}),
				targetKeyword: fields.text({ label: 'Target topic' }),
				content: fields.emptyContent({ extension: 'md' }),
			},
		}),
	},
});
