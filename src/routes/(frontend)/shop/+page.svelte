<script lang="ts">
    import { currentUser } from '$lib/stores';
    import {onMount} from "svelte";

    $: user = $currentUser;
    let error = '';
    let success = '';

    async function buy(item: 'food' | 'toy' | 'treat') {
        if (!user) {
            error = 'Please login first.';
            return;
        }

        try {
            const res = await fetch('/api/shop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item, userId: user.id })
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.error || 'Purchase failed';
                success = '';
                return;
            }

            success = data.message || 'Item bought successfully!';
            error = '';

            await showInventory();


        } catch (err) {
            console.error(err);
            error = 'An error occurred during purchase.';
            success = '';
        }
    }

    async function showInventory() {
        try {

            if(!user){
                error = 'Please login first.';
                return;
            }
            const res = await fetch(`/api/inventory?userId=${user.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                console.error('Failed to fetch inventory');
                return;
            }

            const data = await res.json();
            console.log('Fetched inventory:', data);


            currentUser.update(u => {
                if (!u) return u;
                return {
                    ...u,
                    budget: data.budget,
                    inventory: data.inventory
                };
            });
        } catch (err) {
            console.error('Error fetching inventory:', err);
        }
    }

    onMount(() =>{
        showInventory();
    });
</script>

<main class="shop-container">
    <h1>Pet Shop</h1>

    {#if error}
        <p class="error">{error}</p>
    {/if}
    {#if success}
        <p class="success">{success}</p>
    {/if}

    {#if user}
        <div class="status">
            <h2>Budget: <span>${user?.budget ?? 0}</span></h2>

            <h3>Inventory:</h3>
            <ul>
                <li> Food: {user.inventory?.food || 0}</li>
                <li> Toy: {user.inventory?.toy || 0}</li>
                <li> Treat: {user.inventory?.treat || 0}</li>
            </ul>
        </div>

        <div class="buy-buttons">
            <button on:click={() => buy('food')}>Buy Food ($5)</button>
            <button on:click={() => buy('toy')}>Buy Toy ($10)</button>
            <button on:click={() => buy('treat')}>Buy Treat ($15)</button>
        </div>
    {:else}
        <p>Please login first.</p>
    {/if}
</main>

