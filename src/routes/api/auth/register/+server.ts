import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	// TODO create the user
	// NOTE: use 'bcrypt.hash' to hash password
	// NOTE: the user's name must be unique

	return new Response("Not implemented yet", { status: 200 });
};
0