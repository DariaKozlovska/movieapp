import { useEffect, useState, useMemo } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';
import { useLikedMovies } from '../contexts/LikedMoviesContext';
import { useWatchedMovies } from '../contexts/WatchedMoviesContext';

export const useSwipeMovies = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { likedMovies, addLikedMovie } = useLikedMovies();
  const { watchedMovies } = useWatchedMovies();

  const excludedIds = useMemo(
    () =>
      new Set<number>([
        ...likedMovies.map(m => m.id),
        ...watchedMovies.map(m => m.id),
      ]),
    [likedMovies, watchedMovies]
  );

  const fetchMovies = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await getPopularMovies(pageNumber);

      setAllMovies(prev =>
        pageNumber === 1 ? data : [...prev, ...data]
      );
    } catch (e) {
      console.log('Błąd pobierania filmów', e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GOTOWA KOLEJKA DO SWIPE
  const swipeMovies = useMemo(() => {
    return allMovies.filter(movie => !excludedIds.has(movie.id));
  }, [allMovies, excludedIds]);

  const swipeRight = () => {
    const movie = swipeMovies[0];
    if (!movie) return;

    addLikedMovie(movie);

    // 🔥 USUWAMY FILM Z KOLEJKI
    setAllMovies(prev => prev.filter(m => m.id !== movie.id));
  };

  const swipeLeft = () => {
    const movie = swipeMovies[0];
    if (!movie) return;

    setAllMovies(prev => prev.filter(m => m.id !== movie.id));
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  useEffect(() => {
    if (swipeMovies.length <= 3 && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [swipeMovies, loading]);

  return {
    movies: swipeMovies,
    loading,
    swipeLeft,
    swipeRight,
  };
};