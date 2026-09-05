import { COMMERCIAL_FORMATS, type CommercialFormat } from './partnerships';

export const commercialOffers: Array<{
	id: CommercialFormat; title: string; intent: string; description: string; angle: string; scope: string[];
}> = [
	{
		id: 'feature', title: COMMERCIAL_FORMATS.feature, intent: 'Introduce a product, place or idea',
		description: 'Give a launch, a material or a place the context it deserves. Build the story around a question a reader would want answered.',
		angle: 'A material choice, explained from the workshop to everyday use.',
		scope: ['An agreed article brief and reporting plan.', 'Writing, editing, factual checks and supporting imagery.', 'A published feature with clear disclosure, credits and relevant reader links.'],
	},
	{
		id: 'conversation', title: COMMERCIAL_FORMATS.conversation, intent: 'Share the thinking behind the work',
		description: 'Put a knowledgeable person at the centre. Explore the decisions, trade-offs and experience behind what your brand makes.',
		angle: 'The decision a founder would make differently — and what it taught them.',
		scope: ['A prepared interview with a named founder, maker or creative lead.', 'An edited profile or Q&A with attributable answers.', 'Context, factual checks and agreed portraits or process images.'],
	},
	{
		id: 'series', title: COMMERCIAL_FORMATS.series, intent: 'Develop a subject over several stories',
		description: 'Build a connected body of work around one useful theme. Give each instalment its own question, perspective and reason to return.',
		angle: 'One material, followed through its origin, its makers and its life in a home.',
		scope: ['A shared theme and a defined number of stories.', 'Distinct angles, contributors and a publication sequence.', 'An agreed distribution plan and a reporting point for the series.'],
	},
];

export const paidBriefUrl = (format?: CommercialFormat) =>
	`/partnerships/?route=paid${format ? `&format=${format}` : ''}&ref=advertise#brief`;
