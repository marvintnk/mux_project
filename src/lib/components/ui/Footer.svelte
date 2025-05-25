<script>
    import {
        BookHeart,
        CirclePlus,
        House,
        MessageCircleMore,
        CircleUser
    } from "@lucide/svelte";

    export let profileData = null;
</script>

<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 {profileData ? 'pb-18' : ''} md:pb-4">
    <aside>
        <p class="text-sm"><strong>Swapbox</strong> - Ein Projekt der <nobr>Technischen Hochschule Brandenburg</nobr></p>
        <p class="text-xs">Copyright © {new Date().getFullYear()} - All rights reserved</p>
    </aside>
</footer>

{#if profileData}
    <div class="dock dock-sm visible md:invisible">
        <button>
            <House size="1.2em"/>
            <span class="dock-label">Start</span>
        </button>

        <button>
            <span class="indicator">
                <BookHeart size="1.2em"/>
                <span class="badge badge-accent badge-xs shadow-sm indicator-item">
                    3
                </span>
            </span>

            <span class="dock-label">Favoriten</span>
        </button>

        <button>
            <CirclePlus size="1.2em"/>
            <span class="dock-label">Hinzufügen</span>
        </button>

        <button>
            <MessageCircleMore size="1.2em"/>
            <span class="dock-label">Chat</span>
        </button>

        <button>
            <CircleUser size="1.2em"/>
            <span class="dock-label">Profil</span>
        </button>
    </div>
{/if}
