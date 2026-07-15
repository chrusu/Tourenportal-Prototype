import type { RegistrationStatus, Tour, TourStatus } from "@/types/tour";

export type StatusVariant = "open" | "closed" | "published";

/** Maps the granular tour status to one of the three visible UI states. */
export function statusVariant(status: TourStatus): StatusVariant {
  switch (status) {
    case "anmeldung_offen":
      return "open";
    case "anmeldung_geschlossen":
    case "ausgebucht":
    case "abgesagt":
    case "durchgefuehrt":
    case "nicht_durchgefuehrt":
      return "closed";
    case "veroeffentlicht":
    case "geplant":
    case "fixiert":
    default:
      return "published";
  }
}

export function statusLabel(status: TourStatus): string {
  switch (statusVariant(status)) {
    case "open":
      return "Anmeldung offen";
    case "closed":
      return "Anmeldung geschlossen";
    case "published":
      return "Veröffentlicht";
  }
}

/** Whether a granular status matches a UI registration-status filter value. */
export function matchesRegistrationFilter(
  status: TourStatus,
  filter: RegistrationStatus
): boolean {
  const variant = statusVariant(status);
  if (filter === "anmeldung_offen") return variant === "open";
  if (filter === "anmeldung_geschlossen") return variant === "closed";
  return variant === "published";
}

export const REGISTRATION_STATUS_OPTIONS: {
  value: RegistrationStatus;
  label: string;
}[] = [
  { value: "anmeldung_offen", label: "Anmeldung offen" },
  { value: "anmeldung_geschlossen", label: "Anmeldung geschlossen" },
  { value: "veroeffentlicht", label: "Veröffentlicht" },
];

// ---------------------------------------------------------------------------
// Displayed registration status (per-tour, considering the participants config)
// ---------------------------------------------------------------------------

export type RegStatus = "published" | "open" | "closed" | "full";

/** Base registration state, treating "ausgebucht" as an open (but full) tour. */
function baseState(status: TourStatus): "published" | "open" | "closed" {
  switch (status) {
    case "anmeldung_offen":
    case "ausgebucht":
      return "open";
    case "anmeldung_geschlossen":
    case "abgesagt":
    case "durchgefuehrt":
    case "nicht_durchgefuehrt":
      return "closed";
    default:
      return "published";
  }
}

/** Whether the occupied/available places are shown for a tour (configurable). */
export function showsParticipants(tour: Tour): boolean {
  return tour.showParticipants ?? Boolean(tour.participants?.max);
}

function isFull(tour: Tour): boolean {
  const p = tour.participants;
  return p?.current != null && p?.max != null && p.current >= p.max;
}

/**
 * Resolves the registration status shown to the user.
 *
 * - "published": registration not yet open
 * - "open": registration open (only "not full" when places are shown)
 * - "full": registration open but no free places — only when places are shown
 * - "closed": registration closed
 */
export function registrationStatus(tour: Tour): RegStatus {
  const base = baseState(tour.status);
  if (base === "published") return "published";
  if (base === "closed") return "closed";
  if (showsParticipants(tour) && isFull(tour)) return "full";
  return "open";
}

export function regStatusLabel(status: RegStatus): string {
  switch (status) {
    case "published":
      return "Publiziert";
    case "open":
      return "Anmeldung offen";
    case "full":
      return "Ausgebucht";
    case "closed":
      return "Anmeldung geschlossen";
  }
}
