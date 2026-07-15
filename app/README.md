# SAC Tourenportal – Prototyp

Interaktiver Frontend-Prototyp der Tourensuche (V0.3) auf Basis von **React + Vite + TypeScript**, **Tailwind CSS** und **shadcn/ui**-Komponenten. Umgesetzt gemäss `../technische-anforderungen.md`.

## Features

- Horizontale Filterleiste: Tourengruppe, Tourentyp (inkl. kaskadierender Schwierigkeitsauswahl), Anforderung, Kondition, Tourenleiter, Anmeldestatus.
- Zeitraum-Filter (Von/Bis) und Freitextsuche.
- Aktive Filter als entfernbare Chips, Reset-Funktion, Mobile-Filter im Sheet.
- Tourenkarten mit farbig hervorgehobener Sportart (offizielle SAC-Disziplinfarben), Statusbadges und CTAs.
- Vier per Tab umschaltbare Ansichten: **Liste** (Karten), **Kacheln** (Grid), **Tabelle** (kompakt), **Kalender** (nach Monat gruppiert).
- SAC-Logo und rote Akzentfarbe gemäss offiziellem Erscheinungsbild.
- Keine Sortierung (bewusst weggelassen, siehe `../umsetzungsplan.md`).
- Daten: `src/data/mockdata.json` (aus `../mockdata.json`), Schema in `../structure.json`.

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server
npm run test      # Unit-Tests (Filterlogik)
npm run build     # Produktionsbuild
```

## Design-Tokens

Farben und Typografie orientieren sich am offiziellen SAC-Styleguide (`../styleguide.md`),
konfiguriert in `tailwind.config.ts` (`sac.*`, `discipline.*`, `text-sac-*`).

## Struktur

- `src/lib/filter.ts` – reine, getestete Filterlogik
- `src/lib/disciplines.ts` – Disziplinen, SAC-Farben, Schwierigkeitsskalen
- `src/components/filters/*` – Filterleiste und Popovers
- `src/components/tour-list/*` – Tourenkarten und Liste
- `src/components/ui/*` – shadcn/ui-Basiskomponenten
