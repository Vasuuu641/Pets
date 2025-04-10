import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	return new Response("Not implemented yet", { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	return new Response("Not implemented yet", { status: 200 });
};

// TODO: Handle GET and POST requests for pets
