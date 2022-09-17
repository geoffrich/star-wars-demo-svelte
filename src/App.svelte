<script>
  import { fade } from "svelte/transition";

  import movies from "./movies.json";
  import trash from "./lib/icons/trash.svg?raw";
  import plus from "./lib/icons/plus.svg?raw";
  import arrowUp from "./lib/icons/arrow-up.svg?raw";
  import arrowDown from "./lib/icons/arrow-down.svg?raw";

  import Movie from "./lib/Movie.svelte";
  import IconButton from "./lib/IconButton.svelte";
  import { pageTransition } from "./lib/transition";

  let sortOptions = ["release_date", "title", "vote_average"];
  let sortBy = sortOptions[0];
  let addToStart = true;

  let sorted, filtered;
  sorted = filtered = movies;

  $: sorted = sort(sortBy);

  function sort(sortBy) {
    if (sortBy === "vote_average") {
      return movies.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
    } else {
      return movies.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }
  }

  let filter = "";

  $: pageTransition(() => {
    filtered = sorted.filter(
      (m) =>
        m.title.toLowerCase().includes(filter.toLowerCase()) &&
        !selected.includes(m.id)
    );
  });

  /** @type {number[]} */
  let selected = [movies[0].id];

  /**
   * @param id {number}
   */
  function select(id) {
    if (addToStart) {
      selected.unshift(id);
    } else {
      selected.push(id);
    }
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

<div class="layout">
  <div>
    <p class="alert">
      Experimental branch using the <a
        href="https://developer.chrome.com/blog/shared-element-transitions-for-spas/"
        >Shared Element Transitions API</a
      >. You will need the latest Chrome with the documentTransition API flag
      enabled in <code>chrome://flags</code>. Since the API is experimental,
      this may break at any time.
    </p>
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
      <button on:click={() => pageTransition(reset)}>Reset</button>
    </div>

    <ul class="all-movies">
      {#each filtered as movie (movie.id)}
        {@const key = movie.id}
        <li class="movie" style:--tag="movie-{key}">
          <Movie {movie}>
            <svelte:fragment slot="buttons">
              <IconButton
                on:click={() => pageTransition(() => select(movie.id))}
                label="select">{@html plus}</IconButton
              >
            </svelte:fragment>
          </Movie>
        </li>
      {/each}
    </ul>
  </div>

  <div>
    <h2>Selected</h2>
    <label>
      <input type="checkbox" bind:checked={addToStart} />
      Add to start?
    </label>
    <ul class="selected">
      {#each selected as s, idx (s)}
        {@const key = s}
        {@const movie = movies.find((m) => m.id === s)}
        <li class="movie" style:--tag="movie-{key}">
          <Movie {movie}>
            <svelte:fragment slot="buttons">
              <IconButton
                on:click={() => pageTransition(() => deselect(s))}
                label="remove">{@html trash}</IconButton
              >
              <IconButton
                label="move up"
                on:click={() => pageTransition(() => moveUp(s))}
                disabled={idx === 0}
              >
                {@html arrowUp}
              </IconButton>
              <IconButton
                label="move down"
                on:click={() => pageTransition(() => moveDown(s))}
                disabled={idx === selected.length - 1}
              >
                {@html arrowDown}
              </IconButton>
            </svelte:fragment>
          </Movie>
        </li>
      {:else}
        <li in:fade={{ duration: 250 }}>Nothing added yet!</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .alert {
    background-color: lightcoral;
    padding: 0.5rem;
    border-radius: 4px;
  }

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
    align-items: center;
  }

  .movie {
    contain: paint;
    page-transition-tag: var(--tag);
  }
</style>
