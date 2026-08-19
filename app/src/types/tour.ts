// TypeScript types derived from Tourenportal/structure.json

export type TourStatus =
  | "geplant"
  | "fixiert"
  | "veroeffentlicht"
  | "anmeldung_offen"
  | "anmeldung_geschlossen"
  | "ausgebucht"
  | "abgesagt"
  | "durchgefuehrt"
  | "nicht_durchgefuehrt";

export type ExperienceLevel = "Einsteiger" | "Erfahren" | "Sehr erfahren";

export type PhysicalDifficulty = "A" | "B" | "C" | "D" | "E";

export type DestinationType =
  | "summit"
  | "hut"
  | "traverse"
  | "marking_point"
  | "departure_arrival"
  | "climbing_area";

export interface Destination {
  name: string;
  elevation?: number;
  url?: string;
  type?: DestinationType;
}

export interface SocialLink {
  platform: "website" | "facebook" | "instagram" | "linkedin";
  url: string;
}

export interface Leader {
  name: string;
  role?: string;
  profileUrl?: string;
  /** Contact / profile details (shown in the detail view, all optional). */
  photoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  social?: SocialLink[];
}

export interface Participants {
  current?: number;
  max?: number;
  display?: string;
  /** Whether a full tour still accepts registrations onto a waitlist. */
  waitlist?: boolean;
  /** Number of people currently on the waitlist, if known. */
  waitlistCount?: number;
}

export interface TourDetail {
  pace?: string;
  ascentMeters?: number;
  descentMeters?: number;
  description?: string;
  additionalText?: string;
  additionalInfo?: string;
  maxParticipants?: number;
  transport?: string;
  travelCosts?: number;
  tourCosts?: number;
  costsInfo?: string;
  equipment?: string;
  meetingPoint?: string;
  route?: string;
}

export interface Tour {
  id: string;
  url?: string;
  title: string;
  startDate: string;
  endDate?: string;
  durationDays?: number;
  weekdaySpan?: string;
  registrationDeadline?: string | null;
  registrationOpensAt?: string;
  tourType: string[];
  tourTypeAbbr?: string;
  technicalDifficulty?: string;
  physicalDifficulty?: string;
  experienceLevel?: ExperienceLevel;
  groups: string[];
  leaders: Leader[];
  withMountainGuide?: boolean;
  participants?: Participants;
  /** Whether the occupied/available places are shown for this tour (configurable). */
  showParticipants?: boolean;
  status: TourStatus;
  statusNote?: string;
  /**
   * Additional free-climbing grade (French/UIAA, e.g. "5b") for the crux of
   * an "Alpinklettern" portion of the tour, shown as its own difficulty
   * badge alongside the main technicalDifficulty (e.g. the Hochtourenskala
   * rating).
   */
  climbingGrade?: string;
  /**
   * Free-text call-out shown as a full-width banner (e.g. "Bitte Anmelden,
   * es hat noch freie Plätze"), color-coded by urgency/tone.
   */
  note?: {
    text: string;
    variant: "green" | "orange";
  };
  flags?: string[];
  signature?: string;
  destination?: Destination;
  disciplineColor?: string;
  detail?: TourDetail;
}

export interface TourData {
  section: string;
  tours: Tour[];
}

/** UI-facing registration status filter values (see prototyp.md). */
export type RegistrationStatus =
  | "anmeldung_offen"
  | "warteliste"
  | "anmeldung_geschlossen"
  | "veroeffentlicht"
  | "durchgefuehrt"
  | "abgesagt";
