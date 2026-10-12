import { describe, it, expect } from "vitest";
import { scenes, cast, simpleClues, sceneHints } from "../src/novel";
import {
  initial,
  restore,
  next,
  canContinue,
  correctEvidence,
} from "../src/novelEngine";
describe("det guidade berättelseäventyret", () => {
  it("har bilder och namn till alla talande personer", () => {
    for (const s of scenes) expect(cast[s.speaker].name).toBeTruthy();
    expect(Object.keys(cast)).toHaveLength(6);
  });
  it("leder till alla åtta bevis och slutet utan återvändsgränder", () => {
    let state = { ...initial, started: true };
    const visited = new Set();
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[state.index];
      visited.add(scene.id);
      if (scene.kind === "inspect")
        state = { ...state, found: [...state.found, ...scene.items] };
      if (["question", "evidence", "accuse"].includes(scene.kind))
        state = { ...state, done: [...state.done, scene.id] };
      if (scene.kind !== "finish") {
        expect(canContinue(state)).toBe(true);
        state = next(state);
      }
    }
    expect(visited.size).toBe(scenes.length);
    expect(new Set(state.found).size).toBe(8);
    expect(scenes[state.index].kind).toBe("finish");
  });
  it("visar bevis först när de hittats i berättelsen", () => {
    const available = new Set<string>();
    for (const s of scenes) {
      if (s.kind === "inspect")
        for (const id of s.items) {
          expect(simpleClues[id]).toBeTruthy();
          available.add(id);
        }
      if (s.kind === "evidence")
        for (const id of s.options) expect(available.has(id)).toBe(true);
    }
  });
  it("låter spelaren prova igen och kräver rätt två bevis i kombinationen", () => {
    expect(correctEvidence("clock-link", ["desk"])).toBe(false);
    expect(correctEvidence("clock-link", ["board"])).toBe(true);
    expect(correctEvidence("key-link", ["lock"])).toBe(false);
    expect(correctEvidence("key-link", ["ledger", "lock"])).toBe(true);
    expect(correctEvidence("key-link", ["ledger", "lock", "desk"])).toBe(false);
  });
  it("återställer rätt scen och undviker äldre eller trasig sparning", () => {
    const s = {
      ...initial,
      started: true,
      index: 9,
      found: ["clock"],
      done: ["daniel-question"],
      answers: { "daniel-question": "Svar" },
      history: [0, 1],
    };
    expect(restore(JSON.stringify(s))).toEqual(s);
    for (const raw of [
      "{",
      JSON.stringify({ version: 1 }),
      JSON.stringify({ ...s, index: -1 }),
      JSON.stringify({ ...s, index: 999 }),
    ])
      expect(restore(raw)).toEqual(initial);
  });
  it("ger tre hjälpnivåer utan att avslöja gärningspersonens namn", () => {
    for (const s of scenes) {
      expect(sceneHints(s)).toHaveLength(3);
      expect(sceneHints(s).join(" ")).not.toContain("Elisabeth");
    }
  });
});
