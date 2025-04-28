import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse incoming request body
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
		const users = JSON.parse(usersData);
		const petsData = await readFile(petsPath, 'utf-8');
		const pets = JSON.parse(petsData);

		// Find the user and pet
		const user = users.find((user: any) => user.id === userId);
		const pet = pets.find((pet: any) => pet.id === petId);

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

		// If the pet is already adopted, respond accordingly
		if (pet.adopted) {
			return new Response(
				JSON.stringify({ error: 'This pet has already been adopted.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Mark the pet as adopted
		pet.adopted = true;
		pet.adoptedBy = userId;

		// Update the pet list in the pets.json file
		await writeFile(petsPath, JSON.stringify(pets, null, 2));

		// Update the user’s adopted pets list
		user.adoptedPets = user.adoptedPets || [];
		user.adoptedPets.push(petId);

		// Update the user list in the users.json file
		await writeFile(usersPath, JSON.stringify(users, null, 2));

		// Return success response
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


