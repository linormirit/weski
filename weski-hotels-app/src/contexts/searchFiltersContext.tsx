import { createContext, useContext } from 'react';

export type SearchFilters = {
  skiSiteId: number;
  groupSize: number;
  startDate: Date | null;
  endDate: Date | null;
};

export type SearchFiltersContextValue = {
  filters: SearchFilters;
  setSkiSiteId: (id: number) => void;
  setGroupSize: (n: number) => void;
  setStartDate: (d: Date | null) => void;
  setEndDate: (d: Date | null) => void;
  setFilters: (patch: Partial<SearchFilters>) => void;
};

export const SearchFiltersContext = createContext<SearchFiltersContextValue | undefined>(undefined);

export function useSearchFilters() {
  const ctx = useContext(SearchFiltersContext);
  if (!ctx) throw new Error('useSearchFilters must be used within SearchFiltersProvider');
  return ctx;
}
