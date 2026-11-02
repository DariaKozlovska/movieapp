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
import QRCode from 'react-native-qrcode-svg';

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
          {/* Dark modules on a white background: scans much more reliably
              than white-on-dark. The QR contains just the room code. */}
          <View style={styles.qrBox}>
            <QRCode
              value={session.code}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
              quietZone={4}
            />
          </View>

          <Text style={styles.code}>{session.code}</Text>

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>
{/* 
        <Text style={styles.joined}>
          Uczestnicy: {session.participantIds.length} z {session.maxParticipants}
        </Text> */}
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

  qrBox: {
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  code: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 36,
    letterSpacing: 6,
    marginBottom: 20,
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

  joined: {
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
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