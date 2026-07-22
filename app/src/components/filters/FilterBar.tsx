import { useState } from "react";
import { RotateCcw, SlidersHorizontal, Users, TrendingUp, Activity, CalendarCheck } from "lucide-react";
import type { ExperienceLevel, PhysicalDifficulty, RegistrationStatus, Tour } from "@/types/tour";
import type { TourFilterState } from "@/lib/filter";
import { REGISTRATION_STATUS_OPTIONS } from "@/lib/status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DateRangeFilter } from "./DateRangeFilter";
import { SearchInput } from "./SearchInput";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { TourTypeFilter } from "./TourTypeFilter";
import { LeaderFilter } from "./LeaderFilter";
import { ActiveFilterChips } from "./ActiveFilterChips";

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "Einsteiger", label: "Einsteiger" },
  { value: "Erfahren", label: "Erfahren" },
  { value: "Sehr erfahren", label: "Sehr erfahren" },
];

const CONDITION_OPTIONS: { value: PhysicalDifficulty; label: string }[] = [
  { value: "A", label: "A – wenig anstrengend" },
  { value: "B", label: "B – ziemlich anstrengend" },
  { value: "C", label: "C – anstrengend" },
  { value: "D", label: "D – sehr anstrengend" },
];

interface FilterBarProps {
  filters: TourFilterState;
  setFilters: (updater: (prev: TourFilterState) => TourFilterState) => void;
  update: <K extends keyof TourFilterState>(key: K, value: TourFilterState[K]) => void;
  reset: () => void;
  activeCount: number;
  groups: string[];
  leaders: string[];
  countTours: Tour[];
}

export function FilterBar(props: FilterBarProps) {
  const { filters, setFilters, update, reset, activeCount, groups, leaders, countTours } = props;
  const [sheetOpen, setSheetOpen] = useState(false);

  const controls = (
    <>
      <MultiSelectFilter
        label="Tourengruppe"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        options={groups.map((g) => ({ value: g, label: g }))}
        selected={filters.groups}
        onChange={(v) => update("groups", v)}
      />
      <TourTypeFilter
        selectedTypes={filters.tourTypes}
        difficultiesBySubType={filters.difficultiesBySubType}
        onChangeTypes={(v) => update("tourTypes", v)}
        onChangeDifficulties={(v) => update("difficultiesBySubType", v)}
        countTours={countTours}
      />
      <MultiSelectFilter
        label="Anforderung"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        options={EXPERIENCE_OPTIONS}
        selected={filters.experienceLevels}
        onChange={(v) => update("experienceLevels", v as ExperienceLevel[])}
      />
      <MultiSelectFilter
        label="Kondition"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        options={CONDITION_OPTIONS}
        selected={filters.physicalDifficulties}
        onChange={(v) => update("physicalDifficulties", v as PhysicalDifficulty[])}
      />
      <LeaderFilter
        leaders={leaders}
        selected={filters.leader}
        onChange={(v) => update("leader", v)}
      />
      <MultiSelectFilter
        label="Anmeldestatus"
        icon={<CalendarCheck className="h-4 w-4 text-muted-foreground" />}
        options={REGISTRATION_STATUS_OPTIONS}
        selected={filters.registrationStatuses}
        onChange={(v) => update("registrationStatuses", v as RegistrationStatus[])}
      />
    </>
  );

  return (
    <div className="border border-sac-gray bg-white p-4 shadow-sm sm:p-5">
      {/* Row 1: date range + search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <DateRangeFilter
          from={filters.dateFrom}
          to={filters.dateTo}
          onChange={({ from, to }) =>
            setFilters((p) => ({ ...p, dateFrom: from, dateTo: to }))
          }
        />
        <SearchInput
          value={filters.fullTextSearch}
          onChange={(v) => update("fullTextSearch", v)}
        />
      </div>

      {/* Row 2: facet filters (desktop) */}
      <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
        {controls}
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="ml-auto text-muted-foreground"
          disabled={activeCount === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Row 2: facet filters (mobile -> sheet) */}
      <div className="mt-4 flex items-center gap-2 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeCount > 0 && (
                <Badge className="ml-1 h-5 min-w-5 justify-center px-1.5">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Filter</SheetTitle>
            <div className="flex flex-col gap-3">{controls}</div>
            <Button
              variant="ghost"
              onClick={reset}
              disabled={activeCount === 0}
              className="mt-2 justify-start text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Alle Filter zurücksetzen
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="mt-4 border-t pt-4">
          <ActiveFilterChips filters={filters} setFilters={setFilters} />
        </div>
      )}
    </div>
  );
}
