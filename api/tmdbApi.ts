import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants/config';
import { Movie } from '../models/Movie';

interface TMDBResponse {
  results: Movie[];
}

export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await axios.get<TMDBResponse>(`${TMDB_BASE_URL}/movie/popular`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'pl-PL',
    },
  });

  return response.data.results;
};