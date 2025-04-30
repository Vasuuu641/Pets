import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import type { Pet, User } from "$lib/types";
import { readFile, writeFile } from 'fs/promises';
import {handlePetAction} from "$lib/controllers/petActions";

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');

export const POST: RequestHandler = async ({ request }) => {
	// Parse incoming request body
	type petAction = 'feed' | 'play' | 'return';
	const { action, userId, petId }: { action: petAction; userId: number; petId: number } = await request.json();

	const pet_file = await readFile(petsPath, 'utf-8');
	const pet_data: Pet[] = JSON.parse(pet_file);

	const user_file: string = await readFile(usersPath, 'utf-8');
	const user_data: User[] = JSON.parse(user_file);

	// Validate the userId and petId
	if (!userId || !petId) {
		return new Response(
			JSON.stringify({ error: 'Missing petId or userId.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	// Find the user and pet
	const user = user_data.find((user: any) => user.id === userId);
	const pet = pet_data.find((pet: any) => pet.id === petId);

	if (!user) {
		return new Response(
			JSON.stringify({ error: 'Person not found.' }),
			{ status: 404, headers: { 'Content-Type': 'application/json' } }
		);
	}

	if (!pet) {
		return new Response(
			JSON.stringify({ error: 'Pet not found.' }),
			{ status: 404, headers: { 'Content-Type': 'application/json' } }
		);
	}

	// Checking if the pet has been adopted by this user
	if (!pet.adopted || pet.adoptedBy !== userId) {
		return new Response(
			JSON.stringify({ error: 'You have not adopted this pet!' }),
			{ status: 404, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const result = await handlePetAction(action, user, pet);

	if (!result.success) {
		return new Response(JSON.stringify({ error: result.error }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Updating the user data and re - writing the data
	const updatedUserData = user_data.map((u) => (u.id === userId ? user : u));
	await writeFile(usersPath, JSON.stringify(updatedUserData, null, 2), 'utf-8');

	//Does the same for pets - updates the data
	const updatedPetData = pet_data.map((p) => (p.id === petId ? pet : p));
	await writeFile(petsPath, JSON.stringify(updatedPetData, null, 2), 'utf-8');

	// Success message if all goes well
	return new Response(
		JSON.stringify({ success: true, updatedUser: user, updatedPet: pet }),
		{ status: 200, headers: { 'Content-Type': 'application/json' } }
	);
};
