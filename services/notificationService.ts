import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { loadSettings } from '@/services/notificationSettings';

const CHANNEL_ID = 'default';
const MOVIE_NIGHT_ID = 'movie-night';
const COMEBACK_ID = 'comeback';

const DAY_SECONDS = 24 * 60 * 60;
const FRIDAY = 6; // expo: 1 = Sunday ... 7 = Saturday

/* -------------------------------------------------------------------------- */
/* Setup                                                                       */
/* -------------------------------------------------------------------------- */

/** Call once, at the top of app/_layout.tsx. */
export function configureNotifications() {
  console.log('Notifications: handler configured');

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      console.log(
        'Notifications: received while the app is open:',
        notification.request.content.title,
      );

      const { sounds } = await loadSettings();

      // Room events while the app is open are already visible on screen
      // (lobby, match modal), so no banner for them.
      const isRoomEvent = notification.request.content.data?.kind === 'room';

      return {
        shouldShowBanner: !isRoomEvent,
        shouldShowList: !isRoomEvent,
        shouldPlaySound: sounds && !isRoomEvent,
        shouldSetBadge: false,
      };
    },
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Powiadomienia',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/* -------------------------------------------------------------------------- */
/* Permission                                                                  */
/* -------------------------------------------------------------------------- */

export async function hasNotificationPermission(): Promise<boolean> {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

/** Shows the system dialog if needed. Returns true when allowed. */
export async function ensureNotificationPermission(): Promise<boolean> {
  await ensureChannel();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/* -------------------------------------------------------------------------- */
/* Local reminders (no server needed)                                          */
/* -------------------------------------------------------------------------- */

function likedMoviesText(count: number): string {
  if (count === 1) return '1 polubiony film';

  const lastTwo = count % 100;
  const last = count % 10;
  const isFew = last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14);

  return isFew ? `${count} polubione filmy` : `${count} polubionych filmów`;
}

async function replaceScheduled(
  request: Notifications.NotificationRequestInput & { identifier: string },
) {
  await Notifications.cancelScheduledNotificationAsync(request.identifier);
  await Notifications.scheduleNotificationAsync(request);
}

/**
 * Keeps the reminders in line with the settings. Call it when:
 * the app opens or comes back, the liked list changes, a setting changes.
 *  - movie night: every Friday 18:00, only if "Polubione" is not empty
 *  - comeback: 7 days after the app was last opened
 */
export async function syncLocalReminders(likedCount: number) {
  const settings = await loadSettings();

  if (!settings.reminders || !(await hasNotificationPermission())) {
    await cancelLocalReminders();
    return;
  }

  await ensureChannel();

  if (likedCount > 0) {
    await replaceScheduled({
      identifier: MOVIE_NIGHT_ID,
      content: {
        title: 'Czas na seans 🎬',
        body: `Masz ${likedMoviesText(likedCount)}. Wybierz coś na wieczór!`,
        sound: settings.sounds,
        data: { kind: 'reminder', route: '/(tabs)/favourite' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: FRIDAY,
        hour: 18,
        minute: 0,
        channelId: CHANNEL_ID,
      },
    });
  } else {
    await Notifications.cancelScheduledNotificationAsync(MOVIE_NIGHT_ID);
  }

  // rescheduled on every app open, so it only fires after 7 quiet days
  await replaceScheduled({
    identifier: COMEBACK_ID,
    content: {
      title: 'Dawno Cię nie było 👋',
      body: 'Znajdź nowy film do obejrzenia!',
      sound: settings.sounds,
      data: { kind: 'reminder', route: '/(tabs)/home' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 7 * DAY_SECONDS,
      channelId: CHANNEL_ID,
    },
  });
}

/** A day after a room match: "how was the movie?". */
export async function scheduleRatingReminder(movieId: number, title: string) {
  const settings = await loadSettings();
  if (!settings.reminders || !(await hasNotificationPermission())) return;

  await ensureChannel();

  await replaceScheduled({
    identifier: `rate-${movieId}`,
    content: {
      title: 'Jak podobał się film? 🍿',
      body: `Oceń „${title}” i dodaj go do obejrzanych.`,
      sound: settings.sounds,
      data: { kind: 'reminder', route: '/(tabs)/favourite' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: DAY_SECONDS,
      channelId: CHANNEL_ID,
    },
  });
}

/** Call when the person marks the movie as watched. */
export async function cancelRatingReminder(movieId: number) {
  await Notifications.cancelScheduledNotificationAsync(`rate-${movieId}`);
}

/** Clears the reminders only (not the room notifications). */
export async function cancelLocalReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.kind === 'reminder')
      .map((item) =>
        Notifications.cancelScheduledNotificationAsync(item.identifier),
      ),
  );
}

/** Everything the app scheduled (used on logout). */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/* -------------------------------------------------------------------------- */
/* Room: "the code is about to expire" (for the admin, no server needed)       */
/* -------------------------------------------------------------------------- */

const EXPIRY_WARNING_LEAD_MS = 60 * 1000; // one minute before the code expires

/**
 * Schedules a notification on the admin's own phone, so it also arrives when
 * the app is in the background. Call it again when the number of people in
 * the room changes: the text depends on it.
 */
export async function scheduleExpiryWarning(
  sessionId: string,
  expiresAtMs: number,
  someoneJoined: boolean,
) {
  const settings = await loadSettings();

  if (!settings.roomEvents) {
    console.log('Expiry warning: skipped, "Powiadomienia z pokoju" is off');
    return;
  }

  if (!(await hasNotificationPermission())) {
    console.log('Expiry warning: skipped, no notification permission');
    return;
  }

  const fireAt = expiresAtMs - EXPIRY_WARNING_LEAD_MS;

  // less than a minute left already: nothing to warn about
  if (fireAt <= Date.now() + 5000) {
    console.log('Expiry warning: skipped, less than a minute left');
    await cancelExpiryWarning(sessionId);
    return;
  }

  await ensureChannel();

  await replaceScheduled({
    identifier: `expiry-${sessionId}`,
    content: {
      title: 'Kod pokoju zaraz wygaśnie ⏳',
      body: someoneJoined
        ? 'Rozpocznij wybór teraz, inaczej pokój zostanie zamknięty.'
        : 'Nikt jeszcze nie dołączył. Pokaż znajomym kod lub QR.',
      sound: settings.sounds,
      // kind "room": no banner while the app is open (the timer is visible)
      data: { kind: 'room', route: '/(tabs)/room' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fireAt),
      channelId: CHANNEL_ID,
    },
  });

  console.log(
    `Expiry warning: scheduled for ${new Date(fireAt).toLocaleTimeString()}`,
  );
}

/** The room was started, closed or left. */
export async function cancelExpiryWarning(sessionId: string) {
  await Notifications.cancelScheduledNotificationAsync(`expiry-${sessionId}`);
}

/** For the "test" button in development. */
export async function sendTestNotification() {
  await ensureChannel();

  const { sounds } = await loadSettings();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test powiadomienia 🔔',
      body: 'Jeśli to widzisz, powiadomienia działają.',
      sound: sounds,
      data: { kind: 'reminder', route: '/(tabs)/home' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      channelId: CHANNEL_ID,
    },
  });
}