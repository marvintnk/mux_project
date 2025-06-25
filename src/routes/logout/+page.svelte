<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    
    // Automatisches Logout beim Laden der Seite
    onMount(() => {
        // Form automatisch submitten
        document.getElementById('logoutForm').submit();
    });
</script>

<div class="flex justify-center items-center h-screen">
    <div class="text-center">
        <div class="loading loading-spinner loading-lg mb-4"></div>
        <p>Sie werden abgemeldet...</p>
        
        <form id="logoutForm" method="POST" use:enhance>
            <!-- Form wird automatisch durch onMount submitted -->
        </form>
    </div>
</div>
