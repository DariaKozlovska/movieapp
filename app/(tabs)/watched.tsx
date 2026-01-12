import React, { useState } from 'react';
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
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMovies } from '../../hooks/useMovies';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';
import { getMovieTrailer } from '../../api/tmdbApi';
import { TMDB_IMAGE_URL } from '../../constants/config';
import StarRating from '../../components/StarRating';

const { height } = Dimensions.get('window');

type AnyMovie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  trailer_url?: string;
  userRating?: number;
  review?: string;
  userAdded?: boolean; // nowa flaga
};

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();
  const { watchedMovies, updateWatchedMovie } = useWatchedMovies();
  const { likedMovies } = useLikedMovies();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPoster, setEditPoster] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editTrailer, setEditTrailer] = useState('');
  const [editRating, setEditRating] = useState(3);
  const [editReview, setEditReview] = useState('');

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
  const isUserAdded = (movie as AnyMovie).userAdded ?? false;

  const posterUri = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${TMDB_IMAGE_URL}${movie.poster_path}`
    : null;

  const displayRating = movie.userRating ?? movie.vote_average ?? null;
  const overview = movie.overview ?? 'Brak opisu';
  const releaseDate = movie.release_date;

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

  const openEditModal = () => {
    if (!isUserAdded) return;

    setEditTitle(movie.title);
    setEditPoster(movie.poster_path ?? '');
    setEditOverview(movie.overview ?? '');
    setEditTrailer(movie.trailer_url ?? '');
    setEditRating(movie.userRating ?? 3);
    setEditReview(movie.review ?? '');
    setEditModalVisible(true);
  };

  const saveChanges = () => {
    if (!isUserAdded) return;

    updateWatchedMovie(movie.id, editRating, editReview, {
      title: editTitle,
      poster_path: editPoster,
      overview: editOverview,
      trailer_url: editTrailer,
    });

    setEditModalVisible(false);
    Alert.alert('Sukces', 'Film został zaktualizowany!');
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

      <Text style={styles.overview}>{movie.review ?? overview}</Text>

      {releaseDate && <Text style={styles.date}>Premiera: {releaseDate}</Text>}

      <TouchableOpacity
        style={styles.trailerButton}
        onPress={openTrailer}
        activeOpacity={0.8}
      >
        <Text style={styles.trailerText}>Zobacz zwiastun</Text>
      </TouchableOpacity>

      {isUserAdded && (
        <TouchableOpacity
          style={[styles.trailerButton, { backgroundColor: '#2ecc71', marginTop: 16 }]}
          onPress={openEditModal}
        >
          <Text style={styles.trailerText}>Edytuj film</Text>
        </TouchableOpacity>
      )}

      {/* Modal do edycji filmu */}
      {isUserAdded && (
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalOverlay}
            >
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Edytuj film</Text>

                <TextInput
                  placeholder="Tytuł filmu"
                  placeholderTextColor="#888"
                  style={[styles.input, { marginBottom: 12 }]}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />

                <TextInput
                  placeholder="URL okładki"
                  placeholderTextColor="#888"
                  style={[styles.input, { marginBottom: 12 }]}
                  value={editPoster}
                  onChangeText={setEditPoster}
                />

                <TextInput
                  placeholder="Opis filmu"
                  placeholderTextColor="#888"
                  style={[styles.input, styles.textArea]}
                  multiline
                  value={editOverview}
                  onChangeText={setEditOverview}
                />

                <TextInput
                  placeholder="URL zwiastuna"
                  placeholderTextColor="#888"
                  style={[styles.input, { marginBottom: 12 }]}
                  value={editTrailer}
                  onChangeText={setEditTrailer}
                />

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: '#fff', marginBottom: 6 }}>Twoja ocena</Text>
                  <StarRating rating={editRating} onChange={setEditRating} />
                </View>

                <TextInput
                  placeholder="Twoja opinia"
                  placeholderTextColor="#888"
                  style={[styles.input, styles.textArea]}
                  multiline
                  value={editReview}
                  onChangeText={setEditReview}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: '#e50914' }]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Anuluj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                    <Text style={styles.buttonText}>Zapisz zmiany</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgba(0,255,0,0.6)',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});