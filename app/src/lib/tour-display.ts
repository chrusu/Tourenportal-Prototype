import type { Tour } from "@/types/tour";
import { showsParticipants } from "./status";

/** Occupied/available places string, or undefined if hidden for this tour. */
export function participantsText(tour: Tour): string | undefined {
  if (!showsParticipants(tour)) return undefined;
  return tour.participants?.display || undefined;
}

/** Conditional (physical) requirement, e.g. "A-B". */
export function conditionText(tour: Tour): string | undefined {
  return tour.physicalDifficulty || undefined;
}

/** Ascent / descent (elevation), e.g. "↑ 1600 hm · ↓ 900 hm". */
export function ascentDescentText(tour: Tour): string | undefined {
  const a = tour.detail?.ascentMeters;
  const d = tour.detail?.descentMeters;
  const parts: string[] = [];
  if (a != null) parts.push(`↑ ${a} hm`);
  if (d != null) parts.push(`↓ ${d} hm`);
  return parts.length ? parts.join(" · ") : undefined;
}
