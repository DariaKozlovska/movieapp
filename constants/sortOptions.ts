import { SelectorOption } from '@/components/Selectors/Selector';

export const SORT_OPTIONS: SelectorOption<string>[] = [
  { id: 'newest', name: 'Najnowsze' },
  { id: 'oldest', name: 'Najstarsze' },
  { id: 'titleAsc', name: 'Tytuł A–Z' },
  { id: 'titleDesc', name: 'Tytuł Z–A' },
  { id: 'ratingDesc', name: 'Najwyżej oceniane' },
  { id: 'ratingAsc', name: 'Najniżej oceniane' },
];