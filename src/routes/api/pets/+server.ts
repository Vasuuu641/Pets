import {readFile, writeFile} from 'fs/promises';
import path from 'path';
import { Pet } from '$lib/models/Pet';
import type { RequestHandler } from '@sveltejs/kit';

const petsPath = path.resolve('static/data/pets.json');

//GET method to load the pets to the homepage
export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	const file = await readFile(petsPath, 'utf-8');
	const rawPets = JSON.parse(file);
	const pets: Pet[] = rawPets.map((petData: Pet) => new Pet(
		petData.id,
		petData.name,
		petData.type,
		petData.adopted,
		petData.adoptedBy,
		petData.hunger,
		petData.happiness
	));

	//If a type is specified then filters the pets by type to display. If not, then no filter applied
	const filtered_pets = type ? pets.filter(pet => pet.type === type) : pets;

	console.log('Filtering pets by type:', type);

	return new Response(JSON.stringify(filtered_pets));
};

//POST enables the admin to add a new pet
export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = await request.json();
		const file = await readFile(petsPath, 'utf-8');
		const rawPets = JSON.parse(file);
		const pets: Pet[] = rawPets.map((petData: Pet) => new Pet(
			petData.id,
			petData.name,
			petData.type,
			petData.adopted,
			petData.adoptedBy,
			petData.hunger,
			petData.happiness
		));

		const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;

		const new_pet = new Pet(
			newId,
			input.name,
			input.type,
			false,   // adopted
			null,    // adoptedBy
			input.hunger ?? 100,
			input.happiness ?? 0
		);

		pets.push(new_pet);
		await writeFile(petsPath, JSON.stringify(pets, null, 2));

		return new Response(
			JSON.stringify({ message: 'Pet added successfully!', pet: new_pet }),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (err) {
		console.error('Failed to add pet:', err);
		return new Response(
			JSON.stringify({ error: 'Failed to add pet!' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
