import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile } from 'fs/promises';
import type { User } from '$lib/types';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { name, password } = await request.json();

		// Read user data
		const file: string = await readFile(usersPath, 'utf-8');
		const user_data: User[] = JSON.parse(file);

		// Find the user by name
		const user = user_data.find(user => user.name === name);

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found or name mismatch' }), {
				status: 404,
			});
		}

		// Compare password with hash
		const isMatch = await bcrypt.compare(password, user.passwordHash);

		if (!isMatch) {
			return new Response(JSON.stringify({ error: 'Invalid password' }), {
				status: 401,
			});
		}

		// Generate a JWT (or just a session token) with user data
		const token = jwt.sign(
			{ id: user.id, name: user.name, role: user.role },
			'your-secret-key', // Replace with your secret key
			{ expiresIn: '1h' }
		);

		//Set cookie with user info
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production', // Ensure secure in production
			maxAge: 60 * 60 * 24 // 1 day
		});


		// Success response
		return new Response(
			JSON.stringify({
				message: 'Login successful',
				user: {
					id: user.id,
					name: user.name,
					role: user.role
				}
			}),
			{ status: 200 }
		);

	} catch (err) {
		console.error(err);
		return new Response('Could not login successfully', {
			status: 500,
		});
	}
};
