# Styleguide-Analyse: SAC CAS Frontend-Prototyp

Quelle: `https://saccas-frontend.netlify.app/preview/styleguide/*` (Unterseiten: Buttons, Colors, Font Styles, Form Inputs, Icons). Der Styleguide ist Teil des Fractal/Estatico-basierten Pattern-Library-Prototyps (SCSS/BEM-Klassen `c-*`, `sg_*` für die Styleguide-Chrome selbst).

## 1. Farben (`/preview/styleguide/colors`)

### Basisfarben
| Name | SCSS-Variable | Hex/Wert |
| --- | --- | --- |
| red | `$color-red` | `#E30613` |
| red-hover | `$color-red-hover` | `#B00511` |
| red-30 | `$color-red-30` | `#F6B4B8` |
| green | `$color-green` | `#84BE41` |
| green-hover | `$color-green-hover` | `#81A624` |
| yellow | `$color-yellow` | `#FFCC00` |
| orange | `$color-orange` | `#FF8800` |
| white | `$color-white` | `#FFFFFF` |
| black | `$color-black` | `#333333` |
| blackA50 | `$color-blackA50` | `rgba(51,51,51,0.5)` |

### Graustufen
| Name | Hex |
| --- | --- |
| gray-dark | `#706F6F` |
| gray-dotted-lines | `#C6C7C8` |
| gray | `#E9E9E9` |
| gray-medium | `#999999` |
| gray-light | `#F4F4F4` |
| snow | `#F9F9F9` |

### Alert-Farben
| Name | Hex |
| --- | --- |
| alert-blue | `#00A3DA` |
| alert-yellow | `#FFD300` |

### Disziplin-Farben (`color-discipline-*`)
| Disziplin | Hex |
| --- | --- |
| mountain-hiking (Berg-/Alpinwandern) | `#237100` |
| alpine-tour (Hochtour) | `#662D91` |
| climbing (Klettern) | `#FF3D12` |
| via-ferrata (Klettersteig) | `#FF8800` |
| ski-tour (Skitour) | `#0033FF` |
| snowshoe-tour (Schneeschuhtour) | `#008A79` |

→ Diese Palette deckt sich weitgehend mit den Farbcodes, die im Figma-Prototyp V0.2 für die Tourentyp-Filter/Card-Balken verwendet werden (vgl. `prototyp.md`): Grün = Wandern, Violett = Hochtour, Orange = Klettersteig, Rot = Klettern. Der SAC-Styleguide ist damit die wahrscheinliche **Ursprungsquelle** dieses Farbsystems.

### Weitere semantische Farben
| Name | Hex |
| --- | --- |
| hut-sac (SAC-Hütte) | `#E30613` |
| hut-private (Privathütte) | `#FFBB00` |
| climbing-grades | `#FECC26` |
| protection-rule (Schutzbestimmung) | `#746C20` |
| archive (Routenarchiv) | `#89664E` |

## 2. Typografie (`/preview/styleguide/font-styles`)

- **Schriftfamilie**: Frutiger (durchgängig für alle Textstile).
- **Schnitte**: `bold` und `300` (Light) – kein Regular/400 im Styleguide sichtbar.

| Klasse | Verwendung | Grösse/Zeilenhöhe | Schnitt |
| --- | --- | --- | --- |
| `.fs-h1` | H1 | 36px / 1.25 | bold |
| `.fs-h1-subline` | H1 Subline | 36px / 1.25 | 300 |
| `.fs-h2` | H2 | 30px / 1.25 | bold |
| `.fs-h2-subline` | H2 Subline | 30px / 1.25 | 300 |
| `.fs-h3` | H3 | 22px / 1.25 | bold |
| `.fs-h3-subline` | H3 Subline | 22px / 1.25 | 300 |
| `.fs-h4` | H4 | 15px / 1.25 | bold |
| `.fs-copy` | Fliesstext | 15px / 1.5 | 300 |
| `.fs-copy-bold` | Fliesstext betont | 15px / 1.5 | bold |
| `.fs-copy-note` | Fussnote/Meta | 12px / 1.5 | 300 |
| `.fs-copy-note-bold` | Fussnote betont | 12px / 1.5 | bold |
| `.fs-label` | Label/Kleinstschrift | 10px / 1 | 300 |

**Beobachtung**: Die Hierarchie ist streng zweistufig (bold/light), es gibt keine Zwischengewichte (medium/semibold). Alle Grössen sind fixe px-Werte (kein fluid type/clamp() im Styleguide sichtbar), was auf ein eher klassisches, nicht responsive-fluid Type-System hindeutet.

## 3. Buttons (`/preview/styleguide/components-buttons`)

Basisklasse `c-button`, Varianten via BEM-Modifier:

