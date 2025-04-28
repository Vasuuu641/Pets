import { User } from '$lib/models/User';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import type { User as UserType } from '$lib/models/User';
import { Person } from "$lib/models/Person";

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, password } = await request.json();

		// Read existing users
		const file: string = await readFile(usersPath, 'utf-8');
		const user_data: UserType[] = JSON.parse(file);

		// Check for existing user by name
		const existingUser = user_data.find(user => user.name === name);
		if (existingUser) {
			return new Response(
				JSON.stringify({ error: 'A user with this name already exists' }),
				{ status: 409 }
			);
		}

		// Create the new person (base user) using the static method from Person
		const newPerson = await Person.createUser(name, password); // This returns a Person instance

		// Convert the Person instance to a User instance for additional functionality
		const newUser = new User(
			newPerson.id,
			newPerson.name,
			newPerson.passwordHash, // Access passwordHash
			newPerson.adoptedPets,
			newPerson.role,
			newPerson.budget,
			newPerson.inventory
		);

		// Add the new User to the users array
		user_data.push(newUser);

		// Write updated users back to the file
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
