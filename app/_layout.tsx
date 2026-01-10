import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen
//           name="index"
//           options={{ title: 'Filmy' }}
//         />
//         <Stack.Screen
//           name="movie/[id]"
//           options={{ title: 'Szczegóły filmu' }}
//         />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import { Stack } from 'expo-router';

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ title: 'Filmy' }}
      />
      <Stack.Screen
        name="movie/[id]"
        options={{ title: 'Szczegóły filmu' }}
      />
    </Stack>
  </ThemeProvider>
  );
}