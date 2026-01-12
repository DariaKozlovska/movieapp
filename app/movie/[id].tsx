import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMovies } from '../../hooks/useMovies';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';
import { getMovieTrailer } from '../../api/tmdbApi';
import { TMDB_IMAGE_URL } from '../../constants/config';
import AddWatchedModal from '../../components/AddWatchedModal';

const { height } = Dimensions.get('window');

type AnyMovie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  userRating?: number;
  review?: string;
};

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();
  const { watchedMovies, updateWatchedMovie } = useWatchedMovies();
  const { likedMovies } = useLikedMovies();

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  // Szukamy film w kolejności: watched -> liked -> API
  const movie: AnyMovie | undefined =
    watchedMovies.find((m) => m.id.toString() === id) ||
    likedMovies.find((m) => m.id.toString() === id) ||
    movies.find((m) => m.id.toString() === id);

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Nie znaleziono filmu</Text>
      </View>
    );
  }

  // Sprawdzenie, czy film został dodany przez użytkownika
  const isUserAdded = watchedMovies.some((m) => m.id === movie.id);

  // Ustawiamy początkowe wartości dla modalu tylko jeśli film jest userAdded
  useEffect(() => {
    if (isUserAdded) {
      const watchedMovie = watchedMovies.find((m) => m.id === movie.id);
      setRating(watchedMovie?.userRating ?? 3);
      setReview(watchedMovie?.review ?? '');
    }
  }, [movie.id, isUserAdded]);

  const posterUri = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${TMDB_IMAGE_URL}${movie.poster_path}`
    : null;

  const displayRating = movie.userRating ?? movie.vote_average ?? null;
  const overview = movie.overview ?? 'Brak opisu';
  const userReview = movie.review;
  const releaseDate = movie.release_date;

  const openTrailer = async () => {
    try {
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

  const saveChanges = () => {
    if (!isUserAdded) return;
    updateWatchedMovie(movie.id, rating, review);
    setModalVisible(false);
    Alert.alert('Sukces', 'Zaktualizowano ocenę/opinię filmu.');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: height }]}
      style={{ backgroundColor: '#121212' }}
    >
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Brak okładki</Text>
        </View>
      )}

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.rating}>
        {displayRating !== null ? displayRating.toFixed(1) : 'Brak oceny'}
      </Text>

      {/* Opis filmu */}
      <Text style={styles.overview}>{userReview ?? overview}</Text>

      {releaseDate && <Text style={styles.date}>Premiera: {releaseDate}</Text>}

      <TouchableOpacity
        style={styles.trailerButton}
        onPress={openTrailer}
        activeOpacity={0.8}
      >
        <Text style={styles.trailerText}>Zobacz zwiastun</Text>
      </TouchableOpacity>

      {/* Przycisk edycji tylko dla filmów dodanych przez użytkownika */}
      {isUserAdded && (
        <TouchableOpacity
          style={[styles.trailerButton, { backgroundColor: '#2ecc71', marginTop: 16 }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.trailerText}>Edytuj film</Text>
        </TouchableOpacity>
      )}

      {/* Modal do edycji filmu */}
      {isUserAdded && (
        <AddWatchedModal
          visible={modalVisible}
          title={movie.title}
          rating={rating}
          review={review}
          onChangeRating={setRating}
          onChangeReview={setReview}
          onCancel={() => setModalVisible(false)}
          onSave={saveChanges}
        />
      )}
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
  noImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
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