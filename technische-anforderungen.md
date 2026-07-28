# Technische Anforderungen – SAC Tourenportal Prototyp

Dieses Dokument definiert die technische Grundlage für die Umsetzung eines neuen, klickbaren Frontend-Prototyps für die Tourensuche (Basis: `prototyp.md` V0.2 + `umsetzungsplan.md` V0.3), unter Verwendung von **React**, **Tailwind CSS** und **shadcn/ui**, mit den Daten aus `mockdata.json` und unter Berücksichtigung des offiziellen SAC-Styleguides (`styleguide.md`).

## 1. Zielsetzung

- Funktionsfähiger, interaktiver Prototyp (kein reines Figma-Mock) der Tourenliste inkl. horizontaler Filterleiste, gemäss `umsetzungsplan.md` (V0.3: Tourengruppe, Tourentyp inkl. Schwierigkeit, Anforderung, Kondition, Tourenleiter, Anmeldestatus – **ohne** Sortierung).
- Modernes, benutzerfreundliches UI nach aktuellen Standards (Barrierefreiheit, responsives Verhalten, klare visuelle Hierarchie).
- Optische Anlehnung an den offiziellen SAC-Styleguide (Farben, Typografie, Icons, Button-Varianten), **nicht** 1:1-Kopie des Figma-Prototyps V0.2 (der bewusst ein eigenständiges, moderneres Farbschema nutzt).
- Datengrundlage ausschliesslich `mockdata.json`, strukturiert gemäss `structure.json` – keine echte Backend-Anbindung im Prototyp.

## 2. Technologie-Stack

| Bereich | Wahl | Begründung |
| --- | --- | --- |
| Framework | **React 18** mit **Vite** | Schneller Dev-Server, kein Server-Rendering nötig für einen Daten-Prototyp |
| Sprache | **TypeScript** | Typsicherheit für das Datenmodell aus `structure.json` |
| Styling | **Tailwind CSS v3** | Utility-first, gute Kombination mit shadcn/ui |
| Komponenten | **shadcn/ui** (Radix UI + Tailwind) | Zugängliche, anpassbare Basis-Komponenten (Popover, Command, Checkbox, Badge, Select, Sheet …) |
| Icons | **lucide-react** (shadcn-Standard) für UI-Icons; SAC-SVG-Sprite (`svg-sprite.svg`) für Disziplin-/Zieltyp-Icons | Kombination aus generischem UI-Iconset und offiziellem SAC-Icon-Vokabular |
| State (Filter) | React State/`useReducer` + `useSearchParams` (URL-Sync) | Filterzustand soll in der URL abbildbar sein (Teilbarkeit, Browser-Zurück) |
| Formatierung | `date-fns` (mit `de-CH`-Locale) | Datumsformatierung/-vergleiche für Zeitraum-Filter |
| Validierung Datenmodell | `zod` (aus `structure.json` abgeleitetes Schema) | Laufzeitprüfung der Mockdaten, Typableitung |
| Linting/Formatting | ESLint + Prettier | Konsistenz |
| Tests | Vitest + React Testing Library | Unit-Tests für Filterlogik, Komponententests für Card/Filterbar |
| Package Manager | pnpm (oder npm, je nach Team-Konvention) | – |

> Hinweis: Falls das Endprodukt später serverseitiges Rendering/SEO benötigt (z. B. für öffentliche Sektionsseiten), ist ein Wechsel auf **Next.js (App Router)** empfohlen. Für den reinen Prototyp reicht Vite + React.

## 3. Projektstruktur (Vorschlag)

