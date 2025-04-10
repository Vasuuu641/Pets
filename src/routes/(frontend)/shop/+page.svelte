<script lang="ts">
	import { currentUser } from '$lib/stores';

	$: user = $currentUser;

	async function buy(item: 'food' | 'toy' | 'treat') {
		// TODO implement your logic here
	}
</script>

<h1>Pet Shop</h1>


<!--show the user's budget and inventory-->
<!--call 'buy' function with different items-->

<style>
    button {
        padding: 0.5rem;
        font-size: 1rem;
    }
</style>
