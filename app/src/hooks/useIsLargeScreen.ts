import { useEffect, useState } from "react";

const QUERY = "(min-width: 1024px)";

export function useIsLargeScreen(): boolean {
  const [isLg, setIsLg] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isLg;
}
