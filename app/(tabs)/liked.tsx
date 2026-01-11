import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { Movie } from '../../models/Movie';
import StarRating from '../../components/StarRating';
import Toast from 'react-native-root-toast';
import MovieCard from '../../components/MovieCard';

export default function LikedMoviesScreen() {
  const { likedMovies, removeLikedMovie } = useLikedMovies();
  const { addWatchedMovie } = useWatchedMovies();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [userReview, setUserReview] = useState('');
  const [rating, setRating] = useState(3);

  const openWatchedModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setRating(3);
    setUserReview('');
    setModalVisible(true);
  };

  const submitWatched = () => {
    if (!selectedMovie) return;

    addWatchedMovie(selectedMovie, rating, userReview);
    removeLikedMovie(selectedMovie.id);

    setSelectedMovie(null);
    setModalVisible(false);

    Toast.show('Film dodany do obejrzanych!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: '#2ecc71',
      textColor: '#fff',
    });
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      onRemove={() => removeLikedMovie(item.id)}
      onEdit={() => openWatchedModal(item)}
      onPress={() => router.push(`/movie/${item.id}`)}
      userRating={item.vote_average}
      isWatched={false} // bo lista liked
    />
  );

  if (!likedMovies || likedMovies.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Brak polubionych filmów</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={likedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* MODAL */}
      <Modal
        visible={modalVisible && !!selectedMovie}
        animationType="slide"
        transparent
      >
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
              value={userReview}
              onChangeText={setUserReview}
            />

            <View style={styles.modalButtons}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  Anuluj
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={styles.saveButton}
                  onPress={submitWatched}
                >
                  Zapisz
                </Text>
              </View>
            </View>
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#2A2A2A', color: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, fontSize: 14 },
  textArea: { height: 90, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', marginTop: 8 },
  saveButton: { backgroundColor: 'rgba(0,255,0,0.6)', paddingVertical: 12, borderRadius: 12, textAlign: 'center', color: '#fff', fontWeight: '700' },
  cancelButton: { backgroundColor: '#e50914', paddingVertical: 12, borderRadius: 12, textAlign: 'center', color: '#fff', fontWeight: '700' },
});