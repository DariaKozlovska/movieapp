import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '../models/Movie';

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

  const addLikedMovie = (movie: Movie) => {
    setLikedMovies((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeLikedMovie = (id: number) => {
    setLikedMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <LikedMoviesContext.Provider value={{ likedMovies, addLikedMovie, removeLikedMovie }}>
      {children}
    </LikedMoviesContext.Provider>
  );
};