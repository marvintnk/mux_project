<script>
    import "../app.css";
    import Footer from "$lib/components/ui/Footer.svelte";
    import { page } from '$app/stores';
    import { invalidateAll } from '$app/navigation';
    import { afterNavigate } from '$app/navigation';

    let { data, children } = $props();

    // Benutzer global verfügbar machen (mit $derived)
    const user = $derived(data.user);

    // Routen ohne Footer definieren
    const noFooterRoutes = ['/login', '/register'];
    const showFooter = $derived(!noFooterRoutes.includes($page.url.pathname));

    // Bei Navigation zu geschützten Routen Daten invalidieren
    afterNavigate(() => {
        const protectedRoutes = ['/profile', '/favorites', '/add', '/chat'];
        const isProtected = protectedRoutes.some(route =>
            $page.url.pathname.startsWith(route)
        );

        if (isProtected) {
            invalidateAll();
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
    <Footer profileData={user ? 1 : 0} />
{/if}
