import { useEffect, useMemo, useState } from "react";
import { LayoutList, Columns3, Table2, LayoutPanelTop } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ResultsSummary } from "@/components/layout/ResultsSummary";
import { FilterBar } from "@/components/filters/FilterBar";
import { TourList } from "@/components/tour-list/TourList";
import { TourRowView } from "@/components/tour-list/TourRowView";
import { TourTableView } from "@/components/tour-list/TourTableView";
import { TourDetailCardView } from "@/components/tour-list/TourDetailCardView";
import { TourDetailContent } from "@/components/tour-list/TourDetailContent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useTourData } from "@/hooks/useTourData";
import { useTourFilters } from "@/hooks/useTourFilters";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { deriveGroups, deriveLeaders } from "@/lib/filter";
import type { Tour } from "@/types/tour";

export default function App() {
  const { section, tours } = useTourData();
  const { filters, setFilters, update, reset, filtered, activeCount } =
    useTourFilters(tours);

  const groups = useMemo(() => deriveGroups(tours), [tours]);
  const leaders = useMemo(() => deriveLeaders(tours), [tours]);
  const isLg = useIsLargeScreen();

  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  const [detailTour, setDetailTour] = useState<Tour | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleShowDetails = (tour: Tour) => {
    if (detailOpen && detailTour?.id === tour.id) {
      setDetailOpen(false);
    } else {
      setDetailTour(tour);
      setDetailOpen(true);
    }
  };
  const handleClose = () => setDetailOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const handleRegister = (tour: Tour) =>
    setNotice(`Prototyp: Anmeldung für „${tour.title}" ist nicht aktiv.`);

  const showPanel = isLg && detailOpen && !!detailTour;

  return (
    <>
      {/* Root layout: left scrollable content + right full-height panel */}
      <div className="flex h-screen overflow-hidden">
        {/* LEFT: entire page content, scrollable */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
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
                <TourList tours={filtered} onReset={reset} onShowDetails={handleShowDetails} />
              </TabsContent>
              <TabsContent value="rows">
                <TourRowView tours={filtered} onReset={reset} onShowDetails={handleShowDetails} />
              </TabsContent>
              <TabsContent value="cards">
                <TourDetailCardView tours={filtered} onReset={reset} onShowDetails={handleShowDetails} />
              </TabsContent>
              <TabsContent value="table">
                <TourTableView tours={filtered} onReset={reset} onShowDetails={handleShowDetails} />
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* RIGHT: full-height detail panel (lg+) */}
        {showPanel && (
          <div className="w-[460px] shrink-0 animate-in slide-in-from-right border-l bg-white shadow-xl duration-300">
            <TourDetailContent
              tour={detailTour!}
              onClose={handleClose}
              onRegister={handleRegister}
            />
          </div>
        )}
      </div>

      {/* Mobile overlay sheet (< lg) */}
      {!isLg && (
        <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
          <SheetContent side="right" className="w-full max-w-md gap-0 p-0">
            <SheetTitle className="sr-only">
              {detailTour?.title ?? "Tourdetails"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Detailansicht der Tour
            </SheetDescription>
            {detailTour && (
              <TourDetailContent
                tour={detailTour}
                onClose={handleClose}
                onRegister={handleRegister}
              />
            )}
          </SheetContent>
        </Sheet>
      )}

      {/* Toast notice */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-sac-black px-4 py-3 text-sm text-white shadow-lg"
        >
          {notice}
        </div>
      )}
    </>
  );
}
