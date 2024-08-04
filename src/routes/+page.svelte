<script>
    import { marked } from "marked";
    import { onMount } from "svelte";
    export let form;

    let loading = false;

    onMount(() => {
        const formElement = document.querySelector("form");

        if (formElement) {
            formElement.addEventListener("submit", () => {
                loading = true;
            });
        }
    });

    $: if (form?.success || form?.error) {
        loading = false;
    }
</script>

<form method="post">
    <input
        type="text"
        name="username"
        placeholder="Enter your github username"
        required
    />
    <select name="lang" required aria-label="Select output language">
        <option disabled selected value="">Select output language</option>
        <option value="en">English</option>
        <option value="id">Indonesia</option>
    </select>
    <button type="submit">Praise</button>
</form>

<dialog open={loading}>
    <span aria-busy="true">Loading...</span>
</dialog>

{#if form?.success || form?.error}
    <article>
        {@html marked(form.text ?? form.error)}
    </article>
{/if}
