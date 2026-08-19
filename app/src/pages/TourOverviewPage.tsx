import { useEffect, useMemo, useState } from "react";
import { LayoutList, Table2, Heart, UserCheck, Download } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ResultsSummary } from "@/components/layout/ResultsSummary";
import { FilterBar } from "@/components/filters/FilterBar";
import { TourList } from "@/components/tour-list/TourList";
import { TourTableView } from "@/components/tour-list/TourTableView";
import { CollectionOnlyToggle } from "@/components/tour-list/CollectionOnlyToggle";
import { LoadingOverlay } from "@/components/tour-list/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTourData } from "@/hooks/useTourData";
import { useTourFilters } from "@/hooks/useTourFilters";
import { applyFilters, deriveGroups, deriveLeaders } from "@/lib/filter";
import { toursToCsv, downloadTextFile } from "@/lib/csv";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useMyActivities } from "@/contexts/MyActivitiesContext";

export function TourOverviewPage() {
  const { section, tours } = useTourData();
  const { filters, setFilters, update, reset, filtered, activeCount, isLoading } =
    useTourFilters(tours);
  const { isAuthenticated } = useAuth();
  const { favoriteIds, isFavorite } = useFavorites();
  const { appliedIds, isApplied } = useMyActivities();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [myActivitiesOnly, setMyActivitiesOnly] = useState(false);

  // Leave the "only" toggles behind on logout, so they don't silently hide
  // everything for the next (logged-out) view.
  useEffect(() => {
    if (!isAuthenticated) {
      setFavoritesOnly(false);
      setMyActivitiesOnly(false);
    }
  }, [isAuthenticated]);

  const groups = useMemo(() => deriveGroups(tours), [tours]);
  const leaders = useMemo(() => deriveLeaders(tours), [tours]);

  // Tours visible with every filter applied EXCEPT tourType —
  // used to show meaningful per-sub-type counts in the filter.
  const countTours = useMemo(
    () => applyFilters(tours, { ...filters, tourTypes: [], difficultiesBySubType: {} }),
    [tours, filters]
  );

  const visibleTours = useMemo(() => {
    let result = filtered;
    if (favoritesOnly) result = result.filter((t) => isFavorite(t.id));
    if (myActivitiesOnly) result = result.filter((t) => isApplied(t.id));
    return result;
  }, [filtered, favoritesOnly, myActivitiesOnly, isFavorite, isApplied]);

  const resetAll = () => {
    reset();
    setFavoritesOnly(false);
    setMyActivitiesOnly(false);
  };

  const exportCsv = () => {
    const csv = toursToCsv(visibleTours);
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(`tourenprogramm-${section.toLowerCase()}-${date}.csv`, csv, "text/csv");
  };

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
            <ResultsSummary count={visibleTours.length} loading={isLoading} />
            <div className="flex flex-wrap items-center gap-2">
              <CollectionOnlyToggle
                icon={<Heart className="h-4 w-4" />}
                label="Nur Favoriten"
                active={favoritesOnly}
                count={favoriteIds.length}
                onToggle={setFavoritesOnly}
              />
              <CollectionOnlyToggle
                icon={<UserCheck className="h-4 w-4" />}
                label="Meine Aktivitäten"
                active={myActivitiesOnly}
                count={appliedIds.length}
                onToggle={setMyActivitiesOnly}
              />
              <TabsList>
                <TabsTrigger value="list">
                  <LayoutList /> Liste
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Table2 /> Tabelle
                </TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCsv}
                disabled={visibleTours.length === 0}
              >
                <Download className="h-4 w-4" /> CSV exportieren
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              className={
                isLoading
                  ? "pointer-events-none opacity-40 transition-opacity"
                  : "transition-opacity"
              }
            >
              <TabsContent value="list">
                <TourList tours={visibleTours} onReset={resetAll} />
              </TabsContent>
              <TabsContent value="table">
                <TourTableView tours={visibleTours} onReset={resetAll} />
              </TabsContent>
            </div>
            {isLoading && <LoadingOverlay />}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
