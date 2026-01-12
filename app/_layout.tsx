import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { LikedMoviesProvider } from '../contexts/LikedMoviesContext';
import { WatchedMoviesProvider } from '../contexts/WatchedMoviesContext';
import { Background } from '@react-navigation/elements';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <WatchedMoviesProvider>
        <LikedMoviesProvider>
            <GestureHandlerRootView style={styles.container}>
              <Stack screenOptions={{ headerShown: true }} >
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