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

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};