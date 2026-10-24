import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from '@/components/Button/AppButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import useLobbyViewModel from '@/models/lobby';

type Props = {
  sessionId: string;
  onLeave: () => void;
  onExpired: () => void;
};

/** Lobby for the ADMIN. Guests see WaitingRoomModal instead. */
export default function LobbyView({ sessionId, onLeave, onExpired }: Props) {
  const {
    session,
    participants,
    isActive,
    isFull,
    timeLabel,
    progress,
    handleStart,
    handleReturnToSwipe,
    handleLeave,
  } = useLobbyViewModel(sessionId, { onLeave, onExpired });

  if (!session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.text} />
      </View>
    );
  }

  // one row per slot: people who joined (names from their accounts),
  // then dimmed waiting slots
  const rows = Array.from({ length: session.maxParticipants }, (_, i) => {
    const joined = participants[i];
    if (joined) return { key: joined.id, label: joined.name, pending: false };

    const pendingIndex = i - participants.length;
    return {
      key: `pending-${i}`,
      label: session.invitedNames[pendingIndex] || 'Oczekiwanie…',
      pending: true,
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backRow}
          onPress={handleLeave}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
          <Text style={styles.backText}>Zacznij od początku</Text>
        </TouchableOpacity>

        <View style={[styles.card, styles.codeCard]}>
          <Text style={styles.code}>{session.code}</Text>

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>

        <View style={[styles.card, styles.namesCard]}>
          {rows.map((row, index) => (
            <View key={row.key}>
              {index > 0 && <View style={styles.divider} />}
              <Text style={[styles.name, row.pending && styles.namePending]}>
                {row.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isActive ? (
          <AppButton
            title="Wróć do wyboru filmu"
            onPress={handleReturnToSwipe}
            variant="success"
          />
        ) : (
          <>
            {!isFull && (
              <Text style={styles.footerText}>
                Możesz rozpocząć wspólny wybór bez oczekiwania na wszystkich
                uczestników
              </Text>
            )}
            <AppButton
              title={isFull ? 'Rozpocznij' : 'Rozpocznij mimo to'}
              onPress={handleStart}
              variant="primary"
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  content: { flex: 1 },

  contentContainer: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },

  backText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 22,
    marginBottom: 20,
  },

  codeCard: {
    paddingVertical: 28,
    alignItems: 'center',
  },

  code: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 40,
    letterSpacing: 6,
    marginBottom: 24,
  },

  track: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },

  trackFill: {
    height: '100%',
    backgroundColor: Colors.text,
  },

  time: {
    marginTop: 6,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },

  namesCard: {
    overflow: 'hidden',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  name: {
    height: 56,
    lineHeight: 56,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },

  namePending: {
    opacity: 0.4,
  },

  footer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },

  footerText: {
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },
});