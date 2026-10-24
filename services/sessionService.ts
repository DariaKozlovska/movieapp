import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { generateCode } from '@/utils/generateCode';
import type { Movie } from '@/models/Movie';
import type { Participant, ServiceResult, Session } from '@/types/session';

export const SESSION_TTL_MS = 5 * 60 * 1000; // how long the code works
const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000; // for the optional TTL policy
const MAX_CODE_ATTEMPTS = 5;

const GENERIC_ERROR = 'Coś poszło nie tak. Spróbuj ponownie.';

const ok = <T>(data: T): ServiceResult<T> => ({ success: true, data });
const fail = (message: string): ServiceResult<never> => ({
  success: false,
  message,
});

/* -------------------------------------------------------------------------- */
/* Create                                                                      */
/* -------------------------------------------------------------------------- */

type CreateSessionInput = {
  adminId: string;
  adminName: string;
  maxParticipants: number;
  genre?: number | null;
  invitedNames?: string[];
};

export async function createSession(
  input: CreateSessionInput,
): Promise<ServiceResult<{ sessionId: string; code: string }>> {
  const {
    adminId,
    adminName,
    maxParticipants,
    genre = null,
    invitedNames = [],
  } = input;

  try {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = generateCode();
      const codeRef = doc(db, 'sessionCodes', code);
      const sessionRef = doc(collection(db, 'sessions'));

      const now = Date.now();
      const expiresAt = Timestamp.fromMillis(now + SESSION_TTL_MS);
      const deleteAt = Timestamp.fromMillis(
        now + SESSION_TTL_MS + CLEANUP_AFTER_MS,
      );

      // The code is reserved in the same transaction as the session,
      // so two rooms can never get the same active code.
      const codeTaken = await runTransaction(db, async (tx) => {
        const existing = await tx.get(codeRef);

        if (
          existing.exists() &&
          existing.data().expiresAt.toMillis() > Date.now()
        ) {
          return true;
        }

        tx.set(codeRef, { sessionId: sessionRef.id, expiresAt, deleteAt });

        tx.set(sessionRef, {
          code,
          adminId,
          maxParticipants,
          participantCount: null,
          genre,
          invitedNames,
          status: 'waiting',
          expiresAt,
          deleteAt,
          participantIds: [adminId],
          movies: [],
          matchedMovieId: null,
          createdAt: serverTimestamp(),
        });

        tx.set(doc(sessionRef, 'participants', adminId), {
          name: adminName,
          isAdmin: true,
          joinedAt: serverTimestamp(),
        });

        return false;
      });

      if (!codeTaken) return ok({ sessionId: sessionRef.id, code });
    }

    return fail('Nie udało się wygenerować kodu. Spróbuj ponownie.');
  } catch (error) {
    console.error('createSession failed', error);
    return fail(GENERIC_ERROR);
  }
}

/* -------------------------------------------------------------------------- */
/* Join                                                                        */
/* -------------------------------------------------------------------------- */

export async function joinSession(
  rawCode: string,
  uid: string,
  name: string,
): Promise<ServiceResult<{ sessionId: string }>> {
  const code = rawCode.trim().toUpperCase();

  try {
    return await runTransaction(db, async (tx) => {
      const codeSnap = await tx.get(doc(db, 'sessionCodes', code));
      if (!codeSnap.exists()) {
        return fail('Nie znaleziono pokoju o tym kodzie.');
      }

      const sessionId: string = codeSnap.data().sessionId;
      const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await tx.get(sessionRef);
      if (!sessionSnap.exists()) {
        return fail('Nie znaleziono pokoju o tym kodzie.');
      }

      const session = sessionSnap.data() as Omit<Session, 'id'>;

      // already in the room (e.g. reopened the app) - just let them in
      if (session.participantIds.includes(uid)) {
        return ok({ sessionId });
      }

      if (session.status !== 'waiting' || session.expiresAt.toMillis() < Date.now()) {
        return fail('Ten kod wygasł.');
      }

      if (session.participantIds.length >= session.maxParticipants) {
        return fail('Ten pokój jest już pełny.');
      }

      tx.update(sessionRef, { participantIds: arrayUnion(uid) });
      tx.set(doc(sessionRef, 'participants', uid), {
        name,
        isAdmin: false,
        joinedAt: serverTimestamp(),
      });

      return ok({ sessionId });
    });
  } catch (error) {
    console.error('joinSession failed', error);
    return fail(GENERIC_ERROR);
  }
}

