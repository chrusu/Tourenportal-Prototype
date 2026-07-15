# Prototyp-Analyse: SAC TVS Public V0.2 – „horizontale Filter"

Grundlage: Figma-Make-Prototyp der SAC Sektion Blüemlisalp, Screenshots unter `images/prototyp/`.

## Gesamteindruck

Modernes, aufgeräumtes Webinterface für ein sektionsbezogenes Tourenprogramm. Im Vergleich zu den bestehenden Portalen (Biel = Tabellenlayout, Bern = climbIT-Karten) wirkt der Prototyp deutlich zeitgemässer:

- **Card-basiertes Listenlayout** statt Tabelle.
- **Horizontale Filterleiste** oben (Name des Prototyps) statt einer langen vertikalen Filterspalte.
- **Farbliche Kennzeichnung** der Touren über einen linken Rand-Balken pro Card (Disziplin-Farbe).
- Klare **Statusbadges** (Anmeldung offen / geschlossen / Veröffentlicht) und deutliche Primary-CTAs (dunkler „Details anzeigen"-Button, sekundärer „Anmelden"-Button).

## Header

- Logo (Bergsymbol) + Titel „Tourenprogramm" + Untertitel „SAC Sektion Blüemlisalp".
- Sehr reduziert; keine sichtbare Hauptnavigation im gezeigten Ausschnitt (Fokus liegt auf der Suche).

## Filterbereich (horizontal)

Zwei Zeilen in einer eingerahmten „Filter-Card":

