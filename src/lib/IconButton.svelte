<script>
  export let label;
  export let disabled = false;
</script>

<button on:click aria-label={label} {disabled}>
  <slot />
</button>

<style>
  button {
    background-color: var(--background, cornflowerblue);
    color: white;
    border-radius: 50%;
    width: 1.8rem;
    height: 1.8rem;
    padding: 3px;
  }

  button:disabled {
    filter: grayscale(60%);
    cursor: not-allowed;
  }
</style>
