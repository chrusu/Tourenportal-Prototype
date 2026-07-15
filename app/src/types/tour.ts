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

export type PhysicalDifficulty = "A" | "B" | "C" | "D";

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

export interface Leader {
  name: string;
  role?: string;
  profileUrl?: string;
}

export interface Participants {
  current?: number;
  max?: number;
  display?: string;
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
  status: TourStatus;
  statusNote?: string;
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

/** UI-facing registration status (three visible states, see prototyp.md). */
export type RegistrationStatus =
  | "anmeldung_offen"
  | "anmeldung_geschlossen"
  | "veroeffentlicht";
