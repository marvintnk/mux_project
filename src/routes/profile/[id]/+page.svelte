<script>
    import { OctagonAlert, ChevronLeft } from "@lucide/svelte";
    import Rating from "$lib/components/ui/Rating.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";

    let imageData = $state(null);
    let name = $state("?");
    let email = $state("email@th-brandenburg.de");
    let rating = $state(3.5);

    let myOffers = $state([{
        img: null,
        link: "/offer/0",
        likes: 1,
        location: "Brandenburg an der Havel",
        date: "Mo. 09.06.2025",
        title: "Suche Nachhilfe"
    }]);

    let description = $state("");
</script>

<div class="flex mt-2 border-b border-base-400" style="padding-bottom: 4px !important;">
    <!-- TODO: Find a way to get the last page the user accessed -->
    <a class="flex" href="/" style="min-width: 33% !important;">
        <ChevronLeft />
        <p class="ml-1">Zurück</p>
    </a>
    <!-- Looks weird on long names currently... TODO: Fix later -->
    <div class="max-w-1/3" style="min-width: 33% !important;">
        <p class="font-bold text-center">Anzeigen von {name}</p>
    </div>
</div>

<div class="mx-2 mt-5">
    <div class="flex">
        {#if imageData === null}
            <div class="avatar avatar-placeholder">
                <div class="bg-neutral text-neutral-content w-16 rounded-full">
                    <span class="text-2xl">{name[0]}</span>
                </div>
            </div>
        {:else}
            <div class="avatar">
                <div class="w-16 rounded-full ring-2">
                    <img src={imageData} />
                </div>
            </div>
        {/if}

        <input id="fileInput" type="file" style="display:none;" oninput={() => getNewProfilePicture()} />

        <div class="ml-5">
            <p class="text-xl">{name}</p>

            <div>
                <Rating rating={rating}/>
            </div>
        </div>
    </div>

    <p class="ml-4 text-lg">{email}</p>
    <textarea class="textarea mt-8 w-full h-32 px-4" placeholder="Meine Beschreibung" readonly="true" style="resize: none !important;">{description}</textarea>
</div>

{#if myOffers.length > 0}
    <p class="pl-1 mt-5 text-2xl w-full border-b border-base-400">{myOffers.length} {myOffers.length === 1 ? 'Anzeige' : 'Anzeigen'}</p>
    <div class="mx-2 mt-5">
        {#each myOffers as item}
            <CategoryCard imageData={item.img} likes={item.likes} location={item.location} title={item.title} date={item.date} href={item.link} isDeleteItem={true} trashClickFunction={() => {
                console.log("test");
            }}/>
        {/each}
    </div>
{:else}
    <div class="mt-5 w-full border-b border-base-400"></div>
    <p class="text-2xl mt-5 text-center">Sie haben noch keine Anzeigen</p>
    <div class="flex justify-center mt-2">
        <a class="btn btn-accent" href="/add">Anzeige aufgeben</a>
    </div>
{/if}

<dialog id="modal_invalid_datatype" class="modal">
    <div class="modal-box">
        <div class="flex text-lg font-bold">
            <OctagonAlert class="my-auto mr-2" color="#eb4034" />
            Invalider Datentyp hochgeladen.
        </div>
        <p class="py-4">Ihr Profilbild konnte nicht aktualisiert werden. Bitte stellen Sie sicher, dass Sie Dateien vom Typ PNG oder JPEG hochladen.</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-warning">Schließen</button>
            </form>
        </div>
    </div>
</dialog>
