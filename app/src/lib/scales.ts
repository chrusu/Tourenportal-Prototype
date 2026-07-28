// Explanatory text for the SAC condition ("Kondition") and technical
// difficulty scales, used to power info tooltips throughout the app.
//
// Source for the condition scale: "Konditionelle Anforderungen" reference
// table (SAC), see technische-anforderungen.md § 5.1 for the full table.

import type { PhysicalDifficulty } from "@/types/tour";
import { expandRange } from "./format";

/** Full description per SAC condition ("Kondition") grade. */
export const CONDITION_LABELS: Record<PhysicalDifficulty, string> = {
  A: "nicht anstrengend",
  B: "wenig anstrengend",
  C: "ziemlich anstrengend",
  D: "anstrengend",
  E: "sehr anstrengend",
};

/**
 * Detailed condition requirement per grade ("konditionelle Anforderungen"):
 * approximate total time and ascent. See technische-anforderungen.md § 5.1.
 */
export const CONDITION_DETAILS: Record<PhysicalDifficulty, string> = {
  A: "0–3h Totalzeit",
  B: "3–5h Totalzeit; bis ca. 800 HM Aufstieg",
  C: "4–7h Totalzeit; ca. 800–1300 HM Aufstieg",
  D: "6–10h Totalzeit; ca. 1300–1600 HM Aufstieg",
  E: "über 10h Totalzeit; Aufstieg mehr als 1600 HM",
};

export const CONDITION_OPTIONS: { value: PhysicalDifficulty; label: string; tooltip: string }[] = (
  Object.keys(CONDITION_LABELS) as PhysicalDifficulty[]
).map((value) => ({
  value,
  label: `${value} – ${CONDITION_LABELS[value]}`,
  tooltip: `${value} – ${CONDITION_LABELS[value]}: ${CONDITION_DETAILS[value]}`,
}));

/** Tooltip text describing a tour's condition ("Kondition") requirement, incl. time/ascent detail. */
export function conditionTooltip(physicalDifficulty?: string): string | undefined {
  const grades = expandRange(physicalDifficulty);
  if (grades.length === 0) return undefined;
  const parts = grades.map((g) => {
    const label = CONDITION_LABELS[g as PhysicalDifficulty];
    const detail = CONDITION_DETAILS[g as PhysicalDifficulty];
    if (!label) return g;
    return detail ? `${g} – ${label} (${detail})` : `${g} – ${label}`;
  });
  return `Kondition: ${parts.join(", ")}`;
}

/** Human-readable name of the technical difficulty scale, keyed by tourType sub-type label. */
const SCALE_BY_SUBTYPE: Record<string, string> = {
  "Bergwandern (T1–T3)": "SAC-Wanderskala (T1–T6)",
  "Alpinwandern (T4–T6)": "SAC-Wanderskala (T1–T6)",
  Gletschertouren: "SAC-Hochtourenskala (L–EX)",
  Hochtouren: "SAC-Hochtourenskala (L–EX)",
  Freeride: "SAC-Hochtourenskala (L–AS)",
  Skitour: "SAC-Hochtourenskala (L–AS)",
  Skihochtour: "SAC-Hochtourenskala (L–AS)",
  Schneeschuhtouren: "Schneeschuh-Skala (WT1–WT6)",
  Klettersteig: "Klettersteig-Skala (K1–K6)",
  Alpinklettern: "SAC-Hochtourenskala (L–EX)",
  Sportklettern: "UIAA-/Frz. Kletterskala (3–7)",
  Bouldern: "UIAA-/Frz. Kletterskala (3–7)",
  "Eisklettern/Drytooling": "WI-Eisskala (WI1–WI6)",
  Mountainbike: "MTB-Skala (S0–S5)",
};

/** Tooltip text describing the technical difficulty scale for a tour's (main) sport. */
export function technicalDifficultyTooltip(tourType: string[]): string {
  for (const t of tourType) {
    const scale = SCALE_BY_SUBTYPE[t];
    if (scale) return `Technische Schwierigkeit nach ${scale}`;
  }
  return "Technische Schwierigkeit";
}

/** Name of the technical difficulty scale for a given tourType sub-type label (e.g. "Sportklettern"). */
export function scaleNameForSubType(label: string): string {
  return SCALE_BY_SUBTYPE[label] ?? "Technische Schwierigkeit";
}

/** General explanation of the SAC condition ("Kondition") scale, for filter tooltips. */
export const CONDITION_SCALE_INFO =
  "SAC-Konditionsskala: A (nicht anstrengend) bis E (sehr anstrengend)";
