import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WatchedMovie } from '../models/WatchedMovie';
import { Movie } from '../models/Movie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface WatchedMoviesContextType {
  watchedMovies: WatchedMovie[];

  addWatchedMovie: (
    movie: Movie,
    rating: number,
    review?: string,
    options?: {
      addedByUser?: boolean;
    }
  ) => void;

  updateWatchedMovie: (
    id: number,
    rating?: number,
    review?: string,
    updates?: Partial<WatchedMovie>
  ) => void;

  removeWatchedMovie: (id: number) => void;
}

const WatchedMoviesContext =
  createContext<WatchedMoviesContextType | null>(null);

export function WatchedMoviesProvider({ children }: { children: ReactNode }) {
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const addWatchedMovie = (
    movie: Movie,
    rating: number,
    review?: string,
    options?: { addedByUser?: boolean }
  ) => {
    const watchedMovie: WatchedMovie = {
      ...movie,
      userRating: rating,
      review,
      watchedAt: new Date().toISOString(),
      createdAt: Date.now(),
      addedByUser: options?.addedByUser ?? false,
    };

    setWatchedMovies(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      return [watchedMovie, ...prev];
    });
  };

  const updateWatchedMovie = (
    id: number,
    rating?: number,
    review?: string,
    updates?: Partial<WatchedMovie>
  ) => {
    setWatchedMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              userRating: rating ?? movie.userRating,
              review: review ?? movie.review,
              ...updates,
            }
          : movie
      )
    );
  };

  const removeWatchedMovie = (id: number) => {
    setWatchedMovies((prev) =>
      prev.filter((movie) => movie.id !== id)
    );
  };

  useEffect(() => {
    const loadWatchedMovies = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.WATCHED);
        if (json) {
          setWatchedMovies(JSON.parse(json));
        }
      } catch (e) {
        console.log('Błąd wczytywania obejrzanych filmów', e);
      } finally {
        setLoading(false);
      }
    };

    loadWatchedMovies();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.WATCHED,
        JSON.stringify(watchedMovies)
      );
    }
  }, [watchedMovies, loading]);

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