import { Calendar, Clock, MapPin, Users, ExternalLink, BadgeCheck } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { statusVariant } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";

interface TourCardProps {
  tour: Tour;
  onShowDetails: (tour: Tour) => void;
}

export function TourCard({ tour, onShowDetails }: TourCardProps) {
  const color = tourColor(tour.tourType, tour.disciplineColor);
  const variant = statusVariant(tour.status);
  const isOpen = variant === "open";

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Main info */}
        <div className="min-w-0 flex-1">
          {/* Discipline eyebrow – prominent, colored */}
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

          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold leading-snug text-foreground">
              {tour.title}
            </h3>
            {tour.withMountainGuide && (
              <Badge variant="outline" className="gap-1">
                <BadgeCheck className="h-3 w-3" /> Mit BF
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
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
                {tour.destination.url ? (
                  <a
                    href={tour.destination.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
                  >
                    {tour.destination.name}
                    {tour.destination.elevation
                      ? ` ${tour.destination.elevation} m`
                      : ""}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <>
                    {tour.destination.name}
                    {tour.destination.elevation
                      ? ` ${tour.destination.elevation} m`
                      : ""}
                  </>
                )}
              </span>
            )}
            {tour.participants?.display && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {tour.participants.display}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {tour.groups.map((g) => (
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
            {tour.leaders.length > 0 && (
              <span className="text-sm text-muted-foreground">
                · {tour.leaders.map((l) => l.name).join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <TourStatusBadge status={tour.status} />
          {isOpen && tour.registrationDeadline && (
            <p className="text-right text-xs text-muted-foreground">
              Anmeldeschluss:
              <br />
              <span className="font-bold text-foreground">
                {formatDate(tour.registrationDeadline)}
              </span>
            </p>
          )}
          {variant === "published" && tour.registrationOpensAt && (
            <p className="text-right text-xs text-muted-foreground">
              Anmeldung ab:
              <br />
              <span className="font-bold text-foreground">
                {formatDateTime(tour.registrationOpensAt)}
              </span>
            </p>
          )}
          <div className="flex flex-col gap-2 sm:items-end">
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
}
