<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser, pets } from '$lib/stores';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';

    // Load pets from backend on mount
    async function loadPets() {
        const res = await fetch('/api/pets');
        const petsData = await res.json();
        pets.set(petsData);

        filterAdoptedPets();
    }

    function filterAdoptedPets() {
        const user = get(currentUser);
        if (!user) return;

        const adopted = get(pets).filter(pet => pet.adoptedBy === user.id);

        currentUser.update(u => u ? {
            ...u,
            adoptedPets: adopted,
            petList: adopted
        } : u);
    }

    // Action buttons logic
    async function handleAction(action: 'feed' | 'play' | 'return', petId: number) {
        const user = get(currentUser);
        if (!user) {
            console.log('You must be logged in to perform this action!');
            return;
        }

        const res = await fetch('/api/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, userId: user.id, petId })
        });

        if (res.ok) {
            await loadPets();
            filterAdoptedPets();
        } else {
            const error = await res.json();
            alert(error.error || 'Something went wrong.');
        }
    }

    async function feedPet(petId: number) {
        const user = get(currentUser);
        if (!user) {
            console.log('You must be logged in to perform this action!');
            return;
        }

        // Check if inventory is initialized (it should be if the user is logged in)
        if (!user.inventory) {
            console.log('No inventory found for the user. Initializing inventory.');
            user.inventory = { food: 0, toy: 0, treat: 0 };  // Initialize inventory if not set
        }

        // Check if food or treat is available, else redirect to shop
        if (user.inventory.food > 0) {
            user.inventory.food--; // Decrease food count
            console.log('Fed pet with food');
        } else if (user.inventory.treat > 0) {
            user.inventory.treat--; // Decrease treat count
            console.log('Fed pet with treat');
        } else if (user.budget >= 5) {
            alert('You have no food or treats to feed your pet!');
            await goto('/shop'); // Redirect to shop if no food/treat
            return; // Early return to prevent further logic execution
        } else {
            alert('You don\'t have enough food, treats, or budget!');
            await goto('/shop'); // Redirect to shop if no food/treat/budget
            return; // Early return to prevent further logic execution
        }

        try {
            // Update the user's inventory on the server
            const res = await fetch('/api/updatedInventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    inventory: user.inventory
                })
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to update inventory');
                return;
            }

            console.log('Inventory updated successfully');

            // Perform the feed action after updating the inventory
            await handleAction('feed', petId);

        } catch (error) {
            console.error('Error updating inventory:', error);
            alert('Something went wrong while updating inventory.');
        }
    }

    async function playpet(petId: number) {
        const user = get(currentUser);
        if (!user) {
            console.log('You must be logged in to perform this action!');
            return;
        }

        // Check if inventory is initialized (it should be if the user is logged in)
        if (!user.inventory) {
            console.log('No inventory found for the user. Initializing inventory.');
            user.inventory = { food: 0, toy: 0, treat: 0 };  // Initialize inventory if not set
        }

        if (user.inventory.toy > 0) {
            user.inventory.toy--; // Decrease food count
            console.log('Fed pet with food');
        } else {
            alert('You don\'t have enough toys to play!');
            await goto('/shop'); // Redirect to shop if no food/treat/budget
            return; // Early return to prevent further logic execution
        }

        try {
            // Update the user's inventory on the server
            const res = await fetch('/api/updatedInventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    inventory: user.inventory
                })
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to update inventory');
                return;
            }

            console.log('Inventory updated successfully');

            // Perform the feed action after updating the inventory
            await handleAction('play', petId);

        } catch (error) {
            console.error('Error updating inventory:', error);
            alert('Something went wrong while updating inventory.');
        }

    }

    onMount(() => {
        loadPets();
    });
</script>

<h1>Welcome, {$currentUser?.name}</h1>

{#if $currentUser && $currentUser.adoptedPets && $currentUser.adoptedPets.length > 0}
    <h2>Your Adopted Pets</h2>
    <ul>
        {#each $currentUser.adoptedPets as pet}
            <li>{pet.name}</li>
            Hunger: {pet.hunger}/100<br>
            Happiness: {pet.happiness}/100<br>
            <button on:click={() => feedPet(pet.id)}>Feed</button>
            <button on:click={() => playpet(pet.id)}>Play</button>
            <button on:click={() => handleAction('return', pet.id)}>Return</button>
        {/each}
    </ul>
{:else}
    <p>You haven't adopted any pets yet.</p>
{/if}
