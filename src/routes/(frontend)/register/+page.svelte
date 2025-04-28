<script lang="ts">
	import { goto } from '$app/navigation';
    import { currentUser } from '$lib/stores';

    let name = '';
    let password = '';
    let confirm_password = '';
    let error = '';

	async function handleRegister() {
        try {
            if(password !== confirm_password){
                error = "Passwords don't match. Re - enter password";
                password = '';
                confirm_password = '';
                return;
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.error || 'Registration failed';
                return;
            }

            // Redirect to dashboard if registration successful
            currentUser.set(data.user);
            goto('/dashboard');
        } catch (err) {
            console.error(err);
            error = 'An error occurred during registration.';
        }
    }

</script>

<h1>Register</h1>

{#if error}
    <p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleRegister}>

    <div>
        <label for="name">Name:</label>
        <input id="name" type="text" bind:value={name} required />
    </div>

    <div>
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} required />
    </div>

    <div>
        <label for="confirm-password">Confirm_password:</label>
        <input id="confirm-password" type="password" bind:value={confirm_password} required />
    </div>

    <button type="submit">Register</button>
</form>
