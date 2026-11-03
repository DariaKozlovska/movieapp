import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { useLikedMovies } from '@/contexts/LikedMoviesContext';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  loadSettings,
  saveSettings,
  type NotificationSettings,
} from '@/services/notificationSettings';
import {
  ensureNotificationPermission,
  sendTestNotification,
  syncLocalReminders,
} from '@/services/notificationService';

export default function useNotificationSettingsViewModel() {
  const { likedMovies } = useLikedMovies();

  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const update = async (patch: Partial<NotificationSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  // the system dialog appears only here, when a switch is turned on
  const askPermission = async (): Promise<boolean> => {
    const granted = await ensureNotificationPermission();

    if (!granted) {
      Alert.alert(
        'Powiadomienia są wyłączone',
        'Zezwól aplikacji na powiadomienia w ustawieniach telefonu, aby włączyć tę opcję.',
        [
          { text: 'Anuluj', style: 'cancel' },
          { text: 'Otwórz ustawienia', onPress: () => Linking.openSettings() },
        ],
      );
    }

    return granted;
  };

  const toggleReminders = async (value: boolean) => {
    if (value && !(await askPermission())) return;

    await update({ reminders: value });
    await syncLocalReminders(likedMovies.length);
  };

  // the room notification is scheduled by the lobby when a room is created,
  // so here we only save the choice
  const toggleRoomEvents = async (value: boolean) => {
    if (value && !(await askPermission())) return;

    await update({ roomEvents: value });
  };

  const toggleSounds = async (value: boolean) => {
    await update({ sounds: value });
    await syncLocalReminders(likedMovies.length);
  };

  return {
    settings,
    toggleReminders,
    toggleRoomEvents,
    toggleSounds,
    sendTest: async () => {
      try {
        const allowed = await askPermission();
        console.log('Test notification: permission allowed =', allowed);
        if (!allowed) return;

        await sendTestNotification();

        Alert.alert(
          'Zaplanowano',
          'Powiadomienie pojawi się za 3 sekundy. Jeśli nic nie widzisz, wyjdź teraz na ekran główny telefonu.',
        );
      } catch (error) {
        console.error('Test notification failed', error);
        Alert.alert('Błąd powiadomień', String(error));
      }
    },
  };
}