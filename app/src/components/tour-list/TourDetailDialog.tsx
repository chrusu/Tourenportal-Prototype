import { ExternalLink, Mountain, TrendingUp, Users, Gauge, Bus, Wallet } from "lucide-react";
import type { Tour } from "@/types/tour";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TourStatusBadge } from "./TourStatusBadge";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import { statusVariant } from "@/lib/status";
import { tourColor } from "@/lib/disciplines";

interface TourDetailDialogProps {
  tour: Tour | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (tour: Tour) => void;
}

function Section({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div>
      <h4 className="text-sac-h4 mb-1">{title}</h4>
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
        {text}
      </p>
    </div>
  );
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
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function TourDetailDialog({
  tour,
  open,
  onOpenChange,
  onRegister,
}: TourDetailDialogProps) {
  if (!tour) return null;

  const color = tourColor(tour.tourType, tour.disciplineColor);
  const variant = statusVariant(tour.status);
  const isOpen = variant === "open";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Colored header */}
        <div className="px-6 py-4" style={{ backgroundColor: color }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {tour.tourType.join(" · ")}
            </span>
            {tour.technicalDifficulty && (
              <span className="rounded bg-white/25 px-1.5 py-0.5 text-xs font-bold text-white">
                {tour.technicalDifficulty}
              </span>
            )}
          </div>
          <DialogTitle className="mt-1 pr-8 text-white">{tour.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Details zur Tour {tour.title}
          </DialogDescription>
          {tour.signature && (
            <p className="mt-1 text-sm text-white/80">{tour.signature}</p>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-5 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center gap-2">
            <TourStatusBadge status={tour.status} />
            {tour.groups.map((g) => (
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
            {tour.withMountainGuide && <Badge variant="outline">Mit BF</Badge>}
            {d?.additionalInfo && <Badge variant="outline">{d.additionalInfo}</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                      {tour.destination.elevation
                        ? ` ${tour.destination.elevation} m`
                        : ""}
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
              label="Tempo"
              value={d?.pace}
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
            <Fact
              icon={<Users className="h-4 w-4" />}
              label="Tourenleitung"
              value={tour.leaders.map((l) => l.name).join(", ")}
            />
          </div>

          <div className="flex flex-col gap-4 border-t pt-4">
            <Section title="Beschrieb" text={d?.description} />
            <Section title="Zusatztext" text={d?.additionalText} />
            <Section title="Ausrüstung" text={d?.equipment} />
            <Section title="Kosten" text={d?.costsInfo} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="text-xs text-muted-foreground">
              {isOpen && tour.registrationDeadline && (
                <>Anmeldeschluss: {formatDate(tour.registrationDeadline)}</>
              )}
              {variant === "published" && tour.registrationOpensAt && (
                <>Anmeldung ab: {formatDateTime(tour.registrationOpensAt)}</>
              )}
            </div>
            <div className="flex gap-2">
              {tour.url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={tour.url} target="_blank" rel="noreferrer">
                    Auf sac-bern.ch <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {isOpen && (
                <Button size="sm" variant="positive" onClick={() => onRegister(tour)}>
                  Anmelden
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
