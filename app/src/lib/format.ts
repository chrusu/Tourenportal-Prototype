import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

/** Today's date as an ISO date string (YYYY-MM-DD). */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd.MM.yyyy", { locale: de });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd.MM.yyyy, HH:mm", { locale: de });
  } catch {
    return iso;
  }
}

export function formatDuration(days?: number): string {
  if (!days) return "";
  return days === 1 ? "1 Tag" : `${days} Tage`;
}

/** Splits a difficulty range string like "A-B" into its endpoints. */
export function expandRange(value?: string): string[] {
  if (!value) return [];
  return value
    .split("-")
    .map((v) => v.trim())
    .filter(Boolean);
}
