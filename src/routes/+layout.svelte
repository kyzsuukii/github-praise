<script>
    import "@picocss/pico/css/pico.min.css";
</script>

<svelte:head>
    <title>Github Praise</title>
</svelte:head>

<header class="container">
    <nav>
        <ul>
            <li><h1>Github Praise</h1></li>
        </ul>
        <ul>
            <li>by <a href="https://github.com/kyzsuukii">hikki</a></li>
        </ul>
    </nav>
</header>
<main class="container">
    <slot />
</main>
