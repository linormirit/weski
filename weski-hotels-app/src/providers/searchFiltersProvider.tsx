import { ReactNode, useState } from "react";
import { SearchFilters, SearchFiltersContext } from "../contexts/searchFiltersContext";
import dayjs from "dayjs";

const defaultFilters: SearchFilters = {
  skiSiteId: 1,
  groupSize: 1,
  startDate: dayjs().toDate(),
  endDate: dayjs().add(7, 'days').toDate(),
};

export const SearchFiltersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const setSkiSiteId = (id: number) => setFilters((s) => ({ ...s, skiSiteId: id }));
  const setGroupSize = (n: number) => setFilters((s) => ({ ...s, groupSize: n }));
  const setStartDate = (d: Date | null) => setFilters((s) => ({ ...s, startDate: d }));
  const setEndDate = (d: Date | null) => setFilters((s) => ({ ...s, endDate: d }));
  const setFiltersPatch = (patch: Partial<SearchFilters>) => setFilters((s) => ({ ...s, ...patch }));

  return (
    <SearchFiltersContext.Provider value={{ filters, setSkiSiteId, setGroupSize, setStartDate, setEndDate, setFilters: setFiltersPatch }}>
      {children}
    </SearchFiltersContext.Provider>
  );
};