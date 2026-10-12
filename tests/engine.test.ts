import { describe, it, expect } from "vitest";
import { initial, ready, match, restore, hint } from "../src/engine";
import { clues, connections, people } from "../src/story";
describe("ett rättvist och nåbart mysterium", () => {
  it("har åtta tillgängliga bevis i tre rum", () => {
    expect(clues).toHaveLength(8);
    expect(new Set(clues.map((c) => c.room)).size).toBe(3);
    expect(new Set(clues.map((c) => c.id)).size).toBe(8);
  });
  it("kräver hela utredningen före avslöjandet", () => {
    const s = {
      ...initial,
      found: clues.map((c) => c.id),
      asked: Object.entries(people).flatMap(([id, p]) =>
        p.questions.map((q) => `${id}:${q.id}`),
      ),
      linked: connections.map((c) => c.id),
      confronted: Object.keys(people),
    };
    expect(ready(s)).toBe(true);
    for (const key of ["found", "asked", "linked", "confronted"] as const)
      expect(ready({ ...s, [key]: s[key].slice(1) })).toBe(false);
  });
  it("öppnar samtliga konfrontationer med hittbara bevis", () => {
    for (const c of connections) {
      expect(match(...(c.pair as [string, string]))?.id).toBe(c.id);
      expect(match(c.pair[1], c.pair[0])?.id).toBe(c.id);
      for (const id of c.pair)
        expect(clues.some((clue) => clue.id === id)).toBe(true);
    }
    for (const p of Object.values(people))
      expect(connections.some((c) => c.id === p.requires)).toBe(true);
    expect(match("clock", "clock")).toBeUndefined();
    expect(match("window", "letter")).toBeUndefined();
  });
  it("återställer sparning och klarar skadad JSON", () => {
    expect(restore("{")).toEqual(initial);
    const s = {
      ...initial,
      started: true,
      chapter: 2,
      found: ["clock"],
      asked: ["sara:alibi"],
      linked: ["time"],
      confronted: ["daniel"],
    };
    expect(restore(JSON.stringify(s))).toEqual(s);
    expect(
      restore(JSON.stringify({ ...s, found: ["clock", "clock", "missing"] }))
        .found,
    ).toEqual(["clock"]);
  });
  it("har tre tips på alla steg utan att namnge gärningspersonen", () => {
    for (const s of [
      initial,
      { ...initial, chapter: 2 },
      { ...initial, chapter: 2, found: clues.map((c) => c.id) },
      {
        ...initial,
        chapter: 2,
        found: clues.map((c) => c.id),
        asked: Array(9).fill("q"),
        linked: connections.map((c) => c.id),
        confronted: Object.keys(people),
      },
    ]) {
      expect(hint(s)).toHaveLength(3);
      expect(hint(s).join(" ")).not.toContain("Elisabeth");
    }
  });
});
