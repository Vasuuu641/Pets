
<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import '$lib/styles/login.css';

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


<div class="login-page">
    <div class="login-card">
        <h1>🐾 Welcome Back</h1>
        <p class="subtitle">Log in to continue your pet adoption journey</p>

        <form on:submit|preventDefault={handleLogin}>
            <div class="input-group">
                <label for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder="Enter your name"
                    required
                />         </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button type="submit" class="login-btn">
                Login
            </button>
        </form>

        {#if $error}
            <p class="error-message">{$error}</p>
        {/if}

        <p class="footer-text">
            Don’t have an account?
            <a href="/register">Register here</a>
        </p>
    </div>
</div>