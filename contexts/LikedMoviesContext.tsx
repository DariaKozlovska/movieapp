import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Movie } from '../models/Movie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface LikedMoviesContextType {
  likedMovies: Movie[];
  addLikedMovie: (movie: Movie) => void;
  removeLikedMovie: (id: number) => void;
}

const LikedMoviesContext = createContext<LikedMoviesContextType>({
  likedMovies: [],
  addLikedMovie: () => {},
  removeLikedMovie: () => {},
});

export const useLikedMovies = () => useContext(LikedMoviesContext);

interface Props {
  children: ReactNode;
}

export const LikedMoviesProvider = ({ children }: Props) => {
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const addLikedMovie = (movie: Movie) => {
    setLikedMovies((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeLikedMovie = (id: number) => {
    setLikedMovies((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    const loadLikedMovies = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.LIKED);
        if (json) {
          setLikedMovies(JSON.parse(json));
        }
      } catch (e) {
        console.log('Błąd wczytywania polubionych filmów', e);
      } finally {
        setLoading(false);
      }
    };

    loadLikedMovies();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.LIKED,
        JSON.stringify(likedMovies)
      );
    }
  }, [likedMovies, loading]);

  return (
    <LikedMoviesContext.Provider
      value={{ likedMovies, addLikedMovie, removeLikedMovie }}
    >
      {children}
    </LikedMoviesContext.Provider>
  );
};