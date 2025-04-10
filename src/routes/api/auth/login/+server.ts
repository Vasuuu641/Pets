import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	// TODO sign-in the user if their credentials aren't invalid
	// NOTE: User 'bcrypt.compare' to check password

	return new Response("login is not implemented yet", { status: 200 });
};
