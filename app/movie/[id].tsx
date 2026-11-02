import { useState, useEffect } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useMovies } from '../../hooks/useMovies';
import { useWatchedMovies } from '../../contexts/WatchedMoviesContext';
import { useLikedMovies } from '../../contexts/LikedMoviesContext';

import {
  getMovieDetails,
  getMovieTrailer,
} from '../../api/tmdbApi';

import { TMDB_IMAGE_URL } from '../../constants/config';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { GENRES } from '@/constants/genres';

import HelpButton from '@/components/Button/HelpButton';
import Title from '@/components/Text/title';
import AppButton from '@/components/Button/AppButton';
import LikeButton from '@/components/Button/LikeButton';
import { BackButton } from '@/components/Button/BackButton';

import { Movie } from '@/models/Movie';
import { WatchedMovie } from '@/models/WatchedMovie';

import { getRoomMovie } from '@/services/roomMovieCache';

const { height } = Dimensions.get('window');

// Convert WatchedMovie into Movie
function toMovie(
  source: Movie | WatchedMovie,
  genre: string
): Movie {
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
    genre_ids:
      'genre_ids' in source ? source.genre_ids : undefined,
    genre,
  };
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { movies } = useMovies();

  const {
    watchedMovies,
  } = useWatchedMovies();

  const {
    likedMovies,
  } = useLikedMovies();

  // Find movie in local collections
  const watchedMovie = watchedMovies.find(
    (m) => m.id.toString() === id
  );

  const likedMovie = likedMovies.find(
    (m) => m.id.toString() === id
  );

  const apiMovie = movies.find(
    (m) => m.id.toString() === id
  );

  // Movie from room session
  const roomMovie = getRoomMovie(Number(id));

  // Existing local movie
  const localMovie =
    watchedMovie ||
    likedMovie ||
    apiMovie ||
    roomMovie;

  // Movie retrieved directly from TMDB
  const [fetchedMovie, setFetchedMovie] =
    useState<Movie | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [detailsError, setDetailsError] =
    useState(false);

  // Fetch complete movie details
  useEffect(() => {
    let isActive = true;

    const fetchDetails = async () => {
      if (!id) {
        return;
      }

      try {
        setDetailsLoading(true);
        setDetailsError(false);
        setFetchedMovie(null);

        const result = await getMovieDetails(Number(id));

        if (isActive) {
          setFetchedMovie(result);
        }
      } catch (error) {
        console.error(
          'Error fetching movie details:',
          error
        );

        if (isActive) {
          setDetailsError(true);
        }
      } finally {
        if (isActive) {
          setDetailsLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isActive = false;
    };
  }, [id]);

  // Prefer complete TMDB information
  const movie = fetchedMovie || localMovie;

  // Loading / error screen
  if (!movie) {
    return (
      <View style={styles.center}>
        <BackButton />

        {detailsLoading ? (
          <>
            <ActivityIndicator
              size="large"
              color={Colors.green}
            />

            <Text style={styles.statusText}>
              Ładowanie informacji o filmie...
            </Text>
          </>
        ) : (
          <Text style={styles.statusText}>
            {detailsError
              ? 'Nie udało się pobrać informacji o filmie.'
              : 'Nie znaleziono filmu.'}
          </Text>
        )}
      </View>
    );
  }

  // Movie genres
  const genreNames =
    movie.genre_ids
      ?.map(
        (gid) => GENRES.find((g) => g.id === gid)?.name
      )
      .filter(Boolean) ?? [];

  const genreLabel = genreNames.join(', ');

  // Movie poster
  const posterUri = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${TMDB_IMAGE_URL}${movie.poster_path}`
    : null;

  // Open movie trailer
  const openTrailer = async () => {
    try {
      const url =
        movie.trailer_url ??
        (await getMovieTrailer(movie.id));

      if (!url) {
        Alert.alert(
          'Brak zwiastuna',
          'Ten film nie ma dostępnego zwiastuna.'
        );

        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Błąd',
        'Nie udało się otworzyć zwiastuna.'
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { minHeight: height },
      ]}
      style={{
        backgroundColor: Colors.background,
      }}
    >
      <HelpButton />

      <Title
        title={movie.title}
        style={{ marginTop: 70 }}
      />

      <BackButton />

      {posterUri ? (
        <View style={styles.posterWrapper}>
          <Image
            source={{ uri: posterUri }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.likeButtonOverlay}>
            <LikeButton
              movie={toMovie(movie, genreLabel)}
            />
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.image,
            styles.noImage,
          ]}
        >
          <Text style={styles.noImageText}>
            Brak okładki
          </Text>
        </View>
      )}

      {/* Rating and genres */}
      <View style={styles.rating}>
        <Text style={styles.ratingText}>
          {(
            watchedMovie
              ? watchedMovie.userRating
              : 'vote_average' in movie
                ? movie.vote_average ?? 0
                : 0
          ).toFixed(1)}
        </Text>

        <Image
          source={require('@/assets/images/Star.png')}
          style={{ width: 26, height: 26 }}
        />

        <Text style={styles.genreText}>
          {genreLabel || 'Brak informacji o gatunku'}
        </Text>
      </View>

      {/* Movie description */}
      <Text style={styles.overview}>
        {movie.overview?.trim() || 'Brak opisu filmu.'}
      </Text>

      {/* Trailer button */}
      <AppButton
        title="Zobacz zwiastun"
        onPress={openTrailer}
      />

      {/* Information about failed details request */}
      {detailsError && (
        <Text style={styles.customInfo}>
          Niektóre informacje o filmie mogą być nieaktualne.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },

  container: {
    padding: 16,
    alignItems: 'center',
  },

  posterWrapper: {
    width: '100%',
    marginVertical: 16,
  },

  image: {
    width: '100%',
    height: 400,
    borderRadius: 16,
  },

  likeButtonOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  noImage: {
    backgroundColor: Colors.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageText: {
    color: Colors.disactiveTab,
  },

  rating: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  ratingText: {
    fontSize: 20,
    color: Colors.text,
    marginRight: 8,
    fontFamily: Fonts.bold,
  },

  genreText: {
    fontSize: 20,
    color: Colors.text,
    marginLeft: 8,
    fontFamily: Fonts.bold,
  },

  overview: {
    fontSize: 20,
    color: Colors.text,
    textAlign: 'justify',
    marginBottom: 16,
    fontFamily: Fonts.regular,
  },

  date: {
    fontSize: 14,
    color: Colors.disactiveTab,
    marginBottom: 12,
    fontFamily: Fonts.regular,
  },

  statusText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: 16,
  },

  customInfo: {
    marginTop: 12,
    color: Colors.disactiveTab,
    fontStyle: 'italic',
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
});