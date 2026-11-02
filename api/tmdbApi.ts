import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants/config';
import { Movie } from '../models/Movie';

interface TMDBResponse {
  results: Movie[];
}

interface TMDBVideosResponse {
  results: {
    key: string;
    type: string;
    site: string;
  }[];
}

// Popular movies
export const getPopularMovies = async (
  page: number = 1
): Promise<Movie[]> => {
  const response = await axios.get<TMDBResponse>(
    `${TMDB_BASE_URL}/movie/popular`,
    {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pl-PL',
        page,
      },
    }
  );

  return response.data.results;
};

// Movies filtered by genre
export const getMovies = async (
  genreId: number | null,
  page: number = 1
): Promise<Movie[]> => {
  const endpoint = genreId
    ? `${TMDB_BASE_URL}/discover/movie`
    : `${TMDB_BASE_URL}/movie/popular`;

  const response = await axios.get<TMDBResponse>(endpoint, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'pl-PL',
      page,
      ...(genreId && { with_genres: genreId }),
    },
  });

  return response.data.results;
};

// Search movies by title
export const searchMovies = async (
  query: string
): Promise<Movie[]> => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await axios.get<TMDBResponse>(
    `${TMDB_BASE_URL}/search/movie`,
    {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pl-PL',
        query: trimmedQuery,
        page: 1,
        include_adult: false,
      },
    }
  );

  return response.data.results;
};

// Get a movie trailer
export const getMovieTrailer = async (movieId: number) => {
  const response = await axios.get<TMDBVideosResponse>(
    `${TMDB_BASE_URL}/movie/${movieId}/videos`,
    {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      },
    }
  );

  const trailer = response.data.results.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;
};