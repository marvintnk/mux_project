<script>
    import { Plus, Camera, OctagonAlert, Trash2 } from "@lucide/svelte";
    import GoBackItem from "$lib/components/ui/GoBackItem.svelte";
    import { CATEGORIES } from "$lib/categories.js";
    import { LOCATIONS } from "$lib/locations.js";
    import InvalidImageModal from "$lib/components/ui/InvalidImageModal.svelte";
    import { swapBoxService } from "$lib/api/swapbox.service.js";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";



    let images = $state([]);
    let imageFiles = $state([]); // Speichert die tatsächlichen File-Objekte
    let videoStream = $state(false);
    let isLoading = $state(false);

    // Data aus dem Server Load
    let { data } = $props();
    
    // Formulardaten
    let formData = $state({
        title: "",
        category: "",
        description: "",
        location: "",
        type: "biete" // "biete" oder "suche"
    });

    // Aktueller Benutzer
    let user = data.user;

    const startVideoStream = async () => {
        videoStream = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const canvas = document.getElementById("camera");
            canvas.srcObject = stream;
        } catch (error) {
            document.getElementById("modal_no_camera").showModal();
            videoStream = false;
        }
    }

    const stopVideoStream = () => {
        const canvas = document.getElementById("camera");
        if (canvas.srcObject) {
            canvas.srcObject.getTracks().forEach(track => track.stop());
            canvas.srcObject = null;
        }

        const captureCanvas = document.getElementById("photo");
        captureCanvas.width = 0;
        captureCanvas.height = 0;

        videoStream = false;
    }

    const capturePicture = () => {
        if (!videoStream) return;

        const video = document.getElementById('camera');
        const canvas = document.getElementById('photo');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Canvas zu Blob konvertieren
        canvas.toBlob((blob) => {
            const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
            imageFiles.push(file);
            
            const base64 = canvas.toDataURL("image/jpeg");
            images.push(base64);
        }, 'image/jpeg', 0.8);

        stopVideoStream();
    }

    const removeImage = (i) => {
        images.splice(i, 1);
        imageFiles.splice(i, 1);
        images = [...images];
        imageFiles = [...imageFiles];
    }

    const captureInput = () => {
        const element = document.getElementById("fileInput");
        const files = Array.from(element.files);

        files.forEach(file => {
            if (file.type.startsWith("image/")) {
                imageFiles.push(file);
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    images.push(reader.result);
                };
            } else {
                document.getElementById("modal_invalid_datatype").showModal();
            }
        });
        
        // Input zurücksetzen
        element.value = "";
    }

    const updateTitleCounter = () => {
        document.getElementById("title_counter").textContent = formData.title.length + "/80";
    }

    const validateForm = () => {
        if (!formData.title.trim()) {
            alert("Bitte geben Sie einen Titel ein.");
            return false;
        }
        if (!formData.category) {
            alert("Bitte wählen Sie eine Kategorie aus.");
            return false;
        }
        if (!formData.description.trim()) {
            alert("Bitte geben Sie eine Beschreibung ein.");
            return false;
        }
        if (!formData.location) {
            alert("Bitte wählen Sie einen Ort aus.");
            return false;
        }
        return true;
    }

    const submitOffer = async () => {
        if (!validateForm()) return;
        
        isLoading = true;
        
        try {
            // 1. Angebot erstellen
            const offerData = {
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                type: formData.type,
                location: formData.location,
                status: 'active'
            };

            const createdOffer = await swapBoxService.createOffer(offerData);
            
            // 2. Bilder hochladen (falls vorhanden)
            if (imageFiles.length > 0) {
                const uploadResult = await swapBoxService.uploadMultipleOfferImages(
                    createdOffer.id, 
                    imageFiles, 
                    user.id
                );
                
                console.log(`${uploadResult.successCount} von ${uploadResult.total} Bildern erfolgreich hochgeladen`);
                
                if (uploadResult.failed.length > 0) {
                    console.warn("Einige Bilder konnten nicht hochgeladen werden:", uploadResult.failed);
                }
            }

            // 3. Erfolgsmeldung und Weiterleitung
            alert("Angebot erfolgreich erstellt!");
            goto('/offers'); // oder zur Detailseite des Angebots
            
        } catch (error) {
            console.error("Fehler beim Erstellen des Angebots:", error);
            alert("Fehler beim Erstellen des Angebots: " + error.message);
        } finally {
            isLoading = false;
        }
    }

     onMount(() => {
        // Debug: User-Daten anzeigen
        console.dir(user);
    });


