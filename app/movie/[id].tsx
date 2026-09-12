import { useState, useEffect } from 'react';
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
import { Colors } from '@/constants/colors';
import HelpButton from '@/components/Button/HelpButton';
import Title from '@/components/Text/title';
import { router } from 'expo-router';
import { Fonts } from '@/constants/fonts';
import { GENRES } from '@/constants/genres';
import AppButton from '@/components/Button/AppButton';
import LikeButton from '@/components/Button/LikeButton';
import { Movie } from '@/models/Movie';
import { WatchedMovie } from '@/models/WatchedMovie';
import { BackButton } from '@/components/Button/BackButton';

const { height } = Dimensions.get('window');

function toMovie(source: Movie | WatchedMovie, genre: string): Movie {
  return {
    id: source.id,
    title: source.title,
    overview: source.overview ?? '',
    poster_path: source.poster_path ?? '',
    release_date: source.release_date ?? '',
    vote_average:
      'vote_average' in source
        ? source.vote_average
        : 'userRating' in source
        ? source.userRating
        : 0,
    trailer_url: source.trailer_url,
    genre_ids: 'genre_ids' in source ? source.genre_ids : undefined,
    genre,
  };
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movies } = useMovies();
  const { watchedMovies, updateWatchedMovie, addWatchedMovie } = useWatchedMovies();
  const { likedMovies } = useLikedMovies();

  const watchedMovie = watchedMovies.find((m) => m.id.toString() === id);
  const likedMovie = likedMovies.find((m) => m.id.toString() === id);
  const apiMovie = movies.find((m) => m.id.toString() === id);

  const movie = watchedMovie || likedMovie || apiMovie;

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text }}>Nie znaleziono filmu</Text>
      </View>
    );
  }

  const genreNames =
    movie.genre_ids?.map((gid) => GENRES.find((g) => g.id === gid)?.name).filter(Boolean) ?? [];
  const genreLabel = genreNames.join(', ');

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

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: height }]}
      style={{ backgroundColor: Colors.background }}
    >
      <HelpButton />
      <Title title={movie.title} style={{ marginTop: 70 }} />

      <BackButton />

      {posterUri ? (
        <View style={styles.posterWrapper}>
          <Image source={{ uri: posterUri }} style={styles.image} />
          <View style={styles.likeButtonOverlay}>
            <LikeButton movie={toMovie(movie, genreLabel)} />
          </View>
        </View>
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Brak okładki</Text>
        </View>
      )}

      <View style={styles.rating}>
        <Text style={{ fontSize: 20, color: Colors.text, marginRight: 8, fontFamily: Fonts.bold }}>
          {(watchedMovie?.userRating ?? ('vote_average' in movie ? movie.vote_average ?? 0 : 0)).toFixed(1)}
        </Text>
        <Image source={require('@/assets/images/Star.png')} style={{ width: 26, height: 26 }} />
        <Text style={{ fontSize: 20, color: Colors.text, marginLeft: 8, fontFamily: Fonts.bold }}>
          {genreLabel}
        </Text>
      </View>

      <Text style={styles.overview}>{movie.overview ?? 'Brak opisu'}</Text>

      <AppButton title={'Zobacz zwiastun'} onPress={openTrailer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { padding: 16, alignItems: 'center' },
  posterWrapper: { width: '100%', marginVertical: 16 },
  image: { width: '100%', height: 400, borderRadius: 16 },
  likeButtonOverlay: { position: 'absolute', bottom: 0, right: 0},
  noImage: { backgroundColor: Colors.placeholder, justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: Colors.disactiveTab },
  rating: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end' },
  overview: { fontSize: 20, color: Colors.text, textAlign: 'justify', marginBottom: 16, fontFamily: Fonts.regular },
  date: { fontSize: 14, color: Colors.disactiveTab },
  trailerButton: { backgroundColor: Colors.red, paddingVertical: 14, borderRadius: 12, width: '90%', alignItems: 'center', marginTop: 16 },
  trailerText: { color: Colors.text, fontSize: 18, fontWeight: '600' },
  customInfo: { marginTop: 12, color: Colors.disactiveTab, fontStyle: 'italic' },
});