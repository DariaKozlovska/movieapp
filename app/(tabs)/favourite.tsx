import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { Movie } from '../../models/Movie';
import Toast from 'react-native-root-toast';
import MovieCard from '../../components/MovieCard';
import AddWatchedModal from '../../components/AddWatchedModal';
import Title from '@/components/Text/title';
import { Colors } from '@/constants/colors';
import { SearchButton } from '@/components/Button/SearchButton';
import HelpButton from '@/components/Button/HelpButton';
import Selector from '@/components/Selectors/Selector';
import { SortOption, useMovieSorting } from '@/hooks/useMovieSorting';
import { SORT_OPTIONS } from '@/constants/sortOptions';

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

  const {
  sortOption,
    setSortOption,
    sortedMovies,
  } = useMovieSorting(likedMovies);

  if (!likedMovies.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Brak polubionych filmów</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HelpButton />
      <SearchButton />
      <Title title="Polubienia" />

      <Selector<string>
        options={SORT_OPTIONS}
        selectedOption={sortOption}
          onSelectOption={(optionId) => {
            if (optionId !== null) {
              setSortOption(optionId as SortOption);
            }
          }}
        placeholder="Sortuj"
      />

      <View style={{ height: 16 }} />

      <FlatList
        data={sortedMovies}
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
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  emptyText: { color: Colors.text, fontSize: 16 },
});