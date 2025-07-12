<script>
    export let text;
    export let additionalClasses;
</script>

<p class="{additionalClasses}" style="{additionalClasses}">{text}</p>

<style>
    p {
        background: linear-gradient(
            to right,
            rgb(46, 182, 44),
            rgb(87, 200, 77),
            rgb(131, 212, 117),
            rgb(171, 224, 152),
            rgb(131, 212, 117),
            rgb(87, 200, 77),
            rgb(46, 182, 44)
        );

        color: transparent;
        background-clip: text;
        background-size: 200% auto;
        animation: gradientAnimation 3s linear infinite;
    }

    @keyframes gradientAnimation {
        0% {
            background-position: 200% 50%;
        }

        100% {
            background-position: 0 50%;
        }
    }
</style>
