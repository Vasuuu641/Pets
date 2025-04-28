import { Log } from '$lib/services/Log';
import type { RequestHandler } from "@sveltejs/kit";
import type { Pet } from "$lib/models/Pet";
import type { User } from "$lib/models/User";
import fs from 'fs/promises';
import path from "path";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

//Main task of this server api is to handle the incoming logs request when admin wants to access log data.
// Handles the request through a GET method
//Ensures that only admins can access the logs page.
export const GET: RequestHandler = async ({ request }) => {   // Add `{ request }` to the argument here
    try {
        //Authenitcated the user first to see if they are authorized to view logs
        const cookies = parse(request.headers.get('cookie') || '');
        const token = cookies.session;

        if (!token) {
            return new Response('You must be logged in', { status: 401 });
        }

        const decoded: any = jwt.verify(token, 'your-secret-key');

        if (decoded.role !== 'admin') {
            return new Response('Forbidden: Admins only', { status: 403 });
        }

        //Reads files only after a successful authentication
        const logfile: string = await fs.readFile(logPath, 'utf-8');
        const log_data: Log[] = JSON.parse(logfile);

        const user_file: string = await fs.readFile(usersPath, 'utf-8');
        const user_data: User[] = JSON.parse(user_file);

        const pet_file: string = await fs.readFile(petsPath, 'utf-8');
        const pet_data: Pet[] = JSON.parse(pet_file);

        //Maps the logs to be viewed by the admin
        const logs: Log[] = log_data.map(log => {
            const user = user_data.find(u => u.id === log.userId);
            const pet = pet_data.find(p => p.id === log.petId);

            return new Log(
                log.action,
                log.userId,
                log.petId,
                log.timestamp,
                user ? user.name : 'Unknown Person',
                pet ? pet.name : 'Unknown Pet'
            );
        });

        return new Response(JSON.stringify(logs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Failed to read logs:', err);
        return new Response('Failed to read logs.', { status: 500 });
    }
};
