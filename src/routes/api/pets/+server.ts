import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Pet } from '$lib/models/Pet';
import type { RequestHandler } from '@sveltejs/kit';
import { getRandomPetImage } from '$lib/data/petImage';

const petsPath = path.join(process.cwd(), 'static', 'data', 'pets.json');

// Helper to safely parse JSON
async function safeReadPets(): Promise<any[]> {
    try {
        const file = await readFile(petsPath, 'utf-8');
        const data = JSON.parse(file);
        if (!Array.isArray(data)) throw new Error('pets.json is not an array');
        return data;
    } catch (err) {
        console.error('Failed to read pets.json:', err);
        return [];
    }
}

// GET handler: fetch pets
export const GET: RequestHandler = async ({ url }) => {
    try {
        const typeFilter = url.searchParams.get('type');

        const rawPets = await safeReadPets();

        const pets: Pet[] = rawPets.map((petData: any) => {
            const type = petData.type && ['puppy', 'kitten'].includes(petData.type) ? petData.type : 'puppy';
            return new Pet(
                petData.id ?? 0,
                petData.name ?? 'Unnamed',
                type,
                petData.adopted ?? false,
                petData.adoptedBy ?? null,
                petData.hunger ?? 100,
                petData.happiness ?? 0,
                petData.imageUrl ?? getRandomPetImage(type)
            );
        });

        const filteredPets = typeFilter
            ? pets.filter(pet => pet.type === typeFilter)
            : pets;

        return new Response(JSON.stringify(filteredPets), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('GET /api/pets failed:', err);
        return new Response(
            JSON.stringify({ error: 'Failed to load pets!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// POST handler: add new pet
export const POST: RequestHandler = async ({ request }) => {
    try {
        const input = await request.json();

        const rawPets = await safeReadPets();

        const pets: Pet[] = rawPets.map((petData: any) => {
            const type = petData.type && ['puppy', 'kitten'].includes(petData.type) ? petData.type : 'puppy';
            return new Pet(
                petData.id ?? 0,
                petData.name ?? 'Unnamed',
                type,
                petData.adopted ?? false,
                petData.adoptedBy ?? null,
                petData.hunger ?? 100,
                petData.happiness ?? 0,
                petData.imageUrl ?? getRandomPetImage(type)
            );
        });

        // Assign new ID
        const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;

        // Validate type
        const type = input.type && ['puppy', 'kitten'].includes(input.type) ? input.type : 'puppy';

        // Assign image if missing
        const imageUrl = input.imageUrl ?? getRandomPetImage(type);

        const newPet = new Pet(
            newId,
            input.name ?? 'Unnamed',
            type,
            false,      // adopted
            null,       // adoptedBy
            input.hunger ?? 100,
            input.happiness ?? 0,
            imageUrl
        );

        pets.push(newPet);

        await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

        return new Response(JSON.stringify({ message: 'Pet added successfully!', pet: newPet }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('POST /api/pets failed:', err);
        return new Response(
            JSON.stringify({ error: 'Failed to add pet!' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
