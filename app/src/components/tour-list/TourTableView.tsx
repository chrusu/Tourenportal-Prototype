import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Gauge, Tag, User, Users } from "lucide-react";
import type { Tour } from "@/types/tour";
import { TourStatusIcon } from "./TourStatusIcon";
import { TourActivityTypes } from "./TourActivityTypes";
import { FavoriteButton } from "./FavoriteButton";
import { ParticipantsTooltip } from "./ParticipantsTooltip";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/format";
import { tourColor } from "@/lib/disciplines";
import { technicalDifficultyTooltip, scaleForTourType } from "@/lib/scales";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { participantsText } from "@/lib/tour-display";

interface TourTableViewProps {
  tours: Tour[];
  onReset: () => void;
}

// On mobile each <td> becomes a label/value row laid out as a two-column
// grid: a fixed-width label column (wide enough for the longest label,
// "Schwierigkeit") and a left-aligned content column. On md+ it renders as
// a normal table cell.
const cell =
  "grid grid-cols-[8rem_1fr] items-center gap-3 border-b px-3 py-2 text-left " +
  "last:border-0 md:table-cell md:border-0 md:px-3 md:py-3 md:align-top";

const cellLabel = "font-bold text-muted-foreground md:hidden";

// Forces the value part of a mobile row onto the left edge of its grid
// column, regardless of the content's own intrinsic width.
const cellValue = "flex w-full min-w-0 justify-self-stretch justify-start text-left";

export function TourTableView({ tours, onReset }: TourTableViewProps) {
  const navigate = useNavigate();
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="md:overflow-x-auto md:border md:bg-white md:shadow-sm">
      <table className="w-full border-collapse text-sm">
        <tbody className="block md:table-row-group">
          {tours.map((tour) => {
            const places = participantsText(tour);
            const color = tourColor(tour.tourType, tour.disciplineColor);
            const difficultyColor = scaleForTourType(tour.tourType)?.color ?? color;
            const detailHref = `/tours/${tour.id}`;
            return (
              <tr
                key={tour.id}
                className="mb-3 block cursor-pointer overflow-hidden border bg-white shadow-sm last:mb-0 md:mb-0 md:table-row md:border-0 md:border-b md:shadow-none md:last:border-0 md:hover:bg-sac-snow"
                onClick={() => navigate(detailHref)}
              >
                <td className={`${cell} text-muted-foreground`}>
                  <span className={cellLabel}>Datum</span>
                  <span className={`${cellValue} items-center gap-1.5`}>
                    <Calendar className="h-4 w-4 shrink-0" />
                    {formatDate(tour.startDate)}
                  </span>
                </td>
                <td className={`${cell} whitespace-nowrap text-muted-foreground`}>
                  <span className={cellLabel}>Zeitraum</span>
                  <span className={`${cellValue} items-center gap-1.5`}>
                    {tour.durationDays ? (
                      <>
                        <Clock className="h-4 w-4 shrink-0" />
                        {tour.durationDays} {tour.durationDays === 1 ? "Tag" : "Tage"}
                      </>
                    ) : (
                      "–"
                    )}
                  </span>
                </td>
                <td className={cell}>
                  <span className={cellLabel}>Aktivität</span>
                  <div className={`${cellValue} flex-col items-start gap-1`}>
                    <span className="flex items-center gap-1.5">
                      <FavoriteButton tourId={tour.id} size="sm" />
                      <Link
                        to={detailHref}
                        className="min-w-0 font-bold underline-offset-2 hover:underline hover:text-sac-red"
                      >
                        {tour.title}
                      </Link>
                    </span>
                    <TourActivityTypes
                      tourType={tour.tourType}
                      size="sm"
                      showLabel={false}
                      className="flex flex-wrap items-center gap-x-2 gap-y-0.5"
                    />
                  </div>
                </td>
                <td className={cell}>
                  <span className={cellLabel}>Schwierigkeit</span>
                  <span className={`${cellValue} items-center`}>
                    {tour.technicalDifficulty ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center gap-1.5">
                            <Gauge className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span
                              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold"
                              style={{ backgroundColor: `${difficultyColor}33`, color: difficultyColor }}
                            >
                              {tour.technicalDifficulty}
                            </span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <TooltipInfo {...technicalDifficultyTooltip(tour.tourType, tour.technicalDifficulty)} />
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      "–"
                    )}
                  </span>
                </td>
                <td className={`${cell} text-muted-foreground`}>
                  <span className={cellLabel}>Gruppe</span>
                  <span className={`${cellValue} items-center gap-1.5`}>
                    {tour.groups[0] ? (
                      <>
                        <Tag className="h-4 w-4 shrink-0" />
                        {tour.groups[0]}
                      </>
                    ) : (
                      "–"
                    )}
                  </span>
                </td>
                <td className={`${cell} text-muted-foreground`}>
                  <span className={cellLabel}>Kontakt</span>
                  <span className={`${cellValue} items-start gap-1.5`}>
                    {tour.leaders[0]?.name ? (
                      <>
                        <User className="mt-0.5 h-4 w-4 shrink-0" />
                        {tour.leaders[0].name}
                      </>
                    ) : (
                      "–"
                    )}
                  </span>
                </td>
                <td className={`${cell} text-muted-foreground`}>
                  <span className={cellLabel}>Plätze</span>
                  <ParticipantsTooltip tour={tour}>
                    <span className={`${cellValue} items-center gap-1.5`}>
                      {places ? (
                        <>
                          <Users className="h-4 w-4 shrink-0" />
                          {places}
                        </>
                      ) : (
                        "–"
                      )}
                    </span>
                  </ParticipantsTooltip>
                </td>
                <td className={`${cell} md:text-center`}>
                  <span className={cellLabel}>Status</span>
                  <span className={`${cellValue} items-center md:mx-auto md:w-auto md:justify-center`}>
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