| Variante | Klasse | Beschreibung |
| --- | --- | --- |
| Primary | `c-button` | Standard-Button (a/button/input) |
| Secondary | `c-button c-button--secondary` | Outline/sekundär |
| Tertiary | `c-button c-button--tertiary` | Text-/schwach betonter Button |
| Pill | `c-button c-button--pill` | Pill-Form, z. B. für Filter-Chips |
| Pill aktiv | `c-button c-button--pill is-active` | aktiver Zustand via `is-active` |
| Select | `c-button c-button--select` (+ `is-active`) | Auswahl-Button (z. B. Toggle-Filter) |
| Positive CTA | `c-button c-button--positive-cta` | Hervorgehobener Haupt-CTA (z. B. „Anmelden") |
| Icon-Button (quadratisch) | `c-button c-button--secondary c-button--icon-square` | Nur-Icon-Button |
| Mit Icon + Label | `c-button` + `c-button__icon` + `c-button__label` | Icon-Text-Kombination |
| Text-Button | `c-button-text` | Reiner Link-/Text-Button |
| Text-Button rot | `c-button-text c-button-text--red` | Destruktive Aktion (z. B. Löschen/Abbrechen) |
| Loading-Zustand | `c-button is-loading` + `c-loading-spinner` | 3-Punkte-Spinner, Button während des Requests deaktiviert |
| Disabled | natives `disabled`-Attribut | reduzierte Deckkraft |
| Tooltip | `data-tooltip="top"` + `title` | HTML im Tooltip erlaubt (`<b>`) |

**Konsistenz-Hinweis**: Der Prototyp V0.2 (Figma) verwendet ebenfalls klar getrennte Primary-/Sekundär-Buttons („Details anzeigen" dunkel/primary, „Anmelden" outline/sekundär) – passt zum `c-button` / `c-button--secondary`-Muster dieses Styleguides.

## 4. Formulare (`/preview/styleguide/forms`)

Beobachtete Eingabetypen und -zustände:

- **Textfelder**: Vorname, E-Mail, Strasse/Nr., PLZ, Stadt – Standard-Inputs mit Label.
- **Zustände**: `readonly`, `disabled`, Fehlerzustand mit Inline-Fehlermeldung („Die Eingabe ist fehlerhaft.").
- **Passwortfeld** inkl. Stärkeanzeige (Komponente `C024 Password Strength Meter` laut Modulliste).
- **Radio-Buttons**: Anrede (Frau/Herr) – auch in einer zweiten, alternativen Darstellung.
- **Checkboxen**: „Ich akzeptiere die Bedingungen", „Ich möchte den Newsletter erhalten" (mit Fliesstext-Beschreibung darunter).
- **Farbauswahl-Inputs** (vermutlich Radio-Button-Gruppen mit Farb-Chips): Grün/Blau/Rot – in Varianten „normal", „volle Breite", „disabled", „mit Bemerkung", „mit sehr langem Label".
- **Datei-Upload** (`C037 Input File`): Drag & Drop-Zone, „Dateien auswählen"-Button, Anzeige bereits hochgeladener Dateien mit Thumbnail (Bilder) oder Dateityp-Icon (`icon-file-docx` etc.), Format-Hinweis „max. 5 MB, JPG, PDF".

**Muster**: Formularkomponenten sind konsequent mit Zustandsvarianten (default/readonly/disabled/error) und einer zusätzlichen „volle Breite"-Variante dokumentiert – wichtig für ein responsives Filterformular wie im Tourenportal-Prototyp.

## 5. Icons (`/preview/styleguide/icons`)

Sehr umfangreiches Icon-System (SVG-Sprite `svg-sprite.svg`), thematisch gruppierbar:

- **Pfeile/Navigation**: `icon-arrow-circle-{up,down,left,right}`, `icon-arrow1-*`, `icon-arrow2-*`, `icon-arrow-forward`, `icon-arrow-left-right`, `icon-collapse`, `icon-expand`.
- **Tourenziele (`icon-destination-*`)**: `summit`, `hut-sac`, `hut-private`, `hut`, `lake`, `waterfall`, `cave`, `bridge`, `alp`, `climbing-area`, `climbing-gym`, `departure-arrival`, `traverse`, `other`.
- **Disziplinen (`icon-discipline-*`)**: `mountain-hiking`, `alpine-tour`, `alpine-climbing`, `climbing`, `via-ferrata`, `ski-tour`, `snowshoe-tour`, `archive`. → Direktes Pendant zu den Disziplin-Farben und zu den Tourentyp-Filtern in Biel/Bern/Prototyp V0.2.
- **Klettern-spezifisch (`icon-climbing-*`)**: sehr granular – `approach`, `approach-with-crampons/skis`, `crack`, `descent`, `elegance` (1–3), `exposition`, `friends`, `nuts`, `overhang`, `protection` (1–4), `protection-possibilities`, `quickdraws`, `rain-proof`, `rope`, `slab`, `steep-wall`, `child-friendly-routes/terrain`. Diese Detailtiefe deutet auf ein sehr fachspezifisches Klettergebiets-/Routenmodul hin (vermutlich für „14 Route Climbing Sector").
- **Transportmittel (`icon-transport-*`)**: `bus`, `zug`, `tram`, `metro`, `schiff`, `aufzug`, `kabinenbahn`, `sesselbahn`, `standseilbahn`, `zahnradbahn` – für Anreise-/ÖV-Informationen.
- **Dateitypen (`icon-file-*`)**: `doc`, `jpg`, `pdf`, `png`, `ppt`, `txt`, `video`, `xls`, generisches `icon-file`.
- **Social (`icon-social-*`)**: Facebook, Google+, Instagram, LinkedIn, Mail, Skype, Twitter, WhatsApp, YouTube.
- **UI/Funktional**: `icon-calendar`, `icon-camera`, `icon-checkmark-in-circle`, `icon-exclamation-mark-in-circle`, `icon-question-mark-in-circle`, `icon-x-in-circle`, `icon-info`, `icon-lock(ed)/unlocked`, `icon-magnifier(-with-plus)`, `icon-map`, `icon-map-warning`, `icon-heart(-add/-tick)`, `icon-pin(-on-map/-solid/-double/-square)`, `icon-print(er)`, `icon-share`, `icon-shopping-bag/cart`, `icon-download/upload/export`, `icon-settings`, `icon-target(-arrows)`, `icon-rating-star`, `icon-profile-badge`, `icon-silhouette-{man,woman}(-solid/-in-circle)`, `icon-sign-out`, `icon-membership`, `icon-gemstone` (vermutlich „Kristall"-Flag wie in Biel), `icon-schweizmobil`, `icon-tourenportal`.
- **Logos**: `logo-{de,fr,it,en}`, `logo-{de,fr,it,en}-light-text`, `logo-emblem`, `logo-magazine-{de,fr,it}`.

**Beobachtung**: Das Icon-`icon-gemstone` passt exakt zum Biel-Zusatzfilter „Kristall". Das legt nahe, dass Biel und der offizielle SAC-Prototyp auf ein gemeinsames Vokabular/Regelwerk des Zentralverbands zurückgreifen.

## Technische Beobachtungen

- **Namenskonvention**: BEM (`c-` = Component, `m-`/`M0xx` = Module, `sg_` = nur Styleguide-Chrome, `is-*` = Zustandsklassen, `o-*` = Utility/Objects wie `o-full`).
- **Icon-Distribution**: ein einziges SVG-Sprite (`assets/media/svg/svg-sprite.svg`), referenziert per `<use xlink:href="...#icon-name">` – effizient, aber erschwert das Styling einzelner Icon-Farben ohner Weiteres (nur via `currentColor`/CSS möglich).
- **Mehrsprachigkeit**: Der Prototyp ist für DE/FR/IT/EN ausgelegt (sichtbar an den Logo-Varianten und `lang`/`locale`-Konfiguration `"lang":"de","locale":"de-CH"`).
- **Datenmodell-Hinweise aus globaler Konfiguration** (`estatico.data.global`): bestätigt Disziplin-Übersetzungen (`mountain_hiking`, `alpine_tour`, `climbing`, `alpine_climbing`, `via_ferrata`, `ski_tour`, `snowshoe_tour`, `archive`) und Schwierigkeitsskalen für `alpine_tour`/`ski_tour` (`L, WS, ZS, S, SS, AS`) – deckt sich mit unserem `structure.json`.
- **Zielgruppen-Typen** (`types`): `summit` (Gipfel), `hut` (Hütte), `traverse` (Übergang), `marking_point` (Markanter Punkt), `departure_arrival` (Ausgangspunkt/Talort), `climbing_area` (Klettergebiet) – relevant für unser neu eingeführtes `destination`-Feld, das um einen `type` ergänzt werden könnte.

## Empfehlungen für unsere Datenmodelle/Prototypen

1. **Farbpalette übernehmen**: Für `disciplineColor` (siehe `structure.json`) die offiziellen Hex-Werte statt generischer Farbnamen verwenden (z. B. `#237100` für Wandern statt `"green"`).
2. **`destination.type`** ergänzen (enum: `summit`, `hut`, `traverse`, `marking_point`, `departure_arrival`, `climbing_area`) – passend zum offiziellen Zielty-Modell.
3. **Icon-Namen als Referenz** für ein zukünftiges UI-Komponenten-Set nutzen (z. B. `icon-discipline-alpine-tour` für Hochtour-Badges).
4. **Button-Varianten** (`primary`, `secondary`, `tertiary`, `pill`, `positive-cta`, `text`, `text--red`) als Grundlage für die CTA-Buttons in den Tourenkarten (z. B. „Details anzeigen" = primary, „Anmelden" = positive-cta, „Abmelden"/Abbrechen = `text--red`).
5. **Typografie-Skala** (`fs-h1` … `fs-label`) 1:1 für ein eigenes Design-Token-Set übernehmen, sofern das Zielprodukt näher am offiziellen SAC-Erscheinungsbild als am Figma-Prototyp V0.2 (andere Typografie/Farben) ausgerichtet werden soll.

## Referenzierte Quellen

- `https://saccas-frontend.netlify.app/preview/styleguide/components-buttons`
- `https://saccas-frontend.netlify.app/preview/styleguide/colors`
- `https://saccas-frontend.netlify.app/preview/styleguide/font-styles`
- `https://saccas-frontend.netlify.app/preview/styleguide/forms`
- `https://saccas-frontend.netlify.app/preview/styleguide/icons`
