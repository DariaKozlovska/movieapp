import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMovies } from '../../hooks/useMovies';
import { getMovieTrailer } from '../../api/tmdbApi';
import { TMDB_IMAGE_URL } from '../../constants/config';

const { height } = Dimensions.get('window');

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();

  const movie = movies.find((m) => m.id.toString() === id);

  const openTrailer = async () => {
    try {
      if (!movie) return;
      const url = await getMovieTrailer(movie.id);
      if (!url) {
        Alert.alert('Brak zwiastuna', 'Ten film nie ma dostępnego zwiastuna.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Błąd', 'Nie udało się otworzyć zwiastuna.');
    }
  };

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Nie znaleziono filmu</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: height }]}
      style={{ backgroundColor: '#121212' }}
    >
      <Image
        source={{ uri: `${TMDB_IMAGE_URL}${movie.poster_path}` }}
        style={styles.image}
      />

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.rating}>⭐ {movie.vote_average}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text style={styles.date}>Premiera: {movie.release_date}</Text>

      <TouchableOpacity style={styles.trailerButton} onPress={openTrailer} activeOpacity={0.8}>
        <Text style={styles.trailerText}>🎬 Zobacz zwiastun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  trailerButton: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 40,
  },
  trailerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});