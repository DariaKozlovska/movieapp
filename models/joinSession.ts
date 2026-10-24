import { useState } from 'react';

import { auth } from '@/config/firebase';
import { getAccountName } from '@/services/userService';
import { CODE_LENGTH } from '@/utils/generateCode';
import { joinSession as joinSessionService } from '@/services/sessionService';
import type { ServiceResult } from '@/types/session';

export default function useJoinSessionViewModel() {
  const [accessCode, setAccessCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const joinSession = async (): Promise<
    ServiceResult<{ sessionId: string }>
  > => {
    if (isJoining) return { success: false, message: '' };

    const code = accessCode.trim().toUpperCase();

    if (code.length !== CODE_LENGTH) {
      return {
        success: false,
        message: `Kod ma ${CODE_LENGTH} znaków. Wpisz go lub zeskanuj kod QR.`,
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

  // Mock: later this will open the camera and fill accessCode from the QR
  const scanQr = () => {};

  return {
    accessCode,
    setAccessCode,
    joinSession,
    scanQr,
  };
}