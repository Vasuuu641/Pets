import type {Pet, User} from './types';

export function canAfford(user: User, cost : number) {
return user.budget >= cost;
}

export function feedPet(pet: Pet) {
    pet.hunger -= 20;

    if (pet.hunger < 0) {
        pet.hunger = 0;
    }
}

export function toyPet(pet: Pet) {
pet.happiness += 20;

if(pet.happiness > 100){
pet.happiness = 100;
     }
}

export function returnPet(pet: Pet) {
pet.adopted = false;
pet.adoptedBy = null;
}
