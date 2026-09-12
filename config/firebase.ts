import { initializeApp } from 'firebase/app';
// @ts-ignore 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMtB_vilu7xCTTcvQ80n7xVT1Fva-AfRA",
  authDomain: "matched-f6e2f.firebaseapp.com",
  projectId: "matched-f6e2f",
  storageBucket: "matched-f6e2f.firebasestorage.app",
  messagingSenderId: "620367907730",
  appId: "1:620367907730:web:0529cb0140043df7fdcf4b"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);