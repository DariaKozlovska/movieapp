import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { hasNotificationPermission } from '@/services/notificationService';
import { loadSettings } from '@/services/notificationSettings';

export type PushSyncResult = 'registered' | 'removed' | 'unavailable';

async function getExpoPushToken(): Promise<string | null> {
  // push tokens do not exist on simulators
  if (!Device.isDevice) {
    console.log('Push: needs a physical device');
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log('Push: no EAS projectId in app.json');
    return null;
  }

  try {
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error) {
    // e.g. Expo Go on Android, or push not configured yet
    console.log('Push: could not get a token', error);
    return null;
  }
}

export async function removePushRegistration(uid: string) {
  try {
    await deleteDoc(doc(db, 'pushTokens', uid));
  } catch (error) {
    console.warn('Push: could not remove the token', error);
  }
}

/**
 * Saves this phone's token (and sound preference) for the user, so the
 * Cloud Function knows where to send room notifications.
 * Removes it when "Wydarzenia w pokoju" is off.
 */
export async function syncPushRegistration(
  uid: string,
): Promise<PushSyncResult> {
  try {
    const settings = await loadSettings();

    if (!settings.roomEvents) {
      await removePushRegistration(uid);
      return 'removed';
    }

    if (!(await hasNotificationPermission())) return 'unavailable';

    const token = await getExpoPushToken();
    if (!token) return 'unavailable';

    await setDoc(
      doc(db, 'pushTokens', uid),
      {
        token,
        roomEvents: true,
        sounds: settings.sounds,
        platform: Platform.OS,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return 'registered';
  } catch (error) {
    console.warn('Push: sync failed', error);
    return 'unavailable';
  }
}


