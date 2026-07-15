import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TourStatusBadge } from "./TourStatusBadge";
import { EmptyState } from "./EmptyState";
import { formatDate, formatDuration } from "@/lib/format";
import { tourColor } from "@/lib/disciplines";

interface TourTableViewProps {
  tours: Tour[];
  onReset: () => void;
  onShowDetails: (tour: Tour) => void;
}

export function TourTableView({ tours, onReset, onShowDetails }: TourTableViewProps) {
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-sac-snow text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-bold">Datum</th>
            <th className="px-4 py-3 font-bold">Sportart</th>
            <th className="px-4 py-3 font-bold">Schwierigkeit</th>
            <th className="px-4 py-3 font-bold">Dauer</th>
            <th className="px-4 py-3 font-bold">Tour</th>
            <th className="px-4 py-3 font-bold">Gruppe</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => {
            const color = tourColor(tour.tourType, tour.disciplineColor);
            return (
              <tr key={tour.id} className="border-b last:border-0 hover:bg-sac-snow">
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDate(tour.startDate)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="font-bold" style={{ color }}>
                      {tour.tourType.join(" · ")}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {tour.technicalDifficulty ?? "–"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDuration(tour.durationDays) || "–"}
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold">{tour.title}</span>
                  {tour.leaders.length > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      {tour.leaders.map((l) => l.name).join(", ")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {tour.groups.join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <TourStatusBadge status={tour.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-sac-red hover:text-sac-red-hover"
                    onClick={() => onShowDetails(tour)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
