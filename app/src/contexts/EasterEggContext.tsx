import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const STORAGE_KEY = "tourenportal.easterEgg.unlocked";

/** Number of clicks in quick succession required to unlock the easter egg. */
const REQUIRED_CLICKS = 5;
/** Max time (ms) between the first and last of those clicks. */
const CLICK_WINDOW_MS = 1500;

interface EasterEggContextValue {
  /** Whether the hidden "power user" features (favorites, my activities,
   * login, saved filters) are revealed. */
  unlocked: boolean;
  /** Call on every click in the header area; toggles after 5 fast clicks. */
  registerHeaderClick: () => void;
}

const EasterEggContext = createContext<EasterEggContextValue | undefined>(undefined);

/**
 * Hidden feature flag for the demo: favorites, my activities, login and
 * saved filters are disabled by default and revealed once the user clicks 5
 * times in quick succession anywhere in the header area — a small easter
 * egg rather than a real access-control mechanism. Repeating the 5-click
 * hides the features again.
 */
export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useLocalStorageState<boolean>(STORAGE_KEY, false);
  const clickTimestamps = useRef<number[]>([]);

  const registerHeaderClick = useCallback(() => {
    const now = Date.now();
    const recent = clickTimestamps.current.filter((t) => now - t <= CLICK_WINDOW_MS);
    recent.push(now);
    clickTimestamps.current = recent;

    if (recent.length >= REQUIRED_CLICKS) {
      clickTimestamps.current = [];
      setUnlocked((prev) => !prev);
    }
  }, [setUnlocked]);

  const value = useMemo<EasterEggContextValue>(
    () => ({ unlocked, registerHeaderClick }),
    [unlocked, registerHeaderClick]
  );

  return <EasterEggContext.Provider value={value}>{children}</EasterEggContext.Provider>;
}

export function useEasterEgg(): EasterEggContextValue {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error("useEasterEgg must be used within an EasterEggProvider");
  return ctx;
}
