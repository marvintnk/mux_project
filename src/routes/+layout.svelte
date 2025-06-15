<script>
    import "../app.css";
    import Footer from "$lib/components/ui/Footer.svelte";
    let { children } = $props();
</script>

{@render children()}
<Footer/>
