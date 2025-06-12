<script>
    import GoBackItem from "$lib/components/ui/GoBackItem.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import AskDeleteComponent from "$lib/components/ui/AskDeleteComponent.svelte";

    let idAskDeletion = $state(null);

    let mockupData = $state([
        {
            location: "Brandenburg an der Havel",
            title: "Suche Nachhilfe",
            date: "Mo. 09.06.2025"
        },
        {
            location: "Brandenburg an der Havel",
            title: "Schrank mit Türen",
            date: "Mo. 01.06.2025"
        },
        {
            location: "Brandenburg an der Havel",
            title: "Bike faltbar",
            date: "Mo. 24.05.2025"
        }
    ]);
</script>

<GoBackItem href="/"/>

<div class="flex flex-col {idAskDeletion !== null ? 'blur-xs' : ''}">
    <p class="text-2xl font-bold mx-auto">Favoriten</p>

    <div class="max-h-full mt-10 mx-2" style="overflow-y: scroll !important;">
        {#each mockupData as item, i}
            <CategoryCard location={item.location} title={item.title} date={item.date} hasLiked={true} isFavoriteItem={true} clickFunction={() => idAskDeletion = i}/>
        {/each}
    </div>
</div>

{#if idAskDeletion !== null}
    <AskDeleteComponent
        question="Sind Sie sicher, dass Sie diese Anzeige entfernen möchten?",
        questionClasses="text-sm"

        callbackNo={() => idAskDeletion = null}
        callbackYes={() => {
            // TODO: Delete Item (Backend)
            mockupData[idAskDeletion] = null;
            mockupData = mockupData.filter(mockupData => mockupData !== null);
            idAskDeletion = null;
        }}

        yesButtonText="Entfernen"
        yesButtonClasses="text-center text-red-600 text-xl"

        noButtonText="Abbrechen"
        noButtonClasses="text-center text-xl"
    />
{/if}


