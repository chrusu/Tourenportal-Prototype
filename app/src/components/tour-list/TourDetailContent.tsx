import { ExternalLink, Mountain, TrendingUp, Gauge, Bus, Wallet, Users, Info } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TourStatusBadge } from "./TourStatusBadge";
import { TourDisciplineIcons } from "./TourDisciplineIcons";
import { FavoriteButton } from "./FavoriteButton";
import { LeaderProfile } from "./LeaderProfile";
import { TourNote } from "./TourNote";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { waitlistCount } from "@/lib/tour-display";
import { registrationStatus } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";
import { conditionTooltip, difficultiesForTourType } from "@/lib/scales";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { linkifyText } from "@/lib/linkify";
import { useAuth } from "@/contexts/AuthContext";
import { useEasterEgg } from "@/contexts/EasterEggContext";
import { useMyActivities } from "@/contexts/MyActivitiesContext";
import { participantNames, shortName } from "@/lib/participants";

interface TourDetailContentProps {
  tour: Tour;
  onRegister: (tour: Tour) => void;
}

function Section({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div>
      <h4 className="mb-1 text-sm font-bold">{title}</h4>
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
        {linkifyText(text)}
      </p>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  tooltip?: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  const content = (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function TourDetailContent({ tour, onRegister }: TourDetailContentProps) {
  const { isAuthenticated } = useAuth();
  const { unlocked } = useEasterEgg();
  const { markApplied } = useMyActivities();
  const color = tourColor(tour.tourType, tour.disciplineColor);
  const status = registrationStatus(tour);
  const canRegister = status === "open" || status === "waitlist" || status === "full";
  const canSubmitRegistration = status === "open" || status === "waitlist";
  const d = tour.detail;
  const dateRange =
    tour.endDate && tour.endDate !== tour.startDate
      ? `${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`
      : formatDate(tour.startDate);
  const costs = [
    d?.travelCosts != null ? `Reise CHF ${d.travelCosts}` : null,
    d?.tourCosts != null ? `übrige CHF ${d.tourCosts}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const difficulties =
    tour.technicalDifficulty || tour.climbingGrade
      ? difficultiesForTourType(tour.tourType, tour.technicalDifficulty, tour.climbingGrade)
      : [];
  const waitlist = waitlistCount(tour);
  const participants = isAuthenticated && unlocked ? participantNames(tour) : undefined;

  return (
    <div className="flex flex-col">
      {/* Colored header */}
      <div className="shrink-0 px-5 py-4" style={{ backgroundColor: color }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TourDisciplineIcons tourType={tour.tourType} className="inline-flex items-center gap-1.5" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {tour.tourType.join(" · ")}
              </span>
              {difficulties.map(({ scale, value, color: badgeColor, tooltip }) => (
                <Tooltip key={scale.name}>
                  <TooltipTrigger asChild>
                    <span
                      className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-xs font-bold shadow-sm"
                      style={{ color: badgeColor }}
                    >
                      {value}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <TooltipInfo {...tooltip} />
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <h2 className="mt-1 text-lg font-bold leading-snug text-white">
              {tour.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <FavoriteButton tourId={tour.id} variant="onColor" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 p-5 lg:p-6">
        {/* Status + badges */}
        <div className="flex flex-wrap items-center gap-2">
          <TourStatusBadge tour={tour} />
          {tour.groups.map((g) => (
            <Badge key={g} variant="outline">{g}</Badge>
          ))}
          {tour.withMountainGuide && <Badge variant="outline">Mit BF</Badge>}
          {d?.additionalInfo && <Badge variant="outline">{d.additionalInfo}</Badge>}
          {tour.flags?.map((flag) => (
            <Badge key={flag} variant={flag === "Kurs" ? "kurs" : "outline"}>{flag}</Badge>
          ))}
        </div>

        {/* Facts grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Fact
            icon={<Mountain className="h-4 w-4" />}
            label="Datum"
            value={`${dateRange}${tour.weekdaySpan ? ` (${tour.weekdaySpan})` : ""}`}
          />
          <Fact
            icon={<Gauge className="h-4 w-4" />}
            label="Dauer"
            value={formatDuration(tour.durationDays)}
          />
          {tour.destination?.name && (
            <Fact
              icon={<Mountain className="h-4 w-4" />}
              label="Ziel"
              value={
                tour.destination.url ? (
                  <a
                    href={tour.destination.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sac-red hover:underline"
                  >
                    {tour.destination.name}
                    {tour.destination.elevation ? ` ${tour.destination.elevation} m` : ""}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  `${tour.destination.name}${tour.destination.elevation ? ` ${tour.destination.elevation} m` : ""}`
                )
              }
            />
          )}
          <Fact
            icon={<TrendingUp className="h-4 w-4" />}
            label="Aufstieg"
            value={d?.ascentMeters != null ? `${d.ascentMeters} hm` : undefined}
          />
          {difficulties.length > 0 && (
            <Fact
              icon={<Gauge className="h-4 w-4" />}
              label="Schwierigkeit"
              value={
                <div className="flex flex-wrap items-center gap-1.5">
                  {difficulties.map(({ scale, value, color: badgeColor, tooltip }) => (
                    <Tooltip key={scale.name}>
                      <TooltipTrigger asChild>
                        <span
                          className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold"
                          style={{ backgroundColor: `${badgeColor}33`, color: badgeColor }}
                        >
                          {value}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <TooltipInfo {...tooltip} />
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              }
            />
          )}
          <Fact
            icon={<Gauge className="h-4 w-4" />}
            label="Kondition"
            value={tour.physicalDifficulty}
            tooltip={
              conditionTooltip(tour.physicalDifficulty) && (
                <TooltipInfo {...conditionTooltip(tour.physicalDifficulty)!} />
              )
            }
          />
          <Fact
            icon={<Users className="h-4 w-4" />}
            label="Teilnehmer"
            value={
              tour.participants?.display || d?.maxParticipants ? (
                <span className="inline-flex items-center gap-1.5">
                  {tour.participants?.display
                    ? `${tour.participants.display}${d?.maxParticipants ? ` (max. ${d.maxParticipants})` : ""}`
                    : `max. ${d!.maxParticipants}`}
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
              ) : undefined
            }
            tooltip={
              participants && participants.length > 0 ? (
                <TooltipInfo title="Teilnehmende" items={participants.map(shortName)} />
              ) : undefined
            }
          />
          <Fact
            icon={<Bus className="h-4 w-4" />}
            label="Verkehrsmittel"
            value={d?.transport}
          />
          <Fact
            icon={<Wallet className="h-4 w-4" />}
            label="Kosten"
            value={costs || undefined}
          />
        </div>

        {/* Text sections + leader profiles side-by-side on wide screens */}
        <div className="grid grid-cols-1 gap-6 border-t pt-4 lg:grid-cols-[1fr_22rem]">
          <div className="flex flex-col gap-4">
            <Section title="Beschrieb" text={d?.description} />
            <Section title="Zusatztext" text={d?.additionalText} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Section title="Ausrüstung" text={d?.equipment} />
              <Section title="Kosten" text={d?.costsInfo} />
            </div>
          </div>

          {/* Leader profiles */}
          {tour.leaders.length > 0 && (
            <div className="flex flex-col gap-3 lg:border-l lg:pl-6">
              <h4 className="text-sm font-bold">Tourenleitung</h4>
              {tour.leaders.map((leader, i) => (
                <LeaderProfile key={leader.name} leader={leader} highlight={i === 0} />
              ))}
            </div>
          )}
        </div>

        {/* Footer: deadline + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="text-xs text-muted-foreground">
            {canRegister && tour.registrationDeadline && (
              <>Anmeldeschluss: {formatDate(tour.registrationDeadline)}</>
            )}
            {status === "published" && tour.registrationOpensAt && (
              <>Anmeldestart: {formatDateTime(tour.registrationOpensAt)}</>
            )}
          </div>
          <div className="flex gap-2">
            {canSubmitRegistration && (
              <Button
                size="sm"
                variant="positive"
                onClick={() => {
                  if (isAuthenticated) markApplied(tour.id);
                  onRegister(tour);
                }}
              >
                {status === "waitlist" ? "Auf Warteliste" : "Anmelden"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <TourNote tour={tour} />
    </div>
  );
}
