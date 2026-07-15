import { Hash, Calendar, Clock, TrendingUp, Gauge, Activity, Users, Bus } from "lucide-react";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourStatusBadge } from "./TourStatusBadge";
import { EmptyState } from "./EmptyState";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { registrationStatus } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";
import { participantsText, conditionText, ascentDescentText } from "@/lib/tour-display";

interface TourDetailCardViewProps {
  tours: Tour[];
  onReset: () => void;
  onShowDetails: (tour: Tour) => void;
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function TourDetailCardView({
  tours,
  onReset,
  onShowDetails,
}: TourDetailCardViewProps) {
  if (tours.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="flex flex-col gap-4">
      {tours.map((tour) => {
        const color = tourColor(tour.tourType, tour.disciplineColor);
        const status = registrationStatus(tour);
        const canRegister = status === "open" || status === "full";
        const d = tour.detail;
        const dateRange =
          tour.endDate && tour.endDate !== tour.startDate
            ? `${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`
            : formatDate(tour.startDate);
        const leaderNames = tour.leaders.map((l) => l.name).join(", ");
        const places = participantsText(tour);
        const condition = conditionText(tour);
        const elevation = ascentDescentText(tour);

        return (
          <article
            key={tour.id}
            className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Colored header (like the detail view) */}
            <div className="px-5 py-3" style={{ backgroundColor: color }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-bold uppercase tracking-wider text-white">
                      {tour.tourType.join(" · ")}
                    </span>
                    {tour.technicalDifficulty && (
                      <span className="shrink-0 rounded bg-white/25 px-1.5 py-0.5 text-xs font-bold text-white">
                        {tour.technicalDifficulty}
                      </span>
                    )}
                  </div>
                  <h3
                    className="mt-1 cursor-pointer font-bold leading-snug text-white underline-offset-2 hover:underline"
                    onClick={() => onShowDetails(tour)}
                  >
                    {tour.title}
                  </h3>
                  {tour.signature && (
                    <p className="mt-0.5 text-xs text-white/80">{tour.signature}</p>
                  )}
                </div>
                {leaderNames && (
                  <div className="min-w-0 max-w-[45%] shrink text-right">
                    <div className="text-xs uppercase tracking-wider text-white/70">
                      Leitung
                    </div>
                    <div className="break-words text-sm font-bold text-white">
                      {leaderNames}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Body: badges + facts grid */}
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <TourStatusBadge tour={tour} />
                {tour.groups.map((g) => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))}
                {tour.withMountainGuide && <Badge variant="outline">Mit BF</Badge>}
                {d?.additionalInfo && (
                  <Badge variant="outline">{d.additionalInfo}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
                <Fact
                  icon={<Hash className="h-4 w-4" />}
                  label="Tour-ID"
                  value={tour.id}
                />
                <Fact
                  icon={<Calendar className="h-4 w-4" />}
                  label="Datum"
                  value={`${dateRange}${tour.weekdaySpan ? ` (${tour.weekdaySpan})` : ""}`}
                />
                <Fact
                  icon={<Clock className="h-4 w-4" />}
                  label="Dauer"
                  value={formatDuration(tour.durationDays)}
                />
                <Fact
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Auf-/Abstieg"
                  value={elevation}
                />
                <Fact
                  icon={<Gauge className="h-4 w-4" />}
                  label="Tempo"
                  value={d?.pace}
                />
                <Fact
                  icon={<Activity className="h-4 w-4" />}
                  label="Kondition"
                  value={condition}
                />
                <Fact
                  icon={<Users className="h-4 w-4" />}
                  label="Plätze"
                  value={
                    places
                      ? `${places}${d?.maxParticipants ? ` (max. ${d.maxParticipants})` : ""}`
                      : undefined
                  }
                />
                <Fact
                  icon={<Bus className="h-4 w-4" />}
                  label="Verkehrsmittel"
                  value={d?.transport}
                />
              </div>

              {/* Footer */}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {canRegister && tour.registrationDeadline && (
                    <>Anmeldeschluss: {formatDate(tour.registrationDeadline)}</>
                  )}
                  {status === "published" && tour.registrationOpensAt && (
                    <>Anmeldung ab: {formatDateTime(tour.registrationOpensAt)}</>
                  )}
                </span>
                <div className="flex gap-2">
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
