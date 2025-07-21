<script>
    // @ts-nocheck

    import GoBackItem from "$lib/components/ui/GoBackItem.svelte";
    import { OctagonAlert } from "@lucide/svelte";
    import Rating from "$lib/components/ui/Rating.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import InvalidImageModal from "$lib/components/ui/InvalidImageModal.svelte";
    import AskDeleteComponent from "$lib/components/ui/AskDeleteComponent.svelte";
    import { swapBoxService } from "$lib/api/swapbox.service.js";
    import { onMount } from "svelte";

    let { data } = $props();
    let user = data.user;
    let user_id = user.id;

    // Reactive states
    let currentUser = $state(null);
    let myOffers = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let description = $state("");
    let isEditingDescription = $state(false);
    let idAskDeletion = $state(null);

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

    // Load user data and offers
    onMount(async () => {
        try {
            loading = true;

            // Load current user details
            const userData = await swapBoxService.getUserById(user_id);
            currentUser = userData;
            description = userData.description || "";

            // Load user's offers
            const offersData = await swapBoxService.getOffers({
                user_id: user_id,
            });
            myOffers = offersData.map((offer) => ({
                id: offer.id,
                img: offer.offer_images?.[0]?.public_url || null,
                link: `/offer/${offer.id}`,
                likes: 0,
                location: offer.location,
                date: new Date(offer.created_at).getTime(),
                title: offer.title,
                offer: offer,
            }));
        } catch (err) {
            error = err.message;
            console.error("Fehler beim Laden der Benutzerdaten:", err);
        } finally {
            loading = false;
        }
    });

    // Delete offer function
    async function deleteOffer(offerId, index) {
        try {
            await swapBoxService.deleteOffer(offerId);
            myOffers = myOffers.filter((_, i) => i !== index);
        } catch (err) {
            console.error("Fehler beim Löschen des Angebots:", err);
            alert("Fehler beim Löschen des Angebots");
        }
    }

    // Update description
    async function updateDescription() {
        try {
            await swapBoxService.updateUser(user_id, {
                description: description,
            });
            isEditingDescription = false;
            currentUser = { ...currentUser, description: description };
        } catch (err) {
            console.error("Fehler beim Aktualisieren der Beschreibung:", err);
            alert("Fehler beim Aktualisieren der Beschreibung");
        }
    }
</script>

<GoBackItem showLogoutButton={true} />

<div class="{idAskDeletion !== null ? 'blur-xs' : ''}">
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
    <div class="flex">
        <p class="text-2xl font-bold mx-auto">Mein Profil</p>
    </div>

    <div class="mx-2 mt-5">
        <div class="flex">
            <!-- Avatar mit E-Mail-Initialen -->
            <div class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-16 rounded-full">
                    <span class="text-2xl font-bold"
                        >{getInitials(currentUser.name)}</span
                    >
                </div>
            </div>

            <div class="ml-5">
                <p class="text-xl">{currentUser.name}</p>
                <div>
                    <Rating rating={currentUser.rating || 0} editable={false} />
                </div>
            </div>
        </div>

        <p class="ml-4 text-lg">{currentUser.email}</p>

        {#if isEditingDescription}
            <textarea
                class="textarea mt-8 w-full h-32 px-4 bg-base-200"
                placeholder="Meine Beschreibung"
                style="resize: none !important;"
                bind:value={description}
            ></textarea>
            <div class="flex gap-2 mt-2">
                <button
                    class="btn btn-accent flex-1"
                    onclick={updateDescription}>Speichern</button
                >
                <button
                    class="btn btn-outline flex-1"
                    onclick={() => {
                        isEditingDescription = false;
                        description = currentUser.description || "";
                    }}>Abbrechen</button
                >
            </div>
        {:else}
            <textarea
                class="textarea mt-8 w-full h-32 px-4 bg-base-200"
                placeholder="Meine Beschreibung"
                readonly="true"
                style="resize: none !important;"
                value={description}
            ></textarea>
            <button
                class="btn btn-accent w-full mt-2"
                onclick={() => (isEditingDescription = true)}
            >
                Beschreibung bearbeiten
            </button>
        {/if}
    </div>

    {#if myOffers.length > 0}
        <p class="pl-1 mt-5 text-2xl w-full border-b border-base-400">
            {myOffers.length}
            {myOffers.length === 1 ? "Anzeige" : "Anzeigen"}
        </p>
        <div class="mx-2 mt-5 flex flex-col gap-4">
            {#each myOffers as item, index}
                <CategoryCard
                    imageData={item.img}
                    likes={item.likes}
                    location={item.location}
                    title={item.title}
                    date={item.date}
                    href={item.link}
                    deletable={true}
                    clickFunction={() => idAskDeletion = index}
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
</div>

<InvalidImageModal />

{#if idAskDeletion !== null}
    <AskDeleteComponent
        question="Sind Sie sicher, dass Sie diese Anzeige löschen möchten?"
        questionClasses="text-md"

        callbackNo={() => idAskDeletion = null}
        callbackYes={async () => {
            if (idAskDeletion !== null) {
                await deleteOffer(myOffers[idAskDeletion].id, idAskDeletion);
                idAskDeletion = null;
            }
        }}

        yesButtonText="Entfernen"
        yesButtonClasses="text-center text-red-600 text-xl"

        noButtonText="Abbrechen"
        noButtonClasses="text-center text-xl"
    />
{/if}
