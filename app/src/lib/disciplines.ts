// Discipline definitions with official SAC colors and per-sub-type difficulty scales.

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
    label: "Berg- und Alpinwandern",
    color: "#237100",
    subTypes: [
      { label: "Bergwandern",   difficulties: ["T1","T2","T3","T4","T5","T6"] },
      { label: "Wandern",       difficulties: ["T1","T2","T3"] },
      { label: "Alpinwandern",  difficulties: ["T4","T5","T6"] },
    ],
  },
  {
    label: "Hochtouren",
    color: "#662D91",
    subTypes: [
      { label: "Hochtour", difficulties: ["L","WS-","WS","WS+","ZS-","ZS","ZS+","S-","S","S+","SS","AS","EX"] },
    ],
  },
  {
    label: "Klettersteige",
    color: "#FF8800",
    subTypes: [
      { label: "Klettersteig", difficulties: ["K1","K2","K3","K4","K5","K6"] },
    ],
  },
  {
    label: "Klettern",
    color: "#FF3D12",
    subTypes: [
      // Sport-climbing grades for gym/crag/multi-pitch
      { label: "Klettern Halle",         difficulties: ["3a","3b","3c","4a","4b","4c","5a","5b","5c","6a","6b","6c","7a"] },
      { label: "Klettern Klettergarten", difficulties: ["3a","3b","3c","4a","4b","4c","5a","5b","5c","6a","6b","6c","7a"] },
      { label: "Klettern Mehrseillängen",difficulties: ["3a","3b","3c","4a","4b","4c","5a","5b","5c","6a","6b","6c","7a"] },
      // Alpine grades for alpine climbing (same scale as Hochtouren)
      { label: "Klettern Alpin", difficulties: ["L","WS-","WS","WS+","ZS-","ZS","ZS+","S-","S","S+","SS","AS","EX"] },
    ],
  },
  {
    label: "Eisklettern",
    color: "#008A79",
    subTypes: [
      { label: "Eisklettern", difficulties: ["WI1","WI2","WI3","WI4","WI5","WI6"] },
    ],
  },
  {
    label: "Bouldern",
    color: "#FF3D12",
    subTypes: [
      { label: "Bouldern", difficulties: [] },
    ],
  },
  {
    label: "Ski- und Splitboardtouren",
    color: "#0033FF",
    subTypes: [
      { label: "Skitour",       difficulties: ["L","WS","ZS","S","SS","AS"] },
      { label: "Ski-Hochtour",  difficulties: ["L","WS","ZS","S","SS","AS"] },
      { label: "Skihochtour",   difficulties: ["L","WS","ZS","S","SS","AS"] },
      { label: "Snowboard-Tour",difficulties: ["L","WS","ZS","S","SS","AS"] },
    ],
  },
  {
    label: "Schneeschuhtouren",
    color: "#008A79",
    subTypes: [
      { label: "Schneeschuh-Wanderung", difficulties: ["WT1","WT2","WT3","WT4","WT5","WT6"] },
      { label: "Schneeschuh-Hochtour",  difficulties: ["WT1","WT2","WT3","WT4","WT5","WT6"] },
    ],
  },
  {
    label: "Mountainbike",
    color: "#FFCC00",
    subTypes: [
      { label: "Mountain-Bike", difficulties: ["S0","S1","S2","S3","S4","S5"] },
    ],
  },
  {
    label: "Kurs / Anlass / Weiteres",
    color: "#706F6F",
    subTypes: [
      { label: "Kurs",        difficulties: [] },
      { label: "Anlass",      difficulties: [] },
      { label: "Versammlung", difficulties: [] },
      { label: "Ausbildung",  difficulties: [] },
      { label: "Diverses",    difficulties: [] },
      { label: "Sonstiges",   difficulties: [] },
      { label: "Hütten",      difficulties: [] },
      { label: "Umwelttour",  difficulties: [] },
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
