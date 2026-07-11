import { collection, config, fields } from '@keystatic/core';

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
		validation: { isRequired: true, length: { max: 220 } },
	}),
	category: fields.select({ label: 'Category', options: categories, defaultValue: 'style' }),
	tags: fields.array(fields.text({ label: 'Tag' }), {
		label: 'Tags',
		itemLabel: (props) => props.value || 'New tag',
	}),
	author: fields.relationship({ label: 'Author', collection: 'authors', validation: { isRequired: true } }),
	date: fields.date({ label: 'Publication date', validation: { isRequired: true } }),
	updatedDate: fields.date({ label: 'Last updated' }),
	readingMinutes: fields.integer({ label: 'Reading time (minutes)', validation: { min: 1 } }),
	heroImage: fields.image({
		label: 'Hero image',
		description: 'Use approved, credited imagery only. Uploads are stored with the article assets.',
		directory: 'src/assets/images',
		publicPath: '../../../assets/images/',
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
	seoTitle: fields.text({ label: 'SEO title', validation: { length: { max: 70 } } }),
	metaDescription: fields.text({ label: 'Meta description', multiline: true, validation: { length: { max: 160 } } }),
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
	body: fields.mdx({
		label: 'Article body',
		extension: 'md',
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
				directory: 'src/assets/images',
				publicPath: '../../../assets/images/',
			},
		},
	}),
};

const posts = (year: number) => collection({
	label: `Articles — ${year}`,
	path: `src/content/posts/${year}/*`,
	slugField: 'title',
	columns: ['title', 'category', 'date', 'draft'],
	entryLayout: 'content',
	format: { contentField: 'body' },
	schema: articleSchema,
});

const githubStorage =
	process.env.NODE_ENV === 'production' || process.env.KEYSTATIC_STORAGE_KIND === 'github';

export default config({
	storage: githubStorage
		? { kind: 'github', repo: 'nicholsmindset/arahkaii_blog', branchPrefix: 'cms/' }
		: { kind: 'local' },
	ui: {
		brand: { name: 'Arahkaii Editorial' },
		navigation: {
			Content: ['posts2026', 'posts2025'],
			People: ['authors'],
		},
	},
	collections: {
		posts2026: posts(2026),
		posts2025: posts(2025),
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
				content: fields.emptyContent({ extension: 'md' }),
			},
		}),
	},
});
