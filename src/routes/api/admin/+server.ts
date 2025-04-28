import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from '@sveltejs/kit';
import { Admin } from '$lib/models/Admin';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Pet, User } from '$lib/types';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
    try {
        //Gets cookies
        const cookies = parse(request.headers.get('cookie') || '');
        const token = cookies.session;

        if (!token) {
            return new Response('Unauthorized', { status: 401 });
        }

        const decoded: any = jwt.verify(token, 'your-secret-key');

        //Checks whether the role is admin or not
        if (decoded.role !== 'admin') {
            return new Response('Forbidden: Not an admin', { status: 403 });
        }

        const { name, type } = await request.json();

        if (!name || !type) {
            return new Response('Missing pet name or type', { status: 400 });
        }

        // Read current pets
        const petFile = await readFile(petsPath, 'utf-8');
        const pets: Pet[] = JSON.parse(petFile);

        // Read current users
        const userFile = await readFile(usersPath, 'utf-8');
        const users: User[] = JSON.parse(userFile);

        //Finding admin object
        const adminUser = users.find(u => u.id === decoded.id && u.role === 'admin');

        if (!adminUser) {
            return new Response('Admin user not found', { status: 404 });
        }

        // Creates an instance of admin
        const admin = new Admin(
            adminUser.id,
            adminUser.name,
            adminUser.passwordHash,
            adminUser.adoptedPets || [],
            'admin',
            adminUser.budget,
            adminUser.inventory
        );

        // Uses the method in Admin class to enable the admin to add a new pet
        const newPet = admin.createPet({ name, type });

        // Add the new pet to the pets array
        pets.push(newPet);

        // Save updated pets back to file
        await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

        return new Response(JSON.stringify({ message: 'Pet added successfully', pet: newPet }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error(err);
        return new Response('Something went wrong', { status: 500 });
    }
};
