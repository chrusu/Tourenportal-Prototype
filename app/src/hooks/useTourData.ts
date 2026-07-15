import { useMemo } from "react";
import raw from "@/data/mockdata.json";
import type { Tour, TourData } from "@/types/tour";

export function useTourData(): { section: string; tours: Tour[] } {
  return useMemo(() => {
    const data = raw as unknown as TourData;
    return { section: data.section, tours: data.tours };
  }, []);
}
