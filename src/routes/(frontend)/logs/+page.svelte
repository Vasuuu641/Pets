<script lang="ts">
    import { onMount } from 'svelte';
    import { Log } from '$lib/services/Log';
    import {goto} from "$app/navigation";

    let logs: Log[] = [];
    let error = '';

    onMount(async () => {
        try {
            const res = await fetch('/api/log');

            if (res.status === 401) {
                goto('/login');
                return;
            }

            if (res.status === 403) {
                error = 'Access denied. Admins only.';
                return;
            }

            if (!res.ok) {
                throw new Error(`Error fetching logs: ${res.statusText}`);
            }

            const rawLogs = await res.json();

            logs = rawLogs.map((log: any) => new Log(
                log.action,
                log.userId,
                log.petId,
                log.timestamp,
                log.userName,
                log.petName
            ));

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
                {log.timestamp} — {log.getMessage()}
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
