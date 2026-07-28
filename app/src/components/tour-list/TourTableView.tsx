import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TourStatusIcon } from "./TourStatusIcon";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/format";
import { tourColor } from "@/lib/disciplines";
import { participantsText, conditionText } from "@/lib/tour-display";

interface TourTableViewProps {
  tours: Tour[];
  onReset: () => void;
  onShowDetails: (tour: Tour) => void;
}

// On mobile each <td> becomes a label/value row (label via data-label);
// on md+ it renders as a normal table cell.
const cell =
  "flex items-center justify-between gap-4 border-b px-3 py-2 text-right " +
  "before:font-bold before:text-muted-foreground before:content-[attr(data-label)] " +
  "last:border-0 md:table-cell md:border-0 md:px-3 md:py-3 md:text-left md:before:hidden";

export function TourTableView({ tours, onReset, onShowDetails }: TourTableViewProps) {
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="md:overflow-x-auto md:rounded-2xl md:border md:bg-white md:shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="hidden md:table-header-group">
          <tr className="border-b bg-sac-snow text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-3 font-bold">Datum</th>
            <th className="px-3 py-3 font-bold">Zeitraum</th>
            <th className="px-3 py-3 font-bold">Tour</th>
            <th className="px-3 py-3 font-bold">Sportart</th>
            <th className="px-3 py-3 font-bold">Schwierigkeit</th>
            <th className="px-3 py-3 font-bold">Kondition</th>
            <th className="px-3 py-3 font-bold">Gruppe</th>
            <th className="px-3 py-3 font-bold">Kontakt</th>
            <th className="px-3 py-3 font-bold">Plätze</th>
            <th className="px-3 py-3 font-bold text-center">Status</th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {tours.map((tour) => {
            const color = tourColor(tour.tourType, tour.disciplineColor);
            const places = participantsText(tour);
            const condition = conditionText(tour);
            return (
              <tr
                key={tour.id}
                className="mb-3 block overflow-hidden rounded-2xl border bg-white shadow-sm last:mb-0 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:shadow-none md:last:border-0 md:hover:bg-sac-snow"
              >
                <td data-label="Datum" className={`${cell} text-muted-foreground`}>
                  {formatDate(tour.startDate)}
                </td>
                <td data-label="Zeitraum" className={`${cell} whitespace-nowrap text-muted-foreground`}>
                  {tour.weekdaySpan ?? "–"}
                </td>
                <td data-label="Tour" className={cell}>
                  <span className="text-right md:text-left">
                    <span
                      className="cursor-pointer font-bold underline-offset-2 hover:underline hover:text-sac-red"
                      onClick={() => onShowDetails(tour)}
                    >
                      {tour.title}
                    </span>
                  </span>
                </td>
                <td data-label="Sportart" className={cell}>
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
                <td data-label="Schwierigkeit" className={cell}>
                  {tour.technicalDifficulty ?? "–"}
                </td>
                <td data-label="Kondition" className={`${cell} text-muted-foreground`}>
                  {condition ?? "–"}
                </td>
                <td data-label="Gruppe" className={`${cell} text-muted-foreground`}>
                  {tour.groups.join(", ")}
                </td>
                <td data-label="Kontakt" className={`${cell} text-muted-foreground`}>
                  {tour.leaders.map((l) => l.name).join(", ") || "–"}
                </td>
                <td data-label="Plätze" className={`${cell} text-muted-foreground`}>
                  {places ?? "–"}
                </td>
                <td data-label="Status" className={`${cell} md:text-center`}>
                  <span className="md:mx-auto">
                    <TourStatusIcon tour={tour} />
                  </span>
                </td>
                <td className="flex justify-end border-b px-3 py-2 last:border-0 md:table-cell md:border-0 md:px-3 md:py-3 md:text-right">
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
