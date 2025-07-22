<script>
// @ts-nocheck

    import CategoryItem from "$lib/components/ui/CategoryItem.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import SearchBar from "$lib/components/ui/SearchBar.svelte";
    import { CATEGORIES } from "$lib/categories.js";
    import { onMount } from "svelte";
    import { swapBoxService } from '$lib/api/swapbox.service.js';
    import GreenGradientText from "$lib/components/ui/GreenGradientText.svelte";

    let events = $state([]);
    let allOffers = $state([]);
    let visibleOffers = $state([]);
    let batchSize = 4;
    let loading = false;

    async function loadEvents() {
        try {
            const eventData = await swapBoxService.getOffers({ category: 'Event', status: 'active' });
            events = eventData.slice(0, 3); // Nur die ersten 3 Events anzeigen
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
        }
        console.log(events.length);
    }

    async function loadOffers() {
        try {
            const offerData = await swapBoxService.getOffers({ excludeCategory: 'Event', status: 'active' });
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


    onMount(async () => {
        await Promise.all([loadEvents(), loadOffers()]);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<!-- <div class="flex justify-center mt-2">
    <div class="avatar">
        <div class="w-32">
            <img src="/android-chrome-512x512.png">
        </div>
    </div>
</div> -->

<div class="mt-6"></div>
<GreenGradientText text="Swapbox" additionalClasses="text-4xl font-bold text-center"/>

<SearchBar />


<p class="text-xl mt-5 ml-3 font-bold">Kategorien</p>
<div class="flex gap-4 ml-3 mt-2" style="overflow-y: scroll !important;">
    {#each CATEGORIES as item}
        <CategoryItem
            href={item.href}
            icon={item.icon}
            name={item.name}
        />
    {/each}
</div>

<p class="text-xl mt-5 ml-3 font-bold">Nächste Events</p>

<div class="mx-2 flex flex-col mt-2 gap-2">
    {#each events as event}
        <CategoryCard
            imageData={getFirstImage(event)}
            location={event.location}
            title={event.title}
            date={new Date(event.created_at).getTime()}
            href="/offer/{event.id}"
            hasLiked={false}
        />
    {/each}
</div>

<p class="text-xl mt-5 ml-3 font-bold ">Neuste Anzeigen</p>

<div class="mx-2 flex flex-col mt-2 gap-2">
    {#each visibleOffers as offer}
        <CategoryCard
            imageData={getFirstImage(offer)}
            location={offer.location}
            title={offer.title}
            date={new Date(offer.created_at).getTime()}
            href="/offer/{offer.id}"
            hasLiked={false}
        />
    {/each}

    {#if loading}
        <p class="text-center text-gray-400">Lade mehr...</p>
    {/if}
</div>
