<script>
    import { OctagonAlert } from "@lucide/svelte";
</script>

<dialog id="modal_invalid_datatype" class="modal">
    <div class="modal-box">
        <div class="flex text-lg font-bold">
            <OctagonAlert class="my-auto mr-2" color="#eb4034" />
            Invalider Datentyp hochgeladen.
        </div>
        <p class="py-4">Sie können nur Bilder in PNG oder JPEG Format hochladen.</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-warning">Schließen</button>
            </form>
        </div>
    </div>
</dialog>
