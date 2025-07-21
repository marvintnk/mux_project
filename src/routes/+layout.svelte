<script>
    import "../app.css";
    import Footer from "$lib/components/ui/Footer.svelte";
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { afterNavigate } from '$app/navigation';
    import { messagesStore } from '$lib/stores/messages.js';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let { data, children } = $props();

    // Benutzer global verfügbar machen (mit $derived)
    const user = $derived(data.user);

    // Routen ohne Footer definieren
    const protectedRoutes = ['/profile', '/favorites', '/add', '/chat'];
    const noFooterRoutes = ['/login', '/register', '/chat/'];
    const showFooter = $derived(!noFooterRoutes.some(route => $page.url.pathname.startsWith(route)));

    // Bei Navigation zu geschützten Routen Daten invalidieren
    afterNavigate(() => {
        const isProtected = protectedRoutes.some(route =>
            $page.url.pathname.startsWith(route)
        );

        if (isProtected) {
            invalidateAll();
        }
    });

    // Messages Store initialisieren wenn User verfügbar ist
    $effect(() => {
        if (browser && user?.id) {
            messagesStore.init(user.id);
        } else if (browser && !user?.id) {
            messagesStore.destroy();
        }
    });

    // Cleanup beim Zerstören der Komponente
    onDestroy(() => {
        if (browser) {
            messagesStore.destroy();
        }
    });

    // Debug-Ausgabe mit $effect
    $effect(() => {
        console.log('Layout user:', user);
        console.log('Show footer:', showFooter);
        console.log('Current path:', $page.url.pathname);
    });
</script>

{@render children()}

{#if showFooter}
    <Footer {user} />
{/if}
