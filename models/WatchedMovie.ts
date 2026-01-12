import { Movie } from './Movie';

export interface WatchedMovie {
  id: number;
  title: string;
  poster_path?: string;

  userRating: number; 
  review?: string;
  watchedAt: string;

  overview?: string;
  trailer_url?: string;
}