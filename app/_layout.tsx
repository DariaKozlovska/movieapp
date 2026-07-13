import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { LikedMoviesProvider } from '../contexts/LikedMoviesContext';
import { WatchedMoviesProvider } from '../contexts/WatchedMoviesContext';
import { AuthProvider } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    IntroBlack: require('../assets/fonts/IntroBlack.otf'),
    IntroBold: require('../assets/fonts/IntroBold.otf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <LikedMoviesProvider>
          <WatchedMoviesProvider>
            <Slot />
          </WatchedMoviesProvider>
        </LikedMoviesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});