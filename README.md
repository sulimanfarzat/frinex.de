# frinex.de — Custom-Code

Eigenentwicklungen des Shopware-6.7-Shops [frinex.de](https://www.frinex.de).
Dieses Repository enthält **ausschließlich eigenen Code** (Whitelist in `.gitignore`) —
kein Shopware-Core, keine Secrets, keine kommerziellen Store-Plugins.

## Inhalt

| Plugin | Zweck |
|---|---|
| `custom/plugins/FrinexPremium` | Premium-Storefront-Theme (Frontend-Redesign, Phase 1: Design-Tokens, Typografie Inter + Manrope, Buttons, Formulare, Badges) |
| `custom/plugins/MeinB2BTheme` | Bisheriges aktives Theme (wird durch FrinexPremium abgelöst) |
| `custom/plugins/ZeroBudgetB2B` | B2B-Funktionen: Registrierungsanträge (`zero_budget_b2b_request`), Kundengruppen-Freischaltung, Quick Order |

## Theme-Vererbung

```
@Storefront → @Plugins → @ZeroBudgetB2B → @FrinexPremium
```

## Deployment-Hinweise

Nach Änderungen an Themes/Templates auf dem Server:

```bash
bin/console cache:clear
bin/console theme:refresh
bin/console theme:compile
```

Frontend-Konzept (Design-System, Wireframes, Roadmap Phase 1–4):
siehe internes Konzeptdokument „FRINEX Frontend-Konzept v1.0".

## Startseite pflegen (Erlebniswelten)

Die Startseite wird aus **Core-CMS-Blöcken** gebaut, die das Theme im
Konzept-Look stylt — kein Entwickler nötig. Zuordnung Konzept → Block:

| Konzept-Sektion | CMS-Block (Erlebniswelten) |
|---|---|
| 1 · Hero | „Bild-Text-Cover" — großes Bild, Headline (H1), Button `btn btn-primary` |
| 2 · Vorteile | Element „HTML" mit dem USP-Snippet (siehe unten) |
| 3 · Bestseller | „Produkt-Slider" + dynamische Produktgruppe „Bestseller" |
| 4 · Kategorien | „Drei Spalten" mit verlinkten Bildern (Hover-Zoom automatisch) |
| 5 · Marken | „Bild-Galerie" einzeilig |
| 6 · Bewertungen | „Drei Spalten" Text (Zitat + Name) |
| 7 · Über FRINEX | „Bild + Text" 50/50 |
| 8 · Newsletter | Element „Formular" → Newsletter |

### USP-Snippet (Element „HTML")

```html
<div class="frx-usp-bar">
  <div class="frx-usp">
    <span class="frx-usp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    <span class="frx-usp-title">Schneller Versand</span>
    <span class="frx-usp-text">Heute bestellt, morgen versandt</span>
  </div>
  <div class="frx-usp">
    <span class="frx-usp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg></span>
    <span class="frx-usp-title">Premium-Qualität</span>
    <span class="frx-usp-text">Geprüfte Markenware</span>
  </div>
  <div class="frx-usp">
    <span class="frx-usp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg></span>
    <span class="frx-usp-title">Sichere Zahlung</span>
    <span class="frx-usp-text">SSL, PayPal, Rechnung (B2B)</span>
  </div>
  <div class="frx-usp">
    <span class="frx-usp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21a9 9 0 1 0-9-9"/><path d="M3 12h4l2-5 4 10 2-5h6"/></svg></span>
    <span class="frx-usp-title">Persönlicher Support</span>
    <span class="frx-usp-text">Mo–Fr 8–17 Uhr, direkt vom Fach</span>
  </div>
</div>
```