```
tourenportal-prototyp/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                  # Tailwind-Basis + SAC-Design-Tokens
│   ├── data/
│   │   └── mockdata.json          # 1:1 aus Tourenportal/mockdata.json
│   ├── types/
│   │   └── tour.ts                # TypeScript-Typen aus structure.json abgeleitet
│   ├── schemas/
│   │   └── tour.schema.ts         # zod-Schema (Laufzeitvalidierung)
│   ├── lib/
│   │   ├── filter.ts              # reine Filterlogik (testbar, kein UI)
│   │   ├── sort.ts                # (optional, vorerst ungenutzt lt. Anforderung)
│   │   └── format.ts              # Datum/Anzeige-Helper
│   ├── hooks/
│   │   ├── useTourFilters.ts       # Filterzustand + URL-Sync
│   │   └── useFilteredTours.ts     # kombiniert Daten + Filter
│   ├── components/
│   │   ├── ui/                     # generierte shadcn/ui-Komponenten (Button, Popover, Checkbox, Badge, …)
│   │   ├── filters/
│   │   │   ├── FilterBar.tsx
│   │   │   ├── DateRangeFilter.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── GroupFilter.tsx
│   │   │   ├── TourTypeFilter.tsx   # kaskadierend: Disziplin + Schwierigkeit
│   │   │   ├── RequirementFilter.tsx   # Anforderung (Einsteiger/Erfahren/Sehr erfahren)
│   │   │   ├── ConditionFilter.tsx     # Kondition (A–D)
│   │   │   ├── LeaderFilter.tsx
│   │   │   ├── RegistrationStatusFilter.tsx
│   │   │   └── ActiveFilterChips.tsx   # zeigt aktive Filter als entfernbare Chips
│   │   ├── tour-list/
│   │   │   ├── TourList.tsx
│   │   │   ├── TourCard.tsx
│   │   │   ├── TourStatusBadge.tsx
│   │   │   ├── DisciplineBar.tsx       # farbiger linker Rand
│   │   │   └── EmptyState.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── ResultsSummary.tsx
│   └── pages/ (falls Routing nötig)
├── tailwind.config.ts
├── components.json                 # shadcn/ui-Konfiguration
├── tsconfig.json
├── package.json
└── vite.config.ts
```

## 4. Design-Tokens: Mapping SAC-Styleguide → Tailwind

Basierend auf `styleguide.md`. Tailwind-Konfiguration erweitert um die offiziellen SAC-Farben und die Frutiger-Typografie, damit das Prototyp-UI erkennbar zur Marke passt, auch wenn die Komponenten via shadcn/ui gebaut werden.

### 4.1 Farben (`tailwind.config.ts` → `theme.extend.colors`)

```ts
colors: {
  sac: {
    red: "#E30613",
    redHover: "#B00511",
    red30: "#F6B4B8",
    green: "#84BE41",
    greenHover: "#81A624",
    yellow: "#FFCC00",
    orange: "#FF8800",
    black: "#333333",
    grayDark: "#706F6F",
    gray: "#E9E9E9",
    grayMedium: "#999999",
    grayLight: "#F4F4F4",
    snow: "#F9F9F9",
    alertBlue: "#00A3DA",
    alertYellow: "#FFD300",
  },
  discipline: {
    mountainHiking: "#237100",   // Berg-/Alpinwandern
    alpineTour: "#662D91",       // Hochtour
    climbing: "#FF3D12",         // Klettern (alle Spielarten)
    viaFerrata: "#FF8800",       // Klettersteig
    skiTour: "#0033FF",          // Skitour
    snowshoeTour: "#008A79",     // Schneeschuhtour
  },
}
```

