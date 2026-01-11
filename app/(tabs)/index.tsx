import { View, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import SwipeCard from '../../components/SwipeCard';
// import movies from '../../data/movies.json'; // tymczasowe dane
import { useSwipeMovies } from '../../hooks/useSwipeMovies';

export default function SwipeScreen() {
  const [index, setIndex] = useState(0);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const {
    movies,
    currentIndex,
    swipeLeft,
    swipeRight,
    loading,
  } = useSwipeMovies();

  const movie = movies[index];

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ładowanie filmów...</Text>
      </View>
    );
  }
  
  if (!currentMovie) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Brak kolejnych filmów </Text>
      </View>
    );
  }

  if (!movie) return null;

  return (
    <View style={{ flex: 1 }}>
      {nextMovie && <SwipeCard movie={nextMovie} disabled />}

      <SwipeCard
        movie={currentMovie}
        onSwipeLeft={swipeLeft}
        onSwipeRight={swipeRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});