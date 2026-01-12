import { View, StyleSheet, Text } from 'react-native';
import { useSwipeMovies } from '../../hooks/useSwipeMovies';
import SwipeCard from '../../components/SwipeCard';

export default function SwipeScreen() {
  const {
    movies,
    currentIndex,
    swipeLeft,
    swipeRight,
    loading,
  } = useSwipeMovies();

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Ładowanie filmów...</Text>
      </View>
    );
  }

  if (!currentMovie) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Brak kolejnych filmów</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nextMovie && <SwipeCard movie={nextMovie} disabled isNextCard />}

      {currentMovie && (
        <SwipeCard
          movie={currentMovie}
          onSwipeLeft={swipeLeft}
          onSwipeRight={swipeRight}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 20,
  },
});