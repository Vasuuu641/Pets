import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile } from 'fs/promises';
import type { User } from '$lib/types';

const usersPath = path.resolve('static/data/users.json');

export const GET: RequestHandler = async ({ url }) => {
    // Extract userId from query parameters
    const userId = parseInt(url.searchParams.get('userId') || '', 10);

    if (!userId) {
        return new Response(
            JSON.stringify({ error: 'Missing userId.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Read the user data from the file
    const userFile = await readFile(usersPath, 'utf-8');
    const userData: User[] = JSON.parse(userFile);

    // Find the user with the given userId
    const user = userData.find((user) => user.id === userId);

    if (!user) {
        return new Response(
            JSON.stringify({ error: 'User not found.' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Return the user's inventory data
    return new Response(
        JSON.stringify({
            inventory: user.inventory,
            budget: user.budget
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};
