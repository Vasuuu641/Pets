import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Handle pet actions using inventory or budget, with fallback redirect
	return new Response("Not implemented yet", { status: 200 });
};
