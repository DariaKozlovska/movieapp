export interface WatchedMovie {
  id: number;
  title: string;
  poster_path?: string;

  userRating: number;
  review?: string;
  watchedAt: string;

  overview?: string;
  trailer_url?: string;

  addedByUser?: boolean;
  createdAt?: number;
  release_date?: string;

  genre_ids?: number[];
  genre?: string;
}