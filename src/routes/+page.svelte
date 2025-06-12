<script>
    import {Search} from "@lucide/svelte";
    import CategoryItem from "$lib/components/ui/CategoryItem.svelte";
    import CategoryCard from "$lib/components/ui/CategoryCard.svelte";
</script>

<div class="flex mt-5">
    <div class="input w-full mx-4">
        <Search />
        <input type="text" placeholder="Suche" />
    </div>
</div>

<p class="text-xl mt-5 ml-2 font-bold">Kategorien</p>
<div class="flex gap-4 mx-2 mt-2" style="overflow-y: scroll !important;">
    <CategoryItem
        href="/event"
        icon='<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>'
        name="Event"
    />

    <CategoryItem
        href="/exchange"
        icon='<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>'
        name="Tausch"
    />

    <CategoryItem
        href="/gift"
        icon='<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'
        name="Verschenken"
    />

    <CategoryItem
        href="/borrow"
        icon='<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
        name="Ausleihen"
    />
</div>

<p class="text-xl mt-5 ml-2 font-bold">Nächste Events</p>

<div class="max-h-64 mx-2 gap-4" style="overflow-y: scroll !important;">
    <CategoryCard likes={5} location="Brandenburg an der Havel" title="Flunkyball 28.11.26 ..."  date="Sa. 28.11.2026" href="/event/0"/>
    <CategoryCard likes={20} location="Brandenburg an der Havel" title="Kulturfest mit Live-Musik" date="Sa. 10.04.2025" href="/event/1" hasLiked={true}/>
    <CategoryCard likes={35} location="Brandenburg an der Havel" title="Open-Air Konzert im Park" date="So. 29.06.2025" href="/event/2"/>
    <CategoryCard likes={15} location="Brandenburg an der Havel" title="Workshop für Kreatives Schreiben" date="Mi. 18.09.2025" href="/event/3" hasLiked={true}/>
    <CategoryCard likes={40} location="Brandenburg an der Havel" title="Familienfest im Park" date="Sa. 06.07.2025" href="/event/4" hasLiked={true}/>
    <CategoryCard likes={25} location="Brandenburg an der Havel" title="Sommerparty mit DJ" date="So. 13.08.2025" href="/event/5"/>
</div>

<p class="text-xl mt-5 ml-2 font-bold">Neuste Anzeigen</p>

<div class="mx-2 gap-4" style="overflow-y: scroll !important;">
    <CategoryCard likes={1} location="Brandenburg an der Havel" title="Suche Nachhilfe"  date="Mo. 09.06.2025" href="/offer/0" hasLiked={true}/>
    <CategoryCard likes={0} location="Brandenburg an der Havel" title="Kleiderschrank 1m"  date="Mo. 08.06.2025" href="/offer/1"/>
    <CategoryCard likes={3} location="Brandenburg an der Havel" title="Mitarbeiter gesucht"  date="Mo. 08.06.2025" href="/offer/2"/>
    <CategoryCard likes={2} location="Brandenburg an der Havel" title="Fitnessband 30 cm"  date="Mo. 07.06.2025" href="/offer/3"/>
    <CategoryCard likes={6} location="Brandenburg an der Havel" title="Laptop 15 Zoll"  date="Mo. 06.06.2025" href="/offer/4"/>
    <CategoryCard likes={4} location="Brandenburg an der Havel" title="Schrank mit Türen"  date="Mo. 01.06.2025" href="/offer/5"/>
    <CategoryCard likes={0} location="Brandenburg an der Havel" title="Smartphone 64 GB"  date="Mo. 25.05.2025" href="/offer/6"/>
    <CategoryCard likes={1} location="Brandenburg an der Havel" title="Bike faltbar"  date="Mo. 24.05.2025" href="/offer/7"/>
    <CategoryCard likes={0} location="Brandenburg an der Havel" title="Tisch 120cm"  date="Mo. 12.05.2025" href="/offer/8"/>
</div>
