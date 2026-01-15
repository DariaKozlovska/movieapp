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
import EditCustomMovieModal from '../../components/EditCustomMovieModal';

const { height } = Dimensions.get('window');

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();
  const { watchedMovies, updateWatchedMovie, addWatchedMovie } = useWatchedMovies();
  const { likedMovies } = useLikedMovies();

  const watchedMovie = watchedMovies.find((m) => m.id.toString() === id);
  const likedMovie = likedMovies.find((m) => m.id.toString() === id);
  const apiMovie = movies.find((m) => m.id.toString() === id);

  const movie = watchedMovie || likedMovie || apiMovie;

  const isInWatched = !!watchedMovie;
  const canEditCustom = watchedMovie?.addedByUser === true;

  const [rating, setRating] = useState<number>(watchedMovie?.userRating ?? 3);
  const [review, setReview] = useState<string>(watchedMovie?.review ?? '');
  const [modalVisible, setModalVisible] = useState(false);
  const [editCustomModalVisible, setEditCustomModalVisible] = useState(false);

  useEffect(() => {
    if (watchedMovie) {
      setRating(watchedMovie.userRating ?? 3);
      setReview(watchedMovie.review ?? '');
    }
  }, [watchedMovie?.id]);

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
    if (isInWatched && !canEditCustom) {
      // tylko update rating/review dla zwykłego filmu
      updateWatchedMovie(movie.id, rating, review);
    } else if (!isInWatched) {
      // dodanie filmu do obejrzanych
      addWatchedMovie(
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? '',
          overview: movie.overview ?? '',
          release_date: movie.release_date ?? '',
          vote_average: 'vote_average' in movie ? movie.vote_average ?? 0 : 0,
          trailer_url: movie.trailer_url,
        },
        rating,
        review
      );
    }
    setModalVisible(false);
    Alert.alert('Zapisano zmiany');
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
        {(watchedMovie?.userRating ?? ('vote_average' in movie ? movie.vote_average ?? 0 : 0)).toFixed(1)}
      </Text>

      <Text style={styles.overview}>{movie.overview ?? 'Brak opisu'}</Text>

      {movie.release_date && <Text style={styles.date}>Premiera: {movie.release_date}</Text>}

      <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
        <Text style={styles.trailerText}>Zobacz zwiastun</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.trailerButton, { backgroundColor: 'rgba(0,255,0,0.6)' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.trailerText}>
          {isInWatched ? (canEditCustom ? 'Edytuj film' : 'Edytuj ocenę') : 'Dodaj do obejrzanych'}
        </Text>
      </TouchableOpacity>

      {canEditCustom && <Text style={styles.customInfo}>Film dodany ręcznie</Text>}

      {/* Modal dla zwykłego filmu (tylko rating/review) */}
      {!canEditCustom && (
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

      {/* Modal dla filmu dodanego przez użytkownika (pełna edycja) */}
      {canEditCustom && watchedMovie && (
        <EditCustomMovieModal
          visible={modalVisible}
          movie={watchedMovie}
          onClose={() => setModalVisible(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  container: { padding: 16, alignItems: 'center' },
  image: { width: '100%', height: 400, borderRadius: 16, marginBottom: 16 },
  noImage: { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#888' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  rating: { fontSize: 18, color: '#fff', marginBottom: 12 },
  overview: { fontSize: 16, color: '#ddd', textAlign: 'justify', marginBottom: 16 },
  date: { fontSize: 14, color: '#888' },
  trailerButton: { backgroundColor: '#e50914', paddingVertical: 14, borderRadius: 12, width: '90%', alignItems: 'center', marginTop: 16 },
  trailerText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  customInfo: { marginTop: 12, color: '#aaa', fontStyle: 'italic' },
});