import { useEffect, useMemo, useState } from 'react';

import { auth } from '@/config/firebase';
import { likeMovie, subscribeSession } from '@/services/sessionService';
import type { Movie } from '@/models/Movie';
import type { Session } from '@/types/session';

/**
 * Room version of useSwipeMovies: same shape (movies / swipeLeft / swipeRight),
 * but the deck comes from the session and every like is sent to the room.
 */
export default function useRoomSwipeViewModel(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  // everybody swipes at their own pace through the same deck
  const [index, setIndex] = useState(0);

  const uid = auth.currentUser?.uid ?? null;

  useEffect(() => subscribeSession(sessionId, setSession), [sessionId]);

  const deck: Movie[] = session?.movies ?? [];
  const movies = useMemo(() => deck.slice(index), [deck, index]);

  const swipeLeft = () => {
    if (movies.length === 0) return;
    setIndex((i) => i + 1);
  };

  const swipeRight = () => {
    const movie = movies[0];
    if (!movie || !uid) return;

    setIndex((i) => i + 1);
    likeMovie(sessionId, uid, movie.id);
  };

  const matchedMovie =
    session?.matchedMovieId != null
      ? (deck.find((m) => m.id === session.matchedMovieId) ?? null)
      : null;

  return {
    loading: session === null,
    movies,
    matchedMovie,
    swipeLeft,
    swipeRight,
  };
}