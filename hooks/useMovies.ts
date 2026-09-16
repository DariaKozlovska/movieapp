import { useCallback, useEffect, useState } from 'react';
import { Movie } from '../models/Movie';
import { getMovies } from '../api/tmdbApi';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMovies(selectedGenre);
      setMovies(data);
    } catch {
      setError('Nie udało się pobrać filmów');
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    selectedGenre,
    setSelectedGenre,
    refetch: fetchMovies,
  };
};