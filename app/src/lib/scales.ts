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

/** Structured tooltip content: bold title + one detail line per item. */
export interface TooltipInfoData {
  title: string;
  items: string[];
}

/** Tooltip content describing a tour's condition ("Kondition") requirement, incl. time/ascent detail. */
export function conditionTooltip(physicalDifficulty?: string): TooltipInfoData | undefined {
  const grades = expandRange(physicalDifficulty);
  if (grades.length === 0) return undefined;
  const items = grades.map((g) => {
    const label = CONDITION_LABELS[g as PhysicalDifficulty];
    const detail = CONDITION_DETAILS[g as PhysicalDifficulty];
    if (!label) return g;
    return detail ? `${g} – ${label} (${detail})` : `${g} – ${label}`;
  });
  return { title: "Kondition", items };
}

/**
 * A SAC technical-difficulty scale: name, one-line description, and (where
 * enumerable) a label per grade. See technische-anforderungen.md § 5.2 for
 * the full reference (source: SAC styleguide – Schwierigkeitsskalen).
 */
export interface DifficultyScale {
  name: string;
  description: string;
  /** Grade code -> short label, e.g. "T3" -> "anspruchsvolles Bergwandern". Empty when grades aren't discrete (e.g. Kletterskala). */
  grades: Record<string, string>;
}

const WANDERSKALA: DifficultyScale = {
  name: "SAC-Wanderskala",
  description: "Bewertet die Schwierigkeit von Berg- und Wanderwegen von T1 (leicht) bis T6 (extrem schwierig).",
  grades: {
    T1: "Wandern",
    T2: "Bergwandern",
    T3: "anspruchsvolles Bergwandern",
    T4: "Alpinwandern",
    T5: "anspruchsvolles Alpinwandern",
    T6: "schwieriges Alpinwandern",
  },
};

const HOCHTOURENSKALA: DifficultyScale = {
  name: "SAC-Berg- und Hochtourenskala",
  description:
    "Bewertet die technische Schwierigkeit von Berg- und Hochtouren im hochalpinen Gelände bei guten Verhältnissen.",
  grades: {
    L: "leicht",
    "WS-": "wenig schwierig-",
    WS: "wenig schwierig",
    "WS+": "wenig schwierig+",
    "ZS-": "wenig schwierig-",
    ZS: "ziemlich schwierig",
    "ZS+": "ziemlich schwierig+",
    "S-": "schwierig-",
    S: "schwierig",
    "S+": "schwierig+",
    "SS-": "sehr schwierig-",
    SS: "sehr schwierig",
    "SS+": "sehr schwierig+",
  },
};

const SKITOURENSKALA: DifficultyScale = {
  name: "SAC-Skitourenskala",
  description:
    "Bewertet den skifahrerischen Teil einer Skitour anhand des höchsten Hauptkriteriums bei guten Bedingungen.",
  grades: {
    L: "leicht",
    "WS-": "wenig schwierig-",
    WS: "wenig schwierig",
    "WS+": "wenig schwierig+",
    "ZS-": "wenig schwierig-",
    ZS: "ziemlich schwierig",
    "ZS+": "ziemlich schwierig+",
    "S-": "ziemlich schwierig-",
    S: "schwierig",
    "S+": "schwierig+",
    "SS-": "sehr schwierig-",
    SS: "sehr schwierig",
    "SS+": "sehr schwierig+",
  },
};

const SCHNEESCHUHSKALA: DifficultyScale = {
  name: "SAC-Schneeschuhtourenskala",
  description:
    "Richtwerte für Schneeschuhtouren bei guten Bedingungen; setzt sichere Orientierung und ab WT2 LVS-Ausrüstung voraus.",
  grades: {
    WT1: "Leichte Schneeschuhwanderung",
    WT2: "Schneeschuhwanderung",
    WT3: "anspruchsvolle Schneeschuhwanderung",
    WT4: "Schneeschuhtour",
    WT5: "Alpine Schneeschuhtour",
    WT6: "anspruchsvolle alpine Schneeschuhtour",
  },
};

const KLETTERSKALA_FR: DifficultyScale = {
  name: "Kletterskala (französische Skala)",
  description: "Bewertet die klettertechnische Schwierigkeit anhand der Schlüsselstelle (z. B. 6a, 6b+).",
  grades: {},
};

const WI_SKALA: DifficultyScale = {
  name: "Eisklettern (Water Ice, WI-Skala)",
  description:
    "Bewertet die technische Schwierigkeit von Eiskletterrouten (Wasserfalleis) anhand Steilheit, Länge und Absicherung.",
  grades: {},
};

const KLETTERSTEIGSKALA: DifficultyScale = {
  name: "SAC-Klettersteigskala (Hüsler-Skala)",
  description: "Schweizer Schwierigkeitsskala für Klettersteige, Grade K1 (leicht) bis K6 (extrem schwierig).",
  grades: {
    K1: "leicht",
    K2: "mittel",
    K3: "ziemlich schwierig",
    K4: "schwierig",
    K5: "sehr schwierig",
    K6: "extrem schwierig",
  },
};

