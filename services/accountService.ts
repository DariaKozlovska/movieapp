import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  type User,
} from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/config/firebase';

export type AccountResult =
  | { success: true; message?: string }
  | { success: false; message: string };

// Field in `users/{uid}` where the name is stored (keep it the same as in
// your registration code, see also services/userService.ts)
const USER_NAME_FIELD = 'name';

// Firestore collections that keep one document per user (document id = uid).
// Remove from this list what you don't use, add your own collections.
const USER_DOCUMENT_COLLECTIONS = [
  'users',
  'user',
  'likedMovies',
  'watchedMovies',
  'pushTokens',
];

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (message: string): AccountResult => ({ success: false, message });

function errorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;

  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Obecne hasło jest nieprawidłowe.';
    case 'auth/weak-password':
      return `Nowe hasło jest za słabe (minimum ${MIN_PASSWORD_LENGTH} znaków).`;
    case 'auth/email-already-in-use':
      return 'Ten adres e-mail jest już używany.';
    case 'auth/invalid-email':
      return 'Podaj poprawny adres e-mail.';
    case 'auth/requires-recent-login':
      return 'Ze względów bezpieczeństwa zaloguj się ponownie i spróbuj jeszcze raz.';
    case 'auth/too-many-requests':
      return 'Zbyt wiele prób. Spróbuj ponownie za chwilę.';
    case 'auth/network-request-failed':
      return 'Brak połączenia z internetem.';
    case 'auth/operation-not-allowed':
      return 'Ta operacja jest wyłączona w ustawieniach Firebase.';
    default:
      console.warn('account error', error);
      return 'Coś poszło nie tak. Spróbuj ponownie.';
  }
}

// Changing the e-mail or the password needs a fresh login, so the user
// confirms with the current password first.
async function reauthenticate(user: User, currentPassword: string) {
  const credential = EmailAuthProvider.credential(
    user.email as string,
    currentPassword,
  );
  await reauthenticateWithCredential(user, credential);
}

/* -------------------------------------------------------------------------- */

export async function changeName(rawName: string): Promise<AccountResult> {
  const name = rawName.trim();

  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return fail(
      `Imię musi mieć od ${MIN_NAME_LENGTH} do ${MAX_NAME_LENGTH} znaków.`,
    );
  }

  const user = auth.currentUser;
  if (!user) return fail('Musisz być zalogowany.');

  try {
    await updateProfile(user, { displayName: name });
  } catch (error) {
    return fail(errorMessage(error));
  }

  // keep the Firestore profile in sync (the Auth name is the main one)
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      { [USER_NAME_FIELD]: name },
      { merge: true },
    );
  } catch (error) {
    console.warn('could not sync name to Firestore', error);
  }

  return { success: true, message: 'Imię zostało zmienione.' };
}

export async function changeEmail(
  rawEmail: string,
  currentPassword: string,
): Promise<AccountResult> {
  const email = rawEmail.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) return fail('Podaj poprawny adres e-mail.');
  if (!currentPassword) return fail('Podaj obecne hasło.');

  const user = auth.currentUser;
  if (!user?.email) return fail('Musisz być zalogowany.');

  if (email === user.email.toLowerCase()) {
    return fail('To jest już Twój adres e-mail.');
  }

  try {
    await reauthenticate(user, currentPassword);
    // Firebase sends a link to the NEW address; the e-mail changes after
    // the person clicks it.
    await verifyBeforeUpdateEmail(user, email);

    return {
      success: true,
      message: `Wysłaliśmy link potwierdzający na adres ${email}. E-mail zmieni się po kliknięciu w ten link.`,
    };
  } catch (error) {
    return fail(errorMessage(error));
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<AccountResult> {
  if (!currentPassword) return fail('Podaj obecne hasło.');

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return fail(`Nowe hasło musi mieć minimum ${MIN_PASSWORD_LENGTH} znaków.`);
  }
  if (newPassword === currentPassword) {
    return fail('Nowe hasło musi się różnić od obecnego.');
  }
  if (newPassword !== confirmPassword) {
    return fail('Nowe hasła nie są takie same.');
  }

  const user = auth.currentUser;
  if (!user?.email) return fail('Musisz być zalogowany.');

  try {
    await reauthenticate(user, currentPassword);
    await updatePassword(user, newPassword);

    return { success: true, message: 'Hasło zostało zmienione.' };
  } catch (error) {
    return fail(errorMessage(error));
  }
}

/* -------------------------------------------------------------------------- */

/**
 * Deletes the user's data and then the account itself.
 * Needs the current password (a fresh login is required for this).
 */
export async function deleteAccount(
  currentPassword: string,
): Promise<AccountResult> {
  if (!currentPassword) return fail('Podaj obecne hasło, aby usunąć konto.');

  const user = auth.currentUser;
  if (!user?.email) return fail('Musisz być zalogowany.');

  try {
    await reauthenticate(user, currentPassword);
  } catch (error) {
    return fail(errorMessage(error));
  }

  // Data first: once the account is gone, Firestore rules would reject
  // these deletes because the user is no longer signed in.
  const uid = user.uid;

  try {
    await Promise.all(
      USER_DOCUMENT_COLLECTIONS.map((name) => deleteDoc(doc(db, name, uid))),
    );
  } catch (error) {
    console.error('could not delete user data', error);
    return fail('Nie udało się usunąć danych konta. Spróbuj ponownie.');
  }

  try {
    await deleteUser(user);
  } catch (error) {
    return fail(errorMessage(error));
  }

  return { success: true };
}