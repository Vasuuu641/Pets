<script lang="ts">
    import { currentUser } from '$lib/stores'; // Store for current user
    import { goto } from '$app/navigation';   // Navigation function

    let name = '';         // For username input
    let password = '';     // For password input
    let error = '';        // For showing error messages

    // Login handler function
    async function handleLogin() {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                // Login failed, show error message
                error = data.error || 'Login failed';
                return;
            }

            // Successful login, store user info in the store
            currentUser.set(data.user);

            // Redirect to appropriate page based on user role
            if (data.user.role === 'admin') {
                goto('/admin'); // Redirect to admin page
            } else {
                goto('/dashboard'); // Redirect to dashboard
            }

        } catch (e) {
            console.error('Login failed', e);
            error = 'Login request failed.';
        }
    }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
    <input type="text" bind:value={name} placeholder="Name" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
</form>

{#if error}
    <p style="color: red;">{error}</p>
{/if}

<p>Don't have an account? <a href="/register">Register</a></p>
