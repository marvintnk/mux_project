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
        const url = new URL(document.URL);
        if(hideSearchBarAt.includes(url.pathname)) {
            isSearchBarHidden = true;
        }
    });
</script>

<Header profileData={profileData} hideSearchBar={isSearchBarHidden} />
{@render children()}
<Footer profileData={profileData} />
