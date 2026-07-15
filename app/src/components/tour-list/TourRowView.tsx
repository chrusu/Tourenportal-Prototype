import { Calendar, Clock, MapPin, User, Users, BadgeCheck } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { EmptyState } from "./EmptyState";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { statusVariant } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";

interface TourRowViewProps {
  tours: Tour[];
  onReset: () => void;
  onShowDetails: (tour: Tour) => void;
}

export function TourRowView({ tours, onReset, onShowDetails }: TourRowViewProps) {
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="flex flex-col gap-3">
      {tours.map((tour) => {
        const color = tourColor(tour.tourType, tour.disciplineColor);
        const variant = statusVariant(tour.status);
        const isOpen = variant === "open";

        return (
          <article
            key={tour.id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              {/* LEFT: discipline, difficulty, title, tags */}
              <div className="min-w-0 flex-1 p-4 lg:p-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
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

                <h3 className="text-base font-bold leading-snug text-foreground">
                  {tour.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {tour.groups.map((g) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                  {tour.withMountainGuide && (
                    <Badge variant="outline" className="gap-1">
                      <BadgeCheck className="h-3 w-3" /> Mit BF
                    </Badge>
                  )}
                  {tour.flags?.includes("Tourenwoche") && (
                    <Badge variant="outline">Tourenwoche</Badge>
                  )}
                </div>
              </div>

              {/* CENTER: date, duration, location */}
              <div className="flex flex-col justify-center gap-1.5 border-t px-4 py-3 text-sm text-muted-foreground lg:w-56 lg:shrink-0 lg:border-l lg:border-t-0 lg:px-5 lg:py-5">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="text-foreground">
                    {formatDate(tour.startDate)}
                    {tour.weekdaySpan ? ` · ${tour.weekdaySpan}` : ""}
                  </span>
                </span>
                {tour.durationDays && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    {formatDuration(tour.durationDays)}
                  </span>
                )}
                {tour.destination?.name && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {tour.destination.name}
                      {tour.destination.elevation
                        ? ` ${tour.destination.elevation} m`
                        : ""}
                    </span>
                  </span>
                )}
              </div>

              {/* CENTER-RIGHT: leader, participants */}
              <div className="flex flex-col justify-center gap-1.5 border-t px-4 py-3 text-sm text-muted-foreground lg:w-52 lg:shrink-0 lg:border-l lg:border-t-0 lg:px-5 lg:py-5">
                {tour.leaders.length > 0 && (
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="text-foreground">
                      {tour.leaders.map((l) => l.name).join(", ")}
                    </span>
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  {tour.participants?.display ? (
                    <span>
                      <span className="text-foreground">
                        {tour.participants.display}
                      </span>{" "}
                      Anmeldungen
                    </span>
                  ) : (
                    <span>Keine Angabe</span>
                  )}
                </span>
              </div>

              {/* RIGHT: status + actions */}
              <div className="flex flex-col justify-center gap-2 border-t px-4 py-3 lg:w-48 lg:shrink-0 lg:items-end lg:border-l lg:border-t-0 lg:px-5 lg:py-5">
                <TourStatusBadge status={tour.status} />
                {isOpen && tour.registrationDeadline && (
                  <p className="text-xs text-muted-foreground lg:text-right">
                    Anmeldeschluss:{" "}
                    <span className="font-bold text-foreground">
                      {formatDate(tour.registrationDeadline)}
                    </span>
                  </p>
                )}
                {variant === "published" && tour.registrationOpensAt && (
                  <p className="text-xs text-muted-foreground lg:text-right">
                    Anmeldung ab:{" "}
                    <span className="font-bold text-foreground">
                      {formatDateTime(tour.registrationOpensAt)}
                    </span>
                  </p>
                )}
                <div className="mt-1 flex w-full flex-col gap-2">
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
