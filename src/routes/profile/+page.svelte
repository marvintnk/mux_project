<script>
    import GoBackItem from "$lib/components/ui/GoBackItem.svelte";
    import { OctagonAlert } from "@lucide/svelte";
    import Rating from "$lib/components/ui/Rating.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
    import InvalidImageModal from "$lib/components/ui/InvalidImageModal.svelte";

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
    //let myOffers = $state([]);
    let description = $state("");

    const getNewProfilePicture = () => {
        const element = document.getElementById("fileInput");
        const files = element.files;

        if(files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if(reader.result.startsWith("data:image/")) {
                    imageData = reader.result;
                    // TODO: Upload new profile picture
                } else {
                    document.getElementById("modal_invalid_datatype").showModal();
                }
            };
        }
    }
</script>

<GoBackItem showLogoutButton={true}/>

<div class="flex">
    <p class="text-2xl font-bold mx-auto">Mein Profil</p>
</div>

<div class="mx-2 mt-5">
    <div class="flex">
        {#if imageData === null}
            <div class="avatar avatar-placeholder" onclick={() => document.getElementById("fileInput").click()}>
                <div class="bg-neutral text-neutral-content w-16 rounded-full">
                    <span class="text-2xl">{name[0]}</span>
                </div>
            </div>
        {:else}
            <div class="avatar" onclick={() => document.getElementById("fileInput").click()}>
                <div class="w-16 rounded-full ring-2">
                    <img src={imageData} />
                </div>
            </div>
        {/if}

        <input id="fileInput" type="file" style="display:none;" accept="image/png, image/jpeg" oninput={() => getNewProfilePicture()} />

        <div class="ml-5">
            <p class="text-xl">{name}</p>

            <div>
                <Rating rating={rating}/>
            </div>
        </div>
    </div>

    <p class="ml-4 text-lg">{email}</p>
    <textarea class="textarea mt-8 w-full h-32 px-4" placeholder="Meine Beschreibung" style="resize: none !important;">{description}</textarea>
    <button class="btn btn-accent w-full mt-2">Beschreibung bearbeiten</button>
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

<InvalidImageModal/>