- `disciplineColor` aus `structure.json`/`mockdata.json` liefert bereits diese Hex-Werte direkt – die Tailwind-Tokens dienen primär der Konsistenz für UI-Elemente, die **nicht** direkt aus den Daten kommen (z. B. Statusfarben, Rahmen der Filterleiste).
- shadcn/ui nutzt intern CSS-Variablen (`--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`, …, definiert in `index.css`). Diese werden auf die SAC-Palette gemappt:
  - `--primary` → `sac-black` (Buttons „Details anzeigen", Text-CTA-Farbe)
  - `--destructive` → `sac-red`
  - `--secondary` / `--muted` → `sac-grayLight` / `sac-snow`
  - Status-Grün (Anmeldung offen) → `sac-green`
  - Status-Orange (Anmeldung geschlossen) → `sac-orange`

### 4.2 Typografie

- Schriftfamilie **Frutiger** (Lizenz/Font-Files vom SAC via Design-Team beziehen; Fallback-Stack: `"Frutiger", "Frutiger LT Std", system-ui, sans-serif`).
- Tailwind `fontSize`-Skala an `fs-h1`…`fs-label` anlehnen:

```ts
fontSize: {
  "sac-h1": ["36px", { lineHeight: "1.25", fontWeight: "700" }],
  "sac-h2": ["30px", { lineHeight: "1.25", fontWeight: "700" }],
  "sac-h3": ["22px", { lineHeight: "1.25", fontWeight: "700" }],
  "sac-h4": ["15px", { lineHeight: "1.25", fontWeight: "700" }],
  "sac-copy": ["15px", { lineHeight: "1.5", fontWeight: "300" }],
  "sac-copy-note": ["12px", { lineHeight: "1.5", fontWeight: "300" }],
  "sac-label": ["10px", { lineHeight: "1" }],
}
```

- Nur zwei Schriftschnitte verfügbar (300/700) – shadcn-Komponenten, die `font-medium`/`font-semibold` nutzen, müssen auf `font-light`/`font-bold` umgemappt werden (Tailwind `fontWeight`-Override oder gezielte Klassen-Overrides in `components.json`/Theme).

### 4.3 Icons

- Disziplin-Icons (`icon-discipline-*`) und Zieltyp-Icons (`icon-destination-*`) aus dem SAC-SVG-Sprite für `TourTypeFilter` und `TourCard`/`destination` verwenden (als `<svg><use></svg>` oder als React-Icon-Komponente aus dem Sprite generiert).
- Restliche UI-Icons (Kalender, Suche, Chevron, X, Reset) aus `lucide-react`, da shadcn/ui darauf aufbaut – Icon-Stil (Line-Icons, konsistente Strichstärke) ist mit dem SAC-Iconstil kompatibel.

### 4.4 Buttons (Mapping SAC → shadcn `buttonVariants`)

Quelle: [SAC-Styleguide – Buttons](https://saccas-frontend.netlify.app/preview/styleguide/components-buttons) (`.c-button`-Familie). Umgesetzt in `src/components/ui/button.tsx`.

| SAC-Klasse | shadcn `variant` | Optik | Verwendung im Prototyp |
| --- | --- | --- | --- |
| `c-button` (primary) | `default` | eckig, `bg-sac-red`/weiss, 12px uppercase, `font-semibold`, Hover `sac-red-hover`, disabled `sac-red/50` | „Details anzeigen" |
| `c-button--positive-cta` | `positive` | wie `default`, aber `bg-sac-green`, Hover `sac-green-hover`, disabled `sac-green/50` | „Anmelden" |
| `c-button--secondary` | `outline` | eckig, transparent, Border/Text `sac-gray-dark`, Hover Fill `sac-black` (weisser Text), disabled Fill `sac-gray` | Sekundäraktionen, z. B. externer Link „sac-bern.ch" |
| `c-button--tertiary` | `tertiary` | eckig, `bg-sac-gray-light`, Border `sac-gray`, Text `sac-gray-dark`, Hover Border `sac-gray-dark` | dezente Sekundäraktionen |
| `c-button--pill` | `pill` | `rounded-full`, transparent, Border/Text `sac-gray-dark`, 15px **nicht** uppercase; aktiver Zustand (`is-active`) via `aria-pressed` → Border/Text `sac-red` | Filter-Chips (zukünftig) |
| `c-button--select` | `select` | eckig wie `default` (12px uppercase), transparent, Border `sac-gray`; aktiver Zustand via `aria-pressed` → Fill `sac-gray` | Auswahl-Buttons (zukünftig) |
| `c-button-text` | `ghost` | kein Rahmen/Hintergrund, Hover-Farbe `sac-red`, sonst `currentColor` | „Reset", „Zurücksetzen" in Filter-Popovers, „Details"-Link in Liste/Tabelle |
| `c-button-text--red` | `destructive` | wie `ghost`, aber Text immer `sac-red`, Hover `sac-red-hover` | Destruktive Aktion (z. B. Abmelden) |
| `is-loading` (Spinner) | shadcn `Button` + `Loader2`-Icon (lucide, `animate-spin`) | – | Ladezustand bei künftiger echter Datenanbindung |

Grössen (`size`): `default` = 50px Höhe / 32px horizontales Padding (`c-button`), `sm` = 32px Höhe / 12px Padding (`c-button--small`), `lg` = 60px Höhe / 40px Padding (`p-landing-page .c-button`), `icon` = 50×50px quadratisch, kein Padding (`c-button--icon-square`).

### 4.5 Date-Input (Mapping SAC `c-date-input` → `DateInputField`)

Quelle: [SAC-Styleguide – C004 Date Input](https://saccas-frontend.netlify.app/modules/c004_date_input/c004_date_input). Umgesetzt in `src/components/filters/DateInputField.tsx` (verwendet von `DateRangeFilter` für „Von"/„Bis").

**Struktur laut SAC-Template** (`c-date-input.c-input-group`):

- Container `cursor: pointer`.
- Verschachteltes Label (`c-date-input__label`) **innerhalb** der Input-Box: `position: relative; top: 7px; margin: 0 64px -18px 14px; pointer-events: none;` – liegt optisch über dem Eingabefeld, Klicks gehen durch.
- Folgt ein Label direkt vor dem Input, erhält dieses zusätzliches Padding (`padding-top: 18px; padding-left: 14px;`) und kleinere Schrift (12px), damit Label und Wert nicht überlappen.
- Rot einfärbter Kalender-Icon-Button (`c-input-group__button.c-button-text.c-button-text--red`) rechtsbündig, 16×16px Icon.
- Basis-Inputfeld folgt `c-input-text`: 50px Höhe, 1px Border `#e9e9e9` (`sac-gray`), Fokus-Border `#706f6f` (`sac-gray-dark`), Platzhalterfarbe `#bfbfbf`, `font-weight: 300`, 15px; disabled/readonly: Hintergrund `#f4f4f4` (`sac-gray-light`), Text `#999` (`sac-gray-medium`); Fehlerzustand (`has-error`): Border/Text `sac-red`; valide (`is-valid`): Border `sac-green`.

**Umsetzung im Prototyp:** Da kein JS-Datepicker (wie im Original) eingebunden ist, nutzt `DateInputField` weiterhin ein natives `<input type="date">` (verlässlicher, barrierefreier nativer Kalender-Picker in allen Browsern), übernimmt aber die visuelle Sprache 1:1: verschachteltes 12px-`font-semibold`-Label oben links im Feld, rotes Kalender-Icon rechts (`lucide-react` `Calendar`, `text-sac-red`), gleiche Farben/Höhe/Radien wie `c-input-text`. Das native `::-webkit-calendar-picker-indicator` wird transparent über die gesamte Icon-Fläche gelegt, damit ein Klick auf das (rein dekorative) rote Icon den nativen Picker öffnet.

## 5. Datenmodell & Typisierung

- `structure.json` dient als Quelle der Wahrheit für TypeScript-Typen (`src/types/tour.ts`) und das zod-Schema (`src/schemas/tour.schema.ts`).
- `mockdata.json` wird unverändert unter `src/data/mockdata.json` eingebunden und beim App-Start via zod validiert (`TourDataSchema.parse(mockdata)`), um Tippfehler/Inkonsistenzen früh zu erkennen.
- Zentrale Typen (Auszug):

```ts
export type TourStatus =
  | "geplant" | "fixiert" | "veroeffentlicht"
  | "anmeldung_offen" | "anmeldung_geschlossen"
  | "ausgebucht" | "abgesagt" | "durchgefuehrt" | "nicht_durchgefuehrt";

export type ExperienceLevel = "Einsteiger" | "Erfahren" | "Sehr erfahren";
export type PhysicalDifficulty = "A" | "B" | "C" | "D";

export interface Destination {
  name: string;
  elevation?: number;
  url?: string;
  type?: "summit" | "hut" | "traverse" | "marking_point" | "departure_arrival" | "climbing_area";
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
  leaders: { name: string; role?: string; profileUrl?: string }[];
  withMountainGuide?: boolean;
  participants?: { current?: number; max?: number; display?: string };
  status: TourStatus;
  flags?: string[];
  signature?: string;
  destination?: Destination;
  disciplineColor?: string; // Hex
}
```

### 5.1 Konditionelle Anforderungen (Kondition-Skala `physicalDifficulty`)

Offizielle SAC-Referenztabelle für die 5-stufige Konditionsskala (`A`–`E`, `PhysicalDifficulty`). Ein Tour-Wert kann auch einen Bereich abdecken (z. B. `"A-B"`), siehe `expandRange()` in `src/lib/format.ts`.

| Grad | Bezeichnung | Wert | Totalzeit / Aufstieg |
| --- | --- | --- | --- |
| A | nicht anstrengend | 1 | 0–3h Totalzeit |
| B | wenig anstrengend | 2 | 3–5h Totalzeit; bis ca. 800 HM Aufstieg |
| C | ziemlich anstrengend | 3 | 4–7h Totalzeit; ca. 800–1300 HM Aufstieg |
| D | anstrengend | 4 | 6–10h Totalzeit; ca. 1300–1600 HM Aufstieg |
| E | sehr anstrengend | 5 | über 10h Totalzeit; Aufstieg mehr als 1600 HM |

> Hinweis: In der Ursprungsquelle war die Zeitangabe für Grad C uneinheitlich angegeben (`4-7h` bzw. `5-7h` Totalzeit, je nach Spalte). Für die App wird einheitlich `4–7h` verwendet.

**Implementierung** (`src/lib/scales.ts`):

- `CONDITION_LABELS` – Kurzbezeichnung je Grad ("nicht anstrengend" … "sehr anstrengend").
- `CONDITION_DETAILS` – Totalzeit-/Aufstiegs-Detail je Grad (obige Tabelle).
- `CONDITION_OPTIONS` – für den `Kondition`-Filter (`value`, `label`, `tooltip` je Grad).
- `conditionTooltip(physicalDifficulty)` – Tooltip-Text für Liste/Tabelle/Detailansicht, inkl. Totalzeit/Aufstieg, z. B. `"Kondition: A – nicht anstrengend (0–3h Totalzeit)"`.

Diese Tooltips werden verwendet in: `FilterBar` (Kondition-Filter, je Option), `TourCard` (Liste), `TourDetailContent` (Detailseite). Die Tabellenansicht (`TourTableView`) zeigt keine Kondition-Spalte (bewusst entfernt).

### 5.2 Technische Schwierigkeitsskalen (`technicalDifficulty`)

Quelle: SAC-Styleguide – Schwierigkeitsskalen. Welche Skala gilt, richtet sich nach dem tourType-Subtyp (siehe `src/lib/disciplines.ts`); Mapping in `SCALE_BY_SUBTYPE` (`src/lib/scales.ts`).

#### SAC-Wanderskala (Subtypen: Bergwandern (T1–T3), Alpinwandern (T4–T6))

Bewertet die Schwierigkeit von Berg- und Wanderwegen von T1 (leicht) bis T6 (extrem schwierig). Berücksichtigt Geländeform, Markierung, Wegoberfläche, Exponiertheit sowie erforderliche Erfahrung und Ausrüstung; 2002 vom SAC eingeführt.

| Grad | Bezeichnung |
| --- | --- |
| T1 | Wandern |
| T2 | Bergwandern |
| T3 | anspruchsvolles Bergwandern |
| T4 | Alpinwandern |
| T5 | anspruchsvolles Alpinwandern |
| T6 | schwieriges Alpinwandern |

#### SAC-Berg- und Hochtourenskala (Subtypen: Gletschertouren, Hochtouren, Alpinklettern)

Bewertet die technische Schwierigkeit von Berg- und Hochtouren im hochalpinen Gelände (Fels, Firn, Eis) bei normalen, günstigen Verhältnissen.

| Grad | Bezeichnung | Grad | Bezeichnung |
| --- | --- | --- | --- |
| L | leicht | S | schwierig |
| WS- | wenig schwierig- | S+ | schwierig+ |
| WS | wenig schwierig | SS- | sehr schwierig- |
| WS+ | wenig schwierig+ | SS | sehr schwierig |
| ZS- | wenig schwierig- | SS+ | sehr schwierig+ |
| ZS | ziemlich schwierig | | |
| ZS+ | ziemlich schwierig+ | | |
| S- | schwierig- | | |

#### SAC-Skitourenskala (Subtypen: Freeride, Skitour, Skihochtour)

Bewertet ausschliesslich den skifahrerischen Teil einer Skitour bei guten Bedingungen; massgebend ist das höchste Hauptkriterium (Gesamtgrad = Spitzenwert). Werden zusätzlich Hilfskriterien einbezogen, wird der Grad um eine Drittelstufe angehoben (z. B. WS+ → ZS-). Alpintechnische Anforderungen (Kletterstellen, Fussaufstiege) werden separat mit der UIAA-Skala und Wortbeschrieb erfasst.

| Grad | Bezeichnung | Grad | Bezeichnung |
| --- | --- | --- | --- |
| L | leicht | S- | ziemlich schwierig- |
| WS- | wenig schwierig- | S | schwierig |
| WS | wenig schwierig | S+ | schwierig+ |
| WS+ | wenig schwierig+ | SS- | sehr schwierig- |
| ZS- | wenig schwierig- | SS | sehr schwierig |
| ZS | ziemlich schwierig | SS+ | sehr schwierig+ |
| ZS+ | ziemlich schwierig+ | | |

#### SAC-Schneeschuhtourenskala (Subtyp: Schneeschuhtouren)

Richtwerte bei guten Schnee-/Witterungs-/Sichtverhältnissen, unabhängig von der Tourenlänge. Erfordert sichere Orientierung (Karte, Kompass, Höhenmesser/GPS) und Routenwahl; ab WT2 wird LVS, Schaufel und Sonde empfohlen.

| Grad | Bezeichnung |
| --- | --- |
| WT1 | Leichte Schneeschuhwanderung |
| WT2 | Schneeschuhwanderung |
| WT3 | anspruchsvolle Schneeschuhwanderung |
| WT4 | Schneeschuhtour |
| WT5 | Alpine Schneeschuhtour |
| WT6 | anspruchsvolle alpine Schneeschuhtour |

#### Kletterskala – französische Skala (Subtypen: Sportklettern, Bouldern)

International gebräuchliche Skala zur Bewertung der klettertechnischen Schwierigkeit der Schlüsselstelle einer Route; Zahlen 3–8 kombiniert mit Buchstaben a–c und Plus-Abstufungen (z. B. 6a, 6b+). Grade nicht einzeln benannt (kontinuierliche Skala) – in der App als Liste `3a–3c, 4a–4c, …, 8a–8c` gepflegt (siehe `disciplines.ts`).

#### Eisklettern – Water Ice / WI-Skala (Subtyp: Eisklettern/Drytooling)

Bewertet die technische Schwierigkeit von Wasserfalleis-Routen anhand Steilheit, Länge steiler Passagen und Absicherungsmöglichkeiten. Grade `WI1`–`WI7`, ohne weitere Bezeichnung je Grad.

#### SAC-Klettersteigskala / Hüsler-Skala (Subtyp: Klettersteig)

In der Schweiz gebräuchliche Skala für Klettersteige (benannt nach Eugen E. Hüsler, „Wandern vertikal“).

| Grad | Bezeichnung |
| --- | --- |
| K1 | leicht |
| K2 | mittel |
| K3 | ziemlich schwierig |
| K4 | schwierig |
| K5 | sehr schwierig |
| K6 | extrem schwierig |

#### Singletrail-Skala / STS (Subtyp: Mountainbike)

Vom SAC verwendete Skala zur Bewertung von MTB-Singletrails unter idealen Bedingungen (trocken, gutes Licht); bewertet Untergrund, Hindernisse, Steilheit, Kurvenform und Fahrtechnik – nicht Geschwindigkeit, Wetter oder Absturzgefahr.

| Grad | Bezeichnung |
| --- | --- |
| S0 | leicht |
| S1 | leicht |
| S2 | mittel |
| S3 | schwer |
| S4 | schwer |
| S5 | schwer |

**Implementierung** (`src/lib/scales.ts`):

- `DifficultyScale` – Typ mit `name`, `description` und `grades` (Grad → Bezeichnung; leer bei kontinuierlichen Skalen wie der franz. Kletterskala).
- `SCALE_BY_SUBTYPE` – Mapping tourType-Subtyp → `DifficultyScale`.
- `scaleForSubType(label)` / `scaleNameForSubType(label)` – Skala bzw. Skalenname zu einem Subtyp.
- `technicalDifficultyTooltip(tourType, technicalDifficulty?)` – Tooltip-Text; zeigt bei bekanntem Grad dessen Bezeichnung (z. B. `"T3 – anspruchsvolles Bergwandern (SAC-Wanderskala)"`), sonst Skalenname + Kurzbeschreibung. Grad-Bereiche wie `"T3 - T4"` werden an `" - "` (mit Leerzeichen) gesplittet, um Codes wie `"WS-"` nicht zu zerstören.

Verwendet in: `FilterBar` → `TourTypeFilter` (Schwierigkeits-Chips je Grad), `TourCard` (Liste), `TourTableView` (Tabelle), `TourDetailContent` (Detailseite).

## 6. Filterlogik (`src/lib/filter.ts`)

Reine, ungebundene Funktionen (kein React-Code) – gut testbar mit Vitest. Ein Filterzustand-Objekt (`TourFilterState`) wird gegen jede Tour geprüft:

```ts
export interface TourFilterState {
  dateFrom?: string;
  dateTo?: string;
  fullTextSearch?: string;
  groups: string[];               // ODER
  tourTypes: string[];            // ODER
  technicalDifficultiesByType: Record<string, string[]>; // Disziplin → gewählte Grade
  experienceLevels: ExperienceLevel[]; // ODER
  physicalDifficulties: PhysicalDifficulty[]; // ODER ("Kondition")
  leader?: string;
  registrationStatuses: ("anmeldung_offen" | "anmeldung_geschlossen" | "veroeffentlicht")[]; // ODER
}
```

Regeln (siehe `umsetzungsplan.md`, Abschnitt „Filterlogik"):

1. **UND-Verknüpfung** zwischen den einzelnen Filterkategorien.
2. **ODER-Verknüpfung** innerhalb eines Multi-Select-Filters.
3. **Tourentyp × Schwierigkeit**: kaskadierender Abgleich – Tour matcht, wenn mindestens ein `tourType` gewählt ist UND (falls für diese Disziplin Grade gewählt wurden) `technicalDifficulty` in der Auswahl liegt.
4. **Datum**: Overlap-Prüfung (`startDate <= dateTo && (endDate ?? startDate) >= dateFrom`).
5. **Anmeldestatus-Mapping**: `anmeldung_geschlossen` (UI) matcht die Tour-Status `anmeldung_geschlossen` **und** `ausgebucht`.
6. **Freitextsuche**: case-insensitiver Substring-Match über `title`, `destination.name`, `tourType`, `leaders[].name`.
7. Kein Sortier-Handling (gemäss Anforderung V0.3) – Standardreihenfolge = Reihenfolge in `mockdata.json` (Datum aufsteigend, da so vorbereitet).

Unit-Tests decken jede Regel isoliert ab (`filter.test.ts`).

## 7. Komponentenanforderungen

### 7.1 `FilterBar`
- Sticky-Header-Bereich (bleibt beim Scrollen sichtbar, `position: sticky; top: 0`), analog modernen Suchportalen.
- Horizontal auf Desktop (≥ 1024px), auf Mobile: Filter in einem `Sheet` (shadcn) via „Filter"-Button (Badge mit Anzahl aktiver Filter) – da 7 horizontale Dropdowns auf Mobile nicht praktikabel sind.
- Jeder Filter ist ein `Popover` mit `Command`/`Checkbox`-Liste (shadcn), Footer mit „Zurücksetzen" (nur dieser Filter) und „Anwenden" (schliesst Popover) – konsistent mit `umsetzungsplan.md`.
- Aktive Filter zusätzlich als entfernbare `Badge`-Chips unterhalb der Filterleiste sichtbar (`ActiveFilterChips`) – Best Practice für Facetten-Suchen, im Ursprungsprototyp nicht vorhanden, aber empfohlen für Benutzerfreundlichkeit.

### 7.2 `TourTypeFilter` (kaskadierend)
- `Command`-Liste mit Checkbox pro Disziplin + farbigem Punkt (`disciplineColor`).
- Bei aktivierter Disziplin klappt eine zweite Chip-Gruppe mit den zugehörigen Schwierigkeitsgraden auf (`ToggleGroup` aus shadcn, `type="multiple"`).
- Zuordnung Disziplin → Schwierigkeitsskala als statische Lookup-Tabelle in `src/lib/difficulty-scales.ts`.

### 7.3 `TourCard`
- Linker Farbbalken (`border-l-4`, Farbe = `tour.disciplineColor`).
- Kopfzeile: Titel (`sac-h4`/`text-lg font-bold`), rechts `TourStatusBadge`.
- Meta-Zeile mit Icons (Kalender, Uhr, Zielsymbol, Personen): Datum + `weekdaySpan`, `durationDays`, `destination.name` (+ `elevation`, verlinkt falls `destination.url`), `participants.display`.
- Chip-Zeile: Disziplin(en), `technicalDifficulty`, `groups`, `• leaders[].name`.
- Rechter Bereich: `TourStatusBadge` + Kontextinfo (`registrationDeadline` oder `registrationOpensAt`) + CTAs (`Details anzeigen` primary, `Anmelden` nur wenn `status === "anmeldung_offen"`).
- Karten sind vollständig **tastaturbedienbar** (Titel/„Details anzeigen" per `Tab`/`Enter` erreichbar) und nutzen semantisches HTML (`<article>`, `<h3>` für Titel).

### 7.4 `TourStatusBadge`
- Farblogik gemäss Prototyp V0.2 (grün/orange/grau), aber Text und Farbe zentral aus einer Mapping-Funktion (`statusToLabel`, `statusToVariant`), damit `ausgebucht` und `anmeldung_geschlossen` visuell gleich behandelt werden können (siehe offene Frage in `umsetzungsplan.md`, hier: **zusammengefasst** als „Anmeldung geschlossen").

### 7.5 `ResultsSummary`
- Zeigt „N Touren gefunden" (aus gefilterter Liste, nicht Gesamtzahl).
- Keine Sortiersteuerung (gemäss Anforderung).

### 7.6 `EmptyState`
- Bei 0 Treffern: freundlicher Hinweistext + Button „Filter zurücksetzen" (wichtig für UX, im Ursprungsprototyp nicht sichtbar/dokumentiert, aber Standard-Anforderung an moderne Suchoberflächen).

## 8. UX- / Barrierefreiheits-Anforderungen

- **WCAG 2.1 AA** als Zielniveau:
  - Farbkontraste prüfen, insbesondere Status-Badges (grün/orange auf hellem Grund) und `disciplineColor`-Balken (nur dekorativ, keine reine Farb-Codierung von Information – Text-Chip ergänzt die Farbe immer).
  - Alle interaktiven Elemente per Tastatur erreichbar (shadcn/Radix bringt dies für Popover/Checkbox/Select bereits mit).
  - `aria-label`/`aria-expanded` für Filter-Popover-Trigger, `aria-live="polite"`-Region für den Ergebniszähler (Screenreader-Ansage bei Filteränderung).
- **Responsive Breakpoints** (Tailwind-Standard): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
  - Mobile: Filter im `Sheet`, Cards volle Breite, CTAs untereinander.
  - Tablet: Filter ggf. zweizeilig, Cards volle Breite.
  - Desktop: Filter einzeilig (mit Umbruch bei Bedarf), Cards mit Meta-Infos nebeneinander.
- **Ladezustände**: Skeleton-Komponenten (shadcn `Skeleton`) für Card-Platzhalter, auch wenn Mockdaten synchron geladen werden – bereitet die Struktur auf eine spätere echte API vor.
- **Leere/Fehlerzustände**: siehe `EmptyState`; zusätzlich ein generischer Fehlerzustand für spätere API-Anbindung einplanen (aktuell nicht relevant, da nur Mockdaten).
- **Internationalisierung**: Alle sichtbaren Strings über eine zentrale `i18n/de.json`-Datei referenzieren (auch wenn vorerst nur Deutsch benötigt wird), um spätere Mehrsprachigkeit (FR/IT/EN, siehe `styleguide.md`) nicht zu verbauen.

## 9. Nicht-funktionale Anforderungen

- **Performance**: Da nur ~25–100 Mock-Touren erwartet werden, ist keine Virtualisierung der Liste nötig; Struktur aber so wählen (`TourList` iteriert über gefilterte Ergebnisse), dass `react-window`/`@tanstack/react-virtual` bei Bedarf später ergänzt werden kann.
- **Bundle-Grösse**: Nur benötigte shadcn/ui-Komponenten generieren (`npx shadcn add button popover checkbox badge command sheet skeleton toggle-group select`), kein ungenutzter Code.
- **Kein echtes Backend**: Datenzugriff ausschliesslich über den lokalen Import von `mockdata.json`; Architektur (`useFilteredTours`-Hook) so kapseln, dass ein Austausch gegen einen echten API-Call (`fetch`/`react-query`) später ohne Komponentenänderung möglich ist.
- **Deployment**: statischer Build (`vite build`) – z. B. Netlify/Vercel, analog zu den bestehenden Referenz-Prototypen in `links.md`.

## 10. Abgrenzung / Out of Scope

- Keine Sortierfunktion (siehe `umsetzungsplan.md`).
- Keine echte Anmeldung/Checkout-Funktionalität – „Anmelden"-Button ist rein visuell/Platzhalter (z. B. `alert()`/Toast „Prototyp – keine echte Anmeldung").
- Keine Authentifizierung/Login.
- Keine Persistenz ausser URL-Query-Parameter für Filter (kein Backend, kein LocalStorage-Zwang, aber empfehlenswert als Nice-to-have).
- Keine Mehrsprachigkeit in der ersten Ausbaustufe (nur Struktur vorbereiten, siehe Abschnitt 8).

## 11. Setup-Schritte (Kurzfassung)

1. `npm create vite@latest tourenportal-prototyp -- --template react-ts`
2. Tailwind installieren & konfigurieren (`tailwindcss`, `postcss`, `autoprefixer`), SAC-Farben/Typografie gemäss Abschnitt 4 in `tailwind.config.ts` ergänzen.
3. shadcn/ui initialisieren (`npx shadcn init`), benötigte Komponenten generieren.
4. `mockdata.json` und `structure.json`-abgeleitete Typen/Schemas einbinden (Abschnitt 5).
5. Filterlogik (`lib/filter.ts`) inkl. Unit-Tests implementieren (Abschnitt 6).
6. Komponenten gemäss Abschnitt 7 bauen, beginnend mit `TourCard` (kleinster, gut testbarer Baustein), dann `FilterBar`.
7. Barrierefreiheits- und Responsive-Check (Abschnitt 8) vor Abschluss durchführen (z. B. Lighthouse, axe-core).

## 12. Referenzdokumente

- `Tourenportal/structure.json` – Datenschema
- `Tourenportal/mockdata.json` – Testdaten (SAC Bern)
- `Tourenportal/prototyp.md` – UI-Referenz V0.2 (Figma)
- `Tourenportal/umsetzungsplan.md` – Filterspezifikation V0.3
- `Tourenportal/styleguide.md` – Offizielle SAC-Design-Tokens (Farben, Typografie, Buttons, Icons)
