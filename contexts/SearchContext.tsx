import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { Movie } from '@/models/Movie';
import { searchMovies } from '@/api/tmdbApi';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setMovies([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchMovies(trimmedQuery);

        if (isActive) {
          setMovies(results);
        }
      } catch (err) {
        if (isActive) {
          setMovies([]);
          setError(
            'Nie udało się pobrać filmów. Sprawdź połączenie z internetem.'
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 400);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setMovies([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        movies,
        isLoading,
        error,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      'useSearchContext must be used within SearchProvider'
    );
  }

  return context;
}