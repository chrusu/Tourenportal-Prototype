// Merkmal-Definitionen (Tags), gruppiert nach Kategorie.

export interface FlagCategory {
  label: string;
  flags: string[];
}

export const FLAG_CATEGORIES: FlagCategory[] = [
  {
    label: "Organisation & Durchführung",
    flags: ["Zusätzliche Tourenleitende", "Mit Bergführer", "Organisiert von SAC & JO"],
  },
  {
    label: "Struktur & Dauer",
    flags: ["Mehrtägig", "Lager"],
  },
  {
    label: "Anreise & Logistik",
    flags: ["Anreise mit ÖV", "Anreise am Vorabend"],
  },
  {
    label: "Art / thematische Ausrichtung",
    flags: ["Kurs", "Exkursion", "Arbeitseinsatz", "Versammlung"],
  },
  {
    label: "Zielgruppe / Eignung",
    flags: [
      "Geeignet für Tourenleitende",
      "Geeignet für Schnuppergäste",
      "Geeignet für Menschen mit Einschränkung",
      "Geeignet für Anfänger",
      "Geeignet für hungrige Menschen",
    ],
  },
  {
    label: "Zusatz zur Aktivität",
    flags: [
      "Tradklettern",
      "Plaisir",
      "Geeignet für Snowboard",
      "Geeignet für E-Bike",
      "Mehrseillänge",
      "Klettergarten",
      "Halle",
    ],
  },
];

/** Flat list of all known flag values. */
export const ALL_FLAGS = FLAG_CATEGORIES.flatMap((c) => c.flags);
