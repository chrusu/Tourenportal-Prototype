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

/** Whether a tour matches a UI registration-status filter value. */
export function matchesRegistrationFilter(tour: Tour, filter: RegistrationStatus): boolean {
  // "Durchgeführt" and "Abgesagt" are their own filter values (for past
  // tours), so they're excluded from the generic "closed" bucket below.
  if (filter === "durchgefuehrt") return tour.status === "durchgefuehrt";
  if (filter === "abgesagt") return tour.status === "abgesagt";

  // Waitlisted tours are participants-aware (see registrationStatus below),
  // so they need to be checked and excluded from the plain "open" bucket
  // independently of the raw status variant.
  const isWaitlist = registrationStatus(tour) === "waitlist";
  if (filter === "warteliste") return isWaitlist;

  const variant = statusVariant(tour.status);
  if (filter === "anmeldung_offen") return variant === "open" && !isWaitlist;
  if (filter === "anmeldung_geschlossen") {
    return variant === "closed" && tour.status !== "durchgefuehrt" && tour.status !== "abgesagt";
  }
  return variant === "published";
}

export const REGISTRATION_STATUS_OPTIONS: {
  value: RegistrationStatus;
  label: string;
}[] = [
  { value: "anmeldung_offen", label: "Anmeldung offen" },
  { value: "warteliste", label: "Anmeldung offen (Warteliste)" },
  { value: "anmeldung_geschlossen", label: "Anmeldung geschlossen" },
  { value: "veroeffentlicht", label: "Veröffentlicht" },
  { value: "durchgefuehrt", label: "Durchgeführt" },
  { value: "abgesagt", label: "Abgesagt" },
];

// ---------------------------------------------------------------------------
// Displayed registration status (per-tour, considering the participants config)
// ---------------------------------------------------------------------------

export type RegStatus =
  | "published"
  | "open"
  | "waitlist"
  | "closed"
  | "full"
  | "durchgefuehrt"
  | "abgesagt";

/** Base registration state, treating "ausgebucht" as an open (but full) tour. */
function baseState(
  status: TourStatus
): "published" | "open" | "closed" | "durchgefuehrt" | "abgesagt" {
  switch (status) {
    case "anmeldung_offen":
    case "ausgebucht":
      return "open";
    case "anmeldung_geschlossen":
    case "nicht_durchgefuehrt":
      return "closed";
    case "durchgefuehrt":
      return "durchgefuehrt";
    case "abgesagt":
      return "abgesagt";
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
 * - "open": registration open with free places (only checked when places are shown)
 * - "waitlist": registration open, but full — new registrations join a waitlist
 * - "full": registration open but no free places and no waitlist — cannot register
 * - "closed": registration closed
 */
export function registrationStatus(tour: Tour): RegStatus {
  const base = baseState(tour.status);
  if (base === "published" || base === "closed" || base === "durchgefuehrt" || base === "abgesagt") {
    return base;
  }
  if (showsParticipants(tour) && isFull(tour)) {
    return tour.participants?.waitlist ? "waitlist" : "full";
  }
  return "open";
}

export function regStatusLabel(status: RegStatus): string {
  switch (status) {
    case "published":
      return "Publiziert";
    case "open":
      return "Anmeldung offen";
    case "waitlist":
      return "Anmeldung offen (Warteliste)";
    case "full":
      return "Ausgebucht";
    case "closed":
      return "Anmeldung geschlossen";
    case "durchgefuehrt":
      return "Durchgeführt";
    case "abgesagt":
      return "Abgesagt";
  }
}
