import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={DarkTheme}>
      <GestureHandlerRootView style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
  },
});