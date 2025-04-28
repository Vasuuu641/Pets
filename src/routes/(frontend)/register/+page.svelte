<script lang="ts">
    import { goto } from '$app/navigation';

    let name = '';
    let password = '';
    let confirm_password = '';
    let error = '';
    let isSubmitting = false;
    let success = '';

    async function handleRegister() {

        error = '';

        // Check if passwords match
        if (password !== confirm_password) {
            error = "Passwords don't match. Re-enter password.";
            password = '';
            confirm_password = '';
            return;
        }

        //disables the submit button until credentials are checked and verified. Avoids multiple submissions
        isSubmitting = true;

        try {
            // Send the registration request
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (res.ok) {
                success = data.message;

                // After 2 seconds, user is redirected to login first
                setTimeout(() => {
                    goto('/login');
                }, 2000);

            } else {
                error = data.error || 'Failed to register';
            }
        } catch (err) {
            console.error(err);
            error = 'An error occurred during registration.';
        } finally {
            isSubmitting = false;
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
        <label for="confirm-password">Confirm Password:</label>
        <input id="confirm-password" type="password" bind:value={confirm_password} required />
    </div>

    <button type="submit" disabled={isSubmitting}>Register</button>
</form>
