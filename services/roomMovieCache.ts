import type { Movie } from '@/models/Movie';

/**
 * Small in-memory helper for the room swipe screen:
 *  - the room deck, so the movie details screen can find these movies
 *  - how far each person got in the deck (survives leaving the screen)
 */

let deck = new Map<number, Movie>();
const progress = new Map<string, number>();

export function setRoomDeck(movies: Movie[]) {
  deck = new Map<number, Movie>(
    movies.map((movie) => [movie.id, movie] as [number, Movie]),
  );
}

export function getRoomMovie(id: number): Movie | undefined {
  return deck.get(id);
}

export function getRoomProgress(sessionId: string): number {
  return progress.get(sessionId) ?? 0;
}

export function setRoomProgress(sessionId: string, index: number) {
  progress.set(sessionId, index);
}