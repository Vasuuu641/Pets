<script lang="ts">
	import { onMount } from 'svelte';
	let logs: string[] = [];
	let error = '';

	onMount(async () => {
		// TODO get logs
	});
</script>

<h1>Action Log</h1>

{#if error}
    <p style="color: red;">{error}</p>
{:else if logs.length === 0}
    <p>No actions have been logged yet.</p>
{:else}
    <!--   render logs here with the newest on top-->
{/if}

<style>
</style>
