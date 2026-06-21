import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { LikedMoviesProvider } from '../contexts/LikedMoviesContext';
import { WatchedMoviesProvider } from '../contexts/WatchedMoviesContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    IntroBlack: require('../assets/fonts/IntroBlack.otf'),
    IntroBold: require('../assets/fonts/IntroBold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <LikedMoviesProvider>
        <WatchedMoviesProvider>
          <Slot />
        </WatchedMoviesProvider>
      </LikedMoviesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});