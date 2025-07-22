<script>
    import { goto } from "$app/navigation";
    import { redirect } from "@sveltejs/kit";
    import GreenGradientText from "$lib/components/ui/GreenGradientText.svelte";
    import { swapBoxService } from "$lib/api/swapbox.service.js";

    let registering = $state(false);
    let registerButtonUnlocked = $state(false);
    let invalidEmail = $state(false);
    let invalidPassword = $state(false);
    let invalidPasswordConfirm = $state(false);
    let invalidUsername = $state(false);
    let registrationError = $state("");

    // Hilfsfunktion für Passwort-Hashing
        async function hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hash = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hash));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }


    const check = () => {
        const password = document.getElementById("pw").value;
        const passwordConfirmation = document.getElementById("pwr").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;

        // Password validation
        if (password.length < 8 || !matchesPasswordRequirements(password)) {
            invalidPassword = true;
            if (password.length > 0) {
                document.getElementById("ipass").innerHTML =
                    "" +
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
        if (passwordConfirmation.length > 0) {
            if (password !== passwordConfirmation) {
                invalidPasswordConfirm = true;
                document.getElementById("ipassc").innerHTML =
                    "Die Passwörter stimmen nicht überein.";
            } else {
                invalidPasswordConfirm = false;
                document.getElementById("ipassc").innerHTML = "";
            }
        } else {
            invalidPasswordConfirm = passwordConfirmation.length !== 0;
        }

        // Email validation
        if (!validateEmail(email)) {
            invalidEmail = true;
            document.getElementById("iemail").innerHTML =
                email.length > 0
                    ? "Bitte geben Sie eine valide E-Mail an."
                    : "";
        } else {
            if (!email.endsWith("@th-brandenburg.de")) {
                invalidEmail = true;
                document.getElementById("iemail").innerHTML =
                    "Wir erlauben lediglich E-Mail Adressen von der Technischen Hochschule Brandenburg.";
            } else {
                invalidEmail = false;
                document.getElementById("iemail").innerHTML = "";
            }
        }

        // Username validation
        if (username.length > 0 && username.length < 3) {
            invalidUsername = true;
            document.getElementById("iuser").innerHTML =
                "Benutzername muss mindestens 3 Zeichen lang sein.";
        } else {
            invalidUsername = false;
            document.getElementById("iuser").innerHTML = "";
        }

        registerButtonUnlocked =
            !invalidEmail &&
            !invalidPasswordConfirm &&
            !invalidPassword &&
            !invalidUsername &&
            email.length > 0 &&
            password.length > 0 &&
            passwordConfirmation.length > 0 &&
            username.length > 0;
    };

    const handleRegistration = async () => {
        registering = true;
        registrationError = "";

        try {
            const email = document.getElementById("email").value;
            const password = document.getElementById("pw").value;
            const username = document.getElementById("username").value;

            // Check if user already exists
            const existingUser = await swapBoxService.getUserByEmail(email);
            if (existingUser) {
                throw new Error(
                    "Ein Benutzer mit dieser E-Mail existiert bereits.",
                );
            }

            // Passwort hashen vor dem Senden
            const hashedPassword = await hashPassword(password);

            const response = await fetch("/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password_hash: hashedPassword, // Jetzt wird das gehashte Passwort gesendet
                    name: username,
                    verified: true,
                    role: "student",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Registrierung fehlgeschlagen",
                );
            }

            registrationError = "success";

            setTimeout(() => {
                goto("/login?message=registration-success");
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error);
            registrationError =
                error.message ||
                "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
        } finally {
            registering = false;
        }
    };


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
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    };
</script>


<div class="flex justify-center mt-15">
    <div class="avatar">
        <div class="w-32">
            <img src="/android-chrome-512x512.png">
        </div>
    </div>
</div>

<GreenGradientText text="Swapbox" additionalClasses="text-4xl font-bold text-center"/>

<div class="h-screen flex flex-col">
    <div class="mx-auto mt-5">
        
    </div>

    <div class="m-auto mt-5">
        <fieldset
            class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
        >
            <legend class="fieldset-legend text-xl">Registrierung</legend>

            {#if registrationError === "success"}
                <div class="alert alert-success mb-4">
                    <span
                        >Registrierung erfolgreich! Sie werden zur Anmeldung
                        weitergeleitet...</span
                    >
                </div>
            {:else if registrationError}
                <div class="alert alert-error mb-4">
                    <span>{registrationError}</span>
                </div>
            {/if}

            <input
                id="username"
                type="text"
                class="input mt-2"
                placeholder="Benutzername"
                disabled={registering}
                oninput={() => check()}
                required
            />
            <p id="iuser" hidden={!invalidUsername} class="text-error"></p>

            <input
                id="email"
                type="email"
                class="input mt-2"
                placeholder="E-Mail"
                disabled={registering}
                oninput={() => check()}
                required
            />
            <p id="iemail" hidden={!invalidEmail} class="text-error"></p>

            <input
                id="pw"
                type="password"
                class="input mt-2"
                placeholder="Passwort"
                disabled={registering}
                oninput={() => check()}
                required
            />
            <p id="ipass" hidden={!invalidPassword} class="text-error"></p>

            <input
                id="pwr"
                type="password"
                placeholder="Passwort bestätigen"
                class="input mt-2"
                disabled={registering}
                oninput={() => check()}
                required
            />
            <p
                id="ipassc"
                hidden={!invalidPasswordConfirm}
                class="text-error"
            ></p>

            <a class="mt-5 text-right w-full link link-info" href="/login"
                >Du hast bereits einen Account?</a
            >
            <button
                class="btn btn-outline btn-success bg-accent"
                disabled={!registerButtonUnlocked || registering}
                onclick={handleRegistration}
            >
                {#if registering}
                    <span class="loading loading-dots loading-md"></span>
                {:else}
                    <span class="text-white">Registrieren</span>
                {/if}
            </button>


        </fieldset>
    </div>
</div>
