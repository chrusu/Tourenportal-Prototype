// Aktivitäten-Definitionen mit SAC-Farben und Schwierigkeitsskalen pro Unterkategorie.

export interface SubTypeDef {
  label: string;        // exact tourType value used in tour data
  difficulties: string[];
}

export interface DisciplineDef {
  label: string;        // Hauptkategorie display name
  color: string;        // official SAC discipline hex colour (styleguide.md)
  subTypes: SubTypeDef[];
  /**
   * Icon id from the official SAC icon sprite (see styleguide "Icons" page),
   * rendered via <use href="/icons/sac-discipline-sprite.svg#<id>" />.
   * Undefined when the styleguide has no dedicated discipline icon; a
   * fallback (lucide) icon is used instead, see DisciplineIcon.tsx.
   */
  iconId?: string;
}

export const DISCIPLINES: DisciplineDef[] = [
  {
    label: "Wandern",
    color: "#237100",
    iconId: "icon-discipline-mountain-hiking",
    subTypes: [
      { label: "Bergwandern (T1–T3)", difficulties: ["T1", "T2", "T3"] },
      { label: "Alpinwandern (T4–T6)", difficulties: ["T4", "T5", "T6"] },
    ],
  },
  {
    label: "Hochtouren Sommer",
    color: "#662D91",
    iconId: "icon-discipline-alpine-tour",
    subTypes: [
      { label: "Gletschertouren", difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"] },
      { label: "Hochtouren",      difficulties: ["L", "WS-", "WS", "WS+", "ZS-", "ZS", "ZS+", "S-", "S", "S+", "SS", "AS", "EX"] },
    ],
  },
  {
    label: "Schneesport",
    color: "#0033FF",
    iconId: "icon-discipline-ski-tour",
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
    iconId: "icon-discipline-climbing",
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
    color: "#706F6F",
    // No dedicated discipline icon in the SAC icon set; DisciplineIcon falls back to lucide.
    subTypes: [
      { label: "Velo",        difficulties: [] },
      { label: "Mountainbike", difficulties: ["S0", "S1", "S2", "S3", "S4", "S5"] },
    ],
  },
  {
    label: "Höhle",
    color: "#706F6F",
    iconId: "icon-destination-cave",
    subTypes: [
      { label: "Höhle", difficulties: [] },
    ],
  },
  {
    label: "Trailrunning",
    color: "#FF8800",
    // No dedicated discipline icon in the SAC icon set; DisciplineIcon falls back to lucide.
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

/** Resolves the main discipline (Hauptsportart) for a tour, based on its first matching tourType. */
export function mainDisciplineFor(tourType: string[]): DisciplineDef | undefined {
  for (const t of tourType) {
    const d = disciplineForType(t);
    if (d) return d;
  }
  return undefined;
}

/** Resolves the main sub-type label (e.g. "Sportklettern") for a tour, i.e. the first tourType entry with a known discipline. */
export function mainSubTypeLabel(tourType: string[]): string | undefined {
  for (const t of tourType) {
    if (disciplineForType(t)) return t;
  }
  return tourType[0];
}

export interface DisciplineMatch {
  discipline: DisciplineDef;
  /** The tourType sub-type labels of this tour that belong to this discipline. */
  subTypeLabels: string[];
}

/** Resolves every distinct discipline (sport) involved in a tour, in order of appearance. */
export function disciplinesFor(tourType: string[]): DisciplineMatch[] {
  const matches = new Map<string, DisciplineMatch>();
  for (const t of tourType) {
    const d = disciplineForType(t);
    if (!d) continue;
    const existing = matches.get(d.label);
    if (existing) existing.subTypeLabels.push(t);
    else matches.set(d.label, { discipline: d, subTypeLabels: [t] });
  }
  return [...matches.values()];
}