**Zeile 1 – Zeit & Freitextsuche**
- `Von` (Datepicker, im Screenshot vorbelegt mit 15.07.2026)
- `Bis` (Datepicker, leer/„TT.MM.JJJJ")
- Checkbox `Anmeldung offen` (Toggle-Filter für offene Anmeldungen)
- Freitextsuche rechts: „Nach Tourentitel, Beschreibung, Typ, etc. suchen"

**Zeile 2 – Facetten-Dropdowns + Reset**
- `Tourengruppe` (Multi-Select: Aktive, Senior/innen, Jugend)
- `Tourentyp` – erscheint als „Tourentyp & Schwierigkeit" im geöffneten Zustand. Multi-Select mit farbigen Icons pro Disziplin:
  - Berg- und Alpinwandern (grün)
  - Hochtouren (violett)
  - Klettersteige (orange)
  - Eisklettern (türkis)
  - Sportklettern (rot)
  - Bouldern (dunkelrot)
  - Ski- und Splitboardtouren (blau)
  - Schneeschuhtouren (mint)
  - Mountainbike (gelb)
- `Erfahrung` (Single/Multi-Select: Einsteiger, Erfahren, Sehr erfahren) – ersetzt die bisher üblichen konditionellen A/B/C/D-Skalen durch eine nutzerfreundlichere Selbsteinschätzung.
- `Tourenleiter` (Auswahlliste mit „Alle Tourenleiter" + alphabetische Namensliste)
- `Reset` rechts (Rücksetzen aller Filter, Icon + Label)

Dropdowns öffnen sich als leichte Overlays direkt unter dem jeweiligen Button. Jedes Dropdown zeigt einen kleinen Sektionstitel (z. B. „Tourengruppe", „Erfahrung", „Tourentyp & Schwierigkeit").

## Ergebnisleiste

- Links: Ergebniszähler „**24 Touren gefunden**".
- Rechts: Sortierschalter mit drei Optionen:
  - `Datum` (im Screenshot aktiv, dunkler Pill-Button mit Chevron)
  - `Titel`
  - `Tourenleiter`

## Tourenkarte (Listen-Item)

Jede Tour ist eine Karte in einem hellen Container mit abgerundeten Ecken und farbigem linken Balken (Disziplin-Farbcode konsistent mit dem Tourentyp-Filter).

Inhalt der Karte:

- **Titel** (fett, gross), z. B. „Alpinwanderung Piz Badile".
- **Meta-Zeile** (Icons + Text): Datum, Dauer („2 Tage"), Ziel/Berg mit externem Link-Icon („Piz Badile 3308 m ↗"), Teilnehmer „6/6".
- **Tag-Zeile**: Chips mit Disziplin (z. B. „Berg- und Alpinwandern"), Schwierigkeit (z. B. „T5"), Zielgruppe („Aktive"), gefolgt von „• Tourenleitername".
- **Rechte Spalte**:
  - Statusbadge (farbcodiert):
    - „Anmeldung geschlossen" (orange, weich)
    - „Anmeldung offen" (grün, weich)
    - „Veröffentlicht" (neutral/grau)
  - Kontextinfo unter dem Badge:
    - Bei geöffneten Anmeldungen: `Anmeldeschluss: 13.08.2026`
    - Bei noch nicht offenen: `Anmeldung ab: 01.06.2026, 10:00`
  - Primary-CTA „Details anzeigen" (dunkler Button)
  - Sekundär-CTA „Anmelden" (Outline-Button, nur wenn Status = offen)

Beispiel-Touren aus den Screenshots:
- Alpinwanderung Piz Badile – 18.07.2026, T5, 6/6, Anmeldung geschlossen
- Hochtour Piz Bernina Biancograt – 25.07.2026, S+, 4/4, Anmeldung geschlossen
- Gletschertrekking Aletsch – 08.08.2026, T4, 0/10, Veröffentlicht (Anmeldung ab 01.06.2026, 10:00)
- Klettersteig Dolomiten Klassiker – 15.08.2026, K4, 5/6, Anmeldung offen
- Hochtour Mönch-Besteigung – 22.08.2026, ZS+, 4/6, Anmeldung offen

## Design-System / Visuelle Sprache

- **Typografie**: Sans-Serif (vermutlich System- oder Inter-artig), klare Hierarchie: Titel bold, Meta-Text in Mittelgrau.
- **Farbcodes für Disziplinen** (als linker Card-Streifen und Filter-Icons):
  - Grün = Wandern / Alpinwandern
  - Violett = Hochtour
  - Orange = Klettersteig
  - Türkis = Eisklettern
  - Rot = Sportklettern, Bouldern (leicht unterschiedlich)
  - Blau = Ski/Splitboard
  - Mint = Schneeschuh
  - Gelb = Mountainbike
- **Status-Farben**:
  - Grün = Anmeldung offen
  - Orange = Anmeldung geschlossen / Warnung
  - Grau = Veröffentlicht / neutral
- **Formen**: durchgängig `rounded-lg` bis `rounded-xl`, weiche Schatten, viel Weissraum.
- **Icons**: Line-Icons (Kalender, Uhr, Berg, Personen, Trendpfeil, Reset-Kreis) – konsistente Stroke-Dicke.

## Wesentliche Unterschiede zu Biel / Bern

| Aspekt | Biel (Tabelle) | Bern (climbIT) | Prototyp V0.2 |
| --- | --- | --- | --- |
| Layout | dichte Tabelle | Karten-Liste, viel Text | Karten-Liste, luftig, visuell |
| Filter | vertikale Dropdown-Reihe | vertikale Suchmaske | **horizontale Filterleiste** mit Popovers |
| Schwierigkeit | separater Filter | separater Filter | in Tourentyp integriert („Tourentyp & Schwierigkeit") |
| Erfahrungslevel | Kondition A–D | Anfänger/Fortgeschritten/Könner | **Einsteiger / Erfahren / Sehr erfahren** (nutzerzentriert) |
| Statusanzeige | Textsuffix („/ausgebucht") | Textbadge | **Farbige Pills** (grün/orange/grau) |
| Disziplin-Kennung | Kürzel (HT, BW) | Signatur-String | **Farbbalken + Chip** |
| CTA Anmeldung | via Login/Detail | via Login/Detail | **direkter „Anmelden"-Button** in Liste |
| Anmeldeschluss | nicht sichtbar | im Detail | **prominent in Karte** |

## Bezug zum Datenmodell (`structure.json`)

Der Prototyp lässt sich vollständig aus dem bestehenden Schema befüllen. Mapping:

- Titel → `title`
- Datum + Dauer → `startDate`, `durationDays`
- Berg/Ziel → *neu*: `destination` (Name + optional Höhe + Link/URL) – aktuell nicht im Schema.
- Teilnehmer „6/6" → `participants.current` / `participants.max`
- Chips: Disziplin → `tourType`, Schwierigkeit → `technicalDifficulty`, Zielgruppe → `groups`
- „• Thomas Bauer" → `leaders[].name`
- Status-Pill → `status` (mapping: `Anmeldung offen` → `anmeldung_offen`, `Anmeldung geschlossen` → `anmeldung_geschlossen`, `Veröffentlicht` → `veroeffentlicht`)
- „Anmeldeschluss" → `registrationDeadline`
- „Anmeldung ab" → *neu*: `registrationOpensAt` (Datum + Uhrzeit) – aktuell nicht im Schema.
- Erfahrung → *neu*: `experienceLevel` (`Einsteiger` | `Erfahren` | `Sehr erfahren`) – ersetzt/ergänzt `physicalDifficulty`/`requirementLevel`.

## Empfohlene Ergänzungen am Datenmodell

1. `destination`: `{ name, elevation, url }` – für die prominente Ziel-Anzeige inkl. externem Link.
2. `registrationOpensAt`: ISO-DateTime – für den Zustand „Anmeldung ab: 01.06.2026, 10:00".
3. `experienceLevel`: enum `["Einsteiger", "Erfahren", "Sehr erfahren"]`.
4. `disciplineColor`: optional, ableitbar aus `tourType` (Mapping-Tabelle), aber ggf. explizit für Themen-Konsistenz.
5. Zusätzliches Status-Enum-Mapping (siehe oben) – Prototyp verwendet drei sichtbare Zustände.

## Screenshots-Referenz

- `SCR-20260715-klfs.png` – Standardansicht mit Filterleiste, Ergebnisliste und 5 Karten.
- `SCR-20260715-klhh.png` – Dropdown `Tourengruppe` geöffnet (Aktive / Senior:innen / Jugend).
- `SCR-20260715-kliu.png` – Dropdown `Tourentyp & Schwierigkeit` geöffnet mit farbcodierten Disziplinen.
- `SCR-20260715-klkj.png` – Dropdown `Erfahrung` geöffnet (Einsteiger / Erfahren / Sehr erfahren).
- `SCR-20260715-kllw.png` – Dropdown `Tourenleiter` geöffnet mit Personenliste.
