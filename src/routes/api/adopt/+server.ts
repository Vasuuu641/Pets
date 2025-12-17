import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { Pet } from '$lib/models/Pet';
import type { User } from '$lib/types';

const usersPath = path.join(process.cwd(), 'static/data/users.json');
const petsPath = path.join(process.cwd(), 'static/data/pets.json');

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { petId, userId } = await request.json();

    if (!petId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing petId or userId.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load users and pets
    const usersRaw = await readFile(usersPath, 'utf-8');
    const petsRaw = await readFile(petsPath, 'utf-8');

    const users: User[] = JSON.parse(usersRaw);
    const petsData: any[] = JSON.parse(petsRaw);

    // Convert pets to class instances
    const pets: Pet[] = petsData.map(
      p =>
        new Pet(
          p.id,
          p.name,
          p.type,
          p.adopted ?? false,
          p.adoptedBy ?? null,
          p.hunger ?? 100,
          p.happiness ?? 0,
          p.imageUrl ?? null
        )
    );

    const user = users.find(u => u.id === userId);
    const pet = pets.find(p => p.id === petId);

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

    // Initialize adoptedPets if missing
    user.adoptedPets = user.adoptedPets || [];

    if (user.adoptedPets.includes(petId)) {
      return new Response(
        JSON.stringify({ error: 'User has already adopted this pet.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mark pet as adopted
    pet.adopt(userId);

    // Add pet to user's adopted list
    user.adoptedPets.push(petId);

    // Save back to JSON
    await writeFile(
      petsPath,
      JSON.stringify(pets, (_, v) => (v instanceof Pet ? { ...v } : v), 2)
    );
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    return new Response(
      JSON.stringify({ message: 'Pet adopted successfully.', pet }),
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
