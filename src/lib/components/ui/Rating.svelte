<script>
    export let rating;
    export let editable = false;
    const MAX_RATING = 10.0;
</script>

<div class="rating rating-lg rating-half">
    {#each {length: parseInt(MAX_RATING)} as _, i}
        {#if (parseInt(rating * 2)) === (i + 1)}
            <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-{(i % 2) + 1} bg-amber-400" aria-label="{i / 2} star" checked="checked" disabled="{!editable}" />
        {:else}
            <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-{(i % 2) + 1} bg-amber-400" aria-label="{i / 2} star" disabled="{!editable}"/>
        {/if}
    {/each}
</div>
