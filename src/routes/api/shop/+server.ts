import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import {canAfford} from "$lib/helpers";

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { item, userId } = await request.json();

		const prices: Record<string, number> = {
			food: 5,
			toy: 10,
			treat: 15
		};

		if (!['food', 'toy', 'treat'].includes(item)) {
			return new Response(JSON.stringify({ error: 'Invalid item.' }), { status: 400 });
		}

		const usersData = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
		const user = usersData.find((u: any) => u.id === userId);

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
		}

		const cost = prices[item];

		// Check if enough budget
		if (!canAfford(user,cost)) {
			return new Response(JSON.stringify({ error: 'Not enough budget to buy this item.' }), { status: 400 });
		}

		// Deduct money, add item
		user.budget -= cost;
		user.inventory[item] += 1;

		await fs.writeFile(usersPath, JSON.stringify(usersData, null, 2));

		return new Response(JSON.stringify({ message: `${item} purchased successfully!` }), { status: 200 });

	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
};
