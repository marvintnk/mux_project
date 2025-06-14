<script>
    export let rating;
    export let editable = false;
    export let ratingSizeClass = "rating-lg";
    const MAX_RATING = 10.0;
</script>

<div class="rating {ratingSizeClass} rating-half">
    <input type="radio" name="rating-11" class="rating-hidden hidden" />
    {#each {length: MAX_RATING} as _, i}
        {#if (rating * 2) === (i + 1)}
            <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-{(i % 2) + 1} bg-amber-400" aria-label="{i / 2} star" checked="checked" disabled="{!editable}" />
        {:else}
            <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-{(i % 2) + 1} bg-amber-400" aria-label="{i / 2} star" disabled="{!editable}"/>
        {/if}
    {/each}
</div>
