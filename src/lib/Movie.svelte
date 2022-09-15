<script>
  import IconButton from "./IconButton.svelte";
  import Dialog from "./Dialog.svelte";
  import info from "./icons/information-circle.svg?raw";

  /** @type {typeof import('../movies.json')[0]}*/
  export let movie;

  /** @type {Dialog} */
  let dialog;

  let score = movie.vote_average;

  function showDetails() {
    dialog.open();
  }
</script>

<div class="container">
  <img src={movie.poster_path} alt="{movie.title} poster" />
  <div class="buttons">
    <slot name="buttons" />
    <IconButton label="info" on:click={showDetails}>
      {@html info}
    </IconButton>
  </div>
  <div class="release">{movie.release_date}</div>
</div>
<h2>
  {movie.title}
  <span
    class="score"
    class:high={score >= 8}
    class:mid={score >= 6 && score < 8}
    class:low={score < 6}>({score})</span
  >
</h2>

<Dialog bind:this={dialog}>
  <h2>{movie.title}</h2>
  <p>{movie.overview}</p>
</Dialog>

<style>
  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 400;
  }

  .container {
    position: relative;
    max-width: 180px;
    margin: 0 auto;
  }

  .container:hover .buttons,
  .container:focus-within .buttons {
    opacity: 1;
  }

  .buttons {
    opacity: 0;
    position: absolute;
    bottom: 1rem;
    left: 0.5rem;
  }

  .release {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding: 0.3rem;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .score {
    font-size: 0.8em;
    font-weight: 700;
  }

  .high {
    color: forestgreen;
  }

  .mid {
    color: goldenrod;
  }

  .low {
    color: crimson;
  }
</style>
