import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import AppInput from '../components/Input/AppInput';
import AppButton from '../components/Button/AppButton';
import ScreenContainer from '../components/Screen/ScreenContainer';
import HelpButton from '@/components/Button/HelpButton';
import AppLogo from '@/components/Logo/AppLogo';
import { Fonts } from '@/constants/fonts';
import { Colors } from '@/constants/colors';

import { router } from 'expo-router';
import { registerViewModel } from '@/viewModels/registerViewModel';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      await registerViewModel.register({
        name,
        email,
        password,
        repeatPassword,
      });

      router.replace('/login');
    } catch (e: any) {
      setError(e.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <HelpButton />

      <View style={styles.container}>
        <View style={{ height: 50 }} />

        <View style={styles.content}>
          <AppLogo />
          <Text style={styles.title}>Witamy</Text>
        </View>

        <View style={{ height: 30 }} />

        <View style={styles.form}>
          <AppInput
            placeholder="Imię"
            value={name}
            onChangeText={setName}
          />

          <View style={{ height: 38 }} />

          <AppInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />

          <View style={{ height: 38 }} />

          <AppInput
            placeholder="Hasło"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={{ height: 38 }} />

          <AppInput
            placeholder="Powtórz hasło"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={{ height: 38 }} />

          <AppButton
            title={loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
            variant="success"
            onPress={handleRegister}
          />
        </View>

        <View style={{ height: 70 }} />

        <Text style={styles.subtitle}>
          Masz już konto?{' '}
          <Text
            style={{ fontFamily: Fonts.bold }}
            onPress={() => router.push('/login')}
          >
            Zaloguj się
          </Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  content: {
    alignItems: 'center',
  },

  title: {
    marginTop: 22,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 30,
  },

  form: {
    width: '100%',
    paddingHorizontal: 12,
  },

  error: {
    marginTop: 16,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 18,
    textAlign: 'left',
  },

  subtitle: {
    marginTop: 16,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 20,
    textAlign: 'center',
  },
});