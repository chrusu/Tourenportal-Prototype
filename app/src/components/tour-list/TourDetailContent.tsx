import { ExternalLink, Mountain, TrendingUp, Gauge, Bus, Wallet, Users } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TourStatusBadge } from "./TourStatusBadge";
import { TourDisciplineIcons } from "./TourDisciplineIcons";
import { FavoriteButton } from "./FavoriteButton";
import { LeaderProfile } from "./LeaderProfile";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { registrationStatus } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";
import { conditionTooltip, technicalDifficultyTooltip } from "@/lib/scales";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { linkifyText } from "@/lib/linkify";
import { useAuth } from "@/contexts/AuthContext";
import { useMyActivities } from "@/contexts/MyActivitiesContext";

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

  return (
    <div className="flex flex-col">
      {/* Colored header */}
      <div className="shrink-0 px-5 py-4" style={{ backgroundColor: color }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <TourDisciplineIcons tourType={tour.tourType} className="inline-flex items-center gap-1.5" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {tour.tourType.join(" · ")}
              </span>
              {tour.technicalDifficulty && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded bg-white/25 px-1.5 py-0.5 text-xs font-bold text-white">
                      {tour.technicalDifficulty}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <TooltipInfo {...technicalDifficultyTooltip(tour.tourType, tour.technicalDifficulty)} />
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <h2 className="mt-1 text-lg font-bold leading-snug text-white">
              {tour.title}
            </h2>
            {tour.signature && (
              <p className="mt-0.5 text-xs text-white/80">{tour.signature}</p>
            )}
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
            <Badge key={flag} variant="outline">{flag}</Badge>
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
          <Fact
            icon={<Gauge className="h-4 w-4" />}
            label="Schwierigkeit"
            value={tour.technicalDifficulty}
            tooltip={<TooltipInfo {...technicalDifficultyTooltip(tour.tourType, tour.technicalDifficulty)} />}
          />
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
              tour.participants?.display
                ? `${tour.participants.display}${d?.maxParticipants ? ` (max. ${d.maxParticipants})` : ""}`
                : d?.maxParticipants
                  ? `max. ${d.maxParticipants}`
                  : undefined
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
              <>Anmeldung ab: {formatDateTime(tour.registrationOpensAt)}</>
            )}
          </div>
          <div className="flex gap-2">
            {tour.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={tour.url} target="_blank" rel="noreferrer">
                  sac-bern.ch <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
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
    </div>
  );
}
