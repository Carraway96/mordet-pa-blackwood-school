import { scenes } from "./novel";
export type State = {
  version: 2;
  started: boolean;
  index: number;
  found: string[];
  done: string[];
  answers: Record<string, string>;
  history: number[];
};
export const initial: State = {
  version: 2,
  started: false,
  index: 0,
  found: [],
  done: [],
  answers: {},
  history: [],
};
export const saveKey = "blackwood-novel-v2";
export function restore(raw: string | null): State {
  try {
    const s = JSON.parse(raw || "null");
    if (
      s?.version !== 2 ||
      !Number.isInteger(s.index) ||
      s.index < 0 ||
      s.index >= scenes.length
    )
      return { ...initial };
    return {
      ...initial,
      started: s.started === true,
      index: s.index,
      found: Array.isArray(s.found)
        ? s.found.filter((x: unknown) => typeof x === "string")
        : [],
      done: Array.isArray(s.done)
        ? s.done.filter((x: unknown) => typeof x === "string")
        : [],
      answers:
        s.answers && typeof s.answers === "object" && !Array.isArray(s.answers)
          ? s.answers
          : {},
      history: Array.isArray(s.history)
        ? s.history.filter(
            (x: unknown) =>
              Number.isInteger(x) &&
              Number(x) >= 0 &&
              Number(x) < scenes.length,
          )
        : [],
    };
  } catch {
    return { ...initial };
  }
}
export function canContinue(s: State) {
  const scene = scenes[s.index];
  if (scene.kind === "finish") return false;
  if (scene.kind === "inspect")
    return scene.items.every((id) => s.found.includes(id));
  if (["question", "evidence", "accuse"].includes(scene.kind))
    return s.done.includes(scene.id);
  return true;
}
export function next(s: State): State {
  return canContinue(s)
    ? {
        ...s,
        index: Math.min(s.index + 1, scenes.length - 1),
        history: [...s.history, s.index],
      }
    : s;
}
export function correctEvidence(sceneId: string, ids: string[]) {
  const scene = scenes.find((s) => s.id === sceneId);
  return (
    scene?.kind === "evidence" &&
    ids.length === scene.correct.length &&
    scene.correct.every((id) => ids.includes(id))
  );
}
