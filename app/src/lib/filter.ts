import type {
  ExperienceLevel,
  PhysicalDifficulty,
  RegistrationStatus,
  Tour,
} from "@/types/tour";
import { matchesRegistrationFilter } from "./status";
import { expandRange, todayISO } from "./format";

export interface TourFilterState {
  dateFrom?: string;
  dateTo?: string;
  fullTextSearch: string;
  groups: string[];
  tourTypes: string[];
  /** discipline label -> selected difficulty grades */
  difficultiesByDiscipline: Record<string, string[]>;
  experienceLevels: ExperienceLevel[];
  physicalDifficulties: PhysicalDifficulty[];
  leader?: string;
  registrationStatuses: RegistrationStatus[];
}

export const emptyFilterState: TourFilterState = {
  fullTextSearch: "",
  groups: [],
  tourTypes: [],
  difficultiesByDiscipline: {},
  experienceLevels: [],
  physicalDifficulties: [],
  registrationStatuses: [],
};

/**
 * Default filter state used on load and on reset: shows tours from today onwards
 * ("Von" defaults to the current date).
 */
export function createInitialFilterState(): TourFilterState {
  return { ...emptyFilterState, dateFrom: todayISO() };
}

function overlapsDateRange(tour: Tour, from?: string, to?: string): boolean {
  const start = tour.startDate;
  const end = tour.endDate ?? tour.startDate;
  if (from && end < from) return false;
  if (to && start > to) return false;
  return true;
}

function matchesText(tour: Tour, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    tour.title,
    tour.destination?.name ?? "",
    tour.tourType.join(" "),
    tour.leaders.map((l) => l.name).join(" "),
    tour.signature ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

/** Tour type + cascading difficulty check (see umsetzungsplan.md). */
function matchesTourType(
  tour: Tour,
  selectedTypes: string[],
  difficultiesByDiscipline: Record<string, string[]>
): boolean {
  if (selectedTypes.length === 0) return true;
  const hasMatchingType = tour.tourType.some((t) => selectedTypes.includes(t));
  if (!hasMatchingType) return false;

  // If any difficulty grades were selected for the matched disciplines,
  // the tour must also match at least one of them.
  const relevantGrades = Object.entries(difficultiesByDiscipline)
    .filter(([, grades]) => grades.length > 0)
    .flatMap(([, grades]) => grades);

  if (relevantGrades.length === 0) return true;

  const tourGrades = expandRange(tour.technicalDifficulty);
  if (tourGrades.length === 0) return false;
  return tourGrades.some((g) => relevantGrades.includes(g));
}

function matchesPhysical(
  tour: Tour,
  selected: PhysicalDifficulty[]
): boolean {
  if (selected.length === 0) return true;
  const tourValues = expandRange(tour.physicalDifficulty) as PhysicalDifficulty[];
  if (tourValues.length === 0) return false;
  return tourValues.some((v) => selected.includes(v));
}

export function tourMatchesFilters(tour: Tour, f: TourFilterState): boolean {
  if (!overlapsDateRange(tour, f.dateFrom, f.dateTo)) return false;
  if (!matchesText(tour, f.fullTextSearch)) return false;

  if (f.groups.length > 0 && !tour.groups.some((g) => f.groups.includes(g))) {
    return false;
  }

  if (!matchesTourType(tour, f.tourTypes, f.difficultiesByDiscipline)) return false;

  if (
    f.experienceLevels.length > 0 &&
    !(tour.experienceLevel && f.experienceLevels.includes(tour.experienceLevel))
  ) {
    return false;
  }

  if (!matchesPhysical(tour, f.physicalDifficulties)) return false;

  if (f.leader && !tour.leaders.some((l) => l.name === f.leader)) return false;

  if (
    f.registrationStatuses.length > 0 &&
    !f.registrationStatuses.some((s) => matchesRegistrationFilter(tour.status, s))
  ) {
    return false;
  }

  return true;
}

export function applyFilters(tours: Tour[], f: TourFilterState): Tour[] {
  return tours.filter((t) => tourMatchesFilters(t, f));
}

export function countActiveFilters(f: TourFilterState): number {
  let n = 0;
  if (f.dateFrom) n++;
  if (f.dateTo) n++;
  if (f.fullTextSearch.trim()) n++;
  n += f.groups.length;
  n += f.tourTypes.length;
  n += f.experienceLevels.length;
  n += f.physicalDifficulties.length;
  if (f.leader) n++;
  n += f.registrationStatuses.length;
  return n;
}

/** Derive unique, sorted option lists from the data set. */
export function deriveGroups(tours: Tour[]): string[] {
  const set = new Set<string>();
  tours.forEach((t) => t.groups.forEach((g) => set.add(g)));
  return [...set].sort((a, b) => a.localeCompare(b, "de"));
}

export function deriveLeaders(tours: Tour[]): string[] {
  const set = new Set<string>();
  tours.forEach((t) => t.leaders.forEach((l) => set.add(l.name)));
  return [...set].sort((a, b) => a.localeCompare(b, "de"));
}
