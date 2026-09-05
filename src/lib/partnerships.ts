export const DESK_EMAIL = 'onnifyworks@gmail.com';
export const ROUTES = {
	pitch: { name: 'A story pitch', label: 'Send us a promising lead', note: 'A short introduction for a roundup, expert contribution or story worth investigating. No fee for editorial consideration.' },
	interview: { name: 'An interview or visit', label: 'Let us into the work', note: 'Offer a conversation with a founder, a studio visit, a demonstration or access to a place. Selected on editorial merit.' },
	paid: { name: 'A paid partnership', label: 'Build a considered campaign', note: 'Discuss a clearly labelled feature or series, with scope, fees, rights and distribution agreed before work begins.' },
} as const;
export type PartnershipRoute = keyof typeof ROUTES;
export const COMMERCIAL_FORMATS = {
	feature: 'A reported feature',
	conversation: 'A founder conversation',
	series: 'A considered series',
} as const;
export type CommercialFormat = keyof typeof COMMERCIAL_FORMATS;
export function commercialFormat(value: unknown): CommercialFormat | '' {
	return typeof value === 'string' && Object.hasOwn(COMMERCIAL_FORMATS, value) ? value as CommercialFormat : '';
}
export const STORY_CALLS = [
	{ id: 'behind-the-work', title: 'Behind the work', category: 'Style · Beauty · Living', question: 'What would we understand differently if we saw how it was made?', access: 'A maker, a material or a process we can examine.', route: 'interview' },
	{ id: 'founder-decisions', title: 'A decision that mattered', category: 'People · Culture', question: 'Which difficult choice changed the direction of your work?', access: 'A founder or creative with a specific story to tell.', route: 'interview' },
	{ id: 'neighbourhood-notes', title: 'A neighbourhood, through its people', category: 'Dining · Travel · Guides', question: 'What does your shop, table or space reveal about its neighbourhood?', access: 'A local perspective, practical details and a place to visit.', route: 'pitch' },
	{ id: 'tropical-realities', title: 'Made for life here', category: 'Beauty · Style · Living', question: 'How does your work respond to the way people actually live in Asia?', access: 'A product, design choice or test with evidence behind it.', route: 'pitch' },
] as const;
export const LIMITS = { brand: 120, name: 120, email: 254, location: 120, website: 300, story: 1600, access: 800, timing: 160, assets: 1200, credits: 600, budget: 160, referral: 100 } as const;
export interface PartnershipBrief {
	route: PartnershipRoute;
	call: string;
	format: CommercialFormat | '';
	brand: string;
	name: string;
	email: string;
	location: string;
	website: string;
	story: string;
	access: string;
	timing: string;
	assets: string;
	credits: string;
	budget: string;
	referral: string;
	consent: boolean;
	rights: boolean;
}
export type BriefResult = { ok: true; brief: PartnershipBrief } | { ok: false; errors: Record<string, string> };

/** Shared by the browser and server. Reject overlong input instead of silently losing copy. */
export function validateBrief(input: Record<string, unknown>): BriefResult {
	const errors: Record<string, string> = {};
	const values = Object.fromEntries(Object.entries(LIMITS).map(([key, max]) => {
		const value = typeof input[key] === 'string' ? input[key].trim() : '';
		if (value.length > max) errors[key] = `Please keep this to ${max} characters or fewer.`;
		if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) errors[key] = 'Please remove unsupported characters.';
		return [key, value];
	})) as unknown as Pick<PartnershipBrief, keyof typeof LIMITS>;
	for (const key of ['brand', 'name', 'email', 'location', 'website', 'story'] as const) {
		if (!values[key]) errors[key] = 'Please complete this field.';
	}
	if (!Object.hasOwn(ROUTES, String(input.route))) errors.route = 'Choose how you would like to work with us.';
	if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
	if (values.story && values.story.length < 40) errors.story = 'A few sentences will help us understand the story (at least 40 characters).';
	if (values.website && !/^@[a-zA-Z0-9._]{1,80}$/.test(values.website)) {
		try {
			const url = new URL(values.website.includes('://') ? values.website : `https://${values.website}`);
			if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password || /\s/.test(values.website)) throw new Error();
		} catch { errors.website = 'Enter a website address or an @Instagram handle.'; }
	}
	const assetLinks = values.assets.split('\n').map((line) => line.trim()).filter(Boolean);
	if (assetLinks.length > 5) errors.assets = 'Please send no more than five links.';
	for (const link of assetLinks) {
		try { const url = new URL(link); if (url.protocol !== 'https:' || url.username || url.password) throw new Error(); }
		catch { errors.assets = 'Use complete HTTPS links, one per line.'; }
	}
	const consent = input.consent === true || input.consent === 'on';
	const rights = input.rights === true || input.rights === 'on';
	if (!consent) errors.consent = 'Please confirm we may use these details to review and respond to your brief.';
	if (values.assets && !rights) errors.rights = 'Confirm you have permission to share these materials for review.';
	if (Object.keys(errors).length) return { ok: false, errors };
	return { ok: true, brief: {
		...values, email: values.email.toLowerCase(), route: input.route as PartnershipRoute,
		call: STORY_CALLS.some((call) => call.id === input.call) ? String(input.call) : '',
		format: input.route === 'paid' ? commercialFormat(input.format) : '',
		budget: input.route === 'paid' ? values.budget : '', consent, rights,
	} };
}

export function formatBrief(brief: PartnershipBrief): string {
	const call = STORY_CALLS.find((call) => call.id === brief.call);
	return [
		`ARAHKAII — ${ROUTES[brief.route].name}`, '',
		`Brand / organisation: ${brief.brand}`, `Contact: ${brief.name}`, `Email: ${brief.email}`,
		`Location: ${brief.location}`, `Website / handle: ${brief.website}`,
		...(brief.route === 'paid' && brief.format ? [`Proposed format: ${COMMERCIAL_FORMATS[brief.format]}`] : []),
		...(call ? [`Story prompt: ${call.title}`] : []), '', 'THE STORY / BRIEF', brief.story, '',
		'ACCESS / PEOPLE / EVIDENCE', brief.access || 'To discuss', '',
		`Timing / embargo: ${brief.timing || 'Flexible / not specified'}`,
		...(brief.route === 'paid' ? [`Indicative budget: ${brief.budget || 'To discuss'}`] : []), '',
		'MATERIALS FOR PRIVATE REVIEW', brief.assets || 'To follow if selected',
		`Credits / restrictions: ${brief.credits || 'To confirm before publication'}`, '',
		`Contact and review consent: ${brief.consent ? 'Yes' : 'No'}`,
		`Permission to share linked material for private review: ${brief.rights ? 'Confirmed' : 'No materials supplied'}`,
		'Publication rights, quotation permissions and commercial terms must be agreed separately.',
		...(brief.referral ? ['', `Referral: ${brief.referral}`] : []),
	].join('\n');
}
