import { clues, connections, type Room, type Concept } from "./story";
export type State = {
  version: 1;
  started: boolean;
  room: Room;
  chapter: number;
  found: string[];
  asked: string[];
  linked: string[];
  confronted: string[];
  tools: Concept[];
  solved: boolean;
  endPage: number;
  sound: boolean;
};
export const initial: State = {
  version: 1,
  started: false,
  room: "library",
  chapter: 1,
  found: [],
  asked: [],
  linked: [],
  confronted: [],
  tools: [],
  solved: false,
  endPage: 0,
  sound: false,
};
export const saveKey = "blackwood-mystery-v1";
export const ready = (s: State) =>
  s.found.length === clues.length &&
  s.linked.length === connections.length &&
  s.confronted.length === 3 &&
  s.asked.length === 9;
export function match(a: string, b: string) {
  return connections.find(
    (c) => c.pair.includes(a) && c.pair.includes(b) && a !== b,
  );
}
export function restore(raw: string | null): State {
  try {
    const s = JSON.parse(raw || "null");
    if (s?.version !== 1) return { ...initial };
    return {
      ...initial,
      ...s,
      room: ["library", "hall", "office"].includes(s.room) ? s.room : "library",
      found: [
        ...new Set<string>(
          (s.found || []).filter((id: string) =>
            clues.some((c) => c.id === id),
          ),
        ),
      ],
      asked: Array.isArray(s.asked) ? s.asked : [],
      linked: (s.linked || []).filter((id: string) =>
        connections.some((c) => c.id === id),
      ),
      confronted: (s.confronted || []).filter((id: string) =>
        ["elisabeth", "daniel", "sara"].includes(id),
      ),
      tools: Array.isArray(s.tools) ? s.tools : [],
    };
  } catch {
    return { ...initial };
  }
}
export function hint(s: State): string[] {
  if (s.chapter === 1)
    return [
      "Låt rummet berätta innan du väljer en misstänkt.",
      "Fyra föremål i biblioteket kan undersökas.",
      "Klicka på klockan, brevet, manuskriptet och fönstret. Fortsätt sedan till utredningen.",
    ];
  if (s.found.length < 8) {
    const next = clues.find((c) => !s.found.includes(c.id))!;
    return [
      "Vad går att kontrollera utanför biblioteket?",
      "Besök alla tre platser. Dokumenten kompletterar varandra.",
      `Undersök ”${next.name}” i ${next.room === "hall" ? "korridoren" : next.room === "office" ? "rektorsexpeditionen" : "biblioteket"}.`,
    ];
  }
  if (s.asked.length < 9)
    return [
      "Lyssna på alla innan du bestämmer dig.",
      "Varje person har tre grundfrågor.",
      "Öppna Förhör och ställ alla tre grundfrågor till varje misstänkt.",
    ];
  if (s.linked.length < 3) {
    const next = connections.find((c) => !s.linked.includes(c.id))!;
    return [
      "Två uppgifter tillsammans kan säga mer än en ensam.",
      "Koppla ihop bevis i anteckningsbokens ledtrådsflik.",
      `Markera ”${clues.find((c) => c.id === next.pair[0])!.name}” och ”${clues.find((c) => c.id === next.pair[1])!.name}”.`,
    ];
  }
  if (s.confronted.length < 3)
    return [
      "En berättelse kan förändras när någon får se bevis.",
      "Nya frågor finns när du har upptäckt sambanden.",
      "Förhör personerna igen och välj deras nya fråga: ”Presentera” eller ”Jämför”.",
    ];
  return [
    "Bygg en förklaring som stämmer med alla bevis.",
    "Skilj mellan motiv, möjlighet och ett kontrollerat alibi.",
    "Öppna Avslöjandet. Välj person och motiv, och markera bevis för både tillträde och motiv.",
  ];
}
