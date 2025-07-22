<script>
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import SearchBar from "$lib/components/ui/SearchBar.svelte";
    import { CATEGORIES } from "$lib/categories.js";
    import { swapBoxService } from '$lib/api/swapbox.service.js';

    let searchBarComponent;
    let allOffers = $state([]);
    let visibleOffers = $state([]);
    let batchSize = 20;
    let loading = $state(false);
    let selectedCategory = $state('Alle');
    let currentBatch = $state(1);
    let dropdownOpen = $state(false);
    let searchQuery = $state('');

    // $effect für URL-Parameter (erweitert um Kategorie)
    $effect(() => {
        const query = page.url.searchParams.get('q');
        const category = page.url.searchParams.get('category');

        // Suchanfrage setzen
        if (query) {
            searchQuery = query;
            if (searchBarComponent) {
                searchBarComponent.setSearchValue(query);
            }
        } else {
            searchQuery = '';
        }

        // Kategorie setzen (nur wenn sie existiert)
        if (category && CATEGORIES.some(cat => cat.name === category)) {
            selectedCategory = category;
        } else if (category === null) {
            selectedCategory = 'Alle';
        }
    });

    // $derived für reaktive Berechnung der gefilterten Angebote
    let filteredOffers = $derived(
        (() => {
            let filtered = selectedCategory === 'Alle'
                ? allOffers
                : allOffers.filter(offer => offer.category === selectedCategory);

            if (searchQuery.trim() !== '') {
                filtered = filtered.filter(offer =>
                    offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer.location?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            return filtered;
        })()
    );

    // $effect für Seiteneffekte - Aktualisierung der sichtbaren Angebote
    $effect(() => {
        const filtered = filteredOffers;
        const batch = currentBatch;

        if (filtered && filtered.length > 0) {
            const itemsToShow = batch * batchSize;
            visibleOffers = filtered.slice(0, itemsToShow);
        } else {
            visibleOffers = [];
        }
    });

    async function loadOffers() {
        try {
            const offerData = await swapBoxService.getOffers({
                status: 'active'
            });
            allOffers = offerData;
        } catch (error) {
            console.error('Fehler beim Laden der Angebote:', error);
            allOffers = [];
        }
    }

    function loadMore() {
        if (loading || visibleOffers.length >= filteredOffers.length) return;
        loading = true;

        setTimeout(() => {
            currentBatch += 1;
            loading = false;
        }, 300);
    }

    function handleScroll() {
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.body.offsetHeight;

        if (scrollBottom >= docHeight - 100) {
            loadMore();
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return date.toLocaleDateString('de-DE', options);
    }

    function getFirstImage(offer) {
        if (!offer.offer_images || offer.offer_images.length === 0) {
            return null;
        }
        
        // Hilfsfunktion für die Sortierung (gleiche wie in der anderen Klasse)
        function getImageOrderNumber(name) {
            const match = name.match(/(\d+)(?=\.\w+$)/);
            return match ? parseInt(match[1], 10) : 0;
        }
        
        // Bilder sortieren und das erste zurückgeben
        const sortedImages = [...offer.offer_images].sort(  
            (a, b) => getImageOrderNumber(a.image_url) - getImageOrderNumber(b.image_url)
        );
        
        return sortedImages[0].public_url;
    }

    function selectCategory(category) {
        selectedCategory = category;
        currentBatch = 1;
        dropdownOpen = false;

        // URL aktualisieren
        const url = new URL(window.location);
        if (category !== 'Alle') {
            url.searchParams.set('category', category);
        } else {
            url.searchParams.delete('category');
        }
        window.history.replaceState({}, '', url);
    }

    function handleSearch(event) {
        searchQuery = event.detail.query;
        currentBatch = 1;

        // URL aktualisieren (beide Parameter berücksichtigen)
        const url = new URL(window.location);
        if (searchQuery.trim() !== '') {
            url.searchParams.set('q', searchQuery);
        } else {
            url.searchParams.delete('q');
        }

        // Kategorie-Parameter beibehalten
        if (selectedCategory !== 'Alle') {
            url.searchParams.set('category', selectedCategory);
        }

        window.history.replaceState({}, '', url);
    }

    onMount(async () => {
        await loadOffers();
        window.addEventListener("scroll", handleScroll);

        // Initial search value setzen
        const initialQuery = $page.url.searchParams.get('q') || '';
        if (initialQuery) {
            searchQuery = initialQuery;
            if (searchBarComponent) {
                searchBarComponent.setSearchValue(initialQuery);
            }
        }

        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<svelte:head>
    <title>Suche - SwapBox</title>
</svelte:head>

<!-- SearchBar im Search-Modus mit Event-Handler -->
<SearchBar bind:this={searchBarComponent} mode="search" on:search={handleSearch} />

<!-- Filter Dropdown -->
<details class="dropdown mx-2 mb-4 mt-2 " bind:open={dropdownOpen}>
  <summary class="btn">
    Kategorie: {selectedCategory}
  </summary>
  <ul class="menu dropdown-content bg-base-100 rounded-box shadow z-10 w-52 p-2 mt-1">
    <li>
      <button
        class:selected={selectedCategory === 'Alle'}
        on:click={() => selectCategory('Alle')}>
        Alle Kategorien
      </button>
    </li>
    {#each CATEGORIES as cat}
      <li>
        <button
          class:selected={selectedCategory === cat.name}
          on:click={() => selectCategory(cat.name)}>
          {cat.name}
        </button>
      </li>
    {/each}
  </ul>
</details>

<!-- Suchergebnis-Info -->
{#if searchQuery.trim() !== ''}
  <div class="mx-4 mb-2 text-sm text-gray-300">
    Suchergebnisse für: "{searchQuery}" ({filteredOffers.length} gefunden)
  </div>
{/if}

<!-- Angebotsliste -->
<div class="mx-2 flex flex-col gap-2">
    {#each visibleOffers as offer}
        <CategoryCard
            imageData={getFirstImage(offer)}
            likes={0}
            location={offer.location}
            title={offer.title}
            date={new Date(offer.created_at).getTime()}
            href={`/offer/${offer.id}`}
            hasLiked={false}
        />
    {/each}

    {#if visibleOffers.length === 0 && filteredOffers.length === 0 && !loading}
        <p class="text-center text-gray-400">
            {searchQuery.trim() !== '' ? 'Keine Suchergebnisse gefunden.' : 'Keine Angebote gefunden.'}
        </p>
    {/if}

    {#if loading}
        <p class="text-center text-gray-400">Lade mehr...</p>
    {/if}

    {#if visibleOffers.length < filteredOffers.length && !loading}
        <button
            class="btn btn-outline mx-auto"
            on:click={loadMore}>
            Mehr laden ({filteredOffers.length - visibleOffers.length} weitere)
        </button>
    {/if}
</div>
