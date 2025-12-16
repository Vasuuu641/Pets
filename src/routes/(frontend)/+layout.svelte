<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';
    import '$lib/styles/navbar.css';


	$: user = $currentUser;

	function logout() {
		currentUser.set(null);
		goto('/login');
	}
</script>

<nav class="navbar">
  <div class="logo">🐾 PetAdopt</div>
  <div class="nav-links">
    <a href="/">Home</a>
    {#if user}
      <a href="/dashboard">Dashboard</a>
      <a href="/logs">Logs</a>
      <a href="/shop">Shop</a>
      {#if user.role === 'admin'}
        <a href="/admin">Add Pet</a>
      {/if}
      <button on:click={logout}>Logout</button>
      <span class="user-name">{user.name}</span>
    {:else}
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    {/if}
  </div>
</nav>

<slot />