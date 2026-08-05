import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyFilters,
  countActiveFilters,
  createInitialFilterState,
  emptyFilterState,
  type TourFilterState,
} from "@/lib/filter";
import type { Tour } from "@/types/tour";

/**
 * Simulated network delay for the very first filter change after a (re)load,
 * so the loading indicator has something to show for a demo/prototype.
 * Every subsequent change applies instantly, as if already cached.
 */
const FIRST_LOAD_DELAY_MS = 900;

export function useTourFilters(tours: Tour[]) {
  const [filters, setFilters] = useState<TourFilterState>(createInitialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<TourFilterState>(filters);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);
  const hasDelayedOnce = useRef(false);
  const timeoutRef = useRef<number>();

  // Whenever `filters` changes, apply it to `appliedFilters` (which drives
  // the actual result list) — instantly, except for the very first change
  // since mount/reload, which is deliberately delayed to simulate loading.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.clearTimeout(timeoutRef.current);

    if (!hasDelayedOnce.current) {
      hasDelayedOnce.current = true;
      setIsLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setAppliedFilters(filters);
        setIsLoading(false);
      }, FIRST_LOAD_DELAY_MS);
    } else {
      setAppliedFilters(filters);
    }

    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const filtered = useMemo(() => applyFilters(tours, appliedFilters), [tours, appliedFilters]);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  return { filters, setFilters, update, reset, resetKey, filtered, activeCount, isLoading };
}
