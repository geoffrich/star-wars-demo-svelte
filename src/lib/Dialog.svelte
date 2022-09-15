<script>
  import IconButton from "./IconButton.svelte";
  import close from "./icons/x-mark.svg?raw";

  /** @type {HTMLDialogElement} */
  let dialog;

  export function open() {
    dialog.showModal();
  }
</script>

<dialog bind:this={dialog}>
  <slot />
  <form method="dialog">
    <IconButton label="close" --background="black">{@html close}</IconButton>
  </form>
</dialog>

<style>
  dialog {
    max-width: 600px;
    position: relative;
  }

  form {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  dialog::backdrop {
    background-color: grey;
    opacity: 0.3;
  }
</style>
