<script lang="ts">
    import { goto } from '$app/navigation';
    import '$lib/styles/login.css';

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

<div class="login-page">
    <div class="login-card">
        <h1>🐶 Create an Account</h1>
        <p class="subtitle">Join us and help pets find a loving home</p>

        <form on:submit|preventDefault={handleRegister}>
            <div class="input-group">
                <label for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder="Choose a username"
                    required
                />
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    placeholder="Create a password"
                    required
                /> </div>

            <div class="input-group">
                <label for="confirm-password">Confirm Password</label>
                <input
                    id="confirm-password"
                    type="password"
                    bind:value={confirm_password}
                    placeholder="Re-enter your password"
                    required
                />
            </div>

            <button
                type="submit"
                class="login-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creating account…' : 'Register'}
            </button>
        </form>

        {#if error}
            <p class="error-message">{error}</p>
        {/if} {#if success}
            <p class="success-message">{success}</p>
        {/if}

        <p class="footer-text">
            Already have an account?
            <a href="/login">Login here</a>
        </p>
    </div>
</div>