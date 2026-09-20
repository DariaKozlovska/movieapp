import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

export type LogoutResult = {
  success: boolean;
  message: string;
  type: 'success' | 'error';

};

const logoutViewModel = {
  logout: async (): Promise<LogoutResult> => {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Logout successful',
        type: 'success',
      };
    } catch (error) {
      console.error('Logout failed:', error);
      return {
        success: false,
        message: 'Logout failed',
        type: 'error',
      };
    }
  },
};

export default logoutViewModel;
