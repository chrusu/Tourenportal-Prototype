# SAC Tourenportal – Funktionsbeschreibung

Diese Beschreibung basiert auf den drei in `links.md` referenzierten Frontends für das Tourenportal des Schweizer Alpen-Clubs (SAC):

1. **SAC CAS Frontend-Prototyp** – <https://saccas-frontend.netlify.app/>
   Offizieller Design-/Komponenten-Prototyp des SAC Zentralverbands. Zeigt Referenz-Pages und wiederverwendbare Module.
2. **SAC Sektion Biel** – <https://www.sac-biel.ch/touren/>
   Produktives Tourenprogramm der Sektion Biel (klassische Tabellenansicht mit Filtern).
3. **SAC Sektion Bern** – <https://touren.sac-bern.ch/>
   Produktive Tourensuche der Sektion Bern (climbIT „Tourenangebot", derzeit v2.12.5).

Ziel der Portale ist es, den Mitgliedern und Interessenten einer Sektion die geplanten Touren, Kurse und Anlässe übersichtlich zugänglich zu machen und die Anmeldung zu ermöglichen.

---

## 1. SAC CAS Frontend-Prototyp (saccas-frontend.netlify.app)

Der Prototyp ist kein produktives Portal, sondern ein **Design-System / Styleguide** mit Referenzseiten. Er dokumentiert, wie ein einheitliches Tourenportal für alle SAC-Sektionen aussehen könnte.

### Relevante Seiten (Auswahl)
- **02 Overview** – Tourenliste / Suchresultate mit Filter- und Kartenansicht.
- **03 Detail** – Detailansicht einer Tour.
- **07 Destination Overview**, **10 Summit**, **11 Hut**, **12 Climbing Area** – Ziel-basierte Einstiege (Gipfel, Hütten, Klettergebiete).
- **13 Route Hiking**, **14 Route Climbing Sector**, **15 Route Paywall** – Routen-Detailseiten (teilweise Paywall für Nicht-Mitglieder).
- **31 Course Schedule**, **32 Course Detail**, **34–37 Course Checkout** – Kursangebot inkl. Buchungs-/Checkout-Prozess (Daten, Subvention, Versicherung, Zusammenfassung).
- **41 Route Editor** – Editor für Tourenleitende/Redaktion.
- **51 Search / 52 Search Results / 53 Search Results Detail** – Volltext- und Facetten-Suche.
- **54 Section Overview** – Sektions-Landingpage.
- **60–65 Shop Checkout** – Integrierter Shop.
- **70–73 Ad / Anzeigen** – Kleinanzeigen (z. B. Mitfahr-/Partnersuche).

### Relevante Module
- `M011 Search Form`, `M021 Pills`, `M036 Destination Filter` – Filter- und Suchbausteine.
- `M020 Teaser List`, `M035 Destination List`, `M049 Data Table` – Listen-/Tabellendarstellung von Touren und Zielen.
- `M030 Map`, `M031 Route Selector`, `M032 Route Info`, `M033 Route Accordion`, `M080 Route Signature Legend` – Kartendarstellung und Routendetails.
- `C017 Route Signature`, `C023 Tag`, `C027 Discipline Circle` – Symbolik für Disziplinen, Schwierigkeit, Tags.
- `M052 Course List`, `M050/M053 Course Info/Detail`, `M062 Course Selection` – Kursdarstellung.
- `M034 Status Alert`, `M071 Status Alert List` – Statusmeldungen (z. B. „ausgebucht", „abgesagt").

---

## 2. SAC Sektion Biel (sac-biel.ch/touren/)

Klassische, kompakte Tabellenansicht („Tourenprogramm gesamt Sektion"). Der Fokus liegt auf einer schnellen chronologischen Übersicht.

### Funktionalität
- **Filter** (als Dropdowns oben):
  - Jahr (z. B. 2018–2027)
  - Tourtyp (Ausbildung, Bergwandern, Diverses, Hochtour, Hütten, Klettern, Klettern Alpin, Klettersteig, Skihochtour, Skitour, Versammlung, Wandern) – mit Anzahl in Klammern.
  - Gruppe (Biel-Aktive, Bueren-Aktive, Biel-Jorat, JO-Biel, Biel-Senioren)
  - Techn. Anforderungen (T1–T6, WS/ZS/S/SS, K1–K5, WT1–WT4, KS I/II, Kletter-UIAA/Franz. Skala 3a–6a etc.)
  - Kond. Anforderungen (A–D)
  - Zusatz-Flags: Geführt, Kristall, ÖV, Sünneli
- **Tourenliste** (Tabelle, gruppiert nach Monat):
  - Datum (Wochentag + Datum)
  - Tourtyp-Kürzel (HT, BW, K, KA, KS, W, S, SHT, A, D, V, H)
  - Techn. Schwierigkeit
  - Dauer (in Tagen)
  - Gruppe(n) – mehrere durch `|` getrennt
  - Teilnehmer (aktuell/maximal, z. B. `5/8`) inkl. Statusnotizen wie „/ausgebucht", „/abgesagt"
  - Titel der Tour
  - Tourenleiter*innen (auch mehrere)
- **Zusatzfunktionen**: ICS-Kalender-Abo, RSS-Feed, Druck-Ansicht, Berichte, Login.
- **Paginierung**: 1–50 von N.

---

## 3. SAC Sektion Bern (touren.sac-bern.ch)

Modernere Ansicht auf Basis der Software **climbIT „Tourenangebot"**. Enthält Tourensuche, Kalender, Termine und Berichte.

### Filter / Suche
- Umschalter „Nur aktuelle Touren / Alle Touren"
- Datum von–bis
- TourenleiterIn (Auswahlliste mit allen aktiven Leiter*innen)
- Tourengruppe: JO, FaBe, Aktive, Aktive (Senior:innen), TL/J+S-L/Aspi, Veteranen Gängige, Veteranen Bären, Veteranen
- Tourentyp: Skitour, Ski-Hochtour, Snowboard-Tour, Klettern (Halle / Klettergarten / Mehrseillängen / Alpin), Bouldern, Eisklettern, Klettersteig, Hochtour, Mountain-Bike, Wandern (T1-2), Bergwandern (T3), Alpinwandern (T4-T6), Schneeschuh Tour/Wanderung, Schneeschuh-Hochtour, Kurs, Anlass, Sonstiges, Umwelttour
- Schwierigkeit: sehr feingranular – Alpin (L, WS±, ZS±, S±, SS±), Wandern (T1–T6), Schneeschuh (WT1–WT6), Klettersteig (K1–K6), Klettern (Sportklettergrade 2a–7a und UIAA III–V), Eis (Wi1–Wi5), Ski (S0–S5), MTB (1–4)
- Anforderung (kond.): Anfänger, Fortgeschritten, Könner
- Tourenstatus: Fixiert, Veröffentlicht, Abgesagt, Anmeldung geschlossen, Durchgeführt, Nicht durchgeführt
- „Suchfilter zurücksetzen"

### Tourenliste (Karten-/Listen-Layout)
Pro Tour sichtbar:
- Startdatum + Wochentagsspanne (z. B. `Sa.-Mo.`)
- Titel
- Tourengruppe(n)
- Zusatz-Badges: „Mit BF" (Bergführer), „Tourenwoche"
- Anmeldedatum bzw. Anmeldestart
- Tourenleiter*in
- Typ-/Schwierigkeitscode (z. B. `K Alp, HT/A-B/WS+` = Disziplinen / Kondition / techn. Schwierigkeit)
- Sortier-/Spaltenoptionen: Datum, Titel, TourenleiterIn, Tourengruppe
- Paginierung (nummerierte Seiten)

### Weitere Bereiche
- **Kalender**, **Touren**, **Termine**, **Berichte** als Hauptnavigation.
- Login-Bereich für Mitglieder (Anmeldung zu Touren, eigene Anmeldungen).
- Support, Kontakt, Abkürzungs-Erklärungen, RSS, Datenschutz im Footer.

### Tour-Detailseite

Jede Tour hat eine eigene Detailseite unter der URL `/tours/view/<uuid>` (z. B. `touren.sac-bern.ch/tours/view/a116ba1e-57c3-45bc-a2ad-99b309378a30`). Der Inhalt ist als Label/Wert-Paare (`info-item-label` / `info-item-value`) aufgebaut und in zwei Bereiche gegliedert.

**Kopfbereich (Stammdaten)**
- Tourengruppe(n) (farbig hinterlegt)
- Tourenstatus (z. B. Veröffentlicht, Fixiert)
- Datum (Bereich inkl. Wochentagsspanne)
- Anmeldung ab / Anmeldeschluss
- TourenleiterIn und Zus. TourenleiterInnen (Co-Leitung)
- Tourencode/Signatur (z. B. `K Alp, HT/A-B/WS+`)
- Weitere Angaben (z. B. Tourenwoche)

**Reiter „Tourendetails“**
- Aufstieg / Abstieg (Höhenmeter), Tempo, Anzahl Tage
- Beschrieb (Programm/Etappen, mehrzeilig)
- Zusatztext (Voraussetzungen, Hinweise, externe Links z. B. aufs SAC-Tourenportal)
- max. TN-Zahl
- Verkehrsmittel, Reisekosten (1/2Tax / PW), Tourenkosten (übrige), Kosten Erläuterung
- Ausrüstung

**Reiter „Tourenberichte“**
- Nutzerberichte zur Tour (falls vorhanden), sonst Hinweis „Es gibt noch keine Tourenberichte.“

**Aktionen**: „Kalendereintrag exportieren“ (ICS) sowie Anmeldung (nach Login). Diese Felder sind in `structure.json` unter `$defs/TourDetail` abgebildet und in `mockdata.json` mit echten Werten der SAC-Bern-Touren gefüllt.

---

## Gemeinsamkeiten und Unterschiede

| Aspekt | Biel | Bern | CAS-Prototyp |
| --- | --- | --- | --- |
| Layout | kompakte Tabelle | Karten-/Listenansicht | Design-System |
| Filter | Dropdown-Leiste | umfangreiche Suchmaske | modular (`M011`, `M036`) |
| Schwierigkeit | Techn. + Kond. getrennt | Techn. + Anforderung + Status | via `C017 Route Signature` |
| Kalender-Export | ICS, RSS | RSS | – |
| Anmeldung online | nur via Kontakt/Login | integriert | integriert (Prototyp) |
| Kurse | in Tourenliste enthalten | separater Tourtyp „Kurs" | eigener Bereich (31–37) |
| Software | Eigenentwicklung/CMS | climbIT „Tourenangebot" v2.12.5 | SAC Design-Prototyp |

## Kernparameter einer Tour (portalübergreifend)

- Identifikation: Titel, Sektion, Tourengruppe(n)
- Zeit: Startdatum, Enddatum / Dauer, Anmeldeschluss
- Klassifikation: Tourtyp/Disziplin(en), techn. Schwierigkeit, kond. Anforderung
- Personen: Tourenleiter*in(nen), ggf. Bergführer-Flag
- Kapazität: aktuelle/maximale Teilnehmer, Status (offen, ausgebucht, abgesagt, durchgeführt …)
- Zusatzflags: Geführt, ÖV, Umwelttour/Kristall/Sünneli, Tourenwoche, Kurs
- Verlinkung auf Detailseite mit Beschreibung, Route, Ausrüstung, Treffpunkt, Anmeldung
