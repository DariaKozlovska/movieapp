import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { WatchedMovie } from '../../models/WatchedMovie';
import StarRating from '../../components/StarRating';
import MovieCard from '../../components/MovieCard';
import Toast from 'react-native-root-toast';

export default function WatchedMoviesScreen() {
  const { watchedMovies, removeWatchedMovie, updateWatchedMovie } = useWatchedMovies();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<WatchedMovie | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  // Otwiera modal edycji dla wybranego filmu
  const openEditModal = (movie: WatchedMovie) => {
    setSelectedMovie(movie);
    setRating(movie.userRating ?? 3);
    setReview(movie.review ?? '');
    setModalVisible(true);
  };

  // Zapisuje zmiany w filmie
  const saveChanges = () => {
    if (!selectedMovie) return;
    updateWatchedMovie(selectedMovie.id, rating, review);
    setModalVisible(false);

    Toast.show('Zmieniono ocenę/opinię!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: '#2ecc71',
      textColor: '#fff',
    });
  };

  // Usuwa film z obejrzanych
  const handleRemove = (id: number) => {
    removeWatchedMovie(id);
    Toast.show('Film usunięty z obejrzanych', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: '#e50914',
      textColor: '#fff',
    });
  };

  if (!watchedMovies || watchedMovies.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Brak obejrzanych filmów</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={watchedMovies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            userRating={item.userRating}
            userReview={item.review}
            onRemove={() => handleRemove(item.id)}
            onEdit={() => openEditModal(item)}
            onPress={() => router.push(`/movie/${item.id}`)}
            isWatched={true} // Można użyć w MovieCard do pokazania edycji/komentarza zamiast przycisku "Już obejrzałem"
          />
        )}
      />

      {/* MODAL EDYCJI */}
      <Modal visible={modalVisible && !!selectedMovie} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selectedMovie?.title}</Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#fff', marginBottom: 6 }}>Twoja ocena</Text>
              <StarRating rating={rating} onChange={setRating} />
            </View>

            <TextInput
              placeholder="Twoja opinia"
              placeholderTextColor="#888"
              style={[styles.input, styles.textArea]}
              multiline
              value={review}
              onChangeText={setReview}
            />

            <TouchableOpacity style={styles.saveButtonModal} onPress={saveChanges}>
              <Text style={styles.saveTextModal}>Zapisz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  listContent: { padding: 16, paddingBottom: 32, flexGrow: 1 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { color: '#aaa', fontSize: 18 },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#2A2A2A', color: '#fff', borderRadius: 12, padding: 10, marginBottom: 16, fontSize: 14 },
  textArea: { height: 90, textAlignVertical: 'top' },
  saveButtonModal: { backgroundColor: '#2ecc71', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  saveTextModal: { color: '#fff', fontWeight: '700', fontSize: 16 },
});