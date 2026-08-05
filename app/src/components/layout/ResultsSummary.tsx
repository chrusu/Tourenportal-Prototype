import { Loader2 } from "lucide-react";

export function ResultsSummary({ count, loading = false }: { count: number; loading?: boolean }) {
  if (loading) {
    return (
      <p className="inline-flex items-center gap-2 text-sac-h4 text-muted-foreground" aria-live="polite">
        <Loader2 className="h-4 w-4 animate-spin text-sac-red" aria-hidden />
        Wird geladen …
      </p>
    );
  }

  return (
    <p className="text-sac-h4" aria-live="polite">
      {count} {count === 1 ? "Aktivität" : "Aktivitäten"} gefunden
    </p>
  );
}
