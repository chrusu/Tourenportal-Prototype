import { Clock, MapPin, Users } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TourStatusBadge } from "./TourStatusBadge";
import { EmptyState } from "./EmptyState";
import { formatDate, formatDuration } from "@/lib/format";
import { tourColor } from "@/lib/disciplines";
import { groupByMonth } from "@/lib/group";

interface TourTimelineViewProps {
  tours: Tour[];
  onReset: () => void;
  onShowDetails: (tour: Tour) => void;
}

export function TourTimelineView({
  tours,
  onReset,
  onShowDetails,
}: TourTimelineViewProps) {
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  const groups = groupByMonth(tours);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="sticky top-0 z-10 mb-3 bg-background/95 py-1 text-sac-h3 capitalize backdrop-blur">
            {group.label}
            <span className="ml-2 text-sm font-light text-muted-foreground">
              ({group.tours.length})
            </span>
          </h2>

          <div className="flex flex-col gap-2 border-l-2 border-sac-gray pl-4">
            {group.tours.map((tour) => {
              const color = tourColor(tour.tourType, tour.disciplineColor);
              return (
                <article
                  key={tour.id}
                  className="relative rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span
                    className="absolute -left-[1.35rem] top-5 h-3 w-3 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color }}
                        >
                          {tour.tourType.join(" · ")}
                        </span>
                        {tour.technicalDifficulty && (
                          <span
                            className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {tour.technicalDifficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 font-bold leading-snug">{tour.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                          {formatDate(tour.startDate)}
                          {tour.weekdaySpan ? ` · ${tour.weekdaySpan}` : ""}
                        </span>
                        {tour.durationDays && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {formatDuration(tour.durationDays)}
                          </span>
                        )}
                        {tour.destination?.name && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {tour.destination.name}
                          </span>
                        )}
                        {tour.participants?.display && (
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {tour.participants.display}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <TourStatusBadge status={tour.status} />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-sac-red hover:text-sac-red-hover"
                        onClick={() => onShowDetails(tour)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
