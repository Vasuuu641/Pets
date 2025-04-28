import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { User } from '$lib/types';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, password } = await request.json();

		// Read existing users
		const file: string = await readFile(usersPath, 'utf-8');
		const user_data: User[] = JSON.parse(file);

		// Check for existing user by name
		const existingUser = user_data.find(user => user.name === name);
		if (existingUser) {
			return new Response(
				JSON.stringify({ error: 'A user with this name already exists' }),
				{ status: 409 }
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate a new unique ID (auto-increment based on the last user's id)
		const newId = user_data.length > 0 ? Math.max(...user_data.map((u: any) => u.id)) + 1 : 1;

		// Create the new user object
		const newUser: User = {
			id: newId,
			name,
			passwordHash: hashedPassword,
			adoptedPets: [],
			role : "user",
			budget : 100,
			inventory : {
				food : 0,
				toy : 0,
				treat : 0
			}
		};

		// Add to users array
		user_data.push(newUser);

		// Write updated users back to file
		await writeFile(usersPath, JSON.stringify(user_data, null, 2));

		// Return success message
		return new Response(
			JSON.stringify({
				message: 'Registration successful',
				user: { id: newUser.id, name: newUser.name }
			}),
			{ status: 201 }
		);


	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: 'Failed to register user' }),
			{ status: 500 }
		);
	}
};
