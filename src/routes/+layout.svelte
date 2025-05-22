<script>
    import Footer from "../lib/components/ui/Footer.svelte";

    let { children } = $props();
    import "../app.css";
    import Header from "../lib/components/ui/Header.svelte";

    let profileData = 1;
</script>

<Header profileData={profileData} />
<div class="h-screen">
    {@render children()}
</div>
<Footer profileData={profileData} />
