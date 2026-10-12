# Mordet på Blackwood School

Ett komplett svenskt point-and-click-äventyr för årskurs 7. Eleven undersöker tre illustrerade miljöer, hittar åtta bevis, förhör tre misstänkta, upptäcker tre samband och presenterar en underbyggd lösning. Alla tre kapitel och upplösningen är implementerade.

## Starta lokalt

Installera Node.js 22 och kör följande i projektmappen:

```sh
npm ci
npm run dev
```

Öppna adressen som Vite visar (normalt http://127.0.0.1:5173). Node behövs bara för utveckling. Elever behöver endast en modern webbläsare när spelet är publicerat.

## Bygga

```sh
npm test
npm run build
npm run preview
```

`dist/` innehåller hela webbplatsen. Lägg mappens innehåll på en statisk webbserver. Relativa asset-adresser fungerar även under en GitHub Pages-projektadress.

## GitHub Pages

1. I repots **Settings → Pages**, välj **GitHub Actions** under Source.
2. Arbetsflödet `.github/workflows/pages.yml` testar och bygger vid push till `main`. Kör det manuellt från fliken Actions om filerna redan finns på `main`.
3. Vänta tills både build och deploy är gröna. Speladressen är då `https://carraway96.github.io/mordet-pa-blackwood-school/`.

Om Pages inte har aktiverats ännu kan deployment-jobbet misslyckas. Aktivera Pages och kör arbetsflödet igen. En förväntad adress är inte samma sak som en verifierad publicering.

## Spela och undervisa

Använd mus eller Tab och Enter. Escape stänger anteckningar och dialoger. Inga små dolda klickytor behövs. Hjälpen har tre nivåer och följer den pågående utredningen. Felaktiga beviskombinationer och anklagelser kan alltid prövas igen.

Progressionen sparas med `localStorage` på samma dator och webbläsare. Om lagring blockeras visas ett meddelande; spelet kan ändå slutföras under sessionen. Börja om via menyn före nästa elev. Inget elevnamn samlas in. Inga analysverktyg, externa typsnitt, API-anrop eller betaltjänster finns i det publicerade spelet. Webbhotellet kan föra vanliga serverloggar.

Ljudet skapas lokalt med Web Audio, utan externa ljudfiler. Illustrationerna är egen SVG. Inget blod, grafiskt våld eller jump scares förekommer. Alla personer och händelser är fiktiva.

**Tidsmål:** 20–25 minuter, inklusive en avslutning på ungefär två minuter. Det är ett designmål, inte verifierad elevspeltid. Utredningen innehåller åtta föremål, nio grundfrågor, tre kombinationer, tre konfrontationer och ett avslöjande. Ingen timer eller påtvingad väntan finns. Snabba läsare kan bli klara tidigare. Genomför ett pilotspel med några elever och justera textmängden efter deras faktiska tider; sikta på högst 30 minuter vid normalt spelande.

Efteråt kan eleverna berätta vilket bevis som ändrade deras första misstanke och varför en lögn inte alltid betyder skuld. De åtta begreppen introduceras under spelet och samlas i anteckningsboken. Avslutningen visar berättelsens fem delar och hur spänningen byggdes.

## Ändra eller skapa fler mysterier

| Fil             | Innehåll                                                                   |
| --------------- | -------------------------------------------------------------------------- |
| `src/story.ts`  | Rum, bevis, personer, frågor, begrepp, samband och upplösning              |
| `src/engine.ts` | Sparformat, krav för avslöjandet, beviskombinationer och progressionshjälp |
| `src/App.tsx`   | Gränssnitt, modalrutor, förhör, anklagelse och ljud                        |
| `src/Art.tsx`   | SVG-miljöer och porträtt                                                   |
| `src/style.css` | Färger, layout, dokument och animationer                                   |

Dialoger ändras i `people.questions` och `people.confront`. Varje bevis har ett stabilt `id`, ett `room`, koordinater i procent och korta textstycken. Ändra `connections` när två bevis ska skapa ett samband; personens `requires` anger vilket samband som öppnar konfrontationen. Lösningen anges i `resolution`.

För ett nytt mysterium: kopiera berättelsemodulen, behåll dess datatyper och anpassa bevis, personer, rum, samband och upplösning. Byt import i spelmotorn och appen. Anpassa SVG-rummen, person-ID:n, antalskrav och ledtrådshjälp till det nya fallet. Byt även sparnyckeln så att fallen inte blandas ihop. Motorn är separerad från textinnehållet men är dimensionerad för det här fallets tre rum och tre personer; den är inte en generell redigerare för godtyckligt många fall.

## Tester

```sh
npm test
npm run test:e2e
```

Starta utvecklingsservern först för webbläsartesterna. Playwright använder installerad Edge på Windows. På andra system används Playwright Chromium (`npx playwright install chromium`). Testet följer alla bevis, grundfrågor, kombinationer och konfrontationer, lämnar ett felaktigt svar, löser fallet, laddar om sparningen och startar om. Separat test granskar en smal skärm. `npm run build` kontrollerar TypeScript och produktionspaketering.

Läs `MYSTERIET.md` för lösningen och den logiska kedjan. Den filen innehåller spoilers och bör inte delas med elever före spelet.
