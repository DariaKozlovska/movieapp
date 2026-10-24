import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
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

/**
 * What a GUEST sees after joining:
 *  - while the room waits: a modal with a timer over the join screen
 *  - while the game is on and the guest is back on this screen: a card
 *    with a way back to the swiping
 */
export default function WaitingRoomModal({
  sessionId,
  onLeave,
  onExpired,
}: Props) {
  const {
    isWaiting,
    isActive,
    timeLabel,
    progress,
    handleLeave,
    handleReturnToSwipe,
  } = useLobbyViewModel(sessionId, { onLeave, onExpired });

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={isWaiting}
        onRequestClose={handleLeave}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Czekamy na wszystkich</Text>

            <View style={styles.iconCircle}>
              {/* Put your clapperboard image here instead of the icon:
                  <Image source={require('@/assets/images/clapperboard.png')} /> */}
              <Ionicons name="film" size={56} color={Colors.text} />
            </View>

            <Text style={styles.text}>
              Gdy wszyscy uczestnicy dołączą do pokoju zostaniesz
              automatycznie przekierowany do okna wspólnego wyboru filmu
            </Text>

            <View style={styles.track}>
              <View
                style={[styles.trackFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.time}>{timeLabel}</Text>

            <TouchableOpacity
              onPress={handleLeave}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.leave}>Wyjdź</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isActive && (
        <View style={styles.activeOverlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Sesja trwa</Text>
            <Text style={[styles.text, styles.activeText]}>
              Wspólny wybór filmu już się rozpoczął.
            </Text>

            <AppButton
              title="Wróć do wyboru filmu"
              onPress={handleReturnToSwipe}
              variant="success"
            />

            <TouchableOpacity
              onPress={handleLeave}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.leave}>Wyjdź</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },

  activeOverlay: {
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },

  card: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },

  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 22,
    textAlign: 'center',
  },

  iconCircle: {
    width: 120,
    height: 120,
    marginVertical: 24,
    borderRadius: 60,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },

  activeText: {
    marginTop: 12,
    marginBottom: 24,
  },

  track: {
    width: '100%',
    height: 4,
    marginTop: 24,
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

  leave: {
    marginTop: 20,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    opacity: 0.7,
  },
});