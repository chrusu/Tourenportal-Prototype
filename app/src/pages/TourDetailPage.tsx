import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TourDetailContent } from "@/components/tour-list/TourDetailContent";
import { useTourData } from "@/hooks/useTourData";
import type { Tour } from "@/types/tour";

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { section, tours } = useTourData();
  const tour = tours.find((t) => t.id === id);

  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const handleRegister = (t: Tour) =>
    setNotice(`Prototyp: Anmeldung für „${t.title}" ist nicht aktiv.`);

  return (
    <div className="flex min-h-screen flex-col">
      <Header section={section} />

      <main className="container flex flex-col gap-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
        </Link>

        {tour ? (
          <div className="mx-auto w-full max-w-3xl overflow-hidden border bg-white shadow-sm">
            <TourDetailContent
              tour={tour}
              onClose={() => navigate("/")}
              onRegister={handleRegister}
            />
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 border bg-white p-10 text-center shadow-sm">
            <p className="text-sac-h4">Tour nicht gefunden</p>
            <p className="text-sm text-muted-foreground">
              Diese Tour existiert nicht oder wurde entfernt.
            </p>
          </div>
        )}
      </main>

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
