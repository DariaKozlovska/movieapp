import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { auth } from '@/config/firebase';
import {
  finishSession,
  likeMovie,
  resumeSwiping,
  subscribeSession,
} from '@/services/sessionService';
import {
  getRoomProgress,
  setRoomDeck,
  setRoomProgress,
} from '@/services/roomMovieCache';
import type { Movie } from '@/models/Movie';
import type { Session } from '@/types/session';

/**
 * Room version of useSwipeMovies: same shape (movies / swipeLeft / swipeRight),
 * but the deck comes from the session and every like is sent to the room.
 */
export default function useRoomSwipeViewModel(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  // everybody swipes at their own pace through the same deck
  const [index, setIndex] = useState(() => getRoomProgress(sessionId));
  const finishedHandled = useRef(false);

  const uid = auth.currentUser?.uid ?? null;

  useEffect(() => subscribeSession(sessionId, setSession), [sessionId]);

  const deck: Movie[] = useMemo(() => session?.movies ?? [], [session?.movies]);

  // so the details screen can find these movies
  useEffect(() => setRoomDeck(deck), [deck]);

  // remember how far I got, in case I leave the screen and come back
  useEffect(() => setRoomProgress(sessionId, index), [sessionId, index]);

  const isAdmin = !!uid && session?.adminId === uid;
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

  // everybody liked the same movie -> the match modal is shown
  const matchedMovie =
    session?.status === 'active' && session.matchedMovieId != null
      ? (deck.find((m) => m.id === session.matchedMovieId) ?? null)
      : null;

  // admin ended the session -> everybody goes back to the rooms screen
  useEffect(() => {
    if (session?.status !== 'finished' || finishedHandled.current) return;
    finishedHandled.current = true;

    if (!isAdmin) {
      Alert.alert(
        'Sesja zakończona',
        'Administrator zakończył wspólne wybieranie filmu.',
      );
    }
    router.dismissAll();
  }, [session?.status, isAdmin]);

  const continueSwiping = async () => {
    const result = await resumeSwiping(sessionId);
    if (!result.success) Alert.alert('Błąd', result.message);
  };

  const finishNow = async () => {
    const result = await finishSession(sessionId);
    if (!result.success) Alert.alert('Błąd', result.message);
  };

  const confirmFinish = () => {
    Alert.alert(
      'Zakończyć wybieranie?',
      'Sesja zostanie zamknięta dla wszystkich uczestników.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Zakończ', style: 'destructive', onPress: finishNow },
      ],
    );
  };

  return {
    loading: session === null,
    code: session?.code ?? null,
    isAdmin,
    movies,
    matchedMovie,
    swipeLeft,
    swipeRight,
    continueSwiping,
    finishNow,
    confirmFinish,
  };
}