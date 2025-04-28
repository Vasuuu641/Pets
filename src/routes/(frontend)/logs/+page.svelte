<script lang="ts">
    import { onMount } from 'svelte';
    let logs: any[] = [];
    let error = '';

    onMount(async () => {
        try {
            const res = await fetch('/api/log'); // Adjusted endpoint
            if (!res.ok) {
                throw new Error(`Error fetching logs: ${res.statusText}`);
            }
            logs = await res.json();
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
        }
    });
</script>

<h1>Action Log</h1>

{#if error}
    <p style="color: red;">{error}</p>
{:else if logs.length === 0}
    <p>No actions have been logged yet.</p>
{:else}
    <ul>
        {#each [...logs].reverse() as log}
            <li>
                {log.timestamp} - {log.action} (User: {log.userName} on Pet: {log.petName})
            </li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        background-color: #f9f9f9;
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
    }
</style>
