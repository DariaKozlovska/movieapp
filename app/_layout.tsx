import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { LikedMoviesProvider } from '../contexts/LikedMoviesContext';
import { WatchedMoviesProvider } from '@/contexts/WatchedMoviesContext';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <WatchedMoviesProvider>
        <LikedMoviesProvider>
          <GestureHandlerRootView style={styles.container}>
            <Stack screenOptions={{ headerShown: true }}>
              <Stack.Screen name="(tabs)" options={{ title: 'Filmy' }} />
              <Stack.Screen
                name="movie/[id]"
                options={{ title: 'Szczegóły filmu' }}
              />
            </Stack>
          </GestureHandlerRootView>
        </LikedMoviesProvider>
      </WatchedMoviesProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
  },
});