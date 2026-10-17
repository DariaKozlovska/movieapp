import { router } from 'expo-router';
import AppButton from '@/components/Button/AppButton';
import HelpButton from '@/components/Button/HelpButton';
import Title from '@/components/Text/title';
import { Colors } from '@/constants/colors';
import logoutViewModel from '@/viewModels/logoutViewModel';
import { View, StyleSheet } from 'react-native';
import SettingButton from '@/components/Button/SettingButton';

export default function SettingsScreen() {
  const handleLogout = async () => {
    const result = await logoutViewModel.logout();
    if (result.success) {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <HelpButton />
      <Title title="Ustawienia" style={{ marginBottom: 30 }} />

      <View style={styles.content}>
        <SettingButton title="Dane osobowe" onPress={() => {}} />
        <SettingButton title="Polityka prywatności" onPress={() => {}} />
        <SettingButton title="Powiadomienia i dźwięki" onPress={() => {}} />
      </View>

      <View style={styles.footer}>
        <AppButton title="Wyloguj się" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});