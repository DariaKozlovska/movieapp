import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';

export const authViewModel = {
  resetPassword: async (email: string) => {
    if (!email) {
      throw new Error('Podaj e-mail');
    }

    try {
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: 'Link do resetu hasła został wysłany na e-mail',
      };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Nie znaleziono konta dla tego e-maila');
        case 'auth/invalid-email':
          throw new Error('Niepoprawny e-mail');
        default:
          throw new Error('Nie udało się wysłać maila');
      }
    }
  },
};