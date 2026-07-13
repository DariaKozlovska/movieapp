import { View, StyleSheet, Text } from 'react-native';
import { useSwipeMovies } from '../../hooks/useSwipeMovies';
import { useMovies } from '../../hooks/useMovies';
import SwipeCard from '../../components/SwipeCard';
import GenreSelector from '../../components/GenreSelector';
import { GENRES } from '../../constants/genres';
import { Colors } from '@/constants/colors';

export default function SwipeScreen() {
  const {
    selectedGenre,
    setSelectedGenre,
  } = useMovies();

  const {
    movies,
    swipeLeft,
    swipeRight,
    loading,
  } = useSwipeMovies(selectedGenre);

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
      {/* <Text style={styles.header}>Filmy</Text> */}
      <View style={styles.selectorContainer}>
        <GenreSelector
          genres={GENRES}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      </View>

      <View style={styles.cardsContainer}>
        {nextMovie && (
          <SwipeCard
            movie={nextMovie}
            disabled
            isNextCard
          />
        )}

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

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  selectorContainer: {
    alignItems: 'center',
    marginTop: 70,
    zIndex: 1000,
  },


  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  text: {
    color: Colors.text,
    fontSize: 18,
  },
});