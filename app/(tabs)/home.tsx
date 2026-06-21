import { View, StyleSheet, Text } from 'react-native';
import { useSwipeMovies } from '../../hooks/useSwipeMovies';
import { useMovies } from '../../hooks/useMovies';
import SwipeCard from '../../components/SwipeCard';
import GenreSelector from '../../components/GenreSelector';
import { GENRES } from '../../constants/genres';

export default function SwipeScreen() {
  const { movies, swipeLeft, swipeRight, loading } = useSwipeMovies();
  const { selectedGenre, setSelectedGenre } = useMovies();

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
      <GenreSelector
        genres={GENRES}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />
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