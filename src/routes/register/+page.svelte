<script>
    // TODO: Waiting for backend implementation
    // let { data } = $state();

    let registering = $state(false);
    let registerButtonUnlocked = $state(false);

    let invalidEmail = $state(false);
    let invalidPassword = $state(false);
    let invalidPasswordConfirm = $state(false);
    let invalidUsername = $state(false);

    const check = () => {
        const password = document.getElementById("pw").value,
              passwordConfirmation = document.getElementById("pwr").value;

        if (password.length < 8 || !matchesPasswordRequirements(password)) {
            invalidPassword = true;
            if(password.length > 0) {
                document.getElementById("ipass").innerHTML = "" +
                    "<p class='text-error'>Passwort Richtlinie:</p>" +
                    "<p class='text-error'>- mind. 8 Zeichen Länge</p>" +
                    "<p class='text-error'>- 1 Großbuchstabe</p>" +
                    "<p class='text-error'>- 1 Zahl</p>" +
                    "<p class='text-error'>- 1 Kleinbuchstabe</p>";
            } else {
                document.getElementById("ipass").innerHTML = "";
            }
        } else {
            invalidPassword = false;
        }

        if(passwordConfirmation.length < 8 || !matchesPasswordRequirements(passwordConfirmation)) {
            if(password !== passwordConfirmation) {
                invalidPasswordConfirm = true;
                document.getElementById("ipassc").innerHTML = "Die Passworter stimmen nicht überein.";
            }
        } else {
            invalidPasswordConfirm = false;
        }

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

        registerButtonUnlocked = !invalidEmail && !invalidPasswordConfirm && !invalidPassword && !invalidUsername;
    }

    const matchesPasswordRequirements = (password) => {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/gm;
        let m;

        if ((m = regex.exec(password)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            return m.length > 0;
        }

        return false;
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
</script>

<div class="h-screen flex">
    <div class="mx-auto mt-15">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Registrierung</legend>

            <label class="label">Benutzername</label>
            <input id="username" type="text" class="input" disabled="{registering}" oninput={() => check()} required />
            <p id="iuser" hidden="{!invalidUsername}" class="text-error"></p>

            <label class="label">E-Mail</label>
            <input id="email" type="email" class="input" disabled="{registering}" oninput={() => check()} required />
            <p id="iemail" hidden="{!invalidEmail}" class="text-error"></p>

            <label class="label">Passwort</label>
            <input id="pw" type="password" class="input" disabled="{registering}" oninput={() => check()} required />
            <p id="ipass" hidden="{!invalidPassword}" class="text-error"></p>

            <label class="label">Passwort bestätigen</label>
            <input id="pwr" type="password" class="input" disabled="{registering}" oninput={() => check()} required />
            <p id="ipassc" hidden="{!invalidPasswordConfirm}" class="text-error"></p>

            <a class="mt-5 text-right w-full link link-info" href="/login">Du hast bereits einen Account?</a>
            <button class="btn btn-outline btn-success" disabled="{!registerButtonUnlocked || registering}" onclick={() => registering = true}>
                {#if registering}
                    <span class="loading loading-dots loading-md"></span>
                {:else}
                    Registrieren
                {/if}
            </button>
        </fieldset>
    </div>
</div>
