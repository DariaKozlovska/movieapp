import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import MovieCard from '../../components/MovieCard';
import AddWatchedModal from '../../components/AddWatchedModal';

export default function WatchedScreen() {
  const router = useRouter();
  const { watchedMovies, removeWatchedMovie, updateWatchedMovie } = useWatchedMovies();

  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  if (!watchedMovies || watchedMovies.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Nie masz jeszcze żadnych obejrzanych filmów.</Text>
      </View>
    );
  }

  const handleRemove = (id: number) => {
    removeWatchedMovie(id);
  };

  const handleEdit = (movieId: number) => {
    const movie = watchedMovies.find((m) => m.id === movieId);
    if (!movie) return;

    setRating(movie.userRating ?? 3);
    setReview(movie.review ?? '');
    setEditingMovieId(movieId);
  };

  const saveChanges = () => {
    if (editingMovieId === null) return;

    updateWatchedMovie(editingMovieId, rating, review);
    setEditingMovieId(null);
  };

  const cancelEdit = () => {
    setEditingMovieId(null);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MovieCard
      key={`${item.id}-${index}`} // unikalny key nawet przy duplikatach
      movie={item}
      userRating={item.userRating}
      userReview={item.review}
      isWatched
      onRemove={() => handleRemove(item.id)}
      onEdit={() => handleEdit(item.id)}
      onPress={() => router.push(`/movie/${item.id}`)} // 🔹 kliknięcie otwiera szczegóły
    />
  );

  const editingMovie = editingMovieId !== null
    ? watchedMovies.find((m) => m.id === editingMovieId)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <FlatList
        data={watchedMovies}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`} // unikalny key
        contentContainerStyle={styles.list}
      />

      {editingMovie && (
        <AddWatchedModal
          visible={true}
          title={editingMovie.title}
          rating={rating}
          review={review}
          onChangeRating={setRating}
          onChangeReview={setReview}
          onCancel={cancelEdit}
          onSave={saveChanges}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { color: '#fff', fontSize: 16 },
  list: { padding: 16, paddingBottom: 32 },
});