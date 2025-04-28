import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { User } from '$lib/types'; // Make sure you have the correct type for User

const usersPath = path.resolve('static/data/users.json');  // Path to your users.json

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Get the userId and updated inventory from the request body
        const { userId, inventory } = await request.json();

        // Read the user data from the users.json file
        const userFile = await readFile(usersPath, 'utf-8');
        const userData: User[] = JSON.parse(userFile);

        // Find the user to update
        const user = userData.find((user) => user.id === userId);

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Update the user's inventory
        user.inventory = inventory;

        // Write the updated data back to the users.json file
        await writeFile(usersPath, JSON.stringify(userData, null, 2));

        return new Response(
            JSON.stringify({ message: 'Inventory updated successfully.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to update inventory.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
