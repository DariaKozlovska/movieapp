import { useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

import { auth } from '@/config/firebase';
import { isValidCode, normalizeCode } from '@/utils/generateCode';
import { getAccountName } from '@/services/userService';
import { joinSession as joinSessionService } from '@/services/sessionService';
import type { ServiceResult } from '@/types/session';

export default function useJoinSessionViewModel() {
  const [accessCode, setAccessCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  // the camera reports the same QR many times per second - handle it once
  const scanLocked = useRef(false);

  /** Joins with the typed code, or with a code that was just scanned. */
  const joinSession = async (
    codeOverride?: string,
  ): Promise<ServiceResult<{ sessionId: string }>> => {
    if (isJoining) return { success: false, message: '' };

    const code = normalizeCode(codeOverride ?? accessCode);

    if (!isValidCode(code)) {
      return {
        success: false,
        message:
          'Kod ma 6 znaków (litery i cyfry). Wpisz go lub zeskanuj kod QR.',
      };
    }

    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'Musisz być zalogowany.' };
    }

    setIsJoining(true);
    const name = await getAccountName(user);
    const result = await joinSessionService(code, user.uid, name);
    setIsJoining(false);

    return result;
  };

  /* ------------------------------ QR scanner ------------------------------ */

  const startScan = async () => {
    let granted = permission?.granted ?? false;

    if (!granted) {
      const response = await requestPermission();
      granted = response.granted;
    }

    if (!granted) {
      Alert.alert(
        'Brak dostępu do aparatu',
        'Zezwól aplikacji na użycie aparatu w ustawieniach, aby skanować kod QR.',
        [
          { text: 'Anuluj', style: 'cancel' },
          { text: 'Otwórz ustawienia', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    scanLocked.current = false;
    setIsScanning(true);
  };

  const stopScan = () => setIsScanning(false);

  /**
   * Call with the text read from a QR.
   * Returns the room code if it is valid (and closes the camera),
   * otherwise shows a message and returns null.
   */
  const handleScanned = (data: string): string | null => {
    if (scanLocked.current) return null;
    scanLocked.current = true;

    const code = normalizeCode(data);

    if (!isValidCode(code)) {
      Alert.alert(
        'Nieprawidłowy kod QR',
        'To nie jest kod pokoju. Zeskanuj kod z ekranu administratora.',
        [{ text: 'OK', onPress: () => (scanLocked.current = false) }],
      );
      return null;
    }

    setAccessCode(code);
    setIsScanning(false);
    return code;
  };

  return {
    accessCode,
    setAccessCode,
    joinSession,
    isScanning,
    startScan,
    stopScan,
    handleScanned,
  };
}