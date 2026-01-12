import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import MovieCard from '../../components/MovieCard';
import AddWatchedModal from '../../components/AddWatchedModal';
import AddCustomMovieModal from '../../components/AddCustomMovieModal';
import { Ionicons } from '@expo/vector-icons';

type SortOption = 'rating' | 'date';

export default function WatchedScreen() {
  const router = useRouter();
  const { watchedMovies, removeWatchedMovie, updateWatchedMovie } = useWatchedMovies();

  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date');

  const handleRemove = (id: number) => removeWatchedMovie(id);

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

  const cancelEdit = () => setEditingMovieId(null);

  // 🔹 Sortowane dane
  const sortedMovies = useMemo(() => {
    const moviesCopy = [...watchedMovies];
    if (sortOption === 'rating') {
      return moviesCopy.sort((a, b) => (b.userRating ?? 0) - (a.userRating ?? 0));
    } else {
      return moviesCopy.sort((a, b) => b.id - a.id); // najnowsze na górze
    }
  }, [watchedMovies, sortOption]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MovieCard
      key={`${item.id}-${index}`}
      movie={item}
      userRating={item.userRating}
      userReview={item.review}
      isWatched
      onRemove={() => handleRemove(item.id)}
      onEdit={() => handleEdit(item.id)}
      onPress={() => router.push(`/movie/${item.id}`)}
    />
  );

  const editingMovie = editingMovieId !== null
    ? watchedMovies.find((m) => m.id === editingMovieId)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* 🔹 Górny panel z przyciskiem dodawania i sortowaniem */}
      <View style={styles.topPanel}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCustomModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortOption('rating')}
          >
            <Text style={styles.sortText}>Ocena</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortOption === 'date' && styles.sortButtonActive]}
            onPress={() => setSortOption('date')}
          >
            <Text style={styles.sortText}>Data dodania</Text>
          </TouchableOpacity>
        </View>
      </View>

      {watchedMovies.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nie masz jeszcze żadnych obejrzanych filmów.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedMovies}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
        />
      )}

      {/* 🔹 Modal edycji */}
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

      {/* 🔹 Modal dodania własnego filmu */}
      <AddCustomMovieModal
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,255,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtons: { flexDirection: 'row' },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#333',
    marginLeft: 8,
  },
  sortButtonActive: {
    backgroundColor: 'rgba(0,255,0,0.6)',
  },
  sortText: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16 },
});