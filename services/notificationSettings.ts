import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationSettings = {
  /** Local reminders: movie night, "rate the movie", "come back". */
  reminders: boolean;
  /** Push notifications about rooms (needs a development build). */
  roomEvents: boolean;
  /** Sound for all notifications. */
  sounds: boolean;
};

// Everything starts OFF, so the system permission dialog only appears
// when the person turns a switch on.
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  reminders: false,
  roomEvents: false,
  sounds: true,
};

const STORAGE_KEY = 'notification_settings';

export async function loadSettings(): Promise<NotificationSettings> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(json ? JSON.parse(json) : {}),
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveSettings(settings: NotificationSettings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}