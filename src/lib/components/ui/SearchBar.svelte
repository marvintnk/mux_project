<script>
    import { Search, X } from "@lucide/svelte";
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

    // Props mit $props() statt export let
    let { mode = 'navigate' } = $props();

    let searchValue = $state('');
    let inputElement;

    const handleSubmit = (event) => {
        event.preventDefault();
        search(searchValue);
    }

    const search = (text) => {
        if (text.trim() !== '') {
            if (mode === 'navigate') {
                goto(`/search?q=${encodeURIComponent(text.trim())}`);
            } else {
                dispatch('search', { query: text });
            }
        }
    }

    const handleInput = (event) => {
        searchValue = event.target.value;
        if (mode === 'search') {
            dispatch('search', { query: searchValue });
        }
    }

    const clearSearch = () => {
        searchValue = '';
        if (mode === 'search') {
            dispatch('search', { query: '' });
        }
        inputElement?.focus();
    }

    // Exportierte Funktion für externe Zugriffe
    function setSearchValue(value) {
        searchValue = value;
    }

    // Funktion exportieren
    export { setSearchValue };
</script>

<div class="mx-4">
    <form class="flex mt-5" on:submit={handleSubmit}>
        <div class="input w-full flex items-center">
            <input 
                bind:this={inputElement}
                bind:value={searchValue}
                type="text" 
                placeholder="Suche" 
                class="flex-1 bg-transparent border-none outline-none"
                on:input={handleInput}
            />
            
            {#if searchValue}
                <button 
                    type="button"
                    class="cursor-pointer ml-2 p-1 hover:bg-gray-100 rounded"
                    on:click={clearSearch}
                    aria-label="Suche löschen"
                >
                    <X size="16" />
                </button>
            {/if}
            
            <button 
                type="submit"
                class="cursor-pointer ml-2 p-1 hover:bg-gray-100 rounded"
                aria-label="Suchen"
            >
                <Search size="16" />
            </button>
        </div>
    </form>
</div>
