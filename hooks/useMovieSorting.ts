import { useMemo, useState } from 'react';
import { Movie } from '@/models/Movie';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'titleAsc'
  | 'titleDesc'
  | 'ratingDesc'
  | 'ratingAsc';

export const useMovieSorting = (movies: Movie[]) => {
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const sortedMovies = useMemo(() => {
    const moviesToSort = [...movies];

    switch (sortOption) {
      case 'titleAsc':
        return moviesToSort.sort((a, b) =>
          a.title.localeCompare(b.title),
        );

      case 'titleDesc':
        return moviesToSort.sort((a, b) =>
          b.title.localeCompare(a.title),
        );

      case 'ratingDesc':
        return moviesToSort.sort(
          (a, b) => b.vote_average - a.vote_average,
        );

      case 'ratingAsc':
        return moviesToSort.sort(
          (a, b) => a.vote_average - b.vote_average,
        );

      case 'newest':
        return moviesToSort.reverse();

      case 'oldest':
      default:
        return moviesToSort;
    }
  }, [movies, sortOption]);

  return {
    sortOption,
    setSortOption,
    sortedMovies,
  };
};