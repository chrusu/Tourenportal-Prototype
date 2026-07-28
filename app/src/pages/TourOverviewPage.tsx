import { useMemo } from "react";
import { LayoutList, Table2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ResultsSummary } from "@/components/layout/ResultsSummary";
import { FilterBar } from "@/components/filters/FilterBar";
import { TourList } from "@/components/tour-list/TourList";
import { TourTableView } from "@/components/tour-list/TourTableView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTourData } from "@/hooks/useTourData";
import { useTourFilters } from "@/hooks/useTourFilters";
import { applyFilters, deriveGroups, deriveLeaders } from "@/lib/filter";

export function TourOverviewPage() {
  const { section, tours } = useTourData();
  const { filters, setFilters, update, reset, filtered, activeCount } =
    useTourFilters(tours);

  const groups = useMemo(() => deriveGroups(tours), [tours]);
  const leaders = useMemo(() => deriveLeaders(tours), [tours]);

  // Tours visible with every filter applied EXCEPT tourType —
  // used to show meaningful per-sub-type counts in the filter.
  const countTours = useMemo(
    () => applyFilters(tours, { ...filters, tourTypes: [], difficultiesBySubType: {} }),
    [tours, filters]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header section={section} />

      <main className="container flex flex-col gap-6 py-6">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          update={update}
          reset={reset}
          activeCount={activeCount}
          groups={groups}
          leaders={leaders}
          countTours={countTours}
        />

        <Tabs defaultValue="list">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ResultsSummary count={filtered.length} />
            <TabsList>
              <TabsTrigger value="list">
                <LayoutList /> Liste
              </TabsTrigger>
              <TabsTrigger value="table">
                <Table2 /> Tabelle
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list">
            <TourList tours={filtered} onReset={reset} />
          </TabsContent>
          <TabsContent value="table">
            <TourTableView tours={filtered} onReset={reset} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
