<script>
    import { Search, X } from "@lucide/svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let searchBarVisible = $state(false);
    let searchValue = $state('');
    let inputElement;

    const search = (text) => {
        searchValue = text;
        searchBarVisible = false;
        // Event an Parent-Komponente senden
        dispatch('search', { query: text });
    }

    const handleInput = (event) => {
        searchValue = event.target.value;
        // Live-Suche während der Eingabe
        dispatch('search', { query: searchValue });
    }

    const handleKeydown = (event) => {
        if (event.key === 'Enter') {
            search(searchValue);
        }
    }

    const clearSearch = () => {
        searchValue = '';
        dispatch('search', { query: '' });
        inputElement?.focus();
    }
</script>

<div class="mx-4">
    <div class="flex mt-5">
        <div class="input w-full flex items-center" onclick="{() => { inputElement?.focus(); }}">
            <Search />
            <input 
                bind:this={inputElement}
                bind:value={searchValue}
                type="text" 
                placeholder="Suche" 
                class="flex-1"
                oninput={handleInput}
                onkeydown={handleKeydown}
            />
            {#if searchValue}
                <X class="cursor-pointer ml-2" onclick={clearSearch} />
            {/if}
        </div>
    </div>
</div>
