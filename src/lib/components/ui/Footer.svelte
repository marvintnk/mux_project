<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import {
        BookHeart,
        CirclePlus,
        MessageCircleMore,
        CircleUser
    } from "@lucide/svelte";
    import { unreadMessagesCount, messagesStore } from '$lib/stores/messages.js';

    export let user; // User-Daten als Prop

    // Vereinfachte Navigation
    async function navigateWithAuth(path) {
        await invalidateAll();
        await goto(path);
    }

    // Funktion um zu prüfen, ob ein Pfad aktiv ist
    function isActive(path) {
        if (path === '/') {
            return $page.url.pathname === '/';
        }
        return $page.url.pathname.startsWith(path);
    }

    onMount(async () => {
        if (user?.id) {
            await messagesStore.init(user.id);
        }
    });

    onDestroy(() => {
        messagesStore.destroy();
    });

    // Reaktiv auf User-Änderungen
    $: if (user?.id) {
        messagesStore.init(user.id);
    }
</script>

<div class="mt-15"></div>
<div class="dock dock-md">
    <button 
        class:dock-active={isActive('/')}
        on:click={() => navigateWithAuth('/')}
    >
        <svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span class="dock-label font-bold">Start</span>
    </button>

    <button 
        class:dock-active={isActive('/favorites')}
        on:click={() => navigateWithAuth('/favorites')}
    >
        <BookHeart size="1.2em"/>
        <span class="dock-label">Favoriten</span>
    </button>

    <button 
        class:dock-active={isActive('/add')}
        on:click={() => navigateWithAuth('/add')}
    >
        <CirclePlus size="1.2em"/>
        <span class="dock-label">Hinzufügen</span>
    </button>

    <button 
        class:dock-active={isActive('/chat')}
        on:click={() => navigateWithAuth('/chat')}
    >
        <span class="indicator">
            <MessageCircleMore size="1.2em"/>
            {#if $unreadMessagesCount > 0}
                <span class="badge badge-accent badge-xs shadow-sm indicator-item">
                    {$unreadMessagesCount > 99 ? '99+' : $unreadMessagesCount}
                </span>
            {/if}
        </span>
        <span class="dock-label font-bold">Chat</span>
    </button>

    <button 
        class:dock-active={isActive('/profile')}
        on:click={() => navigateWithAuth('/profile')}
    >
        <CircleUser size="1.2em"/>
        <span class="dock-label font-bold">Profil</span>
    </button>
</div>

<style>
    @media (max-width: 256px) {
        .dock-label {
            display: none !important;
        }
    }
</style>
