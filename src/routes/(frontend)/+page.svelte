<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';

    let pets = [];
    let petType: '' | 'puppy' | 'kitten' = '';
    let isLoading = false;
    let errorMessage = '';
    let user = $currentUser;

    async function loadPets() {
        isLoading = true;
        errorMessage = '';
        try {
            const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
            if (!res.ok) {
                errorMessage = 'Failed to load pets.';
                return;
            }
            pets = await res.json();
        } catch (err) {
            console.log(err);
            errorMessage = 'Failed to load pets.';
        } finally {
            isLoading = false;
        }
    }

	async function adopt(petId: number) {
        // TODO only let the user adopt if they are signed in.
	}

        try {
            const res = await fetch('/api/adopt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, userId: user.id })
            });

            if (!res.ok) throw new Error('Failed to adopt pet.');

            // After adoption, manually update the pet list
            pets = pets.map(pet =>
                pet.id === petId ? { ...pet, adopted: true } : pet
            );

            await loadPets();
        } catch (err) {
            console.log(err);
            errorMessage = 'Failed to adopt the pet. Please try again later.';
        }
    }

    onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

<!-- 🐾 Filter dropdown -->
<label for="petType">Filter by type:</label>
<select id="petType" bind:value={petType} on:change={loadPets}>
    <option value="">All</option>
    <option value="puppy">Puppies</option>
    <option value="kitten">Kittens</option>
</select>

{#if isLoading}
    <p>Loading pets...</p>
{:else}
    {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
    {:else if pets.length === 0}
        <p>No pets available.</p>
    {:else}
        <ul>
            {#each pets as pet}
                <li>
                    <strong>{pet.name}</strong> — {pet.type}
                    {#if !pet.adopted}
                        <button on:click={() => adopt(pet.id)} disabled={pet.adopted}>Adopt</button>
                    {:else}
                        <span>✅ Adopted</span>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
{/if}

<style>
    select {
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    button {
        background-color: #0077cc;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        cursor: pointer;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
        background-color: #005f99;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        padding: 1rem;
        background: #f9f9f9;
        border: 1px solid #ddd;
        margin-bottom: 0.5rem;
    }

    span {
        font-size: 1rem;
        color: green;
    }
</style>
