import { Log } from '$lib/services/Log';
import type { RequestHandler } from "@sveltejs/kit";
import type { Pet } from "$lib/models/Pet";
import type { User } from "$lib/models/User";
import fs from 'fs/promises';
import path from "path";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import {Logger} from "$lib/services/Logger";

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

//Main task of this server api is to handle the incoming logs request when admin wants to access log data.
// Handles the request through a GET method
//Ensures that only admins can access the logs page.
export const GET: RequestHandler = async ({ request }) => {   // Add `{ request }` to the argument here
    try {
        //Authenticated the user first to see if they are authorized to view logs
        const cookies = parse(request.headers.get('cookie') || '');
        const token = cookies.session;

        if (!token) {
            return new Response('You must be logged in', { status: 401 });
        }

        const decoded: any = jwt.verify(token, 'your-secret-key');

        if (decoded.role !== 'admin') {
            return new Response('Forbidden: Admins only', { status: 403 });
        }

        const logs = await Logger.getLogs();

        return new Response(JSON.stringify(logs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Failed to read logs:', err);
        return new Response('Failed to read logs.', { status: 500 });
    }
};
