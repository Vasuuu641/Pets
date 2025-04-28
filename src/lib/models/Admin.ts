import { User } from './User';
import type {Logs, Pet} from "$lib/types"; // Import the User class

//Admin class extends User class. User class extends Person
export class Admin extends User {
    constructor(
        id: number,
        name: string,
        passwordHash: string,
        adoptedPets: Pet[],
        role: 'admin',
        budget: number,
        inventory: { food: number; toy: number; treat: number }
    ) {
        super(id, name, passwordHash, adoptedPets, role, budget, inventory);
    }

    createPet(petDetails: { name: string; type: string; hunger?: number; happiness?: number }): Pet {
        const newPet: Pet = {
            id: Date.now(),
            name: petDetails.name,
            type: petDetails.type,
            adopted: false,
            adoptedBy: null,
            hunger: petDetails.hunger ?? 50, //Sets a default value of 50 unless the admin specifies a value
            happiness: petDetails.happiness ?? 50 //Works the same way as the pet hunger does
        };
        return newPet;
    }
}
