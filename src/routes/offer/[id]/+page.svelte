<script>
    import { MapPin, CalendarDays, ChevronLeft, Heart, MessageSquareMore } from "@lucide/svelte";
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { swapBoxService } from "../../../lib/api/swapbox.service.js";
    import Rating from "../../../lib/components/ui/Rating.svelte";

    // @ts-ignore
    let { data } = $props();
    let user = data.user;
    let user_id = user.id;

    // Offer ID aus der URL
    let offer_id = page.params.id;

    // Reactive states
    let offer = $state(null);
    let loading = $state(true);
    let error = $state(null);
    let hasLiked = $state(false);

    // Sortierte Bilder
    let sortedImages = [];

    // Funktion zum Extrahieren der letzten Zahl vor der Dateiendung
    function getImageOrderNumber(name) {
        const match = name.match(/(\d+)(?=\.\w+$)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // Offer laden
    onMount(async () => {
        try {
            loading = true;

            // Offer Details laden
            const offerData = await swapBoxService.getOfferById(offer_id);
            offer = offerData;

            // Bilder sortieren
            if (offer?.offer_images?.length > 0) {
                sortedImages = [...offer.offer_images].sort(
                    (a, b) => getImageOrderNumber(a.image_url) - getImageOrderNumber(b.image_url)
                );
            }

            // Prüfen ob Favorit
            // @ts-ignore
            hasLiked = await swapBoxService.isFavorite(user_id, offer_id);
        } catch (err) {
            error = err.message;
            console.error('Fehler beim Laden des Angebots:', err);
        } finally {
            loading = false;
        }
    });

    // Favorit hinzufügen/entfernen
    async function toggleFavorite() {
        try {
            if (hasLiked) {
                await swapBoxService.removeFromFavorites(user_id, offer_id);
                hasLiked = false;
            } else {
                await swapBoxService.addToFavorites(user_id, offer_id);
                hasLiked = true;
            }
        } catch (err) {
            console.error('Fehler beim Favoriten-Toggle:', err);
        }
    }

    // Chat erstellen/öffnen
    async function startChat() {
        try {
            const chatData = await swapBoxService.createChat({
                offer_id: offer_id,
                user1_id: user_id,
                user2_id: offer.user_id
            });

            // Zur Chat-Seite weiterleiten
            window.location.href = `/chat/${chatData.id}`;
        } catch (err) {
            console.error('Fehler beim Erstellen des Chats:', err);
        }
    }

    // Datum formatieren
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
</script>


{#if loading}
    <div class="flex justify-center items-center h-64">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="ml-4">Angebot wird geladen...</p>
    </div>
{:else if error}
    <div class="alert alert-error mx-2 mt-4">
        <p>Fehler beim Laden des Angebots: {error}</p>
    </div>
{:else if offer}
    <div class="flex m-2">
        <a class="shadow-sm rounded-box p-1" href="/">
            <ChevronLeft size={24} />
        </a>
        <button class="shadow-sm rounded-box p-1" style="margin-left: auto !important;" on:click={toggleFavorite}>
            {#if hasLiked}
                <Heart size={24} fill="#eb4034" color="#eb4034" />
            {:else}
                <Heart size={24} />
            {/if}
        </button>
    </div>

    {#if sortedImages.length > 0}
    <div class="carousel w-full">
        {#each sortedImages as image, i}
            <div id="item{i + 1}" class="carousel-item w-full">
                <img src="{image.public_url}" class="w-full" alt="Angebotsbild {i + 1}" />
            </div>
        {/each}
    </div>

    <div class="flex w-full justify-center gap-2 pt-2">
        {#each sortedImages as image, i}
            <a href="#item{i + 1}" class="btn btn-xs w-8 h-8">{i + 1}</a>
        {/each}
    </div>
{/if}


    <div class="mx-2 mt-5">
        <p class="text-2xl font-bold">{offer.title}</p>
        <div class="flex mt-2">
            <MapPin size="1.2em" class="mt-0.5"/>
            <p class="text-md ml-1">{offer.location}</p>
        </div>
        <div class="flex">
            <div class="flex">
                <CalendarDays size="1.2em" class="mt-0.5"/>
                <p class="text-md ml-1">{formatDate(offer.created_at)}</p>
            </div>

            <div class="flex" style="margin-left: auto !important;">
                <button on:click={toggleFavorite}>
                    {#if hasLiked}
                        <Heart size={24} fill="#eb4034" color="#eb4034" />
                    {:else}
                        <Heart size={24} />
                    {/if}
                </button>
                <!-- Likes-Anzahl könnte hier aus einer separaten Tabelle geladen werden -->
                <p class="text-md ml-1">0</p>
            </div>
        </div>
        <textarea
            class="textarea mt-4 w-full h-32 px-4"
            placeholder="Es wurde keine Beschreibung angegeben."
            readonly={true}
            style="resize: none !important;"
        >{offer.description || ''}</textarea>

        <p class="mt-4 text-2xl font-bold">Angeboten von</p>
        <a class="flex" href="/profile/{offer.user_id}">
            {#if offer.users?.profile_picture}
                <div class="avatar mt-1">
                    <div class="w-8 rounded-full ring-2">
                        <img src={offer.users.profile_picture} alt="Profilbild" />
                    </div>
                </div>
            {:else}
                <div class="avatar avatar-placeholder mt-1">
                    <div class="bg-neutral text-neutral-content w-8 rounded-full">
                        <span class="text-xl">{offer.users?.name?.[0] || '?'}</span>
                    </div>
                </div>
            {/if}
            <p class="ml-2 my-auto text-lg">{offer.users?.name || 'Unbekannt'}</p>
        </a>
        <Rating rating={offer.users?.rating || 0} editable={false} ratingSizeClass="rating-sm"/>
    </div>

    <div class="mt-4 flex mx-auto w-2/3 pb-4">
        {#if offer.user_id !== user_id}
            <button class="flex btn w-full" on:click={startChat}>
                <MessageSquareMore size={20} class="mt-1 mr-1" />
                <p>Frage stellen</p>
            </button>
        {:else}
            <div class="alert alert-info">
                <p>Dies ist Ihr eigenes Angebot</p>
            </div>
        {/if}
    </div>
{:else}
    <div class="alert alert-warning mx-2 mt-4">
        <p>Angebot nicht gefunden</p>
    </div>
{/if}
