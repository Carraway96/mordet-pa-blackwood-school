import type { Concept, Person, Room } from "./story";
export type Character = Person | "noren" | "viktor" | "you";
export const cast: Record<
  Character,
  { name: string; role: string; color: string; about: string }
> = {
  noren: {
    name: "Kommissarie Norén",
    role: "Din guide",
    color: "#667890",
    about: "Hjälper dig att reda ut mysteriet, en sak i taget.",
  },
  you: {
    name: "Du",
    role: "Blackwoods unga detektiv",
    color: "#54718d",
    about: "Du är elev på skolan och hjälper polisen.",
  },
  viktor: {
    name: "Viktor Falk",
    role: "Historielärare",
    color: "#8a795e",
    about:
      "Han arbetade med skolans manuskript och ville avslöja en hemlighet.",
  },
  elisabeth: {
    name: "Elisabeth Berg",
    role: "Rektor",
    color: "#736985",
    about: "Säger att hon var på expeditionen hela kvällen.",
  },
  daniel: {
    name: "Daniel Holm",
    role: "Vaktmästare",
    color: "#6f827a",
    about: "Arbetade med elen när ljuset slocknade.",
  },
  sara: {
    name: "Sara Lind",
    role: "Svensklärare",
    color: "#a17c67",
    about: "Arbetade med Viktor. Säger att hon gick hem före nio.",
  },
};
export const simpleClues: Record<string, { title: string; text: string }> = {
  clock: {
    title: "Klockan: 21.17",
    text: "Klockan ligger trasig på golvet. Visarna står på 21.17. Men vi vet ännu inte när den stannade.",
  },
  letter: {
    title: "Viktors brev",
    text: "Viktor skrev till Elisabeth: ”Jag vet att du tänker sälja skolans manuskript. I morgon berättar jag för styrelsen.”",
  },
  window: {
    title: "Fönstret och handsken",
    text: "Daniels handske hänger på fönstret. Dammet är orört och det finns inga fotspår utanför. Ingen verkar ha klättrat ut.",
  },
  desk: {
    title: "Saras lapp",
    text: "Sara var arg för att hennes namn saknades på manuskriptet. Viktor skrev tillbaka: ”Jag rättar det i morgon. Förlåt.”",
  },
  board: {
    title: "Daniels videosamtal",
    text: "Elektrikern såg Daniel i källaren 21.10–21.25. På inspelningen hörs Viktor prata 21.15. En duns hörs 21.16.",
  },
  call: {
    title: "Saras telefonsamtal",
    text: "Sara pratade med sin syster från entrén 21.12–21.22. Systern bekräftar samtalet. Sara var kvar, men inte i biblioteket.",
  },
  lock: {
    title: "Bibliotekets nyckel",
    text: "Reservnyckel E hämtades 21.14 och lämnades tillbaka 21.20. Biblioteksdörren låser sig själv när den stängs.",
  },
  ledger: {
    title: "Elisabeths hemliga avtal",
    text: "Elisabeth skulle få pengarna från försäljningen. Bara hon hade tillgång till nyckel E den kvällen.",
  },
};
type Base = {
  id: string;
  chapter: 1 | 2 | 3;
  room: Room | "outside";
  speaker: Character;
  title: string;
  text: string;
  concept?: Concept;
  recap?: string;
};
export type NovelScene = Base &
  (
    | { kind: "line" }
    | { kind: "inspect"; items: string[] }
    | { kind: "question"; options: { label: string; answer: string }[] }
    | {
        kind: "evidence";
        options: string[];
        correct: string[];
        success: string;
        retry: string;
      }
    | { kind: "accuse" }
    | { kind: "finish" }
  );
