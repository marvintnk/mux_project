<script>
    export let callbackYes;
    export let callbackNo;
    export let question;
    export let questionClasses;

    export let yesButtonText;
    export let yesButtonClasses;
    export let noButtonText;
    export let noButtonClasses;
</script>

<div class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
    <div class="toast toast-center mb-15">
        <div class="rounded-box shadow-lg mx-4 bg-base-100 p-4">
            <p class="w-full px-2 pb-1 mt-1 {questionClasses} border-b">{question}</p>
            <p class="{yesButtonClasses} mt-2" style="cursor: pointer !important;" onclick={() => callbackYes()}>{yesButtonText}</p>
        </div>

        <div class="rounded-box shadow-lg mx-4 bg-base-100 p-2">
            <p class="{noButtonClasses}" style="cursor: pointer !important;" onclick={() => callbackNo()}>{noButtonText}</p>
        </div>
    </div>
</div>


<!-- hi -->