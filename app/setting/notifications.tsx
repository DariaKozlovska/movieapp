import React from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';

import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import AppButton from '@/components/Button/AppButton';
import { BackButton } from '@/components/Button/BackButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import useNotificationSettingsViewModel from '@/hooks/useNotificationService';

function SettingSwitch({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.green }}
        thumbColor="#FFFFFF"
        accessibilityLabel={title}
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const { settings, toggleReminders, toggleRoomEvents, toggleSounds, sendTest } =
    useNotificationSettingsViewModel();

  return (
    <View style={styles.container}>
      <HelpButton />
      <BackButton />
      <Title title="Powiadomienia i dźwięki" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingSwitch
          title="Przypomnienia o seansie"
          description="Piątkowy wieczór z polubionymi filmami, pytanie o ocenę dzień po wspólnym wyborze i delikatne przypomnienie po tygodniu przerwy."
          value={settings.reminders}
          onValueChange={toggleReminders}
        />

        <SettingSwitch
          title="Powiadomienia z pokoju"
          description="Przypomnienie dla administratora minutę przed wygaśnięciem kodu pokoju."
          value={settings.roomEvents}
          onValueChange={toggleRoomEvents}
        />

        <SettingSwitch
          title="Dźwięki"
          description="Odtwarzaj dźwięk przy powiadomieniach."
          value={settings.sounds}
          onValueChange={toggleSounds}
        />

        {__DEV__ && (
          <View style={styles.devBox}>
            <AppButton
              title="Wyślij testowe powiadomienie"
              onPress={sendTest}
              variant="success"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
  },

  rowDescription: {
    marginTop: 6,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },

  devBox: {
    marginTop: 16,
  },
});