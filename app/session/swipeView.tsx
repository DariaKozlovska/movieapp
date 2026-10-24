import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import SwipeCard from '@/components/SwipeCard';
import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import AppButton from '@/components/Button/AppButton';
import { BackButton } from '@/components/Button/BackButton';

import MatchModal from '@/app/session/matchedModal';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import useRoomSwipeViewModel from '@/models/Swipe';

type Props = {
  sessionId: string;
};

export default function SwipeView({ sessionId }: Props) {
  const {
    loading,
    code,
    isAdmin,
    movies,
    matchedMovie,
    swipeLeft,
    swipeRight,
    continueSwiping,
    finishNow,
    confirmFinish,
  } = useRoomSwipeViewModel(sessionId);

  const currentMovie = movies[0];
  const nextMovie = movies[1];

  const showCodeInfo = () => {
    Alert.alert(
      'Kod pokoju',
      `Twój pokój ma kod ${code}. Wspólny wybór już trwa, więc nowe osoby nie mogą dołączyć.`,
    );
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <HelpButton />
      <Title title="Filmy" />

      {code && (
        <View style={styles.codeRow}>
          <Text style={styles.code}>{code}</Text>
          <TouchableOpacity
            onPress={showCodeInfo}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Informacja o kodzie pokoju"
          >
            <Ionicons
              name="information-circle"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.cardsContainer}>
        {loading ? (
          <Text style={styles.text}>Ładowanie filmów...</Text>
        ) : currentMovie ? (
          <>
            {nextMovie && <SwipeCard movie={nextMovie} disabled isNextCard />}

            <SwipeCard
              movie={currentMovie}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
            />
          </>
        ) : (
          <Text style={[styles.text, styles.centeredText]}>
            To były wszystkie filmy. Nie ma jeszcze wspólnego wyboru.
          </Text>
        )}
      </View>

      {isAdmin && (
        <View style={styles.footer}>
          <AppButton
            title="Zakończ wybieranie"
            onPress={confirmFinish}
            variant="primary"
          />
        </View>
      )}

      <MatchModal
        movie={matchedMovie}
        isAdmin={isAdmin}
        onContinue={continueSwiping}
        onFinish={finishNow}
        onLeave={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },

  code: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 24,
    letterSpacing: 2,
  },

  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: Colors.text,
    fontSize: 18,
  },

  centeredText: {
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  footer: {
    paddingHorizontal: 32,
    paddingBottom: 30,
    paddingTop: 8,
  },
});