/* -------------------------------------------------------------------------- */
/* Start / close                                                               */
/* -------------------------------------------------------------------------- */

export async function startSession(
  sessionId: string,
  adminId: string,
  movies: Movie[],
): Promise<ServiceResult<null>> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);

    return await runTransaction(db, async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists()) return fail('Nie znaleziono pokoju.');

      const session = snap.data() as Omit<Session, 'id'>;

      if (session.adminId !== adminId) {
        return fail('Tylko administrator może rozpocząć sesję.');
      }
      if (session.status !== 'waiting') {
        return fail('Ta sesja została już rozpoczęta lub zamknięta.');
      }
      if (session.expiresAt.toMillis() < Date.now()) {
        return fail('Czas na rozpoczęcie sesji minął.');
      }
      if (session.participantIds.length < 2) {
        return fail('Do rozpoczęcia potrzebna jest co najmniej jedna osoba.');
      }

      tx.update(sessionRef, {
        status: 'active',
        movies,
        participantCount: session.participantIds.length,
      });

      return ok(null);
    });
  } catch (error) {
    console.error('startSession failed', error);
    return fail(GENERIC_ERROR);
  }
}

/** Admin cancels the room or the code expired with nobody in it. */
export async function closeSession(sessionId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'sessions', sessionId), { status: 'expired' });
  } catch (error) {
    console.warn('closeSession failed', error);
  }
}

/* -------------------------------------------------------------------------- */
/* Realtime listeners                                                          */
/* -------------------------------------------------------------------------- */

export function subscribeSession(
  sessionId: string,
  onChange: (session: Session | null) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'sessions', sessionId),
    (snap) => {
      onChange(
        snap.exists()
          ? { id: snap.id, ...(snap.data() as Omit<Session, 'id'>) }
          : null,
      );
    },
    (error) => console.warn('subscribeSession error', error),
  );
}

export function subscribeParticipants(
  sessionId: string,
  onChange: (participants: Participant[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'sessions', sessionId, 'participants'),
    orderBy('joinedAt'),
  );

  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name as string,
          isAdmin: Boolean(d.data().isAdmin),
        })),
      );
    },
    (error) => console.warn('subscribeParticipants error', error),
  );
}

/* -------------------------------------------------------------------------- */
/* Swiping                                                                     */
/* -------------------------------------------------------------------------- */

/** Call on every "like". A match is registered when everybody liked the movie. */
export async function likeMovie(
  sessionId: string,
  uid: string,
  movieId: number,
): Promise<ServiceResult<{ matched: boolean }>> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    const likeRef = doc(sessionRef, 'likes', String(movieId));

    const matched = await runTransaction(db, async (tx) => {
      const sessionSnap = await tx.get(sessionRef);
      const likeSnap = await tx.get(likeRef);

      const session = sessionSnap.data() as Omit<Session, 'id'> | undefined;
      if (!session || session.status !== 'active') return false;

      const likedBy = new Set<string>(
        likeSnap.exists() ? (likeSnap.data().likedBy as string[]) : [],
      );
      likedBy.add(uid);

      tx.set(likeRef, { likedBy: [...likedBy] });

      const everyoneLiked =
        session.participantCount !== null &&
        likedBy.size >= session.participantCount;

      if (everyoneLiked && session.matchedMovieId === null) {
        tx.update(sessionRef, { matchedMovieId: movieId, status: 'finished' });
        return true;
      }

      return false;
    });

    return ok({ matched });
  } catch (error) {
    console.error('likeMovie failed', error);
    return fail(GENERIC_ERROR);
  }
}