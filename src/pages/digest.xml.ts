// "Arahkaii Weekly" — the digest feed a MailerLite RSS-to-email campaign
// consumes for the Sunday send. Unlike /rss.xml (the full reader-facing
// catalogue, summary-only), this is capped and image-rich: each item carries a
// hero thumbnail + dek + read link inside <content:encoded> so the email
// template can render the master-plan §8 "three story blocks" layout.
// Setup: see docs/newsletter-digest-setup.md.
import rss from '@astrojs/rss';
import { getImage } from 'astro:assets';
import type { APIContext } from 'astro';
import { SITE } from '../lib/seo';
import { getPosts } from '../lib/articles';
import { escapeHtml } from '../lib/safe';

export const prerender = true;

// Latest-N (not a hard 7-day window) so a quiet week still has content;
// MailerLite dedupes by guid and only sends items new since the last Sunday.
const MAX_ITEMS = 12;

export async function GET(context: APIContext) {
	const site = context.site ?? SITE.url;
	const posts = (await getPosts()).slice(0, MAX_ITEMS);

	const items = await Promise.all(
		posts.map(async (post) => {
			const d = post.data;
			const link = `/${d.category}/${post.id.split('/').pop()}/`;
			const absLink = new URL(link, site).toString();
			const dek = d.metaDescription ?? d.standfirst;
			const heroAlt = d.heroCaption.trim() || d.title;

			// Resolve the optimised hero to an absolute URL for the email thumbnail.
			const heroCrop = await getImage({ src: d.heroImage, width: 1200, height: 800, format: 'jpg' });
			const heroUrl = new URL(heroCrop.src, site).toString();

			// Rich body → <content:encoded>. All interpolated strings are escaped
			// (safe.ts) — the same discipline used across the site.
			const content =
				`<img src="${escapeHtml(heroUrl)}" alt="${escapeHtml(heroAlt)}" width="1200" height="800" />` +
				`<p>${escapeHtml(dek)}</p>` +
				`<p><a href="${escapeHtml(absLink)}">Read the full story &#8594;</a></p>`;

			return {
				title: d.title,
				pubDate: d.date,
				link,
				description: dek,
				content,
				enclosure: { url: heroUrl, length: 0, type: 'image/jpeg' },
			};
		}),
	);

	return rss({
		title: 'Arahkaii Weekly',
		description: 'The Sunday edit — considered stories from Arahkaii, once a week.',
		site,
		items,
		customData: `<language>en-GB</language>`,
	});
}
