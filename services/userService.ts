import { doc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

import { db } from '@/config/firebase';

/**
 * The name the person typed at registration.
 * 1) Firebase Auth profile (displayName)
 * 2) the `users/{uid}` document in Firestore
 * 3) fallback "Gość"
 */
export async function getAccountName(user: User): Promise<string> {
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
    console.warn('getAccountName failed', error);
  }

  return 'Gość';
}