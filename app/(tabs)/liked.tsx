import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { Movie } from '../../models/Movie';
import Toast from 'react-native-root-toast';
import MovieCard from '../../components/MovieCard';
import AddWatchedModal from '../../components/AddWatchedModal';

const MAX_REVIEW_LENGTH = 100;

export default function LikedMoviesScreen() {
  const { likedMovies, removeLikedMovie } = useLikedMovies();
  const { addWatchedMovie } = useWatchedMovies();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setRating(3);
    setReview('');
    setModalVisible(true);
  };

  const saveWatched = () => {
    if (!selectedMovie) return;

    addWatchedMovie(selectedMovie, rating, review);
    removeLikedMovie(selectedMovie.id);
    setModalVisible(false);

    Toast.show('Film dodany do obejrzanych!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#2ecc71',
      textColor: '#fff',
    });
  };

  if (!likedMovies.length) {
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
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            userRating={item.vote_average}
            onRemove={() => removeLikedMovie(item.id)}
            onEdit={() => openModal(item)}
            onPress={() => router.push(`/movie/${item.id}`)}
            isWatched={false}
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
        onSave={saveWatched}
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
    backgroundColor: '#121212' 
  },
  emptyText: { color: '#fff', fontSize: 16 },
});