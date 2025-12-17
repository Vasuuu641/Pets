//Kept types.ts to facilitate scalability and maintenance of the code
//Allows programmers to view all the types easily and make changes if needed
//Typescript automatically makes changes to other classes if the classes don't have
// the same properties or if a new property has to be added

export type Role = 'admin'|'user';

export interface Pet {
	id: number;
	name: string;
	type: string;
	adopted: boolean;
	adoptedBy: number | null;
	hunger : number;
	happiness : number;
	imageUrl : string;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
	adoptedPets: Pet[];
	role: Role;
	budget : number;
	inventory: {
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