</script>

<GoBackItem/>

<div class="flex">
    <p class="text-2xl font-bold mx-auto">Hinzufügen</p>
</div>

<div class="rounded-box p-4 mx-4 shadow-sm mt-10 flex" onclick={() => startVideoStream()}>
    <Camera class="my-auto" />
    <p class="w-full text-xl font-bold text-center">Foto erstellen</p>
</div>

{#if videoStream}
    <video id="camera" autoplay></video>
    <div class="flex justify-center mt-2">
        <button id="capture-btn" class="btn btn-primary" onclick={() => capturePicture()}>Foto aufnehmen</button>
        <button class="btn btn-secondary ml-2" onclick={() => stopVideoStream()}>Abbrechen</button>
    </div>
    <canvas id="photo" style="display: none;"></canvas>
{/if}

<div class="rounded-box p-4 mx-4 shadow-sm mt-2 flex" onclick={() => document.getElementById('fileInput').click()}>
    <input id="fileInput" type="file" style="display:none;" accept="image/png, image/jpeg, image/webp" multiple oninput={() => captureInput()} />
    <Plus class="my-auto" />
    <p class="w-full text-xl font-bold text-center">Foto hochladen</p>
</div>

{#if images.length > 0}
    <div class="carousel w-full mt-4">
        {#each images as image, i}
            <div id="item{i + 1}" class="carousel-item w-full">
                <img src="{image}" class="w-full" alt="Angebotsbild {i + 1}" />
            </div>
        {/each}
    </div>

    <div class="flex w-full justify-center gap-2 pt-2">
        {#each images as image, i}
            <a href="#item{i + 1}" class="btn btn-xs w-8 h-8">{i + 1}</a>
        {/each}
    </div>

    <div class="flex w-full justify-center gap-2 mb-4">
        {#each images as image, i}
            <button class="btn btn-xs w-8 h-8" onclick={() => removeImage(i)}>
                <Trash2 size="1em"/>
            </button>
        {/each}
    </div>
{/if}

<div class="mx-10 mt-5 flex">
    <div class="flex w-full">
        <input type="radio" name="action-type" class="radio mr-2 radio-accent" 
               bind:group={formData.type} value="biete" />
        Ich biete
    </div>
    <div class="flex w-full">
        <input type="radio" name="action-type" class="radio mr-2 radio-accent" 
               bind:group={formData.type} value="suche" style="margin-left: auto;" />
        Ich suche
    </div>
</div>

<div class="mx-4 mt-4">
    <div class="flex justify-center input w-full">
        <input id="title" type="text" maxlength="80" placeholder="Titel" 
               bind:value={formData.title} oninput={() => updateTitleCounter()}>
    </div>
    <div class="flex">
        <p id="title_counter" style="margin-left: auto !important;">0/80</p>
    </div>
    
    <select class="select mt-2 w-full" bind:value={formData.category}>
        <option disabled value="">Kategorie auswählen</option>
        {#each CATEGORIES as item}
            <option value={item.name}>{item.name}</option>
        {/each}
    </select>
    
    <textarea class="textarea mt-8 w-full h-32 px-4" placeholder="Beschreibung" 
              bind:value={formData.description} style="resize: none !important;"></textarea>
    
    <select class="select mt-8 w-full" bind:value={formData.location}>
        <option disabled value="">Ort auswählen</option>
        {#each LOCATIONS as item}
            <option value={item}>{item}</option>
        {/each}
    </select>

    <button class="w-full btn btn-accent mt-8 mb-4" 
            onclick={() => submitOffer()} 
            disabled={isLoading}>
        {#if isLoading}
            <span class="loading loading-spinner"></span>
            Wird erstellt...
        {:else}
            Anzeige aufgeben
        {/if}
    </button>
</div>

<!-- Error Dialog Boxes -->
<dialog id="modal_no_camera" class="modal">
    <div class="modal-box">
        <div class="flex text-lg font-bold">
            <OctagonAlert class="my-auto mr-2" color="#eb4034" />
            Kamera nicht gefunden.
        </div>
        <p class="py-4">Auf Ihrem Gerät wurde keine Kamera gefunden. Verwenden Sie stattdessen die Funktion "Foto hochladen", um Bilder hinzuzufügen.</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-warning">Schließen</button>
            </form>
        </div>
    </div>
</dialog>

<InvalidImageModal/>
