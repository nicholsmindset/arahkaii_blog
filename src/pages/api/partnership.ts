import type { APIRoute } from 'astro';
import { deliverPartnership } from '../../lib/partnership-delivery';
import { postOnlyResponse } from '../../lib/api-guard';

export const prerender = false;
export const POST: APIRoute = ({ request, clientAddress }) => deliverPartnership(request, {
	endpoint: import.meta.env.PARTNERSHIP_INTAKE_URL,
	address: clientAddress,
});
export const ALL: APIRoute = () => postOnlyResponse();
