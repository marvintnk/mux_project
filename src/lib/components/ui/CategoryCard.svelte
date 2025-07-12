<script>
// @ts-nocheck

    import HeartBreakIcon from "$lib/components/ui/HeartBreakIcon.svelte";
    import {TimeFormat} from "$lib/timeformat.js";

    export let location;
    export let date;
    export let title;
    export let likes;
    export let href = null;
    export let hasLiked = false;

    export let isFavoriteItem = false;
    export let clickFunction = null;

    export let imageData = null;

    // Handler für das Entfernen von Favoriten
    function handleRemoveClick(event) {
        event.stopPropagation();
        event.preventDefault();
        if (clickFunction) {
            clickFunction();
        }
    }
</script>

<a class="shadow-sm flex rounded-box" href={href}>
    {#if imageData === null}
        <div class="avatar avatar-placeholder">
            <div class="bg-neutral text-neutral-content min-h-16 min-w-16 rounded-box m-2">
                <span class="text-2xl">{title ? title[0] : "?"}</span>
            </div>
        </div>
    {:else}
        <img class="w-[100px] h-[100px] object-cover rounded-box m-2" width="16" height="16" src="{imageData}" alt="Event Image">
    {/if}

    <div class="mt-1 w-full mx-2">
        <div class="flex">
            <p class="text-xs truncate overflow-hidden whitespace-nowrap w-48">{location}</p>
            <p class="text-xs" style="margin-left: auto;">{TimeFormat.parseIntoFormat("vor", date)}</p>
        </div>

        <p class="font-bold mt-1 truncate overflow-hidden whitespace-nowrap w-72">{title}</p>

        <div class="flex justify-end">
            {#if isFavoriteItem}
                <button class="shadow-sm rounded-box flex" onclick={handleRemoveClick}>
                    <p class="mx-2 text-sm mt-1">Entfernen</p>
                    <HeartBreakIcon size={20} classes="m-1" fill="#eb4034" stroke="#eb4034"/>
                </button>
            <!-- {:else}
                {#if likes > 0}
                    {likes}
                {/if}

                <div class="ml-1 my-auto">
                    {#if hasLiked}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#eb4034" stroke="#eb4034" stroke-width="2" stroke-linecap="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    {:else}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    {/if}
                </div> -->
            {/if}
        </div>
    </div>
</a>
