import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { User } from '$lib/types'; // Make sure you have the correct type for Person

const usersPath = path.resolve('static/data/users.json');  // Path to your users.json

export const POST: RequestHandler = async ({ request }) => {
    try {
       //Gets the userId and the current inventory from the request body
        const { userId, inventory } = await request.json();

        //reads the users.json file to see what is currently stored
        const userFile = await readFile(usersPath, 'utf-8');
        const userData: User[] = JSON.parse(userFile);

        //Finds the user based on id
        const user = userData.find((user) => user.id === userId);

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Person not found.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

   //Updates the inventory after a purchase or after an action
        user.inventory = inventory;

        //Re - writes the users.json file with new data
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
