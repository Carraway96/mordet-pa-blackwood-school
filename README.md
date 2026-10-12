# Mordet på Blackwood School

Ett svenskt berättelseäventyr för årskurs 7, inspirerat av visual novels. Karaktären som talar visas stort i scenens kant och replikerna kommer en i taget. Kommissarie Norén leder eleven genom tre kapitel och sammanfattar vad man vet.

## Den förenklade versionen

- En tydlig väg genom historien, utan fri kartnavigering eller komplicerade förhörsmenyer.
- Sex illustrerade personer: eleven, Norén, Viktor, Elisabeth, Daniel och Sara.
- Åtta korta bevis, undersökta i tre guidade miljöer.
- Frågeval och bevisval direkt i samtalen. En enkel kombination av två bevis.
- Korta sammanfattningar efter förhören och återläsning av föregående replik.
- Anteckningar om personer, ledtrådar, berättelsen och deckarord.
- Ett tydligt avslöjande, en fullständig upplösning och ett pedagogiskt avslut.

Felaktiga bevis och personval kan alltid prövas igen. Tre hjälpnivåer följer aktuell scen. Ingen timer, inloggning eller installation behövs för eleverna på den publicerade sidan.

## Starta och bygga

Installera Node.js 22 för utveckling och kör i projektmappen:

```sh
npm ci
npm run dev
```

Öppna adressen Vite visar, normalt http://127.0.0.1:5173.

```sh
npm test
npm run build
npm run preview
```

`dist/` kan publiceras på valfri statisk webbserver. Relativa asset-adresser fungerar under en GitHub Pages-projektadress.

## GitHub Pages

Välj **Settings → Pages → Source → GitHub Actions**. Arbetsflödet `.github/workflows/pages.yml` testar, bygger och publicerar vid push till `main`. Det kan också köras manuellt från Actions.

Speladressen är https://carraway96.github.io/mordet-pa-blackwood-school/. Kontrollera att publiceringsjobbet är grönt efter en ändring.

## Kontroller och sparning

Klicka på **Fortsätt** för nästa replik. Vid undersökningar klickar man på markerade föremål. Vid samtal väljer man en fråga eller ett bevis. Tab och Enter fungerar, och Escape stänger dialoger. **Läs föregående** låter eleven läsa om utan att förlora bevis.

Den nya versionen sparar aktuell scen, hittade föremål och svar i `localStorage` under `blackwood-novel-v2`. Den gamla versionens sparning ligger kvar separat och blandas inte in i den nya berättelsen. **Börja om** återställer bara den nya versionen. Om lagring blockeras visas ett meddelande; sessionen kan ändå spelas klart.

Spelet samlar inte in elevnamn och gör inga externa API-anrop. Miljöerna är SVG och de sex karaktärerna är bildgenererade illustrationer med transparent bakgrund, lagrade i projektet. Bildgenerering sker inte när eleverna spelar. Ljudet skapas lokalt med Web Audio. Inga externa typsnitt, analysverktyg eller ljudfiler används. Webbhotellet kan föra vanliga serverloggar. Ljud är frivilligt. Alla personer och händelser är fiktiva; inga blodiga bilder eller skräckeffekter förekommer.

## Ändra berättelsen

| Fil                  | Innehåll                                                             |
| -------------------- | -------------------------------------------------------------------- |
| `src/novel.ts`       | Scenordning, repliker, personer, förenklade bevis, val och scenhjälp |
| `src/novelEngine.ts` | Sparformat, progression och kontroll av bevisval                     |
| `src/NovelApp.tsx`   | Scenvisning, porträtt, dialog, anteckningar och ljud                 |
| `src/novel.css`      | Utseendet för berättelseäventyret                                    |
| `src/Art.tsx`        | Miljöer och visning av karaktärsbilder                                |
| `src/characters.ts` och `src/assets/characters/` | De sex bildgenererade porträtten       |
| `src/story.ts`       | Deckarbegrepp och grundmaterialet för mysteriet                      |

Varje scen har ett stabilt `id`, kapitel, rum, talande person och kort text. Scenens `kind` anger om den är en vanlig replik, undersökning, fråga, bevisval, anklagelse eller avslutning. `recap` sparar en kort sammanfattning, och `concept` introducerar ett deckarord.

Skapa fler fall genom att kopiera berättelsemodulen och byta personer, scenordning, bevis och upplösning. Uppdatera importerna, illustrerade miljöer och sparnyckeln. Kontrollera särskilt att alla valbara bevis hittas före scenen där de behövs. Anklagelsens rätta person anges för närvarande i `accuse()` i `NovelApp.tsx` och behöver ändras för ett nytt fall.

## Tester och undervisning

```sh
npm test
npm run test:e2e
```

Starta utvecklingsservern före webbläsartesterna. Playwright använder installerad Edge på Windows och Playwright Chromium på andra system (`npx playwright install chromium`). Tester följer hela scenordningen, kontrollerar porträtt, alla bevis, felval, hjälp, återupptagen sparning, slutet och omstarten. Skärmbilder sparas i testresultaten. Enhetstester säkerställer bland annat att inga bevisval förekommer innan bevisen är hittade.

Berättelsen är förenklad för att minska mängden information eleven behöver hålla i huvudet. Faktisk speltid har inte uppmätts med elever. Den ursprungliga tidsramen 20–25 minuter behöver därför prövas på nytt; snabba läsare kan bli klara tidigare. Inga väntetider har lagts till för att förlänga spelet.

Efteråt: samtala om vilket bevis som ändrade elevens första misstanke och varför en lögn inte automatiskt betyder skuld. Läs `MYSTERIET.md` för lärarens lösning och logiska kedja (spoilers).
