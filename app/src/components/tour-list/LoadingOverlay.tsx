import { Loader2 } from "lucide-react";

/**
 * Overlay shown while a (simulated) filter request is loading, see
 * useTourFilters's first-change delay.
 */
export function LoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 backdrop-blur-[1px]"
    >
      <div className="flex items-center gap-2 rounded-full border border-sac-gray bg-white px-4 py-2 text-sm text-sac-gray-dark shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-sac-red" aria-hidden />
        Aktivitäten werden geladen …
      </div>
    </div>
  );
}
