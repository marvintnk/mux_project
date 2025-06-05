<script>
    import Footer from "../lib/components/ui/Footer.svelte";
    import "../app.css";
    import Header from "../lib/components/ui/Header.svelte";
    import {onMount} from "svelte";

    let { children } = $props();

    let profileData = 1;
    let isSearchBarHidden = $state(false);

    const hideSearchBarAt = [
        "/login",
        "/register"
    ];

    onMount(() => {
        const path = new URL(document.URL).pathname;
        isSearchBarHidden = hideSearchBarAt.filter(item => path.startsWith(item)).length > 0;
    });
</script>

<Header profileData={profileData} hideSearchBar={isSearchBarHidden} />
{@render children()}
<Footer profileData={profileData} />
