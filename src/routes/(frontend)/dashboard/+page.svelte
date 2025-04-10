<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet } from '$lib/types';
	import { goto } from '$app/navigation';

	let pets: Pet[] = [];
	let error = '';
	let success = '';

	$: user = $currentUser;

	async function loadPets() {
		// TODO load your pets
	}

	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {

	}

	onMount(() => {
		if (!user) {
			goto('/login');
		} else {
			loadPets();
		}
	});
</script>

<h1>📋 Your Adopted Pets</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

{#if pets.length === 0}
    <p>You haven’t adopted any pets yet.</p>
{:else}
    <!-- Inventory Display -->

<!--    show your pets here-->
{/if}

<style>
</style>
