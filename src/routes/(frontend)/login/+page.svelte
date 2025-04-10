<script lang="ts">
	import { goto } from '$app/navigation';
	let error = '';

	async function handleLogin() {
		// TODO: implement sign-in logic and if successful redirect the user to /dashboard
	}
</script>

<h1>Login</h1>

{#if error}<p style="color: red;">{error}</p>{/if}

<!--login form here-->