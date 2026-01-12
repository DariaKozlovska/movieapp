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
  trailer_url?: string;
};

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();
  const { watchedMovies, updateWatchedMovie, addWatchedMovie } = useWatchedMovies();
  const { likedMovies } = useLikedMovies();

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  // 🔹 Znajdź film w watched, liked lub API
  const watchedMovie = watchedMovies.find((m) => m.id.toString() === id);
  const likedMovie = likedMovies.find((m) => m.id.toString() === id);
  const apiMovie = movies.find((m) => m.id.toString() === id);

  const movie: AnyMovie | undefined = watchedMovie || likedMovie || apiMovie;

  // 🔹 Sprawdzenie, czy film jest już w watched
  const isUserAdded = !!watchedMovie;

  // ✅ Hook zawsze wywołany
  useEffect(() => {
    if (!movie || !isUserAdded) return;

    setRating(watchedMovie?.userRating ?? 3);
    setReview(watchedMovie?.review ?? '');
  }, [movie?.id, isUserAdded]);

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Nie znaleziono filmu</Text>
      </View>
    );
  }

  const posterUri = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${TMDB_IMAGE_URL}${movie.poster_path}`
    : null;

  const displayRating = 'userRating' in movie ? movie.userRating ?? movie.vote_average : movie.vote_average;
  const overview = movie.overview ?? 'Brak opisu';
  const releaseDate = 'release_date' in movie ? movie.release_date : undefined;

  const openTrailer = async () => {
    try {
      const url = movie.trailer_url ?? (await getMovieTrailer(movie.id));
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
    if (isUserAdded) {
      updateWatchedMovie(movie.id, rating, review);
    } else {
      // dodanie filmu do watched
      // Type assertion, bo watchedMovie wymaga Movie
      const movieToAdd = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path ?? '',
        overview: movie.overview ?? '',
        release_date: movie.release_date ?? '',
        vote_average: movie.vote_average ?? 0,
        trailer_url: movie.trailer_url,
      };
      addWatchedMovie(movieToAdd, rating, review);
    }

    setModalVisible(false);
    Alert.alert('Sukces', 'Zapisano zmiany');
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
        {displayRating != null ? displayRating.toFixed(1) : 'Brak oceny'}
      </Text>

      <Text style={styles.overview}>{overview}</Text>

      {releaseDate && <Text style={styles.date}>Premiera: {releaseDate}</Text>}

      <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
        <Text style={styles.trailerText}>Zobacz zwiastun</Text>
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
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    marginBottom: 16,
  },
  noImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#888',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  rating: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'justify',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  trailerButton: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 16,
  },
  trailerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});