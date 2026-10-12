export type Room = "library" | "hall" | "office";
export type Person = "elisabeth" | "daniel" | "sara";
export const rooms: Record<Room, { name: string; description: string }> = {
  library: {
    name: "Biblioteket",
    description:
      "Regnet viskar mot rutorna. På mattan syns märket efter en vält stol. Polisen har tagit hand om Viktor. Kvar finns ett rum som tycks hålla andan.",
  },
  hall: {
    name: "Korridoren",
    description:
      "En ensam lampa lyser över anslagstavlan. Här möts bibliotekets dörr, entrén och trappan till elcentralen. Någon har gått den här vägen i mörkret.",
  },
  office: {
    name: "Rektorsexpeditionen",
    description:
      "Läder, gamla kartor och en doft av kallt te. Elisabeth har gett polisen tillstånd att undersöka handlingarna. Det prydliga skrivbordet döljer en mindre prydlig historia.",
  },
};
export const concepts = {
  Deckare:
    "En berättelse om ett brott eller mysterium som någon försöker lösa. Du följer spåren och prövar olika förklaringar.",
  Misstänkt:
    "En person som kan ha begått brottet. Att någon verkar misstänkt betyder inte att personen är skyldig.",
  Ledtråd:
    "Information som hjälper dig att förstå mysteriet. En ledtråd behöver tolkas och jämföras med andra uppgifter.",
  Alibi:
    "Uppgifter som kan visa att en person var någon annanstans när brottet begicks. Ett påstående blir starkare om det kan bekräftas.",
  Motiv:
    "Anledningen till att någon kan vilja begå brottet. Ett motiv räcker inte för att bevisa skuld.",
  Villospår:
    "Något som verkar peka mot lösningen men leder tankarna fel. Det kan vara planterat eller bara feltolkat.",
  Spänningsuppbyggnad:
    "Författaren ger information stegvis. Osäkerhet, hemligheter och motsägelser gör att du vill veta mer.",
  Upplösning:
    "Den del där mysteriet får sin förklaring och de viktiga frågorna besvaras.",
};
export type Concept = keyof typeof concepts;
export const clues = [
  {
    id: "clock",
    room: "library",
    name: "Den trasiga klockan",
    x: 46,
    y: 78,
    time: "21.17?",
    text: "En bordsklocka ligger på mattan. Glaset är sprucket och visarna står på 21.17. Men uppdragningsfjädern sitter kvar i sitt stopp. Klockan kan ha stannat innan den föll. Du skriver ett frågetecken efter tiden.",
    detail:
      "En stannad klocka visar inte automatiskt när ett brott skedde. Vem vill att du ska lita på just den tiden?",
  },
  {
    id: "letter",
    room: "library",
    name: "Viktors brev",
    x: 29,
    y: 53,
    time: "18.30",
    text: "”Elisabeth. Jag har kopiorna. Skolans manuskript får inte säljas privat. I morgon lämnar jag avtalet till styrelsen. Vi måste tala i biblioteket i kväll. / Viktor”",
    detail:
      "I marginalen står också: ”Sara måste få sitt namn på arbetet. Daniel måste berätta om säkringarna.” Viktor hade konflikter med alla tre.",
  },
  {
    id: "window",
    room: "library",
    name: "Fönstret på glänt",
    x: 78,
    y: 32,
    text: "Fönstret står öppet några centimeter. Dammet på den breda fönsterbrädan är obrutet. Utanför finns mjuk, våt jord utan fotspår. Ingen verkar ha klättrat in eller ut.",
    detail:
      "På haspen hänger Daniels namnmärkta arbetshandske. Handsken ser misstänkt ut – men visar den när han var här?",
  },
  {
    id: "desk",
    room: "library",
    name: "Manuskriptet",
    x: 61,
    y: 57,
    time: "20.50",
    text: "Ett gammalt manuskript ligger under en läslampa. På omslaget står ”Bearbetning: Viktor Falk”. Under finns Saras anteckningar och en lapp: ”Jag var här 20.50. Du lovade att nämna mig. / Sara”.",
    detail:
      "Sara verkar ha varit arg. I papperskorgen ligger en senare lapp från Viktor: ”Rättar omslaget i morgon. Förlåt.” Konflikten kan ha fått en lösning.",
  },
  {
    id: "board",
    room: "hall",
    name: "Elcentralens logg",
    x: 28,
    y: 39,
    time: "21.10–21.25",
    text: "Batteriloggen visar: bibliotekets ström bryts 21.14 och återkommer 21.20. På en bilaga har polisen antecknat att Daniels obrutna videosamtal med elektrikern pågick 21.10–21.25. Elektrikern såg honom arbeta i källaren hela tiden.",
    detail:
      "Ett ljud hörs på inspelningen 21.16: en tung duns ovanifrån. Polisen bedömer att den hör ihop med mordet. Viktor talade med elektrikern via Daniels högtalare 21.15. Han levde alltså då.",
  },
  {
    id: "lock",
    room: "hall",
    name: "Dörren och nyckelloggen",
    x: 76,
    y: 49,
    time: "21.14 / 21.20",
    text: "Biblioteksdörrens fjäderlås låser när dörren stängs. Den behöver ingen nyckel för att låsas utifrån. Reservnyckel E hämtades ur skåpet 21.14 och återlämnades 21.20. Skåpet är batteridrivet och varje uttag registreras.",
    detail:
      "Kvällens behörighetslista finns på expeditionen. Någon kan ha gått ut genom dörren och låtit den låsa sig. Ett låst rum behöver inte betyda en flykt genom fönstret.",
  },
  {
    id: "call",
    room: "hall",
    name: "Telefonen vid entrén",
    x: 49,
    y: 65,
    time: "21.12–21.22",
    text: "Den fasta telefonens logg visar ett samtal till Saras syster 21.12–21.22. Systern har bekräftat för polisen att Sara talade oavbrutet. Sladden räcker bara till entrébänken. Sara hörde en dörr stängas och steg mot expeditionen 21.18.",
    detail:
      "Sara var kvar i skolan senare än hon sagt. Men samtalet placerar henne långt från biblioteket när dunsen hördes. En lögn kan dölja något annat än mord.",
  },
  {
    id: "ledger",
    room: "office",
    name: "Avtalet och nyckellistan",
    x: 53,
    y: 56,
    time: "Kvällens behörighet",
    text: "Ett hemligt försäljningsavtal gäller skolans värdefulla manuskript. Pengarna skulle gå till Elisabeths privata konto. På dagens signerade nyckellista står: ”Reservnyckel E: Elisabeth Berg. Ingen utlåning under kvällen.” De andra nycklarna var inlåsta för inventering.",
    detail:
      "Viktor tänkte avslöja avtalet. Elisabeth hade både något att förlora och tillgång till biblioteket. Listan bevisar behörighet, men du behöver också pröva hennes berättelse.",
  },
] as const;
export const people: Record<
  Person,
  {
    name: string;
    role: string;
    color: string;
    intro: string;
    questions: { id: string; q: string; a: string; concept?: Concept }[];
    requires: string;
    confrontQ: string;
    confront: string;
  }
