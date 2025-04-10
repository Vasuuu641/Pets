import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Handle POST requests to buy food, toy, or treat
	return new Response("Not implemented yet", { status: 200 });
};
