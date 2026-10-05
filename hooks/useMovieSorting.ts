import { useMemo, useState } from 'react';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'titleAsc'
  | 'titleDesc'
  | 'ratingDesc'
  | 'ratingAsc';

type SortableMovie = {
  title: string;
  vote_average?: number;
  userRating?: number;
  watchedAt?: string;
};

export const useMovieSorting = <T extends SortableMovie>(
  movies: T[],
) => {
  const [sortOption, setSortOption] =
    useState<SortOption>('newest');

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
          (a, b) =>
            (b.userRating ?? b.vote_average ?? 0) -
            (a.userRating ?? a.vote_average ?? 0),
        );

      case 'ratingAsc':
        return moviesToSort.sort(
          (a, b) =>
            (a.userRating ?? a.vote_average ?? 0) -
            (b.userRating ?? b.vote_average ?? 0),
        );

      case 'newest':
        return moviesToSort.sort((a, b) => {
          if (a.watchedAt && b.watchedAt) {
            return (
              new Date(b.watchedAt).getTime() -
              new Date(a.watchedAt).getTime()
            );
          }

          return 0;
        });

      case 'oldest':
        return moviesToSort.sort((a, b) => {
          if (a.watchedAt && b.watchedAt) {
            return (
              new Date(a.watchedAt).getTime() -
              new Date(b.watchedAt).getTime()
            );
          }

          return 0;
        });

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