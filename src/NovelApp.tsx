import { useEffect, useRef, useState } from "react";
import { Scene, Portrait } from "./Art";
import { cast, scenes, simpleClues, sceneHints, type Character } from "./novel";
import {
  initial,
  restore,
  saveKey,
  canContinue,
  next,
  correctEvidence,
  type State,
} from "./novelEngine";
import { concepts, type Concept } from "./story";
import "./novel.css";
type Panel = "book" | "help" | "restart" | null;
export default function NovelApp() {
  const [state, setState] = useState<State>(() => {
    try {
      return restore(localStorage.getItem(saveKey));
    } catch {
      return { ...initial };
    }
  });
  const [panel, setPanel] = useState<Panel>(null),
    [tab, setTab] = useState("Personer"),
    [clue, setClue] = useState<string | null>(null),
    [selection, setSelection] = useState<string[]>([]),
    [feedback, setFeedback] = useState(""),
    [help, setHelp] = useState(0),
    [saveError, setSaveError] = useState(false),
    [sound, setSound] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    focus = useRef<HTMLElement | null>(null),
    audio = useRef<AudioContext | null>(null),
    rain = useRef<AudioBufferSourceNode | null>(null);
  const current = scenes[state.index],
    answered = state.done.includes(current.id),
    modal = !!panel || !!clue;
  const reached = Math.max(state.index, ...state.history);
  const known = scenes.slice(0, reached + 1),
    words = [...new Set(known.flatMap((s) => (s.concept ? [s.concept] : [])))];
  useEffect(() => {
    try {
      localStorage.setItem(saveKey, JSON.stringify(state));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [state]);
  useEffect(() => {
    if (modal) {
      focus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      focus.current?.focus();
    }
  }, [modal]);
  useEffect(() => {
    setSelection([]);
    setFeedback("");
  }, [state.index]);
  useEffect(
    () => () => {
      rain.current?.stop();
      void audio.current?.close();
    },
    [],
  );
  function close() {
    setPanel(null);
    setClue(null);
  }
  function open(p: Panel) {
    setPanel(p);
    setHelp(0);
  }
  function mark(text: string) {
    setState((s) => ({
      ...s,
      done: [...new Set([...s.done, current.id])],
      answers: { ...s.answers, [current.id]: text },
    }));
    setFeedback("");
  }
  function advance() {
    setState((s) => next(s));
  }
  function inspect(id: string) {
    setState((s) => ({ ...s, found: [...new Set([...s.found, id])] }));
    setClue(id);
    chime();
  }
  function submit() {
    if (current.kind !== "evidence") return;
    if (correctEvidence(current.id, selection)) {
      mark(current.success);
      chime();
    } else {
      setFeedback(current.retry + " Du kan prova igen.");
      setSelection([]);
    }
  }
  function accuse(id: Character) {
    if (id === "elisabeth") {
      mark(
        "Elisabeth. Hon ville stoppa Viktor från att avslöja försäljningen. Nyckeln och hennes ord om klockan knyter henne till brottsplatsen.",
      );
      chime();
    } else
      setFeedback(
        `${cast[id].name} har ett alibi som en annan person bekräftar. Titta på sammanfattningen igen. Du kan välja en annan person.`,
      );
  }
  function chime() {
    if (!sound || !audio.current) return;
    const a = audio.current,
      o = a.createOscillator(),
      g = a.createGain();
    o.frequency.value = 440;
    g.gain.setValueAtTime(0.03, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.35);
    o.connect(g).connect(a.destination);
    o.start();
    o.stop(a.currentTime + 0.35);
  }
  function toggleSound() {
    if (sound) {
      rain.current?.stop();
      rain.current = null;
      setSound(false);
      return;
    }
    const a = audio.current || new AudioContext();
    audio.current = a;
    void a.resume();
    const b = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.1;
    const r = a.createBufferSource(),
      f = a.createBiquadFilter();
    r.buffer = b;
    r.loop = true;
    f.type = "lowpass";
    f.frequency.value = 850;
    r.connect(f).connect(a.destination);
    r.start();
    rain.current = r;
    setSound(true);
  }
  const person = cast[current.speaker];
  return (
    <div className="novel-game">
      <header className="vn-header">
        <div className="vn-brand">
          <span>B</span>
          <div>
            BLACKWOOD<small>ETT BERÄTTELSEÄVENTYR</small>
          </div>
        </div>
        <div className="vn-actions">
          <span role="status" className="vn-save">
            {saveError ? "Sparning är blockerad" : "Framsteg sparas här"}
          </span>
          <button onClick={toggleSound}>{sound ? "Ljud på" : "Ljud av"}</button>
          {state.started && (
            <button onClick={() => open("restart")}>Börja om</button>
          )}
        </div>
      </header>
      {!state.started ? (
        <main className="vn-start">
          <Scene exterior />
          <div className="vn-start-shade" />
          <section>
            <p className="vn-eyebrow">ETT MYSTERIUM. EN REPLIK I TAGET.</p>
            <h1>
              Mordet på
              <br />
              <em>Blackwood School</em>
            </h1>
            <p>
              Följ berättelsen. Lär känna personerna.
              <br />
              Hitta sanningen tillsammans med Norén.
            </p>
            <button
              className="vn-primary"
              onClick={() => setState((s) => ({ ...s, started: true }))}
            >
              Börja berättelsen →
            </button>
            <p className="vn-fine">
              Tre kapitel · Ingen tidspress · Ingen inloggning
            </p>
            <p className="vn-fine">
              Ett fiktivt mordmysterium utan blod eller skräckeffekter.
            </p>
          </section>
          <div className="vn-start-cast">
            <div>
              <Portrait person="noren" />
              <span>Din guide, Norén</span>
            </div>
            <div>
              <Portrait person="you" />
              <span>Du, den unga detektiven</span>
            </div>
          </div>
        </main>
      ) : (
        <main className="vn-main">
          <nav className="vn-chapters" aria-label="Berättelsens kapitel">
            {["Brottet", "Utredningen", "Avslöjandet"].map((name, i) => (
              <span
                key={name}
                className={current.chapter === i + 1 ? "active" : ""}
                aria-current={current.chapter === i + 1 ? "step" : undefined}
              >
                <b>0{i + 1}</b>
                {name}
              </span>
            ))}
            <button onClick={() => open("book")}>Anteckningar</button>
            <button onClick={() => open("help")}>Hjälp</button>
          </nav>
          <section
            className={`vn-stage ${current.kind === "finish" ? "vn-final" : ""}`}
            aria-label="Berättelsescen"
          >
            <div className="vn-backdrop" key={current.room}>
              <Scene
                room={current.room === "outside" ? "library" : current.room}
                exterior={current.room === "outside"}
              />
            </div>
            <div className="vn-scene-shade" />
            <div className="vn-location">
              <span>
                {current.room === "outside"
                  ? "BLACKWOOD SCHOOL"
                  : current.room === "library"
                    ? "BIBLIOTEKET"
                    : current.room === "hall"
                      ? "KORRIDOREN"
                      : "REKTORSEXPEDITIONEN"}
              </span>
              <h2>{current.title}</h2>
            </div>
            <div className="vn-character" key={current.speaker}>
              <Portrait person={current.speaker} />
            </div>
            {current.speaker !== "noren" && (
              <div className="vn-companion">
                <Portrait person="noren" />
                <small>Norén följer med</small>
              </div>
            )}
            {current.kind === "inspect" && (
              <div className="vn-inspection">
                <p className="vn-eyebrow">
                  UNDERSÖK RUMMET ·{" "}
                  {
                    current.items.filter((id) => state.found.includes(id))
                      .length
                  }
                  /{current.items.length}
                </p>
                <div>
                  {current.items.map((id) => (
                    <button
                      key={id}
                      onClick={() => inspect(id)}
                      className={state.found.includes(id) ? "collected" : ""}
                    >
                      <span className="vn-item-symbol">
                        {id === "clock"
                          ? "◷"
                          : id === "window"
                            ? "▥"
                            : id === "lock"
                              ? "⚿"
                              : "▤"}
                      </span>
                      <span>{simpleClues[id].title}</span>
                      <small>
                        {state.found.includes(id) ? "✓ Läs igen" : "Undersök →"}
                      </small>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="vn-dialogue">
              <div className="vn-name">
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </div>
              <div className="vn-dialogue-body">
                <div className="vn-speech" aria-live="polite">
                  <p key={current.id + (state.answers[current.id] || "")}>
                    {answered && state.answers[current.id]
                      ? state.answers[current.id]
                      : current.text}
                  </p>
                  {current.concept && (
                    <div className="vn-word">
                      <strong>{current.concept}</strong>
                      <span>{concepts[current.concept]}</span>
                    </div>
                  )}
                  {current.kind === "question" && !answered && (
                    <div className="vn-questions">
                      {current.options.map((o) => (
                        <button key={o.label} onClick={() => mark(o.answer)}>
                          {o.label} →
                        </button>
                      ))}
                    </div>
                  )}
                  {current.kind === "evidence" && !answered && (
                    <>
                      <div className="vn-evidence">
                        {current.options.map((id) => (
                          <button
                            key={id}
                            aria-pressed={selection.includes(id)}
                            className={selection.includes(id) ? "chosen" : ""}
                            onClick={() =>
                              setSelection((old) =>
                                old.includes(id)
                                  ? old.filter((x) => x !== id)
                                  : [...old, id],
                              )
                            }
                          >
                            <b>{simpleClues[id].title}</b>
                            <span>{simpleClues[id].text}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        className="vn-present"
                        disabled={selection.length !== current.correct.length}
                        onClick={submit}
                      >
                        {current.correct.length === 2
                          ? "Koppla ihop de två bevisen"
                          : "Visa beviset"}{" "}
                        →
                      </button>
                    </>
                  )}
                  {current.kind === "accuse" && !answered && (
                    <div className="vn-accuse">
                      {(["daniel", "sara", "elisabeth"] as Character[]).map(
                        (id) => (
                          <button key={id} onClick={() => accuse(id)}>
                            <Portrait person={id} />
                            <b>{cast[id].name}</b>
                            <small>
                              {id === "elisabeth"
                                ? "Saknar bekräftat alibi"
                                : "Har ett bekräftat alibi"}
                            </small>
                          </button>
                        ),
                      )}
                    </div>
                  )}
                  {feedback && (
                    <p className="vn-feedback" role="status">
                      {feedback}
                    </p>
                  )}
                  {current.kind === "finish" && (
                    <div className="vn-structure">
                      {[
                        ["Inledning", "Du lärde känna skolan och Viktor."],
                        ["Brott", "Viktor hittades i biblioteket."],
                        [
                          "Utredning",
                          "Du följde spår och pratade med personerna.",
                        ],
                        ["Avslöjande", "Bevisen pekade på Elisabeth."],
                        ["Upplösning", "Alla hemligheter fick en förklaring."],
                      ].map(([name, text]) => (
                        <article key={name}>
                          <h3>{name}</h3>
                          <p>{text}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
                <div className="vn-controls">
                  {current.kind === "finish" ? (
                    <>
                      <button
                        className="vn-primary"
                        onClick={() => open("book")}
                      >
                        Se dina anteckningar
                      </button>
                      <button onClick={() => open("restart")}>
                        Spela igen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="vn-next vn-primary"
                        disabled={!canContinue(state)}
                        onClick={advance}
                      >
                        Fortsätt →
                      </button>
                      {!canContinue(state) && (
                        <small>
                          {current.kind === "inspect"
                            ? "Undersök föremålen först."
                            : current.kind === "question"
                              ? "Välj en fråga."
                              : current.kind === "evidence"
                                ? `Välj ${current.correct.length === 2 ? "två bevis" : "ett bevis"} och visa det.`
                                : "Välj en person."}
                        </small>
                      )}
                      <button
                        className="vn-back"
                        disabled={state.index === 0}
                        onClick={() =>
                          setState((s) => ({ ...s, index: s.index - 1 }))
                        }
                      >
                        ← Läs föregående
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
          <div className="vn-under">
            <span>En berättelse att följa, ett mysterium att lösa.</span>
            <span>{state.found.length} av 8 ledtrådar hittade</span>
          </div>
        </main>
      )}
      <dialog
        ref={dialog}
        className="vn-modal"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="vn-modal-head">
          <span className="vn-eyebrow">BLACKWOODS DETEKTIVBOK</span>
          <button onClick={close} aria-label="Stäng">
            Stäng ×
          </button>
        </div>
        {clue ? (
          <>
            <h2>{simpleClues[clue].title}</h2>
            <div className="vn-paper">
              <p>{simpleClues[clue].text}</p>
            </div>
            <p className="vn-fine">
              Sparad i anteckningarna. Du behöver inte komma ihåg allt själv.
            </p>
            <button className="vn-primary" onClick={close}>
              Tillbaka till berättelsen →
            </button>
          </>
        ) : panel === "restart" ? (
          <>
            <h2>Börja berättelsen från början?</h2>
            <p>Din sparade plats i den nya berättelsen ersätts.</p>
            <button
              className="vn-primary"
              onClick={() => {
                setState({ ...initial });
                close();
                setFeedback("");
              }}
            >
              Starta om
            </button>
            <button onClick={close}>Fortsätt där jag var</button>
          </>
        ) : panel === "help" ? (
          <>
            <h2>Norén hjälper dig</h2>
            <div className="vn-helper">
              <Portrait person="noren" />
              <p>{sceneHints(current)[help]}</p>
            </div>
            <p className="vn-fine">Hjälp {help + 1} av 3</p>
            <button disabled={help === 2} onClick={() => setHelp(help + 1)}>
              Visa tydligare hjälp
            </button>
          </>
        ) : panel === "book" ? (
          <>
            <h2>Det här vet vi</h2>
            <nav className="vn-tabs">
              {["Personer", "Ledtrådar", "Berättelsen", "Deckarord"].map(
                (t) => (
                  <button
                    className={tab === t ? "active" : ""}
                    key={t}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ),
              )}
            </nav>
            {tab === "Personer" ? (
              <div className="vn-cast-grid">
                {(Object.keys(cast) as Character[])
                  .filter((id) => known.some((s) => s.speaker === id))
                  .map((id) => (
                    <article key={id}>
                      <Portrait person={id} />
                      <h3>{cast[id].name}</h3>
                      <small>{cast[id].role}</small>
                      <p>{cast[id].about}</p>
                      {id === "daniel" &&
                        known.some((s) => s.id === "daniel-clear") && (
                          <b>Bekräftat alibi: källaren.</b>
                        )}
                      {id === "sara" &&
                        known.some((s) => s.id === "sara-clear") && (
                          <b>Bekräftat alibi: entrén.</b>
                        )}
                      {id === "elisabeth" &&
                        known.some((s) => s.id === "secret-detail") && (
                          <b>Berättelsen håller inte ihop.</b>
                        )}
                    </article>
                  ))}
              </div>
            ) : tab === "Ledtrådar" ? (
              <div className="vn-note-clues">
                {state.found.map((id) => (
                  <article key={id}>
                    <h3>{simpleClues[id]?.title}</h3>
                    <p>{simpleClues[id]?.text}</p>
                  </article>
                ))}
                {!state.found.length && (
                  <p>Dina upptäckter skrivs upp här automatiskt.</p>
                )}
              </div>
            ) : tab === "Berättelsen" ? (
              <>
                {known
                  .filter((s) => s.recap)
                  .map((s) => (
                    <article className="vn-recap" key={s.id}>
                      <h3>{s.title}</h3>
                      <p>{s.recap}</p>
                    </article>
                  ))}
                {!known.some((s) => s.recap) && (
                  <p>
                    Noréns korta sammanfattningar sparas här när du kommer
                    vidare.
                  </p>
                )}
                <h3>Senaste replikerna</h3>
                {[...new Set([...state.history, state.index])]
                  .slice(-5)
                  .map((i) => (
                    <p key={i}>
                      <b>{cast[scenes[i].speaker].name}:</b>{" "}
                      {state.answers[scenes[i].id] || scenes[i].text}
                    </p>
                  ))}
              </>
            ) : (
              <>
                {words.map((w) => (
                  <article className="vn-recap" key={w}>
                    <h3>{w}</h3>
                    <p>{concepts[w as Concept]}</p>
                  </article>
                ))}
                {!words.length && (
                  <p>Orden dyker upp när du möter dem i berättelsen.</p>
                )}
              </>
            )}
          </>
        ) : null}
      </dialog>
    </div>
  );
}
