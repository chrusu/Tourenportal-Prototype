import { useEffect, useMemo, useState } from "react";
import { LayoutList, Columns3, Table2, LayoutPanelTop } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ResultsSummary } from "@/components/layout/ResultsSummary";
import { FilterBar } from "@/components/filters/FilterBar";
import { TourList } from "@/components/tour-list/TourList";
import { TourRowView } from "@/components/tour-list/TourRowView";
import { TourTableView } from "@/components/tour-list/TourTableView";
import { TourDetailCardView } from "@/components/tour-list/TourDetailCardView";
import { TourDetailDialog } from "@/components/tour-list/TourDetailDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTourData } from "@/hooks/useTourData";
import { useTourFilters } from "@/hooks/useTourFilters";
import { deriveGroups, deriveLeaders } from "@/lib/filter";
import type { Tour } from "@/types/tour";

export default function App() {
  const { section, tours } = useTourData();
  const { filters, setFilters, update, reset, filtered, activeCount } =
    useTourFilters(tours);

  const groups = useMemo(() => deriveGroups(tours), [tours]);
  const leaders = useMemo(() => deriveLeaders(tours), [tours]);

  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  const [detailTour, setDetailTour] = useState<Tour | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleShowDetails = (tour: Tour) => {
    setDetailTour(tour);
    setDetailOpen(true);
  };
  const handleRegister = (tour: Tour) =>
    setNotice(`Prototyp: Anmeldung für „${tour.title}" ist nicht aktiv.`);

  return (
    <div className="min-h-screen bg-background">
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
        />

        <Tabs defaultValue="list">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ResultsSummary count={filtered.length} />
            <TabsList>
              <TabsTrigger value="list">
                <LayoutList /> Liste
              </TabsTrigger>
              <TabsTrigger value="rows">
                <Columns3 /> Spalten
              </TabsTrigger>
              <TabsTrigger value="cards">
                <LayoutPanelTop /> Detailkarten
              </TabsTrigger>
              <TabsTrigger value="table">
                <Table2 /> Tabelle
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list">
            <TourList
              tours={filtered}
              onReset={reset}
              onShowDetails={handleShowDetails}
            />
          </TabsContent>

          <TabsContent value="rows">
            <TourRowView
              tours={filtered}
              onReset={reset}
              onShowDetails={handleShowDetails}
            />
          </TabsContent>

          <TabsContent value="cards">
            <TourDetailCardView
              tours={filtered}
              onReset={reset}
              onShowDetails={handleShowDetails}
            />
          </TabsContent>

          <TabsContent value="table">
            <TourTableView
              tours={filtered}
              onReset={reset}
              onShowDetails={handleShowDetails}
            />
          </TabsContent>
        </Tabs>
      </main>

      <TourDetailDialog
        tour={detailTour}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRegister={handleRegister}
      />

      {notice && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-sac-black px-4 py-3 text-sm text-white shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
