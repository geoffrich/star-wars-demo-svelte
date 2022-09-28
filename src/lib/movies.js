import movies from "./movies.json";

/** @type {Record<number, typeof movies[0]>} */
let movieMap = {};
for (const movie of movies) {
  movieMap[movie.id] = movie;
}

export default movieMap;
