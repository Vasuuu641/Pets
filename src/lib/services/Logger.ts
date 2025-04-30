import fs from 'fs/promises';
import path from 'path';
import { Log } from './Log';
import { User } from '$lib/models/User';
import { Pet } from '$lib/models/Pet';
import type { Logs } from '$lib/types';

const logPath = path.resolve('static/data/log.json');
const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');

//Logger class created to provide help to /log/+server.ts
//Provides log related functions such as reading and structuring log data
export class Logger {
    static async getLogs(): Promise<Log[]> {
        try {
            const logfile: string = await fs.readFile(logPath, 'utf-8');
            const log_data: Logs[] = JSON.parse(logfile);

            const user_file: string = await fs.readFile(usersPath, 'utf-8');
            const user_data: User[] = JSON.parse(user_file);

            const pet_file: string = await fs.readFile(petsPath, 'utf-8');
            const pet_data: Pet[] = JSON.parse(pet_file);


            return log_data.map(log => {
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
        } catch (err) {
            console.error('Failed to read logs:', err);
            throw new Error('Failed to read logs.');
        }
    }

    static async logAction(action: string, userId: number, petId: number) {
        try {
            let logs: Logs[] = [];

            try {
                const logfile = await fs.readFile(logPath, 'utf-8');
                logs = JSON.parse(logfile);
            } catch {
                logs = [];
            }

            const newLog: Logs = {
                action,
                userId,
                petId,
                timestamp: new Date().toISOString()
            };

            logs.push(newLog);
            await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');
        } catch (err) {
            console.error('Failed to write to logs:', err);
        }
    }

}
