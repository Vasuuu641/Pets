import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	// TODO Assign a pet to a user upon adoption
	return new Response("Not implemented yet", { status: 200 });
};
