import { router } from 'expo-router';
import AppButton from '@/components/Button/AppButton';
import HelpButton from '@/components/Button/HelpButton';
import Title from '@/components/Text/title';
import { Colors } from '@/constants/colors';
import logoutViewModel from '@/viewModels/logoutViewModel';
import { View, StyleSheet } from 'react-native';

export default function LoginScreen() {

  const handleLogout = async () => {
      const result = await logoutViewModel.logout();
  if (result.success) {
    router.replace('/login');
  }
    
  };
  return (
    <View style={styles.container}>
      <HelpButton />
      <Title title="Ustawienia" />
      <AppButton title={"Wyloguj się"} onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 24 },
  text: { color: Colors.text, fontSize: 16 },
});