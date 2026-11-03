import { doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

import { db } from '@/config/firebase';

/**
 * The name the person typed at registration (or changed later), or "".
 * 1) Firebase Auth profile (displayName)
 * 2) the `users/{uid}` document in Firestore
 */
export async function getStoredName(user: User): Promise<string> {
  const fromProfile = user.displayName?.trim();
  if (fromProfile) return fromProfile;

  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    const data = snap.data();

    // TODO: keep only the field your registration really writes
    const candidate =
      data?.name ?? data?.displayName ?? data?.firstName ?? data?.username;

    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  } catch (error) {
    console.warn('getStoredName failed', error);
  }

  return '';
}

/** Same as getStoredName, but falls back to "Gość" (used in rooms). */
export async function getAccountName(user: User): Promise<string> {
  return (await getStoredName(user)) || 'Gość';
}