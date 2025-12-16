<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";

    let petName = '';
    let petType = '';
    let petHunger = 0;
    let petHappiness = 0;
    let message = '';
    let success = '';
    let error = '';



    onMount(async() => {
        try{
            const res = await fetch('/admin');

            if(res.status === 401) {
                goto('/login');
            }

            if (res.status === 403) {
                message = 'Access denied. Admins only.';
                return;
            }

            const text = await res.text();
            message = text;

           }
        catch (err)
        {
            console.error('Failed to fetch the admin page!', err);
        }
    });

    async function addPet() {

        success = '';
        error = '';

        try {

            const response = await fetch(`/api/pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: petName,
                    type: petType,
                    hunger: petHunger,
                    happiness: petHappiness
                })
            });

            const data = await response.json();

            if(response.ok)
            {
                success = data.message;

                //Clearing form
                petName = '';
                petType = '';
                petHunger = 0;
                petHappiness = 0;
            }
            else
            {
                error = data.error || 'Failed to add Pet';
            }

        } catch (err) {
            console.log('Error adding pet:', err);
        }
    }
</script>

<h1>Add a New Pet</h1>

<form on:submit|preventDefault={addPet}>
    <label for="name">Name</label>
    <input type="text" id="name" bind:value={petName} required />

    <label for="type">Type</label>
    <select id="type" bind:value={petType} required>
        <option value="" disabled selected>Select a type</option>
        <option value="puppy">Puppy</option>
        <option value="kitten">Kitten</option>
    </select>

    <label for="hunger">Hunger Level</label>
    <input type="number" id="hunger" bind:value={petHunger} min="0" max="100" required />

    <label for="happiness">Happiness Level</label>
    <input type="number" id="happiness" bind:value={petHappiness} min="0" max="100" required />

    <button type="submit">Add Pet</button>
</form>

{#if success}
    <p style="color: green;">{success}</p>
{/if}
{#if error}
    <p style="color: red;">{error}</p>
{/if}

