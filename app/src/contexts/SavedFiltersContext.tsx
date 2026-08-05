import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { TourFilterState } from "@/lib/filter";

export interface SavedFilter {
  id: string;
  name: string;
  createdAt: string;
  filters: TourFilterState;
}

interface SavedFiltersContextValue {
  savedFilters: SavedFilter[];
  saveFilter: (name: string, filters: TourFilterState) => void;
  deleteFilter: (id: string) => void;
}

const SavedFiltersContext = createContext<SavedFiltersContextValue | undefined>(undefined);

export function SavedFiltersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user ? `tourenportal.savedFilters.${user.id}` : null;
  const [savedFilters, setSavedFilters] = useLocalStorageState<SavedFilter[]>(storageKey, []);

  const value = useMemo<SavedFiltersContextValue>(
    () => ({
      savedFilters,
      saveFilter: (name, filters) => {
        const entry: SavedFilter = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          createdAt: new Date().toISOString(),
          filters,
        };
        setSavedFilters((prev) => [...prev, entry]);
      },
      deleteFilter: (id) => {
        setSavedFilters((prev) => prev.filter((f) => f.id !== id));
      },
    }),
    [savedFilters, setSavedFilters]
  );

  return (
    <SavedFiltersContext.Provider value={value}>{children}</SavedFiltersContext.Provider>
  );
}

export function useSavedFilters(): SavedFiltersContextValue {
  const ctx = useContext(SavedFiltersContext);
  if (!ctx) throw new Error("useSavedFilters must be used within a SavedFiltersProvider");
  return ctx;
}
