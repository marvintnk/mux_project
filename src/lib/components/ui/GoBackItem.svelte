<script>
    import { X, LogOut } from "@lucide/svelte";

    export let href;
    export let showLogoutButton = false;
</script>

<div class="flex justify-start">
    {#if showLogoutButton}
        <a class="shadow-sm rounded-box m-2 p-1" href="/logout">
            <LogOut size={24} />
        </a>
    {/if}

    <a class="shadow-sm rounded-box m-2 p-1" href={href} style="margin-left: auto !important;">
        <X size={24} />
    </a>
</div>
