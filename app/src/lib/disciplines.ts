// Discipline definitions with official SAC colors (styleguide.md) and the
// difficulty scales associated with each discipline (structure.json).

export interface DisciplineDef {
  /** Canonical discipline key used for the tour type filter (label). */
  label: string;
  /** Matches values found in Tour.tourType (mockdata.json). */
  matches: string[];
  /** Official SAC discipline color (hex). */
  color: string;
  /** Difficulty grades offered for this discipline. */
  difficulties: string[];
}

export const DISCIPLINES: DisciplineDef[] = [
  {
    label: "Berg- und Alpinwandern",
    matches: ["Bergwandern", "Wandern", "Alpinwandern"],
    color: "#237100",
    difficulties: ["T1", "T2", "T3", "T4", "T5", "T6"],
  },
  {
    label: "Hochtouren",
    matches: ["Hochtour"],
    color: "#662D91",
    difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"],
  },
  {
    label: "Klettersteige",
    matches: ["Klettersteig"],
    color: "#FF8800",
    difficulties: ["K1", "K2", "K3", "K4", "K5", "K6"],
  },
  {
    label: "Klettern",
    matches: [
      "Klettern",
      "Klettern Halle",
      "Klettern Klettergarten",
      "Klettern Mehrseillängen",
      "Klettern Alpin",
    ],
    color: "#FF3D12",
    difficulties: ["3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a"],
  },
  {
    label: "Eisklettern",
    matches: ["Eisklettern"],
    color: "#008A79",
    difficulties: ["WI1", "WI2", "WI3", "WI4", "WI5", "WI6"],
  },
  {
    label: "Bouldern",
    matches: ["Bouldern"],
    color: "#FF3D12",
    difficulties: [],
  },
  {
    label: "Ski- und Splitboardtouren",
    matches: ["Skitour", "Ski-Hochtour", "Skihochtour", "Snowboard-Tour"],
    color: "#0033FF",
    difficulties: ["L", "WS", "ZS", "S", "SS", "AS"],
  },
  {
    label: "Schneeschuhtouren",
    matches: ["Schneeschuh-Wanderung", "Schneeschuh-Hochtour"],
    color: "#008A79",
    difficulties: ["WT1", "WT2", "WT3", "WT4", "WT5", "WT6"],
  },
  {
    label: "Mountainbike",
    matches: ["Mountain-Bike"],
    color: "#FFCC00",
    difficulties: ["S0", "S1", "S2", "S3", "S4", "S5"],
  },
  {
    label: "Kurs / Anlass / Weiteres",
    matches: ["Kurs", "Anlass", "Versammlung", "Ausbildung", "Diverses", "Sonstiges", "Hütten", "Umwelttour"],
    color: "#706F6F",
    difficulties: [],
  },
];

/** Returns the discipline definition that a given tourType value belongs to. */
export function disciplineForType(tourType: string): DisciplineDef | undefined {
  return DISCIPLINES.find((d) => d.matches.includes(tourType));
}

/** Resolves the primary display color for a tour based on its disciplineColor or tourType. */
export function tourColor(tourType: string[], disciplineColor?: string): string {
  if (disciplineColor) return disciplineColor;
  for (const t of tourType) {
    const d = disciplineForType(t);
    if (d) return d.color;
  }
  return "#706F6F";
}
