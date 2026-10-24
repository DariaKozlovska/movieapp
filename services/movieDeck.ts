import { getMovies } from '@/api/tmdbApi';
import type { Movie } from '@/models/Movie';

const DECK_SIZE = 25;
const PAGES_TO_FETCH = [1, 2];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds the deck for a room: ~25 unique movies for the chosen genre,
 * shuffled once. The result is saved in the session, so every phone swipes
 * exactly the same movies in the same order.
 */
export async function buildMovieDeck(genre: number | null): Promise<Movie[]> {
  const pages = await Promise.all(
    PAGES_TO_FETCH.map((page) => getMovies(genre, page)),
  );

  const unique = new Map<number, Movie>();
  for (const movie of pages.flat()) {
    // cards need a poster; skip duplicates between pages
    if (movie.poster_path && !unique.has(movie.id)) {
      unique.set(movie.id, movie);
    }
  }

  return shuffle([...unique.values()])
    .slice(0, DECK_SIZE)
    // Firestore rejects `undefined` values - this strips them
    .map((movie) => JSON.parse(JSON.stringify(movie)) as Movie);
}