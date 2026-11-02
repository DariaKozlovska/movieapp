import { useSearchContext } from '@/contexts/SearchContext';

export default function useSearchViewModel() {
  const {
    query,
    setQuery,
    movies,
    isLoading,
    error,
    clearSearch,
  } = useSearchContext();

  return {
    query,
    setQuery,
    movies,
    isLoading,
    error,
    clearSearch,
  };
}