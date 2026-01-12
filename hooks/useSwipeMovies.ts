import { useEffect, useState } from 'react';
import { Movie } from '../models/Movie';
import { getPopularMovies } from '../api/tmdbApi';
import { useLikedMovies } from '../contexts/LikedMoviesContext';

export const useSwipeMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { addLikedMovie } = useLikedMovies();

  const fetchMovies = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await getPopularMovies(pageNumber);
      setMovies(prev =>
        pageNumber === 1 ? data : [...prev, ...data]
      );
    } catch (e) {
      console.log('Błąd pobierania filmów', e);
    } finally {
      setLoading(false);
    }
  };

  const swipeRight = () => {
    const movie = movies[currentIndex];
    if (!movie) return;

    addLikedMovie(movie);     // zapis do contextu
    setCurrentIndex(i => i + 1); // TYLKO index
  };

  const swipeLeft = () => {
    setCurrentIndex(i => i + 1);
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
  }, [currentIndex, movies]);

  return {
    movies,
    currentIndex,
    swipeLeft,
    swipeRight,
    loading,
  };
};