import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import SwipeCard from '@/components/SwipeCard';
import Title from '@/components/Text/title';
import AppButton from '@/components/Button/AppButton';

import { Colors } from '@/constants/colors';

import useRoomSwipeViewModel from '@/models/Swipe';

type Props = {
  sessionId: string;
};

export default function SwipeView({ sessionId }: Props) {
  const { loading, movies, matchedMovie, swipeLeft, swipeRight } =
    useRoomSwipeViewModel(sessionId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Ładowanie filmów...</Text>
      </View>
    );
  }

  // Everybody liked the same movie
  if (matchedMovie) {
    return (
      <View style={styles.container}>
        <Title title="Mamy film!" />

        <View style={styles.cardsContainer}>
          <SwipeCard movie={matchedMovie} disabled />
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Wróć"
            onPress={() => router.back()}
            variant="success"
          />
        </View>
      </View>
    );
  }

  const currentMovie = movies[0];
  const nextMovie = movies[1];

  // You swiped the whole deck, but there is no common movie (yet)
  if (!currentMovie) {
    return (
      <View style={styles.container}>
        <Title title="Koniec talii" />

        <View style={styles.centered}>
          <Text style={styles.text}>
            Nie ma jeszcze wspólnego filmu. Poczekaj na pozostałych albo wróć.
          </Text>
        </View>

        <View style={styles.footer}>
          <AppButton title="Wróć" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title title="Wybierz film" />

      <View style={styles.cardsContainer}>
        {nextMovie && <SwipeCard movie={nextMovie} disabled isNextCard />}

        <SwipeCard
          movie={currentMovie}
          onSwipeLeft={swipeLeft}
          onSwipeRight={swipeRight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },

  text: {
    color: Colors.text,
    fontSize: 18,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
});