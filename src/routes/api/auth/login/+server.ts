import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';
import { Person } from '$lib/models/Person';
import { User } from '$lib/models/User';
import { Admin } from '$lib/models/Admin';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { name, password } = await request.json();

		//Reads what is already in users.json
		const file: string = await readFile(usersPath, 'utf-8');
		let user_data: Person[];

		try {
			user_data = JSON.parse(file); // Parses users.json
		} catch (err) {
			console.error('Error parsing users.json:', err);
			return new Response(JSON.stringify({ error: 'Failed to read user data.' }), {
				status: 500,
			});
		}

		// Find the user by name
		const user = user_data.find(user => user.name === name);

		if (!user) {
			return new Response(JSON.stringify({ error: 'Person not found or name mismatch' }), {
				status: 404,
			});
		}

		// Create the correct user instance based on the role
		let userInstance: Person;

		if (user.role === 'admin') {
			// If the user is an admin, instantiate the Admin class
			userInstance = new Admin(
				user.id,
				user.name,
				user.passwordHash,
				user.adoptedPets,
				user.role,
				user.budget,
				user.inventory
			);
		} else {
			userInstance = new User(
				user.id,
				user.name,
				user.passwordHash,
				user.adoptedPets,
				user.role,
				user.budget,
				user.inventory
			);
		}

		// Use the verifyPassword method
		const isMatch = await userInstance.verifyPassword(password);

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

		// Set cookie with user info
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
