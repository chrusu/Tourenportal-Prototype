import { useMemo, useState } from "react";
import {
  applyFilters,
  countActiveFilters,
  createInitialFilterState,
  emptyFilterState,
  type TourFilterState,
} from "@/lib/filter";
import type { Tour } from "@/types/tour";

export function useTourFilters(tours: Tour[]) {
  const [filters, setFilters] = useState<TourFilterState>(createInitialFilterState);

  const update = <K extends keyof TourFilterState>(
    key: K,
    value: TourFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setFilters(createInitialFilterState());

  const resetKey = <K extends keyof TourFilterState>(key: K) => {
    update(key, emptyFilterState[key]);
  };

  const filtered = useMemo(() => applyFilters(tours, filters), [tours, filters]);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  return { filters, setFilters, update, reset, resetKey, filtered, activeCount };
}
