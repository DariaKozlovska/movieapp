import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import AppInput from '../components/Input/AppInput';
import AppButton from '../components/Button/AppButton';
import ScreenContainer from '../components/Screen/ScreenContainer';
import HelpButton from '@/components/Button/HelpButton';
import AppLogo from '@/components/Logo/AppLogo';
import { Fonts } from '@/constants/fonts';

import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { loginViewModel } from '@/viewModels/loginViewModel';

import { authViewModel } from '@/viewModels/authViewModel';

import Notification from '@/components/Notifications/EmailNotification';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const handleLogin = async () => {
    const result = await loginViewModel.login(username, password);

    setNotification({
      visible: true,
      message: result.message,
      type: result.type,
    });

    if (result.success) {
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 800);
    }
  };

  return (
    <ScreenContainer>
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
      />

      <HelpButton />

      <View style={styles.container}>

        <View style={{ height: 120 }} />

        <View style={styles.content}>
          <AppLogo />
          <Text style={styles.title}>Witamy z powrotem</Text>
        </View>

        <View style={styles.bottomSpacer} />

        <View style={styles.form}>
          <AppInput
            placeholder="E-mail"
            value={username}
            onChangeText={setUsername}
          />

          <View style={{ height: 38 }} />

          <AppInput
            placeholder="Hasło"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text
            style={styles.remindtext}
            onPress={async () => {
              try {
                if (!username) {
                  setNotification({
                    visible: true,
                    message: 'Podaj email',
                    type: 'error',
                  });
                  return;
                }

                const res = await authViewModel.resetPassword(username);

                setNotification({
                  visible: true,
                  message: res.message,
                  type: 'success',
                });

              } catch (e: any) {
                setNotification({
                  visible: true,
                  message: e.message,
                  type: 'error',
                });
              }

              setTimeout(() => {
                setNotification((prev) => ({
                  ...prev,
                  visible: false,
                }));
              }, 3000);
            }}
          >
            Nie pamiętasz hasła?
          </Text>

          <View style={{ height: 34 }} />

          <AppButton
            title="Zaloguj się"
            variant="primary"
            onPress={handleLogin}
          />
        </View>

        <View style={{ height: 150 }} />

        <Text style={styles.subtitle}>
          Nie masz jeszcze konta?{' '}
          <Text
            style={{ fontFamily: Fonts.bold }}
            onPress={() => router.push('/register')}
          >
            Zarejestruj się
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

  bottomSpacer: {
    height: 40,
  },

  form: {
    width: '100%',
    paddingHorizontal: 12,
  },

  remindtext: {
    marginTop: 16,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 18,
    textAlign: 'right',
  },

  subtitle: {
    marginTop: 16,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 20,
    textAlign: 'center',
  },
});