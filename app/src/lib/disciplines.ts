// Aktivitäten-Definitionen mit SAC-Farben und Schwierigkeitsskalen pro Unterkategorie.

export interface SubTypeDef {
  label: string;        // exact tourType value used in tour data
  difficulties: string[];
}

export interface DisciplineDef {
  label: string;        // Hauptkategorie display name
  color: string;        // official SAC discipline hex colour (styleguide.md)
  subTypes: SubTypeDef[];
}

export const DISCIPLINES: DisciplineDef[] = [
  {
    label: "Wandern",
    color: "#237100",
    subTypes: [
      { label: "Bergwandern (T1–T3)", difficulties: ["T1", "T2", "T3"] },
      { label: "Alpinwandern (T4–T6)", difficulties: ["T4", "T5", "T6"] },
    ],
  },
  {
    label: "Hochtouren Sommer",
    color: "#662D91",
    subTypes: [
      { label: "Gletschertouren", difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"] },
      { label: "Hochtouren",      difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"] },
    ],
  },
  {
    label: "Schneesport",
    color: "#0033FF",
    subTypes: [
      { label: "Freeride",          difficulties: ["L", "WS", "ZS", "S", "SS", "AS"] },
      { label: "Pistenfahren",      difficulties: [] },
      { label: "Langlauf",          difficulties: [] },
      { label: "Schneeschuhtouren", difficulties: ["WT1", "WT2", "WT3", "WT4", "WT5", "WT6"] },
      { label: "Skitour",           difficulties: ["L", "WS", "ZS", "S", "SS", "AS"] },
      { label: "Skihochtour",       difficulties: ["L", "WS", "ZS", "S", "SS", "AS"] },
    ],
  },
  {
    label: "Klettern",
    color: "#FF3D12",
    subTypes: [
      { label: "Klettersteig",          difficulties: ["K1", "K2", "K3", "K4", "K5", "K6"] },
      { label: "Alpinklettern",         difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"] },
      { label: "Sportklettern",         difficulties: ["3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a"] },
      { label: "Bouldern",              difficulties: [] },
      { label: "Eisklettern/Drytooling", difficulties: ["WI1", "WI2", "WI3", "WI4", "WI5", "WI6"] },
    ],
  },
  {
    label: "Velo/Bike",
    color: "#FFCC00",
    subTypes: [
      { label: "Velo",        difficulties: [] },
      { label: "Mountainbike", difficulties: ["S0", "S1", "S2", "S3", "S4", "S5"] },
    ],
  },
  {
    label: "Höhle",
    color: "#706F6F",
    subTypes: [
      { label: "Höhle", difficulties: [] },
    ],
  },
  {
    label: "Trailrunning",
    color: "#FF8800",
    subTypes: [
      { label: "Trailrunning", difficulties: [] },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns the discipline that contains the given tourType value. */
export function disciplineForType(tourType: string): DisciplineDef | undefined {
  return DISCIPLINES.find((d) => d.subTypes.some((s) => s.label === tourType));
}

/** Returns the sub-type definition for a given tourType value. */
export function subTypeFor(tourType: string): SubTypeDef | undefined {
  for (const d of DISCIPLINES) {
    const st = d.subTypes.find((s) => s.label === tourType);
    if (st) return st;
  }
  return undefined;
}

/** Resolves the primary display colour for a tour. */
export function tourColor(tourType: string[], disciplineColor?: string): string {
  if (disciplineColor) return disciplineColor;
  for (const t of tourType) {
    const d = disciplineForType(t);
    if (d) return d.color;
  }
  return "#706F6F";
}
