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

<a class="shadow-sm card-layout rounded-box w-full p-2" href={href}>
    <div class="image-wrapper flex-shrink-0 mx-auto mb-2">
        {#if imageData === null}
            <div class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content min-h-16 min-w-16 rounded-box flex items-center justify-center">
                    <span class="text-2xl">{title ? title[0] : "?"}</span>
                </div>
            </div>
        {:else}
            <img class="w-24 h-24 object-cover rounded-box" src="{imageData}" alt="Event Image">
        {/if}
    </div>

    <div class="text-content flex-grow flex flex-col justify-between min-w-0">
        <div>
            <div class="flex justify-between items-start">
                <p class="text-xs text-gray-500 mr-2 flex-grow truncate">{location}</p>
                <p class="text-xs text-gray-500 flex-shrink-0">{TimeFormat.parseIntoFormat("vor", date)}</p>
            </div>

            <p class="font-bold mt-1 text-base md:text-lg truncate">{title}</p>
        </div>

        <div class="flex justify-end mt-2">
            {#if isFavoriteItem}
                <button class="shadow-sm rounded-box flex items-center px-4 py-2 bg-base-200 hover:bg-base-300 transition-colors duration-200 flex-shrink-0" onclick={handleRemoveClick}>
                    <p class="text-sm mr-1">Entfernen</p>
                    <HeartBreakIcon size={20} classes="my-auto" fill="#eb4034" stroke="#eb4034"/>
                </button>
            {/if}
        </div>
    </div>
</a>

<style>
    .card-layout {
        display: flex;
        flex-direction: column;
    }

    .image-wrapper {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 0.5rem;
    }

    .text-content {
        margin-left: 0;
    }

    @media (min-width: 256px) {
        .card-layout {
            flex-direction: row;
        }

        .image-wrapper {
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 0;
        }

        .text-content {
            margin-left: 0.5rem;
        }
    }
</style>
