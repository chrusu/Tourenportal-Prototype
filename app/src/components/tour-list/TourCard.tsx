import { Link } from "react-router-dom";
import { Calendar, Clock, Users, User, TrendingUp, Activity, Gauge, BadgeCheck } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { DisciplineIcon } from "./DisciplineIcon";
import { FavoriteButton } from "./FavoriteButton";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { registrationStatus } from "@/lib/status";
import { tourColor, mainDisciplineFor, mainSubTypeLabel } from "@/lib/disciplines";
import { conditionTooltip, technicalDifficultyTooltip } from "@/lib/scales";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { participantsText, conditionText, ascentDescentText } from "@/lib/tour-display";
import { useAuth } from "@/contexts/AuthContext";
import { useMyActivities } from "@/contexts/MyActivitiesContext";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const { isAuthenticated } = useAuth();
  const { markApplied } = useMyActivities();
  const color = tourColor(tour.tourType, tour.disciplineColor);
  const mainDiscipline = mainDisciplineFor(tour.tourType);
  const mainSubType = mainSubTypeLabel(tour.tourType);
  const status = registrationStatus(tour);
  const canRegister = status === "open" || status === "waitlist" || status === "full";
  const canSubmitRegistration = status === "open" || status === "waitlist";
  const places = participantsText(tour);
  const condition = conditionText(tour);
  const elevation = ascentDescentText(tour);
  const detailHref = `/tours/${tour.id}`;

  return (
    <article className="relative overflow-hidden border bg-white shadow-sm transition-shadow hover:shadow-md">
      <FavoriteButton
        tourId={tour.id}
        className="absolute right-3 top-3 z-10 bg-white/90 shadow-sm"
      />
      <div className="flex flex-col p-5 sm:flex-row sm:items-stretch sm:gap-0">
        {/* LEFT: id, sub-category, name, tags */}
        <div className="min-w-0 flex-1 sm:pr-5">
          <div className="mt-1 flex items-center gap-2">
            {mainDiscipline && (
              <DisciplineIcon discipline={mainDiscipline} color={color} title={mainDiscipline.label} />
            )}
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color }}
            >
              {mainSubType}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold leading-snug text-foreground">
              <Link
                to={detailHref}
                className="underline-offset-2 hover:underline hover:text-sac-red"
              >
                {tour.title}
              </Link>
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
            {tour.flags?.map((flag) => (
              <Badge key={flag} variant="outline">{flag}</Badge>
            ))}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-2">
                  <Activity className="h-4 w-4 shrink-0" />
                  <span>
                    Kondition{" "}
                    <span className="font-bold text-foreground">{condition}</span>
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipInfo {...conditionTooltip(tour.physicalDifficulty)!} />
              </TooltipContent>
            </Tooltip>
          )}
          {tour.technicalDifficulty && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-4 w-4 shrink-0" />
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ backgroundColor: `${color}33`, color }}
                  >
                    {tour.technicalDifficulty}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipInfo {...technicalDifficultyTooltip(tour.tourType, tour.technicalDifficulty)} />
              </TooltipContent>
            </Tooltip>
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

          <div className="mt-auto flex items-center gap-2">
            {canSubmitRegistration && tour.url && (
              <Button size="sm" variant="positive" asChild>
                <a
                  href={tour.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => isAuthenticated && markApplied(tour.id)}
                >
                  {status === "waitlist" ? "Warteliste" : "Anmeldung"}
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="self-start border-sac-red bg-white text-sac-red hover:border-sac-red-hover hover:bg-sac-red hover:text-white"
              asChild
            >
              <Link to={detailHref}>Details</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} aria-hidden />
    </article>
  );
}
