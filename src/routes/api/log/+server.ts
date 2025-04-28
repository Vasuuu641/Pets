import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import type { Logs, Pet, User } from '$lib/types';

const logPath = path.resolve('static/data/log.json');
const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async () => {
	try {
		// Read the log file
		const logfile: string = await fs.readFile(logPath, 'utf-8');
		const log_data: Logs[] = JSON.parse(logfile);

		// Read user and pet data
		const user_file: string = await fs.readFile(usersPath, 'utf-8');
		const user_data: User[] = JSON.parse(user_file);

		const pet_file: string = await fs.readFile(petsPath, 'utf-8');
		const pet_data: Pet[] = JSON.parse(pet_file);

		// Add user and pet names to the log data
		const logsWithNames = log_data.map(log => {
			const user = user_data.find(u => u.id === log.userId);
			const pet = pet_data.find(p => p.id === log.petId);

			return {
				...log,
				userName: user ? user.name : 'Unknown User',
				petName: pet ? pet.name : 'Unknown Pet'
			};
		});

		// Return the logs with names as a JSON response
		return new Response(JSON.stringify(logsWithNames), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Failed to read logs:', err);
		return new Response('Failed to read logs.', { status: 500 });
	}
};
