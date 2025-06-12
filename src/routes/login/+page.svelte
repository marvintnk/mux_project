<script>
    // TODO: Waiting for backend implementation
    // let { data } = $state();

    let loggingIn = $state(false);
    let registerButtonUnlocked = $state(false);

    let invalidEmail = $state(false);
    let invalidPassword = $state(false);

    const check = () => {
        const email = document.getElementById("email").value;

        if(!validateEmail(email)) {
            invalidEmail = true;
            document.getElementById("iemail").innerHTML = email.length > 0 ? "Bitte geben Sie eine valide E-Mail an." : "";
        } else {
            if(!email.endsWith("@th-brandenburg.de")) {
                invalidEmail = true;
                document.getElementById("iemail").innerHTML = "Wir erlauben lediglich E-Mail Adressen von der Technischen Hochschule Brandenburg.";
            } else {
                invalidEmail = false;
            }
        }

        registerButtonUnlocked = !invalidEmail && !invalidPassword;
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
</script>

<div class="flex flex-col">
    <div class="mx-auto mt-5">
        <p class="text-xl font-bold">Willkommen zurück</p>
    </div>

    <div class="m-auto mt-5">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Login</legend>

            <label class="label">E-Mail</label>
            <input id="email" type="email" class="input" disabled="{loggingIn}" oninput={() => check()} required />
            <p id="iemail" hidden="{!invalidEmail}" class="text-error"></p>

            <label class="label">Passwort</label>
            <input id="pw" type="password" class="input" disabled="{loggingIn}" oninput={() => check()} required />
            <p id="ipass" hidden="{!invalidPassword}" class="text-error"></p>

            <a class="mt-5 text-right w-full link link-info" href="/register">Noch kein Account?</a>
            <button class="btn btn-outline btn-success" disabled="{!registerButtonUnlocked || loggingIn}" onclick={() => loggingIn = true}>
                {#if loggingIn}
                    <span class="loading loading-dots loading-md"></span>
                {:else}
                    Login
                {/if}
            </button>
        </fieldset>
    </div>
</div>
