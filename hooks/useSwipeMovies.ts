import { useEffect, useState, useMemo } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';
import { useLikedMovies } from '../contexts/LikedMoviesContext';
import { useWatchedMovies } from '../contexts/WatchedMoviesContext';

export const useSwipeMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { addLikedMovie, likedMovies } = useLikedMovies();
  const { watchedMovies } = useWatchedMovies();

  // Tworzymy set z ID filmów, które mają być wykluczone
  const excludedIds = useMemo(() => {
    const likedIds = likedMovies.map(m => m.id);
    const watchedIds = watchedMovies.map(m => m.id);
    return new Set([...likedIds, ...watchedIds]);
  }, [likedMovies, watchedMovies]);

  // Filtrowanie filmów przed zwróceniem ich do UI
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => !excludedIds.has(movie.id));
  }, [movies, excludedIds]);

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
    if (currentIndex < filteredMovies.length) {
      addLikedMovie(filteredMovies[currentIndex]); // dodanie do liked
      setCurrentIndex(currentIndex + 1);
    }
  };

  const swipeLeft = () => {
    if (currentIndex < filteredMovies.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  useEffect(() => {
    if (filteredMovies.length - currentIndex <= 3 && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [currentIndex, filteredMovies, loading]);

  return {
    movies: filteredMovies, 
    currentIndex,
    swipeLeft,
    swipeRight,
    loading,
    error,
    refetch: fetchMovies,
  };
};