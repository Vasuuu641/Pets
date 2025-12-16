<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { Pet } from '$lib/models/Pet';

    // CSS
    import '$lib/styles/global.css';
    import '$lib/styles/Petcard.css';
    import '$lib/styles/filter.css';

    // Image helper
    import { getRandomPetImage } from '$lib/data/petImage';

    let pets: Pet[] = [];
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

            const data = await res.json();

            pets = data.map((petData: Pet) => {
                const pet = new Pet(
                    petData.id,
                    petData.name,
                    petData.type,
                    petData.adopted,
                    petData.adoptedBy,
                    petData.hunger,
                    petData.happiness,
                    petData.imageUrl
                );

                // attach stable image ONCE
                pet.imageUrl = getRandomPetImage(pet.type as 'puppy' | 'kitten');

                return pet;
            });
        } catch (err) {
            console.error(err);
            errorMessage = 'Failed to load pets.';
        } finally {
            isLoading = false;
        }
    }

    async function adopt(petId: number) {
        if (!user) {
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

            pets = pets.map(pet => {
                if (pet.id === petId) {
                    pet.adopt(user.id);
                }
                return pet;
            });

            await loadPets();
        } catch (err) {
            console.error(err);
            errorMessage = 'Failed to adopt the pet. Please try again later.';
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
                        <h3>
                            {pet.name}
                            {pet.type === 'puppy' ? ' 🐶' : ' 🐱'}
                        </h3>

                        <p class="pet-type">{pet.type}</p>

                        <!-- Hunger -->
                        <div class="stat-label">Hunger</div>
                        <div class="stat-bar">
                            <div
                                class="fill hunger"
                                style="width: {pet.hunger}%"
                            ></div>
                        </div>

                        <!-- Happiness -->
                        <div class="stat-label">Happiness</div>
                        <div class="stat-bar">
                            <div
                                class="fill happiness"
                                style="width: {pet.happiness}%"
                            ></div>
                        </div>

                        {#if pet.adopted}
                            <span class="adopted-badge">✅ Adopted</span>
                        {:else}
                            <button on:click={() => adopt(pet.id)}>
                                Adopt 🧡
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
