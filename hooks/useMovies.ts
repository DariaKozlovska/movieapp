import { useEffect, useState } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPopularMovies();
      setMovies(data);
    } catch (err) {
      setError('Nie udało się pobrać filmów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    refetch: fetchMovies,
  };
};