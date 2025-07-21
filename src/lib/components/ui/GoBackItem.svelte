<script>
    import { X, LogOut } from "@lucide/svelte";

    export let href = "/";
    export let showLogoutButton = false;
    
    // Logout-Funktion
    function handleLogout() {
        // Zur Logout-Route navigieren
        window.location.href = '/logout';
    }
</script>

<div class="flex justify-start">
    {#if showLogoutButton}
        <button 
            class="shadow-sm rounded-box m-2 p-1 bg-base-200 hover:bg-accent transition-colors" 
            onclick={handleLogout}
            title="Abmelden"
        >
            <LogOut size={24} />
        </button>
    {/if}

    <a class="shadow-sm rounded-box m-2 p-1 bg-base-200 hover:bg-accent transition-colors" href={href} style="margin-left: auto !important;">
        <X size={24} />
    </a>
</div>
