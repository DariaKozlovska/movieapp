import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { auth } from '@/config/firebase';
import { useLikedMovies } from '@/contexts/LikedMoviesContext';
import { useWatchedMovies } from '@/contexts/WatchedMoviesContext';
import {
  changeEmail,
  changeName,
  changePassword,
  deleteAccount,
  type AccountResult,
} from '@/services/accountService';
import { getStoredName } from '@/services/userService';

type Busy = 'name' | 'email' | 'password' | 'delete' | null;

export default function usePersonalDataViewModel() {
  const user = auth.currentUser;

  const { likedMovies, removeLikedMovie } = useLikedMovies();
  const { watchedMovies, removeWatchedMovie } = useWatchedMovies();

  const [name, setName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [deletePassword, setDeletePassword] = useState('');

  const [busy, setBusy] = useState<Busy>(null);

  useEffect(() => {
    if (!user) return;

    // name saved at registration may live only in Firestore
    if (!user.displayName) {
      getStoredName(user).then((stored) => {
        if (stored) setName(stored);
      });
    }

    // picks up a new e-mail after the verification link was clicked
    user
      .reload()
      .then(() => setEmail(auth.currentUser?.email ?? ''))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (
    which: Exclude<Busy, null>,
    action: () => Promise<AccountResult>,
    onSuccess?: () => void,
  ) => {
    if (busy) return;

    setBusy(which);
    const result = await action();
    setBusy(null);

    if (!result.success) {
      Alert.alert('Nie udało się', result.message);
      return;
    }

    onSuccess?.();
    if (result.message) Alert.alert('Gotowe', result.message);
  };

  const saveName = () => run('name', () => changeName(name));

  const saveEmail = () =>
    run('email', () => changeEmail(newEmail, emailPassword), () => {
      setNewEmail('');
      setEmailPassword('');
    });

  const savePassword = () =>
    run(
      'password',
      () => changePassword(currentPassword, newPassword, confirmPassword),
      () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      },
    );

  const performDelete = async () => {
    if (busy) return;

    setBusy('delete');
    const result = await deleteAccount(deletePassword);
    setBusy(null);

    if (!result.success) {
      Alert.alert('Nie udało się', result.message);
      return;
    }

    // clear what this phone remembers about the person
    likedMovies.forEach((movie) => removeLikedMovie(movie.id));
    watchedMovies.forEach((movie) => removeWatchedMovie(movie.id));

    Alert.alert('Konto usunięte', 'Twoje konto i dane zostały usunięte.');
    router.replace('/login');
  };

  const confirmDelete = () => {
    if (!deletePassword) {
      Alert.alert('Nie udało się', 'Podaj obecne hasło, aby usunąć konto.');
      return;
    }

    Alert.alert(
      'Usunąć konto?',
      'Tej operacji nie można cofnąć. Stracisz konto oraz polubione i obejrzane filmy.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Usuń konto', style: 'destructive', onPress: performDelete },
      ],
    );
  };

  return {
    email,
    name,
    setName,
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    deletePassword,
    setDeletePassword,
    busy,
    saveName,
    saveEmail,
    savePassword,
    confirmDelete,
  };
}