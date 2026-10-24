import type { Timestamp } from 'firebase/firestore';

import type { Movie } from '@/models/Movie';

export type SessionStatus = 'waiting' | 'active' | 'finished' | 'expired';

export type Session = {
  id: string;
  code: string;
  adminId: string;
  maxParticipants: number;
  /** Set when the admin starts the session (how many people actually swipe). */
  participantCount: number | null;
  /** TMDB genre id chosen when the room was created (null = all). */
  genre: number | null;
  /** Names typed by the admin for the other people (lobby placeholders only). */
  invitedNames: string[];
  status: SessionStatus;
  expiresAt: Timestamp;
  participantIds: string[];
  /** The shared deck: everybody swipes the same movies in the same order. */
  movies: Movie[];
  matchedMovieId: number | null;
  /** Movies that were already matched (never offered as a match twice). */
  matchedMovieIds: number[];
};

export type Participant = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };