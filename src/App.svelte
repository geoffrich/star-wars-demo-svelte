<script>
  import { flip } from "svelte/animate";
  import { fade, crossfade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import movies from "./movies.json";
  import trash from "./lib/icons/trash.svg?raw";
  import plus from "./lib/icons/plus.svg?raw";
  import arrowUp from "./lib/icons/arrow-up.svg?raw";
  import arrowDown from "./lib/icons/arrow-down.svg?raw";

  import Movie from "./lib/Movie.svelte";
  import IconButton from "./lib/IconButton.svelte";

  const [send, receive] = crossfade({
    duration: 500,
    easing: quintOut,
    fallback: (node) => fade(node, { duration: 300 }),
  });

  let sortOptions = ["release_date", "title", "vote_average"];
  let sortBy = sortOptions[0];

  $: sorted = movies.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  let filter = "";

  $: filtered = sorted.filter(
    (m) =>
      m.title.toLowerCase().includes(filter.toLowerCase()) &&
      !selected.includes(m.id)
  );

  /** @type {number[]} */
  let selected = [movies[0].id];

  /**
   * @param id {number}
   */
  function select(id) {
    selected.push(id);
    selected = selected;
  }

  /**
   * @param id {number}
   */
  function deselect(id) {
    selected = selected.filter((s) => s !== id);
  }

  /**
   * @param id {number}
   */
  function moveUp(id) {
    const idx = selected.indexOf(id);
    deselect(id);
    selected.splice(idx - 1, 0, id);
  }

  /**
   * @param id {number}
   */
  function moveDown(id) {
    const idx = selected.indexOf(id);
    deselect(id);
    selected.splice(idx + 1, 0, id);
  }

  function reset() {
    selected = [];
    filter = "";
  }
</script>

<h1>Star Wars</h1>

<p>Create your own Star Wars watch order!</p>

<div>
  <label for="filter">Filter</label>
  <input id="filter" bind:value={filter} />
  <label for="sort">Sort by</label>
  <select id="sort" bind:value={sortBy}>
    {#each sortOptions as opt}
      <option value={opt}>{opt.replace("_", " ")}</option>
    {/each}
  </select>
  <button on:click={reset}>Reset</button>
</div>

<div class="layout">
  <ul class="all-movies">
    {#each filtered as movie (movie.id)}
      {@const key = movie.id}
      <li
        animate:flip={{ duration: 300 }}
        in:send={{ key }}
        out:receive={{ key }}
      >
        <Movie {movie}>
          <svelte:fragment slot="buttons">
            <IconButton on:click={() => select(movie.id)} label="select"
              >{@html plus}</IconButton
            >
          </svelte:fragment>
        </Movie>
      </li>
    {/each}
  </ul>

  <div>
    <h2>Selected</h2>
    <ul class="selected">
      {#each selected as s, idx (s)}
        {@const key = s}
        {@const movie = movies.find((m) => m.id === s)}
        <li
          in:send={{ key }}
          out:receive={{ key }}
          animate:flip={{ duration: 300 }}
        >
          <Movie {movie}>
            <svelte:fragment slot="buttons">
              <IconButton on:click={() => deselect(s)} label="remove"
                >{@html trash}</IconButton
              >
              <IconButton
                label="move up"
                on:click={() => moveUp(s)}
                disabled={idx === 0}
              >
                {@html arrowUp}
              </IconButton>
              <IconButton
                label="move down"
                on:click={() => moveDown(s)}
                disabled={idx === selected.length - 1}
              >
                {@html arrowDown}
              </IconButton>
            </svelte:fragment>
          </Movie>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  .all-movies {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    list-style: none;
    gap: 1rem;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 20%;
    align-items: start;
    gap: 2rem;
  }

  .selected {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
