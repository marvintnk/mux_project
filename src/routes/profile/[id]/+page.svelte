<script>
// @ts-nocheck

    import { ChevronLeft } from "@lucide/svelte";
    import Rating from "$lib/components/ui/Rating.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import InvalidImageModal from "$lib/components/ui/InvalidImageModal.svelte";
    import { swapBoxService } from '$lib/api/swapbox.service.js';
    import { onMount } from 'svelte';
    import { page } from "$app/state";

    let { data } = $props();
    let user_id = page.params.id;

    // Reactive states
    let currentUser = $state(null);
    let myOffers = $state([]);
    let loading = $state(true);
    let error = $state(null);

    // Load user data and offers
    onMount(async () => {
        try {
            loading = true;

            // Load current user details
            const userData = await swapBoxService.getUserById(user_id);
            currentUser = userData;

            // Load user's offers
            const offersData = await swapBoxService.getOffers({ user_id: user_id });
            myOffers = offersData.map(offer => ({
                id: offer.id,
                img: offer.offer_images?.[0]?.public_url || null,
                link: `/offer/${offer.id}`,
                likes: 0, // Could be calculated from favorites table
                location: offer.location,
                date: new Date(offer.created_at).getTime(),
                title: offer.title,
                offer: offer
            }));

        } catch (err) {
            error = err.message;
            console.error('Fehler beim Laden der Benutzerdaten:', err);
        } finally {
            loading = false;
        }
    });

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

    // Profile picture upload (if needed)
    function getNewProfilePicture() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file) {
            // Handle profile picture upload
            // This would require additional service methods for profile pictures
            console.log('Profile picture selected:', file);
        }
    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-64">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="ml-4">Profil wird geladen...</p>
    </div>
{:else if error}
    <div class="alert alert-error mx-2 mt-4">
        <p>Fehler beim Laden des Profils: {error}</p>
    </div>
{:else if currentUser}
    <div class="flex mt-2 border-b border-base-400" style="padding-bottom: 4px !important;">
        <!-- TODO: Find a way to get the last page the user accessed -->
        <a class="flex" href="/" style="min-width: 33% !important;">
            <ChevronLeft />
            <p class="ml-1">Zurück</p>
        </a>
        <!-- Looks weird on long names currently... TODO: Fix later -->
        <div class="max-w-1/3" style="min-width: 33% !important;">
            <p class="font-bold text-center">Anzeigen von {currentUser.name}</p>
        </div>
    </div>

    <div class="mx-2 mt-5">
        <div class="flex">
            {#if currentUser.profile_picture}
                <div class="avatar">
                    <div class="w-16 rounded-full ring-2">
                        <img src={currentUser.profile_picture} alt="Profilbild" />
                    </div>
                </div>
            {:else}
                <div class="avatar avatar-placeholder">
                    <div class="bg-neutral text-neutral-content w-16 rounded-full">
                        <span class="text-2xl">{currentUser.name[0]}</span>
                    </div>
                </div>
            {/if}

            <input id="fileInput" type="file" style="display:none;" accept="image/png, image/jpeg" oninput={() => getNewProfilePicture()} />

            <div class="ml-5">
                <p class="text-xl">{currentUser.name}</p>

                <div>
                    <Rating rating={currentUser.rating || 0} editable={false}/>
                </div>
            </div>
        </div>

        <p class="ml-4 text-lg">{currentUser.email}</p>
        <textarea
            class="textarea mt-8 w-full h-32 px-4 bg-base-200"
            placeholder="Die Beschreibung"
            readonly="true"
            style="resize: none !important;"
        >{currentUser.description || ''}</textarea>
    </div>

    {#if myOffers.length > 0}
        <p class="pl-1 mt-5 text-2xl w-full border-b border-base-400">
            {myOffers.length} {myOffers.length === 1 ? 'Anzeige' : 'Anzeigen'}
        </p>
        <div class="mx-2 mt-3 mx-2 flex flex-col gap-2">
            {#each myOffers as item, index}
                <CategoryCard
                    imageData={item.img}
                    likes={item.likes}
                    location={item.location}
                    title={item.title}
                    date={item.date}
                    href={item.link}
                    isDeleteItem={true}
                    trashClickFunction={() => deleteOffer(item.id, index)}
                />
            {/each}
        </div>
    {:else}
        <div class="mt-5 w-full border-b border-base-400"></div>
        <p class="text-2xl mt-5 text-center">Sie haben noch keine Anzeigen</p>
        <div class="flex justify-center mt-2">
            <a class="btn btn-accent" href="/add">Anzeige aufgeben</a>
        </div>
    {/if}
{:else}
    <div class="alert alert-warning mx-2 mt-4">
        <p>Benutzer nicht gefunden</p>
    </div>
{/if}

<InvalidImageModal/>
