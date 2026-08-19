import { Link } from "react-router-dom";
import { Calendar, Clock, Users, User, TrendingUp, Activity, Gauge, BadgeCheck, Info } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { TourActivityTypes } from "./TourActivityTypes";
import { FavoriteButton } from "./FavoriteButton";
import { ParticipantsTooltip } from "./ParticipantsTooltip";
import { TourNote } from "./TourNote";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { registrationStatus } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";
import { conditionTooltip, difficultiesForTourType } from "@/lib/scales";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { participantsText, conditionText, ascentDescentText, waitlistCount } from "@/lib/tour-display";
import { useAuth } from "@/contexts/AuthContext";
import { useMyActivities } from "@/contexts/MyActivitiesContext";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const { isAuthenticated } = useAuth();
  const { markApplied } = useMyActivities();
  const color = tourColor(tour.tourType, tour.disciplineColor);
  const status = registrationStatus(tour);
  const canRegister = status === "open" || status === "waitlist" || status === "full";
  const canSubmitRegistration = status === "open" || status === "waitlist";
  const places = participantsText(tour);
  const waitlist = waitlistCount(tour);
  const condition = conditionText(tour);
  const elevation = ascentDescentText(tour);
  const detailHref = `/tours/${tour.id}`;
  const difficulties =
    tour.technicalDifficulty || tour.climbingGrade
      ? difficultiesForTourType(tour.tourType, tour.technicalDifficulty, tour.climbingGrade)
      : [];

  return (
    <article className="relative overflow-hidden border bg-white shadow-sm transition-shadow hover:shadow-md">
      <FavoriteButton
        tourId={tour.id}
        className="absolute right-3 top-3 z-10 bg-white/90 shadow-sm"
      />
      <div className="flex flex-col p-5 sm:flex-row sm:items-start sm:gap-0">
        {/* LEFT: id, sub-category, name, tags */}
        <div className="min-w-0 flex-1 sm:pr-5">
          <div className="mt-1">
            <TourActivityTypes tourType={tour.tourType} />
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
              <Badge key={flag} variant={flag === "Kurs" ? "kurs" : "outline"}>{flag}</Badge>
            ))}
          </div>

          <div className="mt-3">
            <TourStatusBadge tour={tour} />
          </div>
        </div>

        {/* CENTER: date, duration, condition, difficulty */}
        <div className="mt-4 flex flex-col gap-1.5 border-t pt-4 text-sm text-muted-foreground sm:mt-0 sm:w-52 sm:shrink-0 sm:border-l sm:border-t-0 sm:px-5 sm:pt-0">
          <span className="inline-flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="text-foreground">
              {tour.endDate && tour.endDate !== tour.startDate
                ? `${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`
                : formatDate(tour.startDate)}
            </span>
          </span>
          {tour.durationDays && (
            <span className="inline-flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {formatDuration(tour.durationDays)}
              {tour.weekdaySpan ? ` · ${tour.weekdaySpan}` : ""}
            </span>
          )}
          {condition && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-start gap-2">
                  <Activity className="mt-0.5 h-4 w-4 shrink-0" />
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
          {difficulties.map(({ scale, value, color: badgeColor, tooltip }) => (
            <Tooltip key={scale.name}>
              <TooltipTrigger asChild>
                <span className="inline-flex items-start gap-2">
                  <Gauge className="mt-0.5 h-4 w-4 shrink-0" />
                  <span
                    className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold"
                    style={{ backgroundColor: `${badgeColor}33`, color: badgeColor }}
                  >
                    {value}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipInfo {...tooltip} />
              </TooltipContent>
            </Tooltip>
          ))}
          {elevation && (
            <span className="inline-flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
              {elevation}
            </span>
          )}
        </div>

        {/* RIGHT: places, tour guide */}
        <div className="mt-4 flex shrink-0 flex-col gap-2 border-t pt-4 sm:mt-0 sm:w-52 sm:self-stretch sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">

          {places && (
            <ParticipantsTooltip tour={tour}>
              <span className="inline-flex items-start gap-1.5 text-sm text-muted-foreground">
                <Users className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-bold text-foreground">{places}</span> Plätze
                </span>
                {waitlist !== undefined && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {waitlist} {waitlist === 1 ? "Person" : "Personen"} auf der Warteliste
                    </TooltipContent>
                  </Tooltip>
                )}
              </span>
            </ParticipantsTooltip>
          )}

          {tour.leaders.length > 0 && (
            <span className="inline-flex items-start gap-1.5 text-sm text-muted-foreground">
              <User className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-foreground">
                {tour.leaders.map((l) => l.name).join(", ")}
              </span>
            </span>
          )}

          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {canSubmitRegistration && (
                <Button
                  size="sm"
                  variant="positive"
                  onClick={() => isAuthenticated && markApplied(tour.id)}
                >
                  {status === "waitlist" ? "Warteliste" : "Anmeldung"}
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
                Anmeldestart:{" "}
                <span className="font-bold text-foreground">
                  {formatDateTime(tour.registrationOpensAt)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <TourNote tour={tour} />
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} aria-hidden />
    </article>
  );
}
