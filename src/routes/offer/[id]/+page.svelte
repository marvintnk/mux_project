<script>
    import {
        MapPin,
        CalendarDays,
        ChevronLeft,
        Heart,
        MessageSquareMore,
    } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { swapBoxService } from "../../../lib/api/swapbox.service.js";
    import Rating from "../../../lib/components/ui/Rating.svelte";
    import { CATEGORIES } from "$lib/categories.js";
    import { browser } from '$app/environment';

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
    let favoritesCount = $state(0);
    let clickedToggleImageCount = $state(0);

    // Sortierte Bilder
    let sortedImages = [];

    // Funktion zum Extrahieren der letzten Zahl vor der Dateiendung
    function getImageOrderNumber(name) {
        const match = name.match(/(\d+)(?=\.\w+$)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function getCategoryIcon(categoryName) {
        const cat = CATEGORIES.find((c) => c.name === categoryName);
        return cat ? cat.icon : null;
    }

    function getInitials(name) {
        if (!name) return "??";

        const words = name.trim().split(/\s+/); // nach Leerzeichen splitten

        if (words.length >= 2) {
            // erster Buchstabe der ersten beiden Wörter
            return (words[0][0] + words[1][0]).toUpperCase();
        } else if (words[0].length >= 2) {
            // erstes Wort mindestens 2 Buchstaben
            return words[0].substring(0, 2).toUpperCase();
        } else if (words[0].length === 1) {
            // erstes Wort nur 1 Buchstabe
            return (words[0] + words[0]).toUpperCase();
        }

        return "??";
    }

    function goBack() {
        if (browser) {
            window.history.go(-(clickedToggleImageCount + 1));
        }
    }

    // Offer laden
    onMount(async () => {
        try {
            loading = true;

            // debug offer_id
            console.log("Loading offer with ID:", offer_id);

            // Favoriten laden
            const favoritesData = await swapBoxService.getFavoritesByOffer(offer_id);
            favoritesCount = favoritesData.length;

            // Offer Details laden
            const offerData = await swapBoxService.getOfferById(offer_id);
            offer = offerData;

            // Bilder sortieren
            if (offer?.offer_images?.length > 0) {
                sortedImages = [...offer.offer_images].sort(
                    (a, b) =>
                        getImageOrderNumber(a.image_url) -
                        getImageOrderNumber(b.image_url),
                );
            }

            // Prüfen ob Favorit
            // @ts-ignore
            hasLiked = await swapBoxService.isFavorite(user_id, offer_id);
        } catch (err) {
            error = err.message;
            console.error("Fehler beim Laden des Angebots:", err);
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
                favoritesCount -= 1;
            } else {
                await swapBoxService.addToFavorites(user_id, offer_id);
                hasLiked = true;
                favoritesCount += 1;
            }
        } catch (err) {
            console.error("Fehler beim Favoriten-Toggle:", err);
        }
    }

    // Chat erstellen/öffnen
    async function startChat() {
        try {
            const chatData = await swapBoxService.createChat({
                offer_id: offer_id,
                user1_id: user_id,
                user2_id: offer.user_id,
            });

            // Zur Chat-Seite weiterleiten
            window.location.href = `/chat/${chatData.id}`;
        } catch (err) {
            console.error("Fehler beim Erstellen des Chats:", err);
        }
    }

    // Datum formatieren
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
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
        <button class="shadow-sm rounded-box p-1" onclick={goBack}>
            <ChevronLeft size={24} />
        </button>
        <button
            class="shadow-sm rounded-box p-1"
            style="margin-left: auto !important;"
            onclick={toggleFavorite}
        >
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
                    <img
                        src={image.public_url}
                        class="w-full"
                        alt="Angebotsbild {i + 1}"
                    />
                </div>
            {/each}
        </div>

        <div class="flex w-full justify-center gap-2 pt-2">
            {#each sortedImages as image, i}
                <a href="#item{i + 1}" onclick={() => clickedToggleImageCount += 1} class="btn btn-xs w-8 h-8">{i + 1}</a>
            {/each}
        </div>
    {/if}

        <p class="text-2xl font-bold mx-3 mt-4">{offer.title}</p>
        <!-- Kategorie-Zeile -->
        <div class="flex mt-2">
            <svg
                width="1.2em"
                height="1.2em"
                class="mt-0.5 ml-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style="min-width:1.2em;min-height:1.2em;"
                >{@html getCategoryIcon(offer.category)}</svg
            >
            <p class="text-md ml-1">{offer.category}</p>
        </div>

        <!-- Ort-Zeile -->
        <div class="flex mt-2 ml-3">
            <MapPin size="1.2em" class="mt-0.5" />
            <p class="text-md ml-1">{offer.location}</p>
        </div>

        <!-- Datum- und Like-Zeile -->
        <div class="flex mt-3">
            <div class="flex">
                <CalendarDays size="1.2em" class="mt-0.5 ml-3" />
                <p class="text-md ml-1">{formatDate(offer.created_at)}</p>
            </div>
            <div class="flex" style="margin-left: auto !important;">
                <button onclick={toggleFavorite}>
                    {#if hasLiked}
                        <Heart size={24} fill="#eb4034" color="#eb4034" />
                    {:else}
                        <Heart size={24} />
                    {/if}
                </button>
                <p class="text-md ml-1 mr-2">{favoritesCount}</p>
            </div>
        </div>

        
        <div class="mx-2 mt-4">
            <textarea
                class="textarea w-full h-32 bg-base-200 px-4"
                placeholder="Es wurde keine Beschreibung angegeben."
                readonly
                style="resize: none !important;"
                value={offer.description || ""}
            ></textarea>
        </div>
        
        <p class="text-2xl font-bold mt-4 mx-3">Angeboten von</p>

            <a class="flex mt-2" href="/profile/{offer.user_id}">
                <div class="avatar avatar-placeholder ml-2 mt-2">
                    <div
                        class="bg-neutral text-neutral-content w-8 rounded-full"
                    >
                        <span class="text-s font-bold">
                            {getInitials(offer.users?.name)}
                        </span>
                    </div>
                </div>


                <p class="ml-2 my-auto text-lg">
                    {offer.users?.name || "Unbekannt"}
                </p>
            </a>

            <div class="ml-3 mt-2">
                <Rating
                    rating={offer.users?.rating || 0}
                    editable={false}
                    ratingSizeClass="rating-sm"
                />

        </div>

    <div class="mt-4 flex mx-auto w-2/3 pb-4 ">
        {#if offer.user_id !== user_id}
            <button class="flex btn w-full" onclick={startChat}>
                <MessageSquareMore size={20} class="mt-1 mr-1" />
                <p>Chat starten</p>
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
