<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		// TODO: redirect to /login if there is no signed in user and redirect to root if the user is not an admin
	});


	async function addPet() {
		// TODO post on /api/pets
	}
</script>

<h1>Add a New Pet</h1>

<form on:submit|preventDefault={addPet}>
</form>


<style>
    form {
        display: grid;
        gap: 0.75rem;
        max-width: 300px;
    }
</style>
