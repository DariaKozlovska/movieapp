import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';

import AppButton from '../components/Button/AppButton';
import HelpButton from '../components/Button/HelpButton';
import AppLogo from '../components/Logo/AppLogo';
import { Fonts } from '../constants/fonts';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <HelpButton />

      <View style={styles.container}>
        <View style={styles.topSpacer} />

        <View style={styles.content}>
          <AppLogo />

          <Text style={styles.title}>Matched</Text>

          <Text style={styles.subtitle}>
            Szybkie decyzje, trafne rekomendacje i więcej czasu na oglądanie
          </Text>
        </View>

        <View style={styles.bottomSpacer} />

        <View style={styles.buttons}>
          <AppButton
            title="Zaloguj się"
            onPress={() => router.push('/login')}
          />

          <AppButton
            title="Zarejestruj się"
            variant="success"
            onPress={() => router.push('/register')}
          />
        </View>

        <View style={{ height: 140 }} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
  },

  topSpacer: {
    height: 190,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  title:{
    marginTop: 22,
    color: '#fff',
    fontFamily: Fonts.bold,
    fontSize: 30,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 32, 
    color: '#fff',
    fontFamily: Fonts.regular, 
    fontSize: 24,
    textAlign: 'center',
  },

  bottomSpacer: {
    flex: 1, 
  },

  buttons: {
    paddingHorizontal: 30,
    gap: 16,
  },
});