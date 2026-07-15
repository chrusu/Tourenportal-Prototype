import type { RegistrationStatus, TourStatus } from "@/types/tour";

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
