import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { WatchedMovie } from '../../models/WatchedMovie';
import MovieCard from '../../components/MovieCard';
import Toast from 'react-native-root-toast';
import AddWatchedModal from '../../components/AddWatchedModal';

const MAX_REVIEW_LENGTH = 100;

export default function WatchedMoviesScreen() {
  const { watchedMovies, removeWatchedMovie, updateWatchedMovie } =
    useWatchedMovies();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] =
    useState<WatchedMovie | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  const openEditModal = (movie: WatchedMovie) => {
    setSelectedMovie(movie);
    setRating(movie.userRating ?? 3);
    setReview(movie.review ?? '');
    setModalVisible(true);
  };

  const saveChanges = () => {
    if (!selectedMovie) return;

    updateWatchedMovie(selectedMovie.id, rating, review);
    setModalVisible(false);

    Toast.show('Zmieniono ocenę/opinię!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#2ecc71',
      textColor: '#fff',
    });
  };

  const handleRemove = (id: number) => {
    removeWatchedMovie(id);
    Toast.show('Film usunięty z obejrzanych', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#e50914',
      textColor: '#fff',
    });
  };

  if (!watchedMovies.length) {
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
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            userRating={item.userRating}
            userReview={item.review}
            onRemove={() => handleRemove(item.id)}
            onEdit={() => openEditModal(item)}
            onPress={() => router.push(`/movie/${item.id}`)}
            isWatched
          />
        )}
      />

    <AddWatchedModal
    visible={modalVisible}
    title={selectedMovie?.title}
    rating={rating}
    review={review}
    maxLength={MAX_REVIEW_LENGTH}
    onChangeRating={setRating}
    onChangeReview={setReview}
    onCancel={() => setModalVisible(false)}
    onSave={saveChanges}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  list: { padding: 16, paddingBottom: 32 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyText: { color: '#aaa', fontSize: 18 },
});