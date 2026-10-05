import { SelectorOption } from '@/components/Selectors/Selector';
import { SortOption } from '@/hooks/useMovieSorting';

export const SORT_OPTIONS: SelectorOption<SortOption>[] = [
  { id: 'newest', name: 'Najnowsze' },
  { id: 'oldest', name: 'Najstarsze' },
  { id: 'titleAsc', name: 'Tytuł A–Z' },
  { id: 'titleDesc', name: 'Tytuł Z–A' },
  { id: 'ratingDesc', name: 'Najwyżej oceniane' },
  { id: 'ratingAsc', name: 'Najniżej oceniane' },
];