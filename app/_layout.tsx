import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { LikedMoviesProvider } from '../contexts/LikedMoviesContext';
import { WatchedMoviesProvider } from '../contexts/WatchedMoviesContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { Colors } from '@/constants/colors';
import NotificationManager from '@/components/notificationManager';
import { configureNotifications } from '@/services/notificationService';

SplashScreen.preventAutoHideAsync();
configureNotifications();

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
            <SearchProvider>
              <NotificationManager />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.background },
                }}
              >
                <Stack.Screen
                  name="room-swipe"
                  options={{ gestureEnabled: false }}
                />
              </Stack>
            </SearchProvider>
          </WatchedMoviesProvider>
        </LikedMoviesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});