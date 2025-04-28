import { writable } from 'svelte/store';
import type {SafeUser} from './types';
import type {Pet} from './types';

// This store should always hold the currently logged-in user (without passwordHash)
export const currentUser = writable<SafeUser | null>(null);

//Stores an array of Pet objects where the pet can be stored and values within the array can be updated
export const pets = writable<Pet[]>([]);
