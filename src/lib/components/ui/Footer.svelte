<script>
    import {
        BookHeart,
        CirclePlus,
        House,
        MessageCircleMore,
        CircleUser,
        ContactRound
    } from "@lucide/svelte";

    export let profileData = null;
</script>

<div class="mt-15"></div>
<div class="dock dock-sm">
    <a href="/">
        <House size="1.2em"/>
        <span class="dock-label">Start</span>
    </a>

    {#if profileData}
        <a href="/favorites">
            <span class="indicator">
                <BookHeart size="1.2em"/>
                <span class="badge badge-accent badge-xs shadow-sm indicator-item">
                    3
                </span>
            </span>

            <span class="dock-label">Favoriten</span>
        </a>

        <a href="/add">
            <CirclePlus size="1.2em"/>
            <span class="dock-label">Hinzufügen</span>
        </a>

        <a href="/chat">
            <MessageCircleMore size="1.2em"/>
            <span class="dock-label">Chat</span>
        </a>

        <a href="/profile">
            <CircleUser size="1.2em"/>
            <span class="dock-label">Profil</span>
        </a>
    {:else}
        <a href="/login">
            <CircleUser size="1.2em"/>
            <span class="dock-label">Login</span>
        </a>

        <a href="/register">
            <ContactRound size="1.2em"/>
            <span class="dock-label">Registrieren</span>
        </a>
    {/if}
</div>
