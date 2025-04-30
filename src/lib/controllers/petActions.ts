// src/lib/helpers/petActions.ts
import { feedPet, returnPet, toyPet, canAfford } from '$lib/helpers';
import { Logger } from '$lib/services/Logger';
import type { Pet, User } from '$lib/types';

type ActionResult = { success: boolean; error?: string };

export async function handlePetAction(
    action: 'feed' | 'play' | 'return',
    user: User,
    pet: Pet
): Promise<ActionResult> {
    switch (action) {
        case 'feed':
            if (!canAfford(user, 5)) return { success: false, error: 'Not enough budget to feed.' };
            feedPet(pet);
            user.budget -= 5;
            await Logger.logAction('feed', user.id, pet.id);
            return { success: true };

        case 'play':
            if (!canAfford(user, 10)) return { success: false, error: 'Not enough budget to play.' };
            toyPet(pet);
            user.budget -= 10;
            await Logger.logAction('play', user.id, pet.id);
            return { success: true };

        case 'return':
            returnPet(pet);
            user.budget -= 20;
            if (user.adoptedPets) {
                user.adoptedPets = user.adoptedPets.filter(pid => pid !== pet.id);
            }
            await Logger.logAction('return', user.id, pet.id);
            return { success: true };

        default:
            return { success: false, error: 'Unknown action.' };
    }
}
