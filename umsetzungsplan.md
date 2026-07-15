# Umsetzungsplan – Prototyp V0.3

Basis: Figma-Make-Prototyp „SAC TVS Public V0.2 – horizontale Filter" (siehe `prototyp.md`).

## Ziel

Neue Version des Prototyps mit **erweitertem Filterset** (inkl. Kondition und Anmeldestatus) und **ohne Sortiersteuerung**. Layout, Card-Design und visuelle Sprache bleiben unverändert.

## Änderungen gegenüber V0.2

### Filterleiste (horizontal, zwei Zeilen wie bisher)

1. **Zeitraum** – `Von` / `Bis` (unverändert)
2. **Freitextsuche** – unverändert
3. **Tourengruppe** – Multi-Select (unverändert)
4. **Tourentyp** – Multi-Select mit farbcodierten Disziplinen **inkl. Schwierigkeitsauswahl** pro Disziplin (kaskadierend)
5. **Anforderung** – Multi-Select: `Einsteiger` · `Erfahren` · `Sehr erfahren` (bisher „Erfahrung", umbenannt)
6. **Kondition** – *neu*, Multi-Select: `A – wenig anstrengend` · `B – ziemlich anstrengend` · `C – anstrengend` · `D – sehr anstrengend`
7. **Tourenleiter** – Single-Select (unverändert)
8. **Anmeldestatus** – *neu, ersetzt Checkbox „Anmeldung offen"*: Multi-Select mit `Anmeldung offen` · `Anmeldung geschlossen` · `Veröffentlicht`
9. **Reset** – unverändert

### Ergebnisleiste

- Ergebniszähler „N Touren gefunden" bleibt.
- **Sortiersteuerung (Datum / Titel / Tourenleiter) wird entfernt.** Standardsortierung: Datum aufsteigend, ohne UI-Umschalter.

### Tourenkarte

Keine Änderungen. Card-Layout, Farbbalken, Chips, Badges und CTAs bleiben identisch zu V0.2.

## Detailspezifikation der neuen/geänderten Filter

### Tourentyp inkl. Schwierigkeit (kaskadierend)

Popover in zwei Ebenen:

- **Ebene 1**: Liste der Disziplinen wie V0.2, Checkbox + farbiges Icon.
- **Ebene 2 (dynamisch)**: Pro angehakter Disziplin erscheint darunter eine Chipreihe mit den zugehörigen Schwierigkeitsgraden (mehrfach wählbar). Beispiele:
  - Berg-/Alpinwandern → `T1 … T6`
  - Hochtouren → `L, WS-, WS, WS+, ZS-, ZS, ZS+, S-, S, S+, SS, AS, EX`
  - Klettersteige → `K1 … K6`
  - Sport-/MSL-Klettern, Bouldern → `3a … 7a+`
  - Ski-/Splitboardtouren → `L, WS, ZS, S, SS, AS`
  - Schneeschuhtouren → `WT1 … WT6`
  - Eisklettern → `WI1 … WI6`
  - Mountainbike → `S0 … S5`
- Popover-Footer: `Zurücksetzen` (nur dieser Filter) und `Anwenden`.
- Filterknopf zeigt Auswahlzahl, z. B. `Tourentyp (3)`.

### Kondition (neu)

- Werte gemäss SAC-Skala `A|B|C|D` mit Kurzbeschreibung im Popover.
- Multi-Select per Checkbox.
- Datenfeld: `physicalDifficulty` (bereits im Schema).
- Optional (nicht V0.3): zusätzlicher Kondition-Chip auf der Karte.

### Anmeldestatus (neu)

- Optionen und Mapping auf `status`:
  - `Anmeldung offen` → `anmeldung_offen`
  - `Anmeldung geschlossen` → `anmeldung_geschlossen` **und** `ausgebucht`
  - `Veröffentlicht` → `veroeffentlicht`
- Multi-Select. Optionen mit Statusfarben (grün/orange/grau), konsistent zu den Karten-Badges.
- Ersetzt die bisherige Checkbox „Anmeldung offen".

## Auswirkungen auf das Datenmodell

Keine strukturellen Änderungen nötig – alle Felder sind in `structure.json` vorhanden:

- `physicalDifficulty` → Kondition
- `experienceLevel` → Anforderung
- `technicalDifficulty` → Schwierigkeit
- `tourType` → Disziplin
- `status` → Anmeldestatus

Zu prüfen: Normalisierung von `physicalDifficulty`. Mockdaten enthalten teils Bereiche (`A-B`, `B-C`). Empfohlen für saubere Filterlogik:

```json
"physicalDifficulty": { "min": "A", "max": "B" }
```

Vorerst reicht String-Zerlegung (`split("-")`).

## Filterlogik

- **Kombination**: Filter untereinander per **UND**; innerhalb eines Multi-Selects per **ODER**.
- **Tourentyp × Schwierigkeit**: Tour matcht, wenn eine ihrer `tourType`-Werte gewählt ist **und** – sofern für diese Disziplin Grade selektiert sind – `technicalDifficulty` in der Auswahl liegt.
- **Zeitraum**: Overlap-Prüfung `startDate ≤ Bis` und `endDate ≥ Von`.
- **Freitextsuche**: case-insensitiver Substring in `title`, `destination.name`, `tourType`, `leaders[].name`.
- **Reset**: alle Filter zurücksetzen; `Von` behält Default (heute).

## Arbeitsschritte

1. **Figma-Prototyp duplizieren** (V0.2 → V0.3).
2. **Filterleiste anpassen**:
   - Checkbox „Anmeldung offen" entfernen.
   - Filter „Erfahrung" → „Anforderung" umbenennen.
   - Neue Filter-Buttons „Kondition" (zwischen Anforderung und Tourenleiter) und „Anmeldestatus" (nach Tourenleiter) einfügen.
   - Popover „Tourentyp" um Schwierigkeits-Chip-Sektion pro Disziplin erweitern.
3. **Ergebnisleiste**: Sortierbuttons entfernen. Ergebniszähler bleibt.
4. **Prototyp-States** anlegen:
   - Standard (leer).
   - Popover „Tourentyp" mit einer angehakten Disziplin + sichtbaren Schwierigkeitschips.
   - Popover „Kondition" offen.
   - Popover „Anmeldestatus" offen.
   - Ergebnisliste mit kombiniertem Filter (z. B. Hochtour + WS/WS+, Kondition B, Status offen).
5. **Datenmodell dokumentieren**: `structure.json` um `filters.condition` und `filters.registrationStatus` als Multi-Select ergänzen; `sorting` als leeres Array/entfernt markieren.
6. **Mockdaten**: `filters`-Block anpassen (kein `sorting`).
7. **Screenshots** in `images/prototyp-v0.3/` ablegen und `prototyp.md` um „V0.3" ergänzen.
8. **Review** mit den Stakeholdern der Sektion.

## Offene Fragen

- `Kondition` als Multi- oder Single-Select? Empfehlung: **Multi**.
- `Anmeldung geschlossen` und `ausgebucht` im UI zusammenfassen? Empfehlung: **ja**, ein Status-Chip.
- Kondition-Chip zusätzlich auf der Karte? Empfehlung: **später** (nicht V0.3).
- Schnell-Toggle „Anmeldung offen" als Ergänzung zum Multi-Select behalten? Empfehlung: **streichen**.
