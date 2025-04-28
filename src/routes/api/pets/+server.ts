import { readFile, writeFile } from 'fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import type { Pet } from '$lib/types';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	const file = await readFile(petsPath, 'utf-8');
	const data: Pet[] = JSON.parse(file);

	const filtered_pets = type ? data.filter(pet => pet.type === type) : data;

	console.log('Filtering pets by type:', type); // Log the type filter

	return new Response(JSON.stringify(filtered_pets));
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = await request.json();

		const file = await readFile(petsPath, 'utf-8'); // ✅ Read before using
		const pets: Pet[] = JSON.parse(file);

		const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;

		// Construct a full pet object with defaults
		const new_pet: Pet = {
			id: newId,           // 🆔 Unique ID
			name: input.name,
			type: input.type,
			hunger: input.hunger ?? 100,
			happiness: input.happiness ?? 0,
			adopted: false,                    // 🐾 Not adopted by default
			adoptedBy: null                   // 👤 No owner yet
		};

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
