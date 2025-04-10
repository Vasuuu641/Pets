export interface Pet {
	name: string
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