> = {
  elisabeth: {
    name: "Elisabeth Berg",
    role: "Rektor",
    color: "#6c667c",
    intro:
      "Hon stryker ett osynligt veck ur ärmen. ”Skolan behöver lugn nu. Jag förväntar mig att du arbetar diskret.”",
    questions: [
      {
        id: "alibi",
        q: "Var befann du dig under strömavbrottet?",
        a: "”På expeditionen. Hela tiden, ensam. Jag arbetade med budgeten. Jag gick inte ens ut i korridoren.” Hon svarar innan du har hunnit ta fram din penna.",
        concept: "Alibi",
      },
      {
        id: "last",
        q: "När såg du Viktor senast?",
        a: "”Vid middagen. Han var upprörd. Efteråt hade jag ingen kontakt med honom.” Hon tittar mot dörren. ”Finns det verkligen inget annat du behöver undersöka?”",
      },
      {
        id: "motive",
        q: "Varför grälade ni?",
        a: "”Han tyckte att jag fattade fel beslut om skolans samlingar. Jag tyckte att han lade sig i sådant han inte förstod. Ett gräl är inte ett mord.” Det har hon rätt i. Men vilket beslut menar hon?",
        concept: "Motiv",
      },
    ],
    requires: "keys",
    confrontQ: "Presentera nyckelloggen och det hemliga avtalet",
    confront:
      "”Jag hämtade nyckeln, ja. Jag skulle hämta avtalet, men gick tillbaka. Viktor levde när jag gick. Klockan gick sönder 21.17 när han föll …” Hon tystnar. Du har aldrig berättat vilken tid klockan visar. Polisen har inte lämnat ut den uppgiften. Hennes påstående om expeditionen håller inte, och hon känner till brottsplatsen.",
  },
  daniel: {
    name: "Daniel Holm",
    role: "Vaktmästare",
    color: "#6f827a",
    intro:
      "Daniel vrider sin mössa mellan händerna. ”Jag har skött den här byggnaden i tjugo år. Nu önskar jag att den kunde tala.”",
    questions: [
      {
        id: "alibi",
        q: "Var var du klockan 21.17?",
        a: "”I elcentralen, i videosamtal med jour-elektrikern. Från tio över till tjugofem över. Hon såg mig hela tiden. Lamporna i källaren går på en annan krets.”",
        concept: "Alibi",
      },
      {
        id: "last",
        q: "När var du senast i biblioteket?",
        a: "”Vid halv nio. Jag vädrade efter ett läckage och rättade till fönsterhaspen. Viktor satt vid bordet. Jag glömde nog något där.” Han stoppar sin bara hand i fickan.",
      },
      {
        id: "motive",
        q: "Varför är du nervös?",
        a: "”Viktor ville rapportera mitt arbete med elen. Jag hade skjutit upp en reparation. Jag kunde förlora jobbet. Men jag försökte faktiskt laga felet i kväll.”",
        concept: "Motiv",
      },
    ],
    requires: "time",
    confrontQ: "Jämför klockan med elcentralens logg",
    confront:
      "”Den där klockan stod redan stilla vid halv nio. Jag hörde Viktor i telefonen 21.15, och sedan dunsen 21.16. Elektrikern hörde den också. Handsken? Den fastnade när jag vädrade. Jag vågade inte säga något om den dåliga säkringen.” Daniels hemlighet handlar om slarv. Inspelningen bekräftar hans alibi och att klockan inte visar mordets tid.",
  },
  sara: {
    name: "Sara Lind",
    role: "Svensklärare",
    color: "#a17c67",
    intro:
      "Sara håller en bok hårt mot bröstet. ”Viktor och jag skulle göra skolans historia till en berättelse. Nu vet jag inte hur den ska sluta.”",
    questions: [
      {
        id: "alibi",
        q: "När lämnade du skolan?",
        a: "”Före nio. Jag gick direkt hem. Jag såg inte strömavbrottet.” Hon sänker blicken när du frågar om någon såg henne gå.",
        concept: "Alibi",
      },
      {
        id: "last",
        q: "Hur gick ert arbete med manuskriptet?",
        a: "”Jag hade skrivit nästan alla kommentarer, men mitt namn saknades på omslaget. Jag gick till Viktor för att protestera. Han lovade att rätta det. Jag ville tro honom.”",
      },
      {
        id: "motive",
        q: "Var du arg på Viktor?",
        a: "”Ja. Jag hade lagt månader på arbetet. Jag lämnade en skarp lapp. Men det är skillnad på att vilja få rätt och att vilja någon illa.”",
        concept: "Motiv",
      },
    ],
    requires: "sara",
    confrontQ: "Presentera telefonloggen och manuskriptet",
    confront:
      "”Okej. Jag var kvar. Efter vårt gräl ringde jag min syster från entrén. Jag skämdes för att jag hade gråtit och ville inte bli indragen. Hon kan bekräfta samtalet. Jag hörde steg 21.18, mot expeditionen. Jag såg inte vem det var.” Sara ljög om när hon gick. Telefonen och systerns uppgifter ger henne ändå ett alibi vid 21.16.",
  },
};
export const connections = [
  {
    id: "time",
    pair: ["clock", "board"],
    title: "Klockan visar fel tid",
    text: "Viktor levde 21.15. Dunsen hördes 21.16. Den stannade klockan kan inte användas som exakt tid för mordet. Fråga Daniel om den.",
  },
  {
    id: "sara",
    pair: ["desk", "call"],
    title: "En lögn, men ett alibi",
    text: "Sara var kvar efter nio, trots sitt påstående. Konflikten om manuskriptet hade fått en lösning. Telefonloggen placerar henne vid entrén när brottet skedde. Konfrontera henne.",
  },
  {
    id: "keys",
    pair: ["lock", "ledger"],
    title: "En väg in – och ut",
    text: "Elisabeth hade ensam behörighet till reservnyckel E. Den användes under avbrottet. Dörren kunde låsa sig bakom någon som gick ut. Pröva Elisabeths påstående om expeditionen.",
  },
];
export const ending = [
  [
    "21.14",
    "Nyckeln",
    "Elisabeth hämtade reservnyckel E. Hon gick till biblioteket för att få tillbaka försäljningsavtalet innan Viktor kunde visa det för styrelsen. Strömavbrottet berodde på den dåliga säkringen; det var inte planerat av mördaren.",
  ],
  [
    "21.16",
    "Brottet",
    "Viktor vägrade lämna över beviset. Elisabeth slog honom med det tunga bokstödet. Dunsen fångades i Daniels samtal. Berättelsen visar inte själva våldet.",
  ],
  [
    "21.18",
    "Det låsta rummet",
    "Elisabeth välte den redan stannade klockan för att skapa en falsk mordtid. Hon gick ut genom dörren, som låste sig av sig själv. Sara hörde stegen mot expeditionen. Fönstret hade Daniel öppnat tidigare.",
  ],
  [
    "21.20",
    "Avslöjandet",
    "Elisabeth lämnade tillbaka nyckeln. Hennes alibi saknade stöd och motsades av loggen och hennes eget erkännande av nyckeluttaget. När hon avslöjade en hemlig detalj om klockan knöts hon till brottsplatsen. Polisen tog över bevisen.",
  ],
];
export const resolution = {
  person: "elisabeth",
  motive: "sale",
  evidence: ["lock", "ledger", "clock"],
} as const;
