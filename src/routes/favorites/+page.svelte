<script>
    import GoBackItem from "$lib/components/ui/GoBackItem.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import AskDeleteComponent from "$lib/components/ui/AskDeleteComponent.svelte";
    import { swapBoxService } from '$lib/api/swapbox.service.js';
    import { onMount } from 'svelte';

    let { data } = $props();
    let user = data.user;
    let user_id = user.id;

    let idAskDeletion = $state(null);
    let favorites = $state([]);
    let loading = $state(true);
    let error = $state(null);

    // Favoriten beim Laden der Komponente abrufen
    onMount(async () => {
        try {
            loading = true;
            const favoritesData = await swapBoxService.getFavorites(user_id);
            favorites = favoritesData.map(favorite => ({
                id: favorite.id,
                offer_id: favorite.offer_id,
                location: favorite.offers?.location || 'Unbekannt',
                title: favorite.offers?.title || 'Kein Titel',
                date: new Date(favorite.created_at).getTime(),
                offer: favorite.offers,
                // Wichtig: href für Navigation hinzufügen
                href: `/offer/${favorite.offer_id}`
            }));
        } catch (err) {
            error = err.message;
            console.error('Fehler beim Laden der Favoriten:', err);
        } finally {
            loading = false;
        }
    });

    // Favorit entfernen
    async function removeFavorite(index) {
        try {
            const favorite = favorites[index];
            await swapBoxService.removeFromFavorites(user_id, favorite.offer_id);

            // Favorit aus der Liste entfernen
            favorites = favorites.filter((_, i) => i !== index);
            idAskDeletion = null;
        } catch (err) {
            error = err.message;
            console.error('Fehler beim Entfernen des Favoriten:', err);
        }
    }
</script>

<GoBackItem/>

<div class="flex flex-col {idAskDeletion !== null ? 'blur-xs' : ''}">
    <p class="text-2xl font-bold mx-auto">Favoriten</p>

    <div class="max-h-full mt-10 mx-2 gap-4" style="overflow-y: scroll !important;">
        {#if loading}
            <div class="text-center py-8">
                <p>Favoriten werden geladen...</p>
            </div>
        {:else if error}
            <div class="text-center py-8 text-red-600">
                <p>Fehler beim Laden der Favoriten: {error}</p>
            </div>
        {:else if favorites.length === 0}
            <div class="text-center py-8">
                <p>Sie haben noch keine Favoriten hinzugefügt.</p>
            </div>
        {:else}
            {#each favorites as item, i}
                <CategoryCard
                    location={item.location}
                    title={item.title}
                    date={item.date}
                    href={item.href}
                    hasLiked={true}
                    isFavoriteItem={true}
                    clickFunction={() => idAskDeletion = i}
                />
            {/each}
        {/if}
    </div>
</div>

{#if idAskDeletion !== null}
    <AskDeleteComponent
        question="Sind Sie sicher, dass Sie diese Anzeige entfernen möchten?"
        questionClasses="text-sm"

        callbackNo={() => idAskDeletion = null}
        callbackYes={() => removeFavorite(idAskDeletion)}

        yesButtonText="Entfernen"
        yesButtonClasses="text-center text-red-600 text-xl"

        noButtonText="Abbrechen"
        noButtonClasses="text-center text-xl"
    />
{/if}
