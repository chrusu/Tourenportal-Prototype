import type { Tour } from "@/types/tour";

/**
 * The mock data only carries participant *counts*, not individual people.
 * For the easter-egg "who's coming" tooltip we synthesize plausible
 * participant names deterministically from the tour id, so the same tour
 * always shows the same names (no names are persisted/stored).
 */
const FIRST_NAMES = [
  "Tobias", "Anna", "Lukas", "Sarah", "Simon", "Laura", "Michael", "Nina",
  "Daniel", "Julia", "Marco", "Lea", "Reto", "Sina", "Fabian", "Elena",
  "Patrick", "Céline", "Stefan", "Melanie", "Andreas", "Sabrina", "Christoph",
  "Vanessa", "Roman", "Corinne", "Beat", "Nadine", "Urs", "Michelle",
];

const LAST_NAMES = [
  "Huber", "Meier", "Schmid", "Keller", "Weber", "Fischer", "Baumann",
  "Steiner", "Frei", "Widmer", "Brunner", "Zimmermann", "Gerber", "Moser",
  "Vogel", "Wyss", "Graf", "Bühler", "Rossi", "Egli", "Roth", "Berger",
  "Kaufmann", "Kunz", "Sutter", "Marti", "Stucki", "Lehmann", "Christen",
];

/** Small deterministic 32-bit hash, used to seed the name generator per tour. */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/** Deterministic pseudo-random generator (mulberry32) for a given seed. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Full participant names for a tour (deterministically generated from the
 * tour id), one per registered participant. Returns undefined when the
 * participant count isn't known.
 */
export function participantNames(tour: Tour): string[] | undefined {
  const count = tour.participants?.current;
  if (count == null || count <= 0) return undefined;

  const random = mulberry32(hashSeed(tour.id));
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    names.push(`${first} ${last}`);
  }
  return names;
}

/** "Tobias Huber" -> "Tobias H." */
export function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  const last = parts[parts.length - 1];
  const first = parts.slice(0, -1).join(" ");
  return `${first} ${last.charAt(0)}.`;
}
