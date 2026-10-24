import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '@/components/Button/AppButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import useJoinSessionViewModel from '@/models/joinSession';

type Props = {
  onJoined: (sessionId: string) => void;
};

export default function JoinSessionView({ onJoined }: Props) {
  const { accessCode, setAccessCode, joinSession, scanQr } =
    useJoinSessionViewModel();

  const handleJoinSession = async () => {
    const result = await joinSession();

    if (!result.success) {
      if (result.message) Alert.alert('Nie udało się dołączyć', result.message);
      return;
    }

    onJoined(result.data.sessionId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Zeskanuj QR</Text>

        <TouchableOpacity
          style={styles.scanBox}
          activeOpacity={0.8}
          onPress={scanQr}
          accessibilityRole="button"
          accessibilityLabel="Zeskanuj kod QR"
        >
          <Ionicons
            name="camera"
            size={44}
            color={Colors.text}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, styles.codeTitle]}>
          Albo wpisz hasło dostępu
        </Text>

        <TextInput
          style={styles.codeInput}
          value={accessCode}
          onChangeText={setAccessCode}
          placeholder="np. K3U7hh6"
          placeholderTextColor={Colors.border}
          autoCapitalize="characters"
          maxLength={6}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleJoinSession}
          accessibilityLabel="Hasło dostępu"
        />
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Dołącz do pokoju"
          onPress={handleJoinSession}
          variant="success"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },

  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
    textAlign: 'center',
  },

  scanBox: {
    marginTop: 20,
    width: '100%',
    aspectRatio: 2.1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraIcon: {
    opacity: 0.6,
  },

  codeTitle: {
    marginTop: 28,
  },

  codeInput: {
    marginTop: 20,
    height: 56,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },

  footer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
});