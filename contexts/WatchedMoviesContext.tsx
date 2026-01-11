import { createContext, useContext, useState, ReactNode } from 'react';
import { WatchedMovie } from '../models/WatchedMovie';
import { Movie } from '../models/Movie';

interface WatchedMoviesContextType {
  watchedMovies: WatchedMovie[];
  addWatchedMovie: (movie: Movie, rating: number, review?: string) => void;
  updateWatchedMovie: (id: number, rating: number, review?: string) => void;
  removeWatchedMovie: (id: number) => void;
}

const WatchedMoviesContext =
  createContext<WatchedMoviesContextType | null>(null);

export function WatchedMoviesProvider({ children }: { children: ReactNode }) {
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);

  const addWatchedMovie = (
    movie: Movie,
    rating: number,
    review?: string
  ) => {
    const watchedMovie: WatchedMovie = {
      ...movie,
      userRating: rating,
      review,
      watchedAt: new Date().toISOString(),
    };

    setWatchedMovies((prev) => [watchedMovie, ...prev]);
  };

  const updateWatchedMovie = (
    id: number,
    rating: number,
    review?: string
  ) => {
    setWatchedMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, userRating: rating, review }
          : movie
      )
    );
  };

  const removeWatchedMovie = (id: number) => {
    setWatchedMovies((prev) =>
      prev.filter((movie) => movie.id !== id)
    );
  };

  return (
    <WatchedMoviesContext.Provider
      value={{
        watchedMovies,
        addWatchedMovie,
        updateWatchedMovie,
        removeWatchedMovie,
      }}
    >
      {children}
    </WatchedMoviesContext.Provider>
  );
}

export const useWatchedMovies = () => {
  const context = useContext(WatchedMoviesContext);
  if (!context) {
    throw new Error(
      'useWatchedMovies must be used within WatchedMoviesProvider'
    );
  }
  return context;
};