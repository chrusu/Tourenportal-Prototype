import { Link, useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import { TourStatusIcon } from "./TourStatusIcon";
import { DisciplineIcon } from "./DisciplineIcon";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/format";
import { tourColor, mainDisciplineFor } from "@/lib/disciplines";
import { technicalDifficultyTooltip } from "@/lib/scales";
import { participantsText } from "@/lib/tour-display";

interface TourTableViewProps {
  tours: Tour[];
  onReset: () => void;
}

// On mobile each <td> becomes a label/value row (label via data-label);
// on md+ it renders as a normal table cell.
const cell =
  "flex items-center justify-between gap-4 border-b px-3 py-2 text-right " +
  "before:font-bold before:text-muted-foreground before:content-[attr(data-label)] " +
  "last:border-0 md:table-cell md:border-0 md:px-3 md:py-3 md:text-left md:before:hidden md:truncate";

export function TourTableView({ tours, onReset }: TourTableViewProps) {
  const navigate = useNavigate();
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="md:overflow-x-auto md:border md:bg-white md:shadow-sm">
      <table className="w-full border-collapse text-sm md:table-fixed">
        <colgroup>
          <col className="md:w-[9%]" />
          <col className="md:w-[5%]" />
          <col className="md:w-[44%]" />
          <col className="md:w-[7%]" />
          <col className="md:w-[12%]" />
          <col className="md:w-[12%]" />
          <col className="md:w-[6%]" />
          <col className="md:w-[5%]" />
        </colgroup>
        <tbody className="block md:table-row-group">
          {tours.map((tour) => {
            const places = participantsText(tour);
            const color = tourColor(tour.tourType, tour.disciplineColor);
            const mainDiscipline = mainDisciplineFor(tour.tourType);
            const detailHref = `/tours/${tour.id}`;
            return (
              <tr
                key={tour.id}
                className="mb-3 block cursor-pointer overflow-hidden border bg-white shadow-sm last:mb-0 md:mb-0 md:table-row md:border-0 md:border-b md:shadow-none md:last:border-0 md:hover:bg-sac-snow"
                onClick={() => navigate(detailHref)}
              >
                <td data-label="Datum" className={`${cell} text-muted-foreground`}>
                  {formatDate(tour.startDate)}
                </td>
                <td data-label="Zeitraum" className={`${cell} whitespace-nowrap text-muted-foreground`}>
                  {tour.durationDays ? `${tour.durationDays}d` : "–"}
                </td>
                <td data-label="Tour" className={cell}>
                  <span className="inline-flex items-center gap-2 text-right md:text-left">
                    {mainDiscipline && (
                      <DisciplineIcon
                        discipline={mainDiscipline}
                        color={color}
                        title={mainDiscipline.label}
                      />
                    )}
                    <Link
                      to={detailHref}
                      className="font-bold underline-offset-2 hover:underline hover:text-sac-red"
                    >
                      {tour.title}
                    </Link>
                  </span>
                </td>
                <td data-label="Schwierigkeit" className={cell}>
                  {tour.technicalDifficulty ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={{ backgroundColor: `${color}33`, color }}
                        >
                          {tour.technicalDifficulty}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{technicalDifficultyTooltip(tour.tourType, tour.technicalDifficulty)}</TooltipContent>
                    </Tooltip>
                  ) : (
                    "–"
                  )}
                </td>
                <td data-label="Gruppe" className={`${cell} text-muted-foreground`}>
                  {tour.groups[0] ?? "–"}
                </td>
                <td data-label="Kontakt" className={`${cell} text-muted-foreground`}>
                  {tour.leaders[0]?.name ?? "–"}
                </td>
                <td data-label="Plätze" className={`${cell} text-muted-foreground`}>
                  {places ?? "–"}
                </td>
                <td data-label="Status" className={`${cell} md:text-center`}>
                  <span className="md:mx-auto">
                    <TourStatusIcon tour={tour} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