const SINGLETRAILSKALA: DifficultyScale = {
  name: "Singletrail-Skala (STS)",
  description:
    "Bewertet die technische Schwierigkeit von Mountainbike-Singletrails unter idealen Bedingungen, S0 (sehr leicht) bis S5 (extrem schwierig).",
  grades: {
    S0: "leicht",
    S1: "leicht",
    S2: "mittel",
    S3: "schwer",
    S4: "schwer",
    S5: "schwer",
  },
};

/** Maps a tourType sub-type label to its technical difficulty scale. */
const SCALE_BY_SUBTYPE: Record<string, DifficultyScale> = {
  "Bergwandern (T1–T3)": WANDERSKALA,
  "Alpinwandern (T4–T6)": WANDERSKALA,
  Gletschertouren: HOCHTOURENSKALA,
  Hochtouren: HOCHTOURENSKALA,
  Alpinklettern: HOCHTOURENSKALA,
  Freeride: SKITOURENSKALA,
  Skitour: SKITOURENSKALA,
  Skihochtour: SKITOURENSKALA,
  Schneeschuhtouren: SCHNEESCHUHSKALA,
  Klettersteig: KLETTERSTEIGSKALA,
  Sportklettern: KLETTERSKALA_FR,
  Bouldern: KLETTERSKALA_FR,
  "Eisklettern/Drytooling": WI_SKALA,
  Mountainbike: SINGLETRAILSKALA,
};

/** Resolves the technical difficulty scale for a given tourType sub-type label (e.g. "Sportklettern"). */
export function scaleForSubType(label: string): DifficultyScale | undefined {
  return SCALE_BY_SUBTYPE[label];
}

/** Resolves the technical difficulty scale for a tour's tourType list (first match wins). */
export function scaleForTourType(tourType: string[]): DifficultyScale | undefined {
  for (const t of tourType) {
    const scale = SCALE_BY_SUBTYPE[t];
    if (scale) return scale;
  }
  return undefined;
}

/** Name of the technical difficulty scale for a given tourType sub-type label (e.g. "Sportklettern"). */
export function scaleNameForSubType(label: string): string {
  return SCALE_BY_SUBTYPE[label]?.name ?? "Technische Schwierigkeit";
}

/** Splits a grade range like "T3 - T4" into its endpoints, without breaking codes such as "WS-". */
export function splitGradeRange(value: string): string[] {
  return value
    .split(/\s+-\s+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Builds the tooltip content for a single resolved difficulty scale. */
function buildScaleTooltip(scale: DifficultyScale, technicalDifficulty?: string): TooltipInfoData {
  if (technicalDifficulty) {
    const grades = splitGradeRange(technicalDifficulty);
    const items = grades
      .map((g) => (scale.grades[g] ? `${g} – ${scale.grades[g]}` : undefined))
      .filter((p): p is string => !!p);
    if (items.length > 0) {
      return { title: scale.name, items };
    }
  }

  return { title: scale.name, items: [scale.description] };
}

/** Tooltip content describing a tour's technical difficulty, incl. the scale and (if known) the specific grade's meaning. */
export function technicalDifficultyTooltip(
  tourType: string[],
  technicalDifficulty?: string
): TooltipInfoData {
  const scale = scaleForTourType(tourType);
  if (!scale) return { title: "Technische Schwierigkeit", items: [] };
  return buildScaleTooltip(scale, technicalDifficulty);
}

/**
 * A tour can combine multiple activity types (e.g. "Alpinklettern" +
 * "Hochtouren"), each potentially governed by its own SAC difficulty scale.
 * Resolves one entry per *distinct* scale referenced by `tourType` (so types
 * sharing a scale, like the example above, aren't duplicated), each paired
 * with a tooltip for the tour's technical difficulty under that scale.
 */
export interface SubTypeDifficulty {
  scale: DifficultyScale;
  tooltip: TooltipInfoData;
}

export function difficultiesForTourType(
  tourType: string[],
  technicalDifficulty?: string
): SubTypeDifficulty[] {
  const scales = new Map<string, DifficultyScale>();
  for (const t of tourType) {
    const scale = SCALE_BY_SUBTYPE[t];
    if (scale && !scales.has(scale.name)) scales.set(scale.name, scale);
  }
  return [...scales.values()].map((scale) => ({
    scale,
    tooltip: buildScaleTooltip(scale, technicalDifficulty),
  }));
}

/** General explanation of the SAC condition ("Kondition") scale, for filter tooltips. */
export const CONDITION_SCALE_INFO =
  "SAC-Konditionsskala: A (nicht anstrengend) bis E (sehr anstrengend)";
