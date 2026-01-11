import { useEffect, useState } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';
import { useLikedMovies } from '../contexts/LikedMoviesContext';

export const useSwipeMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { addLikedMovie } = useLikedMovies();

  const fetchMovies = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await getPopularMovies(pageNumber);
      setMovies((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
    } catch (err) {
      setError('Nie udało się pobrać filmów');
    } finally {
      setLoading(false);
    }
  };

  const swipeRight = () => {
    if (currentIndex < movies.length) {
      addLikedMovie(movies[currentIndex]); // dodanie do kontekstu
      setCurrentIndex(currentIndex + 1);
    }
  };

  const swipeLeft = () => {
    if (currentIndex < movies.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  useEffect(() => {
    if (movies.length - currentIndex <= 3 && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [currentIndex]);

  return {
    movies,
    currentIndex,
    swipeLeft,
    swipeRight,
    loading,
    error,
    refetch: fetchMovies,
  };
};