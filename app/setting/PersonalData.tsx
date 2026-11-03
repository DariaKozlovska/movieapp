import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type TextInputProps,
} from 'react-native';

import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import AppButton from '@/components/Button/AppButton';
import { BackButton } from '@/components/Button/BackButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import usePersonalDataViewModel from '@/hooks/PersonalData';

function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.border}
      autoCorrect={false}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.fields}>{children}</View>
    </View>
  );
}

export default function PersonalDataScreen() {
  const {
    email,
    name,
    setName,
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    deletePassword,
    setDeletePassword,
    busy,
    saveName,
    saveEmail,
    savePassword,
    confirmDelete,
  } = usePersonalDataViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <HelpButton />
      <BackButton />
      <Title title="Dane osobowe" style={{ fontSize: 18 }} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Section title="Imię">
          <Field
            value={name}
            onChangeText={setName}
            placeholder="Twoje imię"
            autoCapitalize="words"
            maxLength={30}
          />
          <AppButton
            title={busy === 'name' ? 'Zapisywanie...' : 'Zapisz imię'}
            onPress={saveName}
            variant="success"
          />
        </Section>

        <Section
          title="Adres e-mail"
          hint={`Obecny adres: ${email}. Wyślemy link potwierdzający na nowy adres, e-mail zmieni się po kliknięciu w link.`}
        >
          <Field
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Nowy adres e-mail"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Field
            value={emailPassword}
            onChangeText={setEmailPassword}
            placeholder="Obecne hasło"
            autoCapitalize="none"
            secureTextEntry
          />
          <AppButton
            title={busy === 'email' ? 'Wysyłanie...' : 'Zmień e-mail'}
            onPress={saveEmail}
            variant="success"
          />
        </Section>

        <Section title="Hasło">
          <Field
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Obecne hasło"
            autoCapitalize="none"
            secureTextEntry
          />
          <Field
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nowe hasło"
            autoCapitalize="none"
            secureTextEntry
          />
          <Field
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Powtórz nowe hasło"
            autoCapitalize="none"
            secureTextEntry
          />
          <AppButton
            title={busy === 'password' ? 'Zapisywanie...' : 'Zmień hasło'}
            onPress={savePassword}
            variant="success"
          />
        </Section>

        <Section
          title="Usuń konto"
          hint="Tej operacji nie można cofnąć. Usuniemy Twoje konto oraz polubione i obejrzane filmy. Aby potwierdzić, podaj obecne hasło."
        >
          <Field
            value={deletePassword}
            onChangeText={setDeletePassword}
            placeholder="Obecne hasło"
            autoCapitalize="none"
            secureTextEntry
          />
          <AppButton
            title={busy === 'delete' ? 'Usuwanie...' : 'Usuń konto'}
            onPress={confirmDelete}
            variant="primary"
          />
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 22,
  },

  hint: {
    marginTop: 6,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },

  fields: {
    marginTop: 16,
    gap: 12,
  },

  input: {
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 18,
  },
});