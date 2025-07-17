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

<div class="toast toast-center mb-15">
    <div class="rounded-box shadow-sm mx-4">
        <p class="w-full px-2 pb-1 mt-1 {questionClasses} border-b">{question}</p>
        <p class="{yesButtonClasses}" style="cursor: pointer !important;" onclick={() => callbackYes()}>{yesButtonText}</p>
    </div>

    <div class="rounded-box shadow-sm mx-4">
        <p class="{noButtonClasses}" style="cursor: pointer !important;" onclick={() => callbackNo()}>{noButtonText}</p>
    </div>
</div>

<!-- hi -->