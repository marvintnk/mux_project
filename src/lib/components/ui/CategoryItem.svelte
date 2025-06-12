<script>
    export let href;
    export let icon;
    export let name;
</script>

<a class="flex justify-center flex-col" href={href}>
    <div class="mx-auto">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shadow-sm p-1.5 rounded-box">
            {@html icon}
        </svg>
    </div>
    <p class="text-sm text-center"><nobr>{name}</nobr></p>
</a>
