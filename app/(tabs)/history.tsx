import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import MovieCard from '../../components/MovieCard';
import AddWatchedModal from '../../components/AddWatchedModal';

import Title from '@/components/Text/title';
import { SearchButton } from '@/components/Button/SearchButton';
import HelpButton from '@/components/Button/HelpButton';
import Selector from '@/components/Selectors/Selector';

import { Colors } from '@/constants/colors';
import { SORT_OPTIONS } from '@/constants/sortOptions';
import { SortOption, useMovieSorting } from '@/hooks/useMovieSorting';

import { WatchedMovie } from '@/models/WatchedMovie';

export default function WatchedScreen() {
  const router = useRouter();

  const {
    watchedMovies,
    removeWatchedMovie,
    updateWatchedMovie,
  } = useWatchedMovies();

  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  const {
    sortOption,
    setSortOption,
    sortedMovies,
  } = useMovieSorting(watchedMovies);

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

    updateWatchedMovie(
      editingMovieId,
      rating,
      review,
    );

    setEditingMovieId(null);
  };

  const cancelEdit = () => {
    setEditingMovieId(null);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: WatchedMovie;
    index: number;
  }) => (
    <MovieCard
      movie={item}
      userRating={item.userRating}
      userReview={item.review}
      isWatched
      onRemove={() => handleRemove(item.id)}
      onEdit={() => handleEdit(item.id)}
      onPress={() => router.push(`/movie/${item.id}`)}
    />
  );

  const editingMovie =
    editingMovieId !== null
      ? watchedMovies.find((m) => m.id === editingMovieId)
      : null;

  return (
    <View style={styles.container}>
      <HelpButton />
      <SearchButton />

      <Title title="Historia seansów" />

      <Selector<SortOption>
        options={SORT_OPTIONS}
        selectedOption={sortOption}
        onSelectOption={(optionId) => {
          if (optionId !== null) {
            setSortOption(optionId);
          }
        }}
        placeholder="Sortuj"
      />

      <View style={{ height: 16 }} />

      {watchedMovies.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Nie masz jeszcze żadnych obejrzanych filmów.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedMovies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: Colors.text,
    fontSize: 16,
  },
});