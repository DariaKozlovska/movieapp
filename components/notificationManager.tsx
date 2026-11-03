import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/config/firebase';
import { useLikedMovies } from '@/contexts/LikedMoviesContext';
import {
  cancelAllNotifications,
  syncLocalReminders,
} from '@/services/notificationService';

/**
 * Renders nothing. Keeps notifications in sync with the app:
 * reminders, and what happens when a notification is tapped.
 * Put it inside the providers in app/_layout.tsx.
 */
export default function NotificationManager() {
  const { likedMovies } = useLikedMovies();
  const likedCount = likedMovies.length;

  const likedCountRef = useRef(likedCount);
  likedCountRef.current = likedCount;

  const [uid, setUid] = useState<string | null>(null);

  useEffect(
    () => onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null)),
    [],
  );

  // local reminders: on login, when the liked list changes
  useEffect(() => {
    if (!uid) {
      cancelAllNotifications();
      return;
    }
    syncLocalReminders(likedCount);
  }, [uid, likedCount]);

  // ...and every time the app comes back (resets the "7 days" reminder)
  useEffect(() => {
    if (!uid) return;

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') syncLocalReminders(likedCountRef.current);
    });

    return () => subscription.remove();
  }, [uid]);

  // tapping a notification opens the screen stored in its data
  useEffect(() => {
    let mounted = true;

    const open = (response: Notifications.NotificationResponse | null) => {
      const route = response?.notification.request.content.data?.route;
      if (!mounted || typeof route !== 'string') return;

      try {
        router.push(route as Href);
      } catch (error) {
        console.warn('Could not open the screen from a notification', error);
      }
    };

    // app was closed and opened by tapping a notification
    // (small delay: the navigation has to be ready first)
    Notifications.getLastNotificationResponseAsync().then((response) =>
      setTimeout(() => open(response), 500),
    );

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => open(response),
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return null;
}