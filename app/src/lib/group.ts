import type { Tour } from "@/types/tour";
import { monthLabel } from "./format";

export interface TourMonthGroup {
  key: string;
  label: string;
  tours: Tour[];
}

/** Groups tours by calendar month of their start date, preserving order. */
export function groupByMonth(tours: Tour[]): TourMonthGroup[] {
  const groups: TourMonthGroup[] = [];
  const index = new Map<string, TourMonthGroup>();

  for (const tour of tours) {
    const key = tour.startDate.slice(0, 7); // YYYY-MM
    let group = index.get(key);
    if (!group) {
      group = { key, label: monthLabel(tour.startDate), tours: [] };
      index.set(key, group);
      groups.push(group);
    }
    group.tours.push(tour);
  }

  return groups;
}