const line = (
  id: string,
  chapter: 1 | 2 | 3,
  room: Base["room"],
  speaker: Character,
  title: string,
  text: string,
  extra: Partial<Base> = {},
): NovelScene => ({
  id,
  chapter,
  room,
  speaker,
  title,
  text,
  kind: "line",
  ...extra,
});
export const scenes: NovelScene[] = [
  line(
    "welcome",
    1,
    "outside",
    "noren",
    "En kväll på Blackwood",
    "Du är elev på Blackwood School. I kväll hjälper du mig att reda ut ett mysterium. Vi tar en sak i taget.",
  ),
  line(
    "before",
    1,
    "library",
    "viktor",
    "Tidigare samma kväll",
    "”Det finns något jag måste berätta i morgon.” Det var det sista Viktor Falk sa till dig vid middagen.",
  ),
  line(
    "rain",
    1,
    "outside",
    "you",
    "Ljuset slocknar",
    "Regnet slår mot skolans fönster. Plötsligt blir korridoren mörk. Någonstans längre bort hörs en duns.",
  ),
  line(
    "crime",
    1,
    "library",
    "noren",
    "Brottet",
    "När ljuset kommer tillbaka hittas Viktor död i biblioteket. Polisen tar hand om honom. Dörren är låst, men fönstret står på glänt.",
    { concept: "Deckare" },
  ),
  line(
    "suspects",
    1,
    "hall",
    "noren",
    "Tre personer att prata med",
    "Rektorn Elisabeth, vaktmästaren Daniel och läraren Sara var i byggnaden. Alla kan veta något. Vi börjar i biblioteket.",
    { concept: "Misstänkt" },
  ),
  {
    id: "library-search",
    chapter: 1,
    room: "library",
    speaker: "noren",
    title: "Se dig omkring",
    text: "Undersök de fyra markerade föremålen. Jag skriver upp det vi hittar, så du behöver inte memorera något.",
    kind: "inspect",
    items: ["clock", "window", "letter", "desk"],
    concept: "Ledtråd",
  },
  line(
    "first-summary",
    1,
    "library",
    "noren",
    "Vad vet vi nu?",
    "Klockan visar 21.17. Daniels handske ligger vid fönstret. Viktor hade en konflikt med Elisabeth och Sara. Inget av det bevisar vem som är skyldig.",
    {
      recap:
        "Vi hittade en klocka, en handske och två meddelanden. Nu ska vi höra personernas berättelser.",
    },
  ),
  line(
    "daniel-enter",
    2,
    "hall",
    "daniel",
    "Möt Daniel",
    "”Jag försökte laga elen när ljuset slocknade. Jag ville aldrig att något sådant här skulle hända.” Daniel håller hårt i sin mössa.",
  ),
  {
    id: "daniel-question",
    chapter: 2,
    room: "hall",
    speaker: "daniel",
    title: "Prata med Daniel",
    text: "Vad vill du fråga först?",
    kind: "question",
    options: [
      {
        label: "Var var du när ljuset slocknade?",
        answer:
          "”I källaren. Jag pratade med en elektriker i ett videosamtal. Hon kunde se mig hela tiden.”",
      },
      {
        label: "Varför verkar du så nervös?",
        answer:
          "”Jag hade skjutit upp en reparation. Viktor tänkte rapportera mig. Jag var rädd att förlora jobbet.”",
      },
    ],
  },
  line(
    "daniel-motive",
    2,
    "hall",
    "daniel",
    "Daniels hemlighet",
    "”Viktor visste att jag hade slarvat med elen. Det är därför jag är nervös. Men jag var i källaren under hela avbrottet.”",
    { concept: "Motiv" },
  ),
  line(
    "alibi",
    2,
    "hall",
    "noren",
    "Vi kontrollerar berättelsen",
    "Daniel säger att någon såg honom i källaren. Det kan ge honom ett alibi. Vi läser polisens uppgifter innan vi drar en slutsats.",
    { concept: "Alibi" },
  ),
  {
    id: "hall-search",
    chapter: 2,
    room: "hall",
    speaker: "noren",
    title: "Spåren i korridoren",
    text: "Här finns uppgifter om samtalen och bibliotekets nyckel. Undersök de tre markerade föremålen.",
    kind: "inspect",
    items: ["board", "call", "lock"],
  },
  line(
    "time-explain",
    2,
    "hall",
    "noren",
    "En viktig tid",
    "På inspelningen hörs Viktor prata 21.15. Dunsen kommer 21.16. Daniel syns i källaren hela tiden. Men klockan visar 21.17 …",
  ),
  {
    id: "clock-link",
    chapter: 2,
    room: "hall",
    speaker: "noren",
    title: "Jämför två ledtrådar",
    text: "Vad ska vi jämföra med klockan för att undersöka tiden? Välj ett bevis.",
    kind: "evidence",
    options: ["board", "desk", "window"],
    correct: ["board"],
    success:
      "Precis. Inspelningen visar att Viktor levde 21.15 och att dunsen kom 21.16. Klockan kan visa fel tid.",
    retry:
      "Leta efter beviset som innehåller både Viktors röst och tiden för dunsen.",
  },
  line(
    "clock-answer",
    2,
    "hall",
    "daniel",
    "Klockans hemlighet",
    "”Klockan stod redan stilla när jag var där vid halv nio! Min handske fastnade när jag öppnade fönstret för att vädra.”",
  ),
  line(
    "daniel-clear",
    2,
    "hall",
    "noren",
    "Daniel kan uteslutas",
    "Elektrikern bekräftar Daniels alibi. Handsken kom dit tidigare. Den såg misstänkt ut, men ledde oss åt fel håll.",
    {
      concept: "Villospår",
      recap:
        "Daniel var i källaren. Handsken var ett villospår. Klockan visar inte mordets tid.",
    },
  ),
  line(
    "sara-enter",
    2,
    "hall",
    "sara",
    "Möt Sara",
    "”Viktor och jag arbetade med skolans manuskript. Vi grälade, men jag hade gått hem före nio.” Sara tittar ner på sin bok.",
  ),
  {
    id: "sara-question",
    chapter: 2,
    room: "hall",
    speaker: "sara",
    title: "Prata med Sara",
    text: "Vad vill du fråga henne?",
    kind: "question",
    options: [
      {
        label: "Varför grälade ni?",
        answer:
          "”Mitt namn saknades på omslaget, fast jag hade gjort mycket av arbetet. Jag blev arg.”",
      },
      {
        label: "Vad hände efter grälet?",
        answer:
          "”Viktor lovade att skriva dit mitt namn. Sedan gick jag … före nio.”",
      },
    ],
  },
  line(
    "sara-claim",
    2,
    "hall",
    "noren",
    "Något stämmer inte",
    "Sara säger att hon gick före nio. Men ett av bevisen visar att hon var kvar senare. Vi låter henne förklara.",
  ),
  {
    id: "sara-proof",
    chapter: 2,
    room: "hall",
    speaker: "sara",
    title: "Visa Sara ett bevis",
    text: "Vilket bevis visar att Sara var kvar efter klockan nio?",
    kind: "evidence",
    options: ["call", "clock", "lock"],
    correct: ["call"],
    success:
      "”Okej. Jag var kvar vid entrén och ringde min syster. Jag hade gråtit efter grälet och skämdes. Därför sa jag att jag hade gått.”",
    retry:
      "Ett av bevisen handlar om ett samtal som Saras syster kan bekräfta.",
  },
  line(
    "sara-alibi",
    2,
    "hall",
    "sara",
    "Saras riktiga berättelse",
    "”Jag pratade med min syster hela tiden, från 21.12 till 21.22. Telefonens sladd räckte bara till bänken vid entrén.”",
  ),
  line(
    "sara-steps",
    2,
    "hall",
    "sara",
    "Stegen i mörkret",
    "”Jag hörde en dörr stängas och steg mot rektorsexpeditionen. Det var ungefär 21.18. Jag såg inte vem det var.”",
  ),
  line(
    "sara-clear",
    2,
    "hall",
    "noren",
    "Sara kan också uteslutas",
    "Systern bekräftar samtalet. Sara var vid entrén när brottet skedde. Hon ljög, men hennes lögn handlade om skam, inte om mord.",
    {
      recap:
        "Sara pratade i telefon vid entrén. Hon hade ett alibi. Någon gick mot expeditionen efter dunsen.",
    },
  ),
  line(
    "elisabeth-enter",
    2,
    "office",
    "elisabeth",
    "Möt Elisabeth",
    "”Jag satt här på expeditionen hela kvällen. Ensam. Jag gick aldrig ut.” Elisabeth lägger sina händer prydligt på bordet.",
  ),
  {
    id: "elisabeth-question",
    chapter: 2,
    room: "office",
    speaker: "elisabeth",
    title: "Prata med Elisabeth",
    text: "Vad vill du fråga rektorn?",
    kind: "question",
    options: [
      {
        label: "Vad handlade ert gräl om?",
        answer:
          "”Viktor tyckte att jag fattade fel beslut om skolans gamla manuskript. Det var en fråga för mig som rektor.”",
      },
      {
        label: "Kan någon bekräfta att du var här?",
        answer:
          "”Nej. Jag var ensam. Men jag har redan sagt att jag inte gick ut.”",
      },
    ],
  },
  line(
    "office-open",
    2,
    "office",
    "noren",
    "Dokumentet på skrivbordet",
    "Vi har tillstånd att läsa handlingarna. Ett avtal på skrivbordet kan förklara vad Viktor ville berätta.",
  ),
  {
    id: "office-search",
    chapter: 2,
    room: "office",
    speaker: "noren",
    title: "Undersök avtalet",
    text: "Klicka på dokumentet för att se varför manuskriptet var så viktigt.",
    kind: "inspect",
    items: ["ledger"],
  },
  line(
    "sale-explain",
    2,
    "office",
    "noren",
    "Pengarna och nyckeln",
    "Elisabeth skulle sälja skolans manuskript och behålla pengarna själv. Viktor tänkte avslöja det. Bara Elisabeth hade tillgång till reservnyckel E.",
  ),
  {
    id: "key-link",
    chapter: 2,
    room: "office",
    speaker: "noren",
    title: "Sätt ihop två uppgifter",
    text: "Välj de två bevis som tillsammans visar Elisabeths möjlighet att komma in i biblioteket.",
    kind: "evidence",
    options: ["lock", "ledger", "desk"],
    correct: ["lock", "ledger"],
    success:
      "Nyckeln användes under strömavbrottet. Nyckellistan visar att Elisabeth hade tillgång till den. Vi behöver fråga henne igen.",
    retry:
      "Välj uppgiften om när nyckeln användes och uppgiften om vem som hade tillgång till den.",
  },
  line(
    "confront",
    2,
    "office",
    "you",
    "En sista fråga",
    "”Elisabeth, nyckeln hämtades 21.14 och lämnades tillbaka 21.20. Du hade tillgång till den. Var du verkligen här hela tiden?”",
  ),
  line(
    "slip",
    2,
    "office",
    "elisabeth",
    "Elisabeth säger för mycket",
    "”Jag hämtade nyckeln, ja. Men Viktor levde när jag gick. Klockan gick sönder 21.17 när han föll …” Hon avbryter sig mitt i meningen.",
  ),
  line(
    "secret-detail",
    2,
    "office",
    "noren",
    "Hur kunde hon veta det?",
    "Vi har aldrig berättat vilken tid den trasiga klockan visar. Den uppgiften är hemlig. Ändå visste Elisabeth den.",
  ),
  line(
    "suspense",
    2,
    "office",
    "noren",
    "Bilden förändras",
    "Först misstänkte vi Daniel och Sara. Nya bevis ändrade bilden. Så byggs spänning i en deckare: du får veta lite i taget.",
    {
      concept: "Spänningsuppbyggnad",
      recap:
        "Elisabeth hade ett motiv och tillgång till nyckeln. Hennes berättelse ändrades. Hon kände till den hemliga tiden på klockan.",
    },
  ),
  line(
    "gather",
    3,
    "library",
    "noren",
    "Alla samlas i biblioteket",
    "Du har följt spåren hela vägen. Vi går igenom det viktigaste tillsammans innan du presenterar din lösning.",
  ),
  line(
    "recap-daniel",
    3,
    "library",
    "daniel",
    "Daniel",
    "”Elektrikern såg mig i källaren hela tiden.” Daniel har ett bekräftat alibi. Handsken kom till fönstret tidigare.",
  ),
  line(
    "recap-sara",
    3,
    "library",
    "sara",
    "Sara",
    "”Jag pratade med min syster vid entrén.” Sara har också ett bekräftat alibi. Hennes lögn handlade om grälet.",
  ),
  line(
    "recap-elisabeth",
    3,
    "library",
    "elisabeth",
    "Elisabeth",
    "Elisabeth saknar ett bekräftat alibi. Hon hämtade nyckeln, hade något att dölja och visste vad klockan visade.",
  ),
  {
    id: "accuse",
    chapter: 3,
    room: "library",
    speaker: "noren",
    title: "Vem stämmer bevisen in på?",
    text: "Välj den person vars berättelse inte håller. Du kan läsa våra korta anteckningar om du vill.",
    kind: "accuse",
  },
  line(
    "answer",
    3,
    "library",
    "elisabeth",
    "Sanningen",
    "”Viktor tänkte visa avtalet för styrelsen. Jag ville stoppa honom.” Elisabeth sjunker ner på stolen. Kommissarie Norén tar över.",
    { concept: "Upplösning" },
  ),
  line(
    "resolution-one",
    3,
    "library",
    "noren",
    "Det som hände",
    "Elisabeth gick till Viktor med nyckeln. De grälade om avtalet. Hon slog honom med ett tungt bokstöd. Det var dunsen som hördes 21.16.",
  ),
  line(
    "resolution-two",
    3,
    "library",
    "noren",
    "Den låsta dörren",
    "Elisabeth gick ut genom dörren. Den låste sig själv bakom henne. Ingen behövde klättra genom fönstret.",
  ),
  line(
    "resolution-three",
    3,
    "library",
    "noren",
    "Den trasiga klockan",
    "Hon välte den redan stannade klockan för att få oss att tro på en annan tid. Sedan lämnade hon tillbaka nyckeln och låtsades ha varit på expeditionen.",
  ),
  line(
    "closure",
    3,
    "outside",
    "you",
    "Regnet har slutat",
    "Utanför skolan ljusnar himlen. Du började med en låst dörr och tre hemligheter. Nu hänger berättelsen ihop.",
  ),
  {
    id: "finish",
    chapter: 3,
    room: "outside",
    speaker: "noren",
    title: "Fallet är löst",
    text: "Du lyssnade, jämförde och ändrade uppfattning när bevisen ändrade bilden. Det är så en detektiv arbetar.",
    kind: "finish",
  },
];
export function sceneHints(scene: NovelScene) {
  return scene.kind === "inspect"
    ? [
        "Se dig omkring i rummet.",
        "De markerade föremålen går att undersöka.",
        "Klicka på varje markerat föremål och sedan på Fortsätt.",
      ]
    : scene.kind === "evidence"
      ? [
          "Läs frågan och de korta beviskorten.",
          "Fundera på vilken uppgift som går att kontrollera.",
          scene.retry,
        ]
      : scene.kind === "accuse"
        ? [
            "Använd sammanfattningen av personernas berättelser.",
            "Två personer har alibin som någon annan bekräftar.",
            "Välj personen som saknar ett bekräftat alibi och känner till den hemliga uppgiften om klockan.",
          ]
        : [
            "Ta berättelsen en replik i taget.",
            "Namnet ovanför texten visar vem som pratar.",
            "Tryck på Fortsätt, eller välj den fråga du vill ställa.",
          ];
}
