import { useEffect, useRef, useState } from "react";
import {
  clues,
  rooms,
  people,
  concepts,
  connections,
  ending,
  resolution,
  type Room,
  type Person,
  type Concept,
} from "./story";
import {
  initial,
  restore,
  saveKey,
  ready,
  match,
  hint,
  type State,
} from "./engine";
import { Portrait, Scene } from "./Art";
type Panel = "book" | "talk" | "hint" | "accuse" | "restart" | null;
export default function App() {
  const [s, setS] = useState<State>(() => {
    try {
      return restore(localStorage.getItem(saveKey));
    } catch {
      return { ...initial };
    }
  });
  const [panel, setPanel] = useState<Panel>(null),
    [book, setBook] = useState("Ledtrådar"),
    [person, setPerson] = useState<Person>("elisabeth"),
    [selected, setSelected] = useState<string[]>([]),
    [level, setLevel] = useState(0),
    [notice, setNotice] = useState<{
      title: string;
      text: string;
      detail?: string;
    } | null>(null),
    [response, setResponse] = useState(""),
    [accused, setAccused] = useState<Person>("elisabeth"),
    [motive, setMotive] = useState(""),
    [evidence, setEvidence] = useState<string[]>([]),
    [feedback, setFeedback] = useState(""),
    [saveError, setSaveError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    lastFocus = useRef<HTMLElement | null>(null),
    audio = useRef<AudioContext | null>(null),
    rain = useRef<AudioBufferSourceNode | null>(null);
  useEffect(() => {
    try {
      localStorage.setItem(saveKey, JSON.stringify(s));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [s]);
  const modal = !!panel || !!notice;
  useEffect(() => {
    if (modal) {
      lastFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      lastFocus.current?.focus();
    }
  }, [modal]);
  useEffect(
    () => () => {
      rain.current?.stop();
      audio.current?.close();
    },
    [],
  );
  const patch = (data: Partial<State>) => setS((old) => ({ ...old, ...data }));
  function learn(...c: Concept[]) {
    setS((old) => ({ ...old, tools: [...new Set([...old.tools, ...c])] }));
  }
  function tone() {
    if (!s.sound) return;
    const ctx = audio.current;
    if (!ctx) return;
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.setValueAtTime(660, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.035, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  }
  function toggleSound() {
    if (s.sound) {
      rain.current?.stop();
      rain.current = null;
      patch({ sound: false });
      return;
    }
    const ctx = audio.current || new AudioContext();
    audio.current = ctx;
    void ctx.resume();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate),
      data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * 0.12;
    const source = ctx.createBufferSource(),
      filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter).connect(ctx.destination);
    source.start();
    rain.current = source;
    patch({ sound: true });
  }
  function close() {
    setPanel(null);
    setNotice(null);
    setSelected([]);
    setFeedback("");
  }
  function inspect(id: string) {
    const c = clues.find((c) => c.id === id)!;
    if (!s.found.includes(id)) {
      patch({ found: [...s.found, id] });
      tone();
    }
    learn("Ledtråd");
    setNotice({ title: c.name, text: c.text, detail: c.detail });
  }
  function ask(id: string) {
    const p = people[person],
      q = p.questions.find((q) => q.id === id)!;
    const key = `${person}:${id}`;
    if (!s.asked.includes(key)) patch({ asked: [...s.asked, key] });
    if (q.concept) learn(q.concept);
    setResponse(q.a);
  }
  function confront() {
    if (!s.confronted.includes(person))
      patch({ confronted: [...s.confronted, person] });
    learn("Villospår", "Spänningsuppbyggnad");
    setResponse(people[person].confront);
    tone();
  }
  function link(id: string) {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    if (next.length === 2) {
      const c = match(next[0], next[1]);
      if (c) {
        if (!s.linked.includes(c.id)) patch({ linked: [...s.linked, c.id] });
        learn("Spänningsuppbyggnad");
        setFeedback(`${c.title}. ${c.text}`);
        tone();
      } else
        setFeedback(
          "De här uppgifterna räcker inte för ett nytt samband. Pröva två bevis som handlar om samma tid, alibi eller tillträde.",
        );
      setSelected([]);
    }
  }
  function verdict() {
    if (
      accused === resolution.person &&
      motive === resolution.motive &&
      resolution.evidence.every((id) => evidence.includes(id))
    ) {
      patch({ solved: true, endPage: 0 });
      learn("Upplösning");
      setPanel(null);
      tone();
    } else
      setFeedback(
        "Din förklaring håller inte ihop ännu. Kontrollera vem som saknar ett bekräftat alibi vid 21.16, vilket hot offret utgjorde och vem som kände till klockan. Välj bevis för tillträdet, motivet och den hemliga detaljen. Du kan försöka igen eller återvända till anteckningarna.",
      );
  }
  function open(p: Panel) {
    setPanel(p);
    setNotice(null);
    setFeedback("");
    setLevel(0);
    if (p === "talk") {
      learn("Misstänkt", "Alibi");
      setResponse("");
    }
  }
  const countLibrary = s.found.filter(
    (id) => clues.find((c) => c.id === id)?.room === "library",
  ).length;
  return (
    <div className="game">
      <header>
        <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
          <span className="crest">B</span>
          <span>
            BLACKWOOD <small>SCHOOL · GRUNDAD 1896</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="saved" role="status">
            {saveError
              ? "Sparning saknas i denna webbläsare"
              : "Sparas på den här datorn"}
          </span>
          <button onClick={toggleSound}>
            {s.sound ? "Ljud: på" : "Ljud: av"}
          </button>
          {s.started && (
            <button onClick={() => open("restart")}>Börja om</button>
          )}
        </div>
      </header>
      {!s.started ? (
        <main className="start">
          <Scene exterior />
          <div className="start-shade" />
          <section className="title">
            <p className="eyebrow">ETT DETEKTIVÄVENTYR I TRE KAPITEL</p>
            <h1>
              Mordet på
              <br />
              <em>Blackwood School</em>
            </h1>
            <p>
              En låst dörr. Tre hemligheter.
              <br />
              En berättelse som inte stämmer.
            </p>
            <button
              className="primary"
              onClick={() => {
                patch({ started: true });
                learn("Deckare", "Misstänkt");
                setNotice({
                  title: "Ditt första fall",
                  text: "Du är elev på Blackwood och hjälper kommissarie Norén att ordna kvällens uppgifter. Ingen elev bevittnade brottet. Polisen har säkrat byggnaden och gett dig kopior av loggarna.",
                  detail:
                    "När ljuset återkom 21.20 hittades historieläraren Viktor Falk död i det låsta biblioteket. Undersök rummet, lyssna på tre misstänkta och pröva deras berättelser. Klicka på föremålens namnskyltar. Anteckningarna sparas automatiskt.",
                });
              }}
            >
              Öppna fallet <span>→</span>
            </button>
            <div className="start-meta">
              Årskurs 7 <span>•</span> Cirka 20–25 minuter <span>•</span> Ingen
              tidspress
            </div>
            <p className="fine">
              Ett fiktivt mordmysterium utan blod eller skräckeffekter.
              <br />
              Spela med mus eller Tab och Enter. Ljud är frivilligt.
            </p>
          </section>
        </main>
      ) : s.solved ? (
        <main className="ending">
          <p className="eyebrow">KAPITEL 3 · UPPLÖSNINGEN</p>
          {s.endPage < 4 ? (
            <>
              <div className="reveal-layout">
                <div className="portrait-large">
                  <Portrait person="elisabeth" />
                  <p>Elisabeth Berg</p>
                </div>
                <section>
                  <span className="time-big">{ending[s.endPage][0]}</span>
                  <h1>{ending[s.endPage][1]}</h1>
                  <p>{ending[s.endPage][2]}</p>
                  {s.endPage === 0 && (
                    <p className="quote">
                      ”Jag trodde att jag kunde styra berättelsen”, säger
                      Elisabeth. Kommissarie Norén ber henne följa med.
                    </p>
                  )}
                  <button
                    className="primary"
                    onClick={() => patch({ endPage: s.endPage + 1 })}
                  >
                    {s.endPage === 3
                      ? "Se hur deckaren var byggd"
                      : "Fortsätt berättelsen"}{" "}
                    →
                  </button>
                  <p className="fine">{s.endPage + 1} av 4 · Fallet är löst</p>
                </section>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">FALLET ÄR LÖST</p>
              <h1>Du läste mellan spåren.</h1>
              <p className="end-intro">
                En hemlighet gör någon misstänkt. Det är sambanden mellan
                bevisen som gör en lösning trovärdig.
              </p>
              <div className="structure">
                {[
                  ["Inledning", "Regn, skog och en gammal internatskola."],
                  ["Brott", "Viktor hittas i ett låst bibliotek."],
                  [
                    "Utredning",
                    "Du undersöker föremål, förhör och kontrollerar alibin.",
                  ],
                  [
                    "Avslöjande",
                    "Nyckelloggen, avtalet och Elisabeths ord hänger ihop.",
                  ],
                  [
                    "Upplösning",
                    "Brottet och de oskyldigas hemligheter förklaras.",
                  ],
                ].map(([title, text], i) => (
                  <article key={title}>
                    <b>0{i + 1}</b>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
              <div className="paper">
                <h3>Så byggdes spänningen</h3>
                <p>
                  Klockan väckte en fråga. Handsken riktade misstankarna mot
                  Daniel. Saras lögn ökade osäkerheten. Kontrollerade alibin och
                  nya samband ändrade bilden steg för steg. Klockan och handsken
                  blev villospår, medan nyckeln ledde vidare.
                </p>
              </div>
              <div className="concept-chips">
                {Object.keys(concepts).map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setNotice({ title: c, text: concepts[c as Concept] })
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="fine">
                Ta med till samtalet i klassen: Vilket bevis fick dig att ändra
                uppfattning?
              </p>
              <button onClick={() => open("book")}>
                Öppna dina anteckningar
              </button>{" "}
              <button onClick={() => open("restart")}>Spela igen</button>
            </>
          )}
        </main>
      ) : (
        <main>
          <div className="chapter-bar">
            <span className="eyebrow">KAPITEL {s.chapter} / 3</span>
            <h1>
              {s.chapter === 1
                ? "Brottet"
                : s.chapter === 2
                  ? "Utredningen"
                  : "Avslöjandet"}
            </h1>
            <span>
              {s.found.length}/8 bevis · {s.linked.length}/3 samband
            </span>
          </div>
          <div className="play-layout">
            <section className="location">
              <div className="scene" key={s.room}>
                <Scene room={s.room} />
                <div className="room-label">
                  <span>BLACKWOOD SCHOOL</span>
                  <h2>{rooms[s.room].name}</h2>
                </div>
                {clues
                  .filter((c) => c.room === s.room)
                  .map((c) => (
                    <button
                      key={c.id}
                      className={`hotspot ${s.found.includes(c.id) ? "found" : ""}`}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                      onClick={() => inspect(c.id)}
                    >
                      <span className="hotspot-dot" />
                      {c.name}
                      {s.found.includes(c.id) && (
                        <span className="check">✓</span>
                      )}
                    </button>
                  ))}
              </div>
              <div className="narration">
                <span className="eyebrow">DIN IAKTTAGELSE</span>
                <p>{rooms[s.room].description}</p>
              </div>
            </section>
            <aside className="sidebar">
              <p className="eyebrow">DETEKTIVENS UPPDRAG</p>
              <h2>
                {s.chapter === 1
                  ? "Läs brottsplatsen."
                  : "Pröva deras berättelser."}
              </h2>
              <p>
                {s.chapter === 1
                  ? "Undersök de fyra föremålen i biblioteket. Lita inte på den första förklaringen."
                  : "Samla bevis, förhör alla tre och koppla ihop uppgifter i anteckningsboken."}
              </p>
              <button className="tool" onClick={() => open("book")}>
                <span className="line-icon">▤</span> Anteckningsbok{" "}
                <span>→</span>
              </button>
              <button className="tool" onClick={() => open("talk")}>
                <span className="line-icon">◇</span> Förhör de misstänkta{" "}
                <span>→</span>
              </button>
              <div className="map">
                <p className="eyebrow">SKOLANS KARTA</p>
                {Object.entries(rooms).map(([id, r]) => (
                  <button
                    key={id}
                    aria-current={s.room === id ? "location" : undefined}
                    disabled={s.chapter === 1 && id !== "library"}
                    className={s.room === id ? "active" : ""}
                    onClick={() => {
                      patch({ room: id as Room });
                      tone();
                    }}
                  >
                    <span className="map-node" />
                    {r.name}
                  </button>
                ))}
              </div>
              <button className="help" onClick={() => open("hint")}>
                Behöver du en ledtråd?
              </button>
              {s.chapter === 1 ? (
                <button
                  className="primary"
                  disabled={countLibrary < 4}
                  onClick={() => {
                    patch({ chapter: 2 });
                    learn("Spänningsuppbyggnad");
                    setNotice({
                      title: "Kapitel 2 · Utredningen",
                      text: "Fyra föremål – men ännu ingen säker förklaring. Nu är korridoren och expeditionen tillgängliga. Alla tre misstänkta väntar på dina frågor.",
                      detail:
                        "Samla alla åtta bevis. I anteckningsboken kan du markera två ledtrådar och upptäcka ett samband. Sambanden öppnar nya frågor i förhören.",
                    });
                  }}
                >
                  Börja utredningen →
                </button>
              ) : (
                <button
                  className="primary"
                  disabled={!ready(s)}
                  onClick={() => {
                    patch({ chapter: 3 });
                    open("accuse");
                  }}
                >
                  Samla till avslöjandet →
                </button>
              )}
              {s.chapter > 1 && !ready(s) && (
                <p className="fine">
                  Kvar: {8 - s.found.length} bevis, {9 - s.asked.length}{" "}
                  grundfrågor, {3 - s.linked.length} samband,{" "}
                  {3 - s.confronted.length} konfrontationer.
                </p>
              )}
            </aside>
          </div>
          <footer>
            <span>
              ”Det viktigaste är inte vem du misstänker. Det är varför.”
            </span>
            <span>Kommissarie Norén</span>
          </footer>
        </main>
      )}
      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        className={panel === "book" ? "notebook" : ""}
      >
        <div className="modal-head">
          <span className="eyebrow">
            {notice
              ? "IAKTTAGELSE"
              : panel === "book"
                ? "DETEKTIVENS ANTECKNINGAR"
                : "BLACKWOOD · FALLET FALK"}
          </span>
          <button aria-label="Stäng" onClick={close}>
            Stäng ×
          </button>
        </div>
        {notice ? (
          <>
            <h2>{notice.title}</h2>
            <div className="paper">
              <p>{notice.text}</p>
            </div>
            {notice.detail && <p>{notice.detail}</p>}
            {notice.title === "Ditt första fall" && (
              <p className="concept">
                <b>Deckare:</b> {concepts.Deckare}
              </p>
            )}
            {clues.some((c) => c.name === notice.title) && (
              <p className="concept">
                <b>Ledtråd:</b> {concepts.Ledtråd}
              </p>
            )}
            <button className="primary" onClick={close}>
              Tillbaka till fallet →
            </button>
          </>
        ) : panel === "restart" ? (
          <>
            <h2>Öppna ett nytt fall?</h2>
            <p>
              Dina sparade framsteg för det här fallet ersätts. Du kan också
              fortsätta där du var.
            </p>
            <button
              className="primary"
              onClick={() => {
                rain.current?.stop();
                rain.current = null;
                setS({ ...initial });
                close();
                setResponse("");
                setEvidence([]);
                setMotive("");
              }}
            >
              Starta om spelet
            </button>{" "}
            <button onClick={close}>Fortsätt mitt fall</button>
          </>
        ) : panel === "hint" ? (
          <>
            <h2>En knuff i rätt riktning</h2>
            <p className="hint-level">Nivå {level + 1} av 3</p>
            <div className="paper">
              <p>{hint(s)[level]}</p>
            </div>
            <button disabled={level === 2} onClick={() => setLevel(level + 1)}>
              Visa tydligare hjälp
            </button>
          </>
        ) : panel === "talk" ? (
          <>
            <h2>Förhörsrummet</h2>
            <div className="person-tabs">
              {(Object.keys(people) as Person[]).map((id) => (
                <button
                  className={person === id ? "active" : ""}
                  key={id}
                  onClick={() => {
                    setPerson(id);
                    setResponse("");
                  }}
                >
                  {people[id].name}
                </button>
              ))}
            </div>
            <div className="interview">
              <div>
                <Portrait person={person} />
                <h3>{people[person].name}</h3>
                <p className="fine">{people[person].role}</p>
              </div>
              <div>
                <p className="quote">{response || people[person].intro}</p>
                {people[person].questions.map((q) => (
                  <button
                    className="question"
                    key={q.id}
                    onClick={() => ask(q.id)}
                  >
                    {s.asked.includes(`${person}:${q.id}`) ? "✓ " : ""}
                    {q.q}
                  </button>
                ))}
                {s.linked.includes(people[person].requires) && (
                  <button className="question new" onClick={confront}>
                    {s.confronted.includes(person) ? "✓ " : "NYTT BEVIS · "}
                    {people[person].confrontQ}
                  </button>
                )}
                <p className="concept">
                  <b>
                    {s.asked.includes(`${person}:motive`) ? "Motiv" : "Alibi"}:
                  </b>{" "}
                  {s.asked.includes(`${person}:motive`)
                    ? concepts.Motiv
                    : concepts.Alibi}
                </p>
                {s.confronted.includes(person) && (
                  <p className="concept">
                    <b>Villospår:</b> {concepts.Villospår}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : panel === "book" ? (
          <>
            <h2>Fallet Viktor Falk</h2>
            <nav className="book-tabs">
              {[
                "Misstänkta",
                "Ledtrådar",
                "Tidslinje",
                "Deckarens verktyg",
              ].map((t) => (
                <button
                  key={t}
                  className={book === t ? "active" : ""}
                  onClick={() => {
                    setBook(t);
                    setSelected([]);
                    setFeedback("");
                  }}
                >
                  {t}
                </button>
              ))}
            </nav>
            {book === "Ledtrådar" ? (
              <>
                <p>
                  Markera två ledtrådar som kan förklara varandra. Tre samband
                  går att upptäcka.
                </p>
                <div className="clue-grid">
                  {clues
                    .filter((c) => s.found.includes(c.id))
                    .map((c) => (
                      <button
                        className={`clue-card ${selected.includes(c.id) ? "selected" : ""}`}
                        aria-pressed={selected.includes(c.id)}
                        key={c.id}
                        onClick={() => link(c.id)}
                      >
                        <span className="eyebrow">{rooms[c.room].name}</span>
                        <h3>{c.name}</h3>
                        <p>{c.text}</p>
                      </button>
                    ))}
                </div>
                {s.found.length === 0 && (
                  <p>Undersök ett föremål för att samla ditt första bevis.</p>
                )}
                <p role="status" className="feedback">
                  {feedback}
                </p>
                {connections
                  .filter((c) => s.linked.includes(c.id))
                  .map((c) => (
                    <div key={c.id} className="connection">
                      <h3>{c.title}</h3>
                      <p>{c.text}</p>
                    </div>
                  ))}
              </>
            ) : book === "Misstänkta" ? (
              <div className="suspect-grid">
                {(Object.keys(people) as Person[]).map((id) => (
                  <article key={id}>
                    <Portrait person={id} />
                    <h3>{people[id].name}</h3>
                    <p>{people[id].role}</p>
                    {people[id].questions
                      .filter((q) => s.asked.includes(`${id}:${q.id}`))
                      .map((q) => (
                        <p key={q.id}>
                          <b>
                            {q.id === "alibi"
                              ? "Alibi"
                              : q.id === "motive"
                                ? "Möjligt motiv"
                                : "Bakgrund"}
                            :
                          </b>{" "}
                          {q.a}
                        </p>
                      ))}
                    {s.confronted.includes(id) && (
                      <p className="connection">{people[id].confront}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : book === "Tidslinje" ? (
              <div className="timeline">
                {clues
                  .filter((c) => s.found.includes(c.id) && "time" in c)
                  .sort((a, b) =>
                    ("time" in a ? a.time : "").localeCompare(
                      "time" in b ? b.time : "",
                    ),
                  )
                  .map((c) => (
                    <article key={c.id}>
                      <b>{"time" in c ? c.time : ""}</b>
                      <h3>{c.name}</h3>
                      <p>{c.text}</p>
                    </article>
                  ))}
                {s.linked.includes("time") && (
                  <article>
                    <b>Slutsats: cirka 21.16</b>
                    <p>
                      Viktor levde 21.15. Dunsen hördes 21.16. Klockans 21.17 är
                      inte en säker mordtid.
                    </p>
                  </article>
                )}
              </div>
            ) : (
              <>
                <p>Begreppen fylls på när du använder dem i ditt fall.</p>
                {s.tools.map((t) => (
                  <article className="definition" key={t}>
                    <h3>{t}</h3>
                    <p>{concepts[t]}</p>
                  </article>
                ))}
                <div className="paper">
                  Inledning → Brott → Utredning → Avslöjande → Upplösning
                </div>
              </>
            )}
          </>
        ) : panel === "accuse" ? (
          <>
            <h2>Din förklaring till mordet</h2>
            <p>
              Kommissarie Norén samlar alla i biblioteket. Regnet avtar. Nu
              behöver dina slutsatser hänga ihop.
            </p>
            <label>
              Vem begick mordet?
              <select
                value={accused}
                onChange={(e) => setAccused(e.target.value as Person)}
              >
                {Object.entries(people).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Vilket motiv stöds av utredningen?
              <select
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
              >
                <option value="">Välj motiv</option>
                <option value="repair">Dölja slarvet med elsystemet</option>
                <option value="sale">
                  Stoppa avslöjandet av en hemlig försäljning
                </option>
                <option value="credit">
                  Hämnas för ett saknat namn på manuskriptet
                </option>
              </select>
            </label>
            <fieldset>
              <legend>
                Välj bevis för tillträdet, motivet och den hemliga detaljen i
                förhöret
              </legend>
              {clues.map((c) => (
                <label className="evidence" key={c.id}>
                  <input
                    type="checkbox"
                    checked={evidence.includes(c.id)}
                    onChange={() =>
                      setEvidence(
                        evidence.includes(c.id)
                          ? evidence.filter((id) => id !== c.id)
                          : [...evidence, c.id],
                      )
                    }
                  />
                  {c.name}
                </label>
              ))}
            </fieldset>
            <button className="primary" onClick={verdict}>
              Presentera min lösning →
            </button>
            <p className="feedback" role="status">
              {feedback}
            </p>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
