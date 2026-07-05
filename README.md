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
