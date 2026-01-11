import { useEffect, useState } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';

export const useSwipeMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await getPopularMovies();
      setMovies(data);
    } catch (err) {
      setError('Nie udało się pobrać filmów');
    } finally {
      setLoading(false);
    }
  };

  const swipeRight = () => {
    if (currentIndex < movies.length) {
      setLiked([...liked, movies[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const swipeLeft = () => {
    if (currentIndex < movies.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    currentIndex,
    liked,
    swipeLeft,
    swipeRight,
    loading,
    error,
    refetch: fetchMovies,
  };
};