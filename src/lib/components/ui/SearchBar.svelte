<script>
    import { Search, X } from "@lucide/svelte";

    let searchMockup = $state([
        "Headset",
        "mathe nahhilfe",
        "Mathenachhilfe",
        "Hilfe für mathe",
        "Mathe Nachhilfe",
        "Nachhilfe in Mathematik",
        "Hilfe bei Mathe",
        "Lernhilfe Mathe",
        "Mathe Nachhilfe Online",
        "Laptop 15 Zoll",
        "Smartphone 64 GB",
        "Bike faltbar",
        "Kleiderschrank 1m",
        "Mitarbeiter gesucht",
        "Fitnessband 30 cm",
        "Schrank mit Türen",
        "Suche Nachhilfe",
        "Rechtschreibfehler beheben",
        "Koffer zum Verkauf",
        "Stuhl für Büro"
    ]);

    let searchBarVisible = $state(false);

    const removeItem = (i) => {
        searchMockup[i] = null;
        searchMockup = searchMockup.filter(item => item !== null);
        // TODO: Backend request
    }

    const clear = () => {
        searchMockup = [];
        // TODO: Backend request
    }

    const search = (text) => {
        // TODO: implement search
    }
</script>

<div class="{searchBarVisible && searchMockup.length > 0 ? 'shadow-sm rounded-box' : ''} mx-4">
    <div class="flex mt-5">
        <div class="input w-full" onclick="{searchBarVisible = true}" onfocusout="{searchBarVisible = false}">
            <Search />
            <input type="text" placeholder="Suche" />
        </div>
    </div>

    {#if searchBarVisible && searchMockup.length > 0}
        <div class="max-h-32 mt-1" style="overflow-y: scroll !important;">
            {#each searchMockup as item, i}
                <div class="flex hover:cursor-pointer">
                    <p class="ml-2 hover:cursor-pointer" onclick={() => search(item)}>{item}</p>
                    <p style="margin-left: auto;" class="place-content-center">
                        <X size="1.2em" class="cursor-pointer" onclick={() => removeItem(i)} />
                    </p>
                </div>
            {/each}
        </div>

        <div class="ml-2 py-2 text-red-600 hover:cursor-pointer" onclick={() => clear()}>
            Suchverlauf löschen
        </div>
    {/if}
</div>
