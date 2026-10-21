import { useState } from 'react';

type JoinSessionResult =
  | { success: true; data: { accessCode: string } }
  | { success: false; message: string };

export default function useJoinSessionViewModel() {
  const [accessCode, setAccessCode] = useState('');

  // Mock: later this is where the real API call / QR result will go
  const joinSession = (): JoinSessionResult => {
    const code = accessCode.trim();

    if (!code) {
      return {
        success: false,
        message: 'Wpisz hasło dostępu lub zeskanuj kod QR.',
      };
    }

    return { success: true, data: { accessCode: code } };
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