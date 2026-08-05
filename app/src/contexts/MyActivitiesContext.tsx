import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

/**
 * "Meine Aktivitäten": activities the demo user has applied to (clicked
 * "Anmelden"/"Anmeldung") or previously attended. Unlike favorites, this
 * list can't be curated manually — it's only ever added to automatically.
 */
const DEFAULT_APPLIED_IDS: string[] = [
  "bern-2026-0001",
  "bern-2026-0007",
  "bern-2026-0014",
];

interface MyActivitiesContextValue {
  appliedIds: string[];
  isApplied: (tourId: string) => boolean;
  /** Marks a tour as applied without unmarking it if already present. */
  markApplied: (tourId: string) => void;
}

const MyActivitiesContext = createContext<MyActivitiesContextValue | undefined>(undefined);

export function MyActivitiesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user ? `tourenportal.myActivities.${user.id}` : null;
  const [appliedIds, setAppliedIds] = useLocalStorageState<string[]>(
    storageKey,
    DEFAULT_APPLIED_IDS
  );

  const value = useMemo<MyActivitiesContextValue>(
    () => ({
      appliedIds,
      isApplied: (tourId) => appliedIds.includes(tourId),
      markApplied: (tourId) => {
        setAppliedIds((prev) => (prev.includes(tourId) ? prev : [...prev, tourId]));
      },
    }),
    [appliedIds, setAppliedIds]
  );

  return (
    <MyActivitiesContext.Provider value={value}>{children}</MyActivitiesContext.Provider>
  );
}

export function useMyActivities(): MyActivitiesContextValue {
  const ctx = useContext(MyActivitiesContext);
  if (!ctx) throw new Error("useMyActivities must be used within a MyActivitiesProvider");
  return ctx;
}
