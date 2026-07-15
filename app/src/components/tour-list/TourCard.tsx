import { Calendar, Clock, Users, User, TrendingUp, Activity, Gauge, BadgeCheck } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { registrationStatus } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";
import { participantsText, conditionText, ascentDescentText } from "@/lib/tour-display";

interface TourCardProps {
  tour: Tour;
  onShowDetails: (tour: Tour) => void;
}

export function TourCard({ tour, onShowDetails }: TourCardProps) {
  const color = tourColor(tour.tourType, tour.disciplineColor);
  const status = registrationStatus(tour);
  const canRegister = status === "open" || status === "full";
  const places = participantsText(tour);
  const condition = conditionText(tour);
  const elevation = ascentDescentText(tour);

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col p-5 sm:flex-row sm:items-stretch sm:gap-0">
        {/* LEFT: id, sub-category, name, tags */}
        <div className="min-w-0 flex-1 sm:pr-5">
          <div className="font-mono text-xs text-muted-foreground">{tour.id}</div>

          <div className="mt-1 flex items-center gap-2">
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
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3
              className="cursor-pointer text-lg font-bold leading-snug text-foreground underline-offset-2 hover:underline hover:text-sac-red"
              onClick={() => onShowDetails(tour)}
            >
              {tour.title}
            </h3>
            {tour.withMountainGuide && (
              <Badge variant="outline" className="gap-1">
                <BadgeCheck className="h-3 w-3" /> Mit BF
              </Badge>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {tour.groups.map((g) => (
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
            {tour.flags?.includes("Tourenwoche") && (
              <Badge variant="outline">Tourenwoche</Badge>
            )}
          </div>

          <div className="mt-3">
            <TourStatusBadge tour={tour} />
          </div>
        </div>

        {/* CENTER: date, duration, condition, difficulty */}
        <div className="mt-4 flex flex-col justify-center gap-1.5 border-t pt-4 text-sm text-muted-foreground sm:mt-0 sm:w-52 sm:shrink-0 sm:border-l sm:border-t-0 sm:px-5 sm:pt-0">
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
          {condition && (
            <span className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4 shrink-0" />
              <span>
                Kondition{" "}
                <span className="font-bold text-foreground">{condition}</span>
              </span>
            </span>
          )}
          {tour.technicalDifficulty && (
            <span className="inline-flex items-center gap-2">
              <Gauge className="h-4 w-4 shrink-0" />
              <span
                className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {tour.technicalDifficulty}
              </span>
            </span>
          )}
          {elevation && (
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 shrink-0" />
              {elevation}
            </span>
          )}
        </div>

        {/* RIGHT: places, tour guide */}
        <div className="mt-4 flex shrink-0 flex-col gap-2 border-t pt-4 sm:mt-0 sm:w-52 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">

          {places && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span>
                <span className="font-bold text-foreground">{places}</span> Plätze
              </span>
            </span>
          )}

          {tour.leaders.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span className="text-foreground">
                {tour.leaders.map((l) => l.name).join(", ")}
              </span>
            </span>
          )}

          {canRegister && tour.registrationDeadline && (
            <p className="text-xs text-muted-foreground">
              Anmeldeschluss:{" "}
              <span className="font-bold text-foreground">
                {formatDate(tour.registrationDeadline)}
              </span>
            </p>
          )}
          {status === "published" && tour.registrationOpensAt && (
            <p className="text-xs text-muted-foreground">
              Anmeldung ab:{" "}
              <span className="font-bold text-foreground">
                {formatDateTime(tour.registrationOpensAt)}
              </span>
            </p>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="mt-auto self-start text-sac-red hover:text-sac-red-hover"
            onClick={() => onShowDetails(tour)}
          >
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}
