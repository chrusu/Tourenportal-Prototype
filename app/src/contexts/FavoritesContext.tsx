import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (tourId: string) => boolean;
  toggleFavorite: (tourId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user ? `tourenportal.favorites.${user.id}` : null;
  const [favoriteIds, setFavoriteIds] = useLocalStorageState<string[]>(storageKey, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isFavorite: (tourId) => favoriteIds.includes(tourId),
      toggleFavorite: (tourId) => {
        setFavoriteIds((prev) =>
          prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId]
        );
      },
    }),
    [favoriteIds, setFavoriteIds]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
