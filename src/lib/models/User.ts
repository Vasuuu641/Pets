import { Person } from './Person';
import type { Pet, Role } from '$lib/types';

//Created a User class which extends Person.
export class User extends Person {
    constructor(
        id: number,
        name: string,
        passwordHash: string,
        adoptedPets: Pet[],
        role: Role,
        budget: number,
        inventory: { food: number; toy: number; treat: number }
    ) {
        super(id, name, passwordHash, adoptedPets, role, budget, inventory);
    }

}
