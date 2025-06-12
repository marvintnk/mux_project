<script>
    export let location;
    export let date;
    export let title;
    export let likes;
    export let href;
    export let hasLiked = false;

    export let imageData = null;
</script>

<a class="shadow-sm flex rounded-box" href={href}>
    {#if imageData === null}
        <div class="skeleton min-h-16 min-w-16 m-2"></div>
    {:else}
        <img class="min-h-16 min-w-16" src="{imageData}" alt="Event Image">
    {/if}

    <div class="mt-1 w-full mx-2">
        <div class="flex">
            <p class="text-xs">{location}</p>
            <p class="text-xs" style="margin-left: auto;">{date}</p>
        </div>

        <p class="font-bold mt-1">{title}</p>

        <div class="flex justify-end">
            {likes}
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
            </div>
        </div>
    </div>
</a>
