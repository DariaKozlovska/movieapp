import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { auth } from '@/config/firebase';
import { formatSeconds, useCountdown } from '@/hooks/useCountdown';
import {
  SESSION_TTL_MS,
  closeSession,
  startSession,
  subscribeParticipants,
  subscribeSession,
} from '@/services/sessionService';
import { buildMovieDeck } from '@/services/movieDeck';
import type { Participant, Session } from '@/types/session';

// Guests wait a few seconds longer than the admin's clock before they give up
// (only matters when the admin's app is closed and cannot close the room).
const GUEST_EXPIRY_GRACE_MS = 5000;

type Options = {
  /** The user left on purpose, or the game is finished. */
  onLeave: () => void;
  /** Time is up and the admin did not start (or the admin closed the room). */
  onExpired: () => void;
};

export default function useLobbyViewModel(
  sessionId: string,
  { onLeave, onExpired }: Options,
) {
  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [graceOver, setGraceOver] = useState(false);
  const overHandled = useRef(false);

  const uid = auth.currentUser?.uid ?? null;

  useEffect(() => subscribeSession(sessionId, setSession), [sessionId]);
  useEffect(
    () => subscribeParticipants(sessionId, setParticipants),
    [sessionId],
  );

  const isWaiting = session?.status === 'waiting';
  const isAdmin = !!uid && session?.adminId === uid;
  const joinedCount = session?.participantIds.length ?? 0;

  const { secondsLeft, isExpired } = useCountdown(
    isWaiting && session ? session.expiresAt.toMillis() : null,
  );

  useEffect(() => {
    if (!isExpired) {
      setGraceOver(false);
      return;
    }
    const id = setTimeout(() => setGraceOver(true), GUEST_EXPIRY_GRACE_MS);
    return () => clearTimeout(id);
  }, [isExpired]);

  // The room is over for everybody when the time is up without a start
  const isOver =
    session?.status === 'expired' ||
    (isWaiting && isExpired && (isAdmin || graceOver));

  useEffect(() => {
    if (!isOver || overHandled.current) return;
    overHandled.current = true;

    if (isAdmin && isWaiting) closeSession(sessionId);
    onExpired();
  }, [isOver, isAdmin, isWaiting, sessionId, onExpired]);

  // Admin started the session -> everybody goes to the swipe screen
  useEffect(() => {
    if (session?.status === 'active') {
      router.push({ pathname: '/room-swipe', params: { sessionId } });
    }
  }, [session?.status, sessionId]);

  // Somebody found a match -> this room is done, back to the forms
  useEffect(() => {
    if (session?.status === 'finished') onLeave();
  }, [session?.status, onLeave]);

  const canStart = isAdmin && isWaiting && !isExpired && joinedCount >= 2;
  const isFull = !!session && joinedCount >= session.maxParticipants;

  const handleStart = async () => {
    if (!uid || !session || isStarting) return;

    if (!canStart) {
      Alert.alert(
        'Poczekaj na uczestników',
        'Do rozpoczęcia potrzebna jest co najmniej jedna dodatkowa osoba.',
      );
      return;
    }

    setIsStarting(true);

    try {
      // the admin builds ONE deck for everybody (same movies, same order)
      const movies = await buildMovieDeck(session.genre);

      if (movies.length === 0) {
        Alert.alert('Błąd', 'Nie udało się pobrać filmów. Spróbuj ponownie.');
        return;
      }

      const result = await startSession(sessionId, uid, movies);
      if (!result.success) Alert.alert('Błąd', result.message);
    } catch (error) {
      console.error('handleStart failed', error);
      Alert.alert('Błąd', 'Nie udało się rozpocząć sesji.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleReturnToSwipe = () => {
    router.push({ pathname: '/room-swipe', params: { sessionId } });
  };

  const handleLeave = () => {
    if (isAdmin && isWaiting) closeSession(sessionId);
    onLeave();
  };

  return {
    session,
    participants,
    isAdmin,
    isWaiting,
    isActive: session?.status === 'active',
    isFull,
    isStarting,
    canStart,
    secondsLeft,
    timeLabel: formatSeconds(secondsLeft),
    progress: Math.min(1, secondsLeft / (SESSION_TTL_MS / 1000)),
    handleStart,
    handleReturnToSwipe,
    handleLeave,
  };
}