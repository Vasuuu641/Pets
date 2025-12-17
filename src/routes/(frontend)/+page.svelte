<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { Pet } from '$lib/models/Pet';
    import { getRandomPetImage } from '$lib/data/petImage';
    import { get } from 'svelte/store';

    // CSS
    import '$lib/styles/global.css';
    import '$lib/styles/Petcard.css';
    import '$lib/styles/filter.css';

    let pets: Pet[] = [];
    let petType: '' | 'puppy' | 'kitten' = '';
    let isLoading = false;
    let errorMessage = '';

    // Subscribe to store safely
    let user = get(currentUser);
    currentUser.subscribe(value => user = value);

    // Load pets safely
    async function loadPets() {
        isLoading = true;
        errorMessage = '';

        try {
            const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
            if (!res.ok) {
                throw new Error(`Failed to load pets: ${res.status}`);
            }

            const data = await res.json();

            pets = data.map((petData: any) => {
                // Validate type
                const type = petData.type && ['puppy', 'kitten'].includes(petData.type) ? petData.type : 'puppy';

                return new Pet(
                    petData.id ?? 0,
                    petData.name ?? 'Unnamed',
                    type,
                    petData.adopted ?? false,
                    petData.adoptedBy ?? null,
                    petData.hunger ?? 100,
                    petData.happiness ?? 0,
                    petData.imageUrl ?? getRandomPetImage(type)
                );
            });

        } catch (err) {
            console.error('Failed to load pets:', err);
            errorMessage = 'Failed to load pets. Please try again later.';
        } finally {
            isLoading = false;
        }
    }

    // Adopt function (update frontend safely)
    async function adopt(petId: number) {
        if (!user || !user.id) {
            goto('/login');
            return;
        }

        try {
            const res = await fetch('/api/adopt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId, userId: user.id })
            });

            if (!res.ok) throw new Error('Failed to adopt pet.');

            // Update local pets array without reloading
            pets = pets.map(pet => {
                if (pet.id === petId) pet.adopt(user!.id);
                return pet;
            });

        } catch (err) {
            console.error('Failed to adopt pet:', err);
            errorMessage = 'Failed to adopt pet. Please try again later.';
        }
    }

    onMount(loadPets);
</script>

<div class="container">
    <h1>🐾 Browse Adoptable Pets</h1>

    <!-- Filter -->
    <div class="filter-container">
        <label for="petType">Filter by type</label>
        <select id="petType" bind:value={petType} on:change={loadPets}>
            <option value="">All</option>
            <option value="puppy">🐶 Puppies</option>
            <option value="kitten">🐱 Kittens</option>
        </select>
    </div>

    {#if isLoading}
        <div class="loader">Loading pets...</div>

    {:else if errorMessage}
        <p class="text-red">{errorMessage}</p>

    {:else if pets.length === 0}
        <p>No pets available.</p>

    {:else}
        <div class="pet-grid">
            {#each pets as pet}
                <div class="pet-card">
                    <!-- Pet Image -->
                    <div class="pet-image">
                        <img src={pet.imageUrl} alt={pet.name} />
                    </div>

                    <!-- Pet Info -->
                    <div class="pet-info">
                        <h3>{pet.name} {pet.type === 'puppy' ? '🐶' : '🐱'}</h3>
                        <p class="pet-type">{pet.type}</p>

                        <!-- Hunger -->
                        <div class="stat-label">Hunger</div>
                        <div class="stat-bar">
                            <div class="fill hunger" style="width: {pet.hunger}%"></div>
                        </div>

                        <!-- Happiness -->
                        <div class="stat-label">Happiness</div>
                        <div class="stat-bar">
                            <div class="fill happiness" style="width: {pet.happiness}%"></div>
                        </div>

                        {#if pet.adopted}
                            <span class="adopted-badge">✅ Adopted</span>
                        {:else}
                            <button on:click={() => adopt(pet.id)}>Adopt 🧡</button>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
