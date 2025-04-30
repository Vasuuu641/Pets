import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { User, Pet } from '$lib/types'; // Import relevant types

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { petId, userId } = await request.json();

		// Validate the userId and petId
		if (!userId || !petId) {
			return new Response(
				JSON.stringify({ error: 'Missing petId or userId.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Load users and pets data
		const usersData = await readFile(usersPath, 'utf-8');
		const users: User[] = JSON.parse(usersData); // Use the User type
		const petsData = await readFile(petsPath, 'utf-8');
		const pets: Pet[] = JSON.parse(petsData); // Use the Pet type

		// Find the user and pet
		const user = users.find((user: User) => user.id === userId);
		const pet = pets.find((pet: Pet) => pet.id === petId);

		if (!user) {
			return new Response(
				JSON.stringify({ error: 'User not found.' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } }
			);
		}

		if (!pet) {
			return new Response(
				JSON.stringify({ error: 'Pet not found.' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } }
			);
		}


		// If a user has adopted the pet, disable the adopt button and show adopted sign next to the pet name
		if (user.adoptedPets.includes(petId)) {
			return new Response(
				JSON.stringify({ error: 'User has already adopted this pet.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Mark the pet as adopted
		pet.adopted = true;
		pet.adoptedBy = userId;


		// Update the pet list in the pets.json file
		await writeFile(petsPath, JSON.stringify(pets, null, 2));

		// Add the pet to the user's adopted pets list
		user.adoptedPets.push(petId);

		// Update the user list in the users.json file
		await writeFile(usersPath, JSON.stringify(users, null, 2));


		return new Response(
			JSON.stringify({ message: 'Pet adopted successfully.' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);

	} catch (err) {
		console.error('Error during adoption:', err);
		return new Response(
			JSON.stringify({ error: 'An error occurred while processing the adoption.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
