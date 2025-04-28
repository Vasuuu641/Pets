<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';

    let name = '';
    let password = '';
    let error = writable('');

   //This function handles the login functionality by calling the backend +server.ts for api/auth/login
    async function handleLogin() {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                error.set(data.error || 'Login failed');
                return;
            }


            currentUser.set(data.user);//stores the current user to the user that logs in until logged out


            if (data.user.role === 'admin') {
                goto('/admin');
            } else {
                goto('/dashboard');
            }

        } catch (e) {
            console.error('Login failed', e);
            error.set('Login request failed.');
        }
    }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
    <input type="text" bind:value={name} placeholder="Name" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
</form>

{#if $error}
    <p style="color: red;">{$error}</p>
{/if}

<p>Don't have an account? <a href="/register">Register</a></p>
