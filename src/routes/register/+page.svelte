<script>
    import { goto } from '$app/navigation';
    import {redirect} from "@sveltejs/kit";


    let registering = $state(false);
    let registerButtonUnlocked = $state(false);
    let invalidEmail = $state(false);
    let invalidPassword = $state(false);
    let invalidPasswordConfirm = $state(false);
    let invalidUsername = $state(false);
    let registrationError = $state('');

    const check = () => {
        const password = document.getElementById("pw").value;
        const passwordConfirmation = document.getElementById("pwr").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;

        // Password validation
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
            document.getElementById("ipass").innerHTML = "";
        }

        // Password confirmation validation
        if(passwordConfirmation.length > 0) {
            if(password !== passwordConfirmation) {
                invalidPasswordConfirm = true;
                document.getElementById("ipassc").innerHTML = "Die Passwörter stimmen nicht überein.";
            } else {
                invalidPasswordConfirm = false;
                document.getElementById("ipassc").innerHTML = "";
            }
        } else {
            invalidPasswordConfirm = passwordConfirmation.length !== 0;
        }

        // Email validation
        if(!validateEmail(email)) {
            invalidEmail = true;
            document.getElementById("iemail").innerHTML = email.length > 0 ? "Bitte geben Sie eine valide E-Mail an." : "";
        } else {
            if(!email.endsWith("@th-brandenburg.de")) {
                invalidEmail = true;
                document.getElementById("iemail").innerHTML = "Wir erlauben lediglich E-Mail Adressen von der Technischen Hochschule Brandenburg.";
            } else {
                invalidEmail = false;
                document.getElementById("iemail").innerHTML = "";
            }
        }

        // Username validation
        if(username.length > 0 && username.length < 3) {
            invalidUsername = true;
            document.getElementById("iuser").innerHTML = "Benutzername muss mindestens 3 Zeichen lang sein.";
        } else {
            invalidUsername = false;
            document.getElementById("iuser").innerHTML = "";
        }


        registerButtonUnlocked = !invalidEmail && !invalidPasswordConfirm && !invalidPassword && !invalidUsername && email.length > 0 && password.length > 0 && passwordConfirmation.length > 0 && username.length > 0;
    }

    const handleRegistration = async () => {
        registering = true;
        registrationError = '';


        try {
            const email = document.getElementById("email").value;
            const password = document.getElementById("pw").value;
            const username = document.getElementById("username").value;

            // Check if user already exists
            const existingUser = await swapBoxService.getUserByEmail(email);
            if (existingUser) {
                throw new Error('Ein Benutzer mit dieser E-Mail existiert bereits.');
            }


        const email = document.getElementById("email").value;
        const password = document.getElementById("pw").value;
        const username = document.getElementById("username").value;

        await fetch("/api/v1/user/register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password_hash: hashedPassword,
                verified: true,
                role: 'student'
            });

            registrationError = 'success';

            setTimeout(() => {
                goto('/login?message=registration-success');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            registrationError = error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
        } finally {
            registering = false;
        });
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

<div class="h-screen flex flex-col">
    <div class="mx-auto mt-5">
        <p class="text-xl font-bold">Herzlich Willkommen</p>
    </div>

    <div class="m-auto mt-5">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Registrierung</legend>

            {#if registrationError === 'success'}
                <div class="alert alert-success mb-4">
                    <span>Registrierung erfolgreich! Sie werden zur Anmeldung weitergeleitet...</span>
                </div>
            {:else if registrationError}
                <div class="alert alert-error mb-4">
                    <span>{registrationError}</span>
                </div>
            {/if}

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
            <button
                class="btn btn-outline btn-success"
                disabled="{!registerButtonUnlocked || registering}"
                onclick={handleRegistration}
            >
                {#if registering}
                    <span class="loading loading-dots loading-md"></span>
                {:else}
                    Registrieren
                {/if}
            </button>
        </fieldset>
    </div>
</div>
