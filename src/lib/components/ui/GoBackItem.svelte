<script>
    import { X } from "@lucide/svelte";

    export let href;
</script>

<div class="flex justify-end">
    <a class="shadow-sm rounded-box m-2" href={href}>
        <X size={24} />
    </a>
</div>
