import { useEffect, useState } from "react";

function readValue<T>(key: string, initialValue: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * A `useState` that persists its value to `localStorage` under `key`.
 *
 * When `key` is `null` (e.g. no user is logged in), the state simply resets
 * to `initialValue` and nothing is read from / written to storage — this is
 * used to scope per-user data (favorites, saved filters) to the current
 * fake-login session without leaking data across users.
 */
export function useLocalStorageState<T>(
  key: string | null,
  initialValue: T
): readonly [T, (updater: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() =>
    key && typeof window !== "undefined" ? readValue(key, initialValue) : initialValue
  );

  // Reload the value whenever the storage key changes (e.g. login/logout).
  useEffect(() => {
    if (!key || typeof window === "undefined") {
      setValue(initialValue);
      return;
    }
    setValue(readValue(key, initialValue));
    // Only re-run when the key itself changes; `initialValue` is treated as
    // a stable default for this hook's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota/serialization errors in this prototype.
    }
  }, [key, value]);

  const set = (updater: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater
    );
  };

  return [value, set] as const;
}
