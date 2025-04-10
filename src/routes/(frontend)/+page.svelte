<script lang="ts">
	import { onMount } from 'svelte';

	let pets = [];
	let petType: '' | 'puppy' | 'kitten' = '';

	async function loadPets() {
		const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
		pets = await res.json();
	}

	async function adopt(petId: number) {
        // TODO only let the user adopt if they are signed in.
	}

	onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <!--    show available pets here-->
{/if}

<style>
</style>
