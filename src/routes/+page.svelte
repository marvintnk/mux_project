<script>
    import CategoryItem from "$lib/components/ui/CategoryItem.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import SearchBar from "$lib/components/ui/SearchBar.svelte";
    import { CATEGORIES } from "$lib/categories.js";
    import { onMount } from "svelte";
    import { swapBoxService } from '$lib/api/swapbox.service.js';

    let events = $state([]);
    let allOffers = $state([]);
    let visibleOffers = $state([]);
    let batchSize = 4;
    let loading = false;

    async function loadEvents() {
        try {
            const eventData = await swapBoxService.getEvents({ upcoming: true });
            events = eventData.slice(0, 3); // Nur die ersten 3 Events anzeigen
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
        }
    }

    async function loadOffers() {
        try {
            const offerData = await swapBoxService.getOffers({ status: 'verfügbar' });
            allOffers = offerData;
            loadInitial();
        } catch (error) {
            console.error('Fehler beim Laden der Angebote:', error);
            allOffers = [];
        }
    }

    function loadInitial() {
        visibleOffers = allOffers.slice(0, batchSize);
    }

    function loadMore() {
        if (loading || visibleOffers.length >= allOffers.length) return;
        loading = true;

        setTimeout(() => {
            const nextLength = visibleOffers.length + batchSize;
            visibleOffers = allOffers.slice(0, nextLength);
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
        return offer.offer_images && offer.offer_images.length > 0 
            ? offer.offer_images[0].public_url 
            : null;
    }

    onMount(async () => {
        await Promise.all([loadEvents(), loadOffers()]);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<SearchBar/>

<p class="text-xl mt-5 ml-2 font-bold">Kategorien</p>
<div class="flex gap-4 mx-2 mt-2" style="overflow-y: scroll !important;">
    {#each CATEGORIES as item}
        <CategoryItem
            href={item.href}
            icon={item.icon}
            name={item.name}
        />
    {/each}
</div>

<p class="text-xl mt-5 ml-2 font-bold">Nächste Events</p>

<div class="mx-2 flex flex-col gap-4">
    {#each events as event}
        <CategoryCard
            imageData={getFirstImage(event.offers)}
            likes={0}
            location={event.event_location}
            title={event.offers?.title || 'Event'}
            date={formatDate(event.event_date)}
            href="/event/{event.id}"
            hasLiked={false}
        />
    {/each}
</div>

<p class="text-xl mt-5 ml-2 font-bold">Neuste Anzeigen</p>

<div class="mx-2 flex flex-col gap-4">
    {#each visibleOffers as offer}
        <CategoryCard
            imageData={getFirstImage(offer)}
            likes={0}
            location={offer.location}
            title={offer.title}
            date={formatDate(offer.created_at)}
            href="/offer/{offer.id}"
            hasLiked={false}
        />
    {/each}

    {#if loading}
        <p class="text-center text-gray-400">Lade mehr...</p>
    {/if}
</div>
