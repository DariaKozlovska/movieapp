import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export type LoginResult = {
  success: boolean;
  message: string;
  type: 'success' | 'error';
};

export const loginViewModel = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    if (!email || !password) {
      return {
        success: false,
        message: 'Email i hasło są wymagane',
        type: 'error',
      };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      return {
        success: true,
        message: 'Zalogowano pomyślnie',
        type: 'success',
      };
    } catch (error: any) {
      let message = 'Błąd logowania';

      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Niepoprawny email';
          break;
        case 'auth/user-not-found':
          message = 'Nie znaleziono użytkownika';
          break;
        case 'auth/wrong-password':
          message = 'Niepoprawne hasło';
          break;
        case 'auth/too-many-requests':
          message = 'Za dużo prób. Spróbuj później';
          break;
      }

      return {
        success: false,
        message,
        type: 'error',
      };
    }
  },
};