export type Role = 'admin'|'user';

export interface Pet {
	id: number;
	name: string;
	type: string;
	adopted: boolean;
	adoptedBy: number | null;
	hunger : number;
	happiness : number;

}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
	adoptedPets: Pet[];
	role: Role;
	budget : number;
	inventory: { // Corrected this line
		food: number;
		toy: number;
		treat: number;
	};

}

export interface Logs {
	action: string;
	userId: number;
	petId: number;
	timestamp: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
