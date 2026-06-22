import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/config/firebase';

type RegisterParams = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export const registerViewModel = {
  register: async ({
    name,
    email,
    password,
    repeatPassword,
  }: RegisterParams) => {
    if (!email || !password) {
      throw new Error('E-mail i hasło są wymagane');
    }

    if (password !== repeatPassword) {
      throw new Error('Hasła nie są takie same');
    }

    if (password.length < 6) {
      throw new Error('Hasło musi mieć min. 6 znaków');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name || '',
        email,
        createdAt: new Date(),
      });

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};