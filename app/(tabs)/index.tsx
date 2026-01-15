import { View, StyleSheet, Text } from 'react-native';
import { useSwipeMovies } from '../../hooks/useSwipeMovies';
import SwipeCard from '../../components/SwipeCard';

export default function SwipeScreen() {
  const { movies, swipeLeft, swipeRight, loading } = useSwipeMovies();

  const currentMovie = movies[0];
  const nextMovie = movies[1];

  if (loading && movies.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.text}>Ładowanie filmów...</Text>
      </View>
    );
  }

  if (!currentMovie) {
    return (
      <View style={styles.loading}>
        <Text style={styles.text}>Brak kolejnych filmów</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nextMovie && (
        <SwipeCard movie={nextMovie} disabled isNextCard />
      )}

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
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});