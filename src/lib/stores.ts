import { writable } from 'svelte/store';
import type {SafeUser} from './types';

// This store should always hold the currently logged-in user (without passwordHash)
export const currentUser = writable<SafeUser | null>(null);
