/* ============================================================
   DER DÜMMSTE FLIEGT · Gamemaster-Logik
   - 3–12 Spieler, jeder mit 3 Herzen
   - Pro Runde: jeder lebende Spieler bekommt 2 Fragen (30s Timer)
   - Falsche Antworten kosten KEIN Herz direkt
   - Nach der Runde: VOTE über die Handys – wer die dümmste
     Antwort gegeben hat, verliert 1 Herz. 0 Herzen = raus.
   - Übrig 2 -> Finale: je 10 Fragen, mehr richtige gewinnt
   - Gleichstand -> Stechen (Sudden Death)
   ============================================================ */

const DF_KEY = "df_state_v2";
const QUESTION_SECONDS = 30;
const PLAYER_COLORS = [
  "#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040",
  "#2ee6d6", "#ff6ad5", "#9dff57", "#ff4a4a", "#57c8ff", "#ffe14a",
];

let state = null;
/* state = {
     mode: "round" | "vote" | "finale" | "stechen" | "done",
     players: [{name, hearts, out}],
     deck, deckPos, round,
     queue: [pIdx...], roundTotal, roundDone,
     marks: { pIdx: [true/false,...] },   // Antworten der laufenden Runde
     current: {p, qIdx, num, phase, wasCorrect, timeout} | null,
     votes: { voterIdx: forIdx },          // laufende Vote-Runde
     voteResult: {p, count} | null,
     finale: {a,b,scores:[..],asked:[..],turn,stechen,stechenScores}|null,
     winner: null,
     onlineCode: "ABC123",
   } */

let timerInterval = null;
let deadline = null;

function saveState() { try { localStorage.setItem(DF_KEY, JSON.stringify(state)); } catch (e) {} }
function loadState() { try { return JSON.parse(localStorage.getItem(DF_KEY)); } catch (e) { return null; } }
function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* ---------------- Fragen-Deck ---------------- */
function newDeck() {
  const idx = DF_QUESTIONS.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}
function drawQuestion() {
  if (state.deckPos >= state.deck.length) {
    state.deck = newDeck();
    state.deckPos = 0;
  }
  return state.deck[state.deckPos++];
}

/* ================= NETZWERK ================= */
let broadcastTimer = null;

function alivePlayers() {
  return state.players.map((p, i) => ({ p, i })).filter(({ p }) => !p.out);
}

function snapshot() {
  const cur = state.current;
  return {
    from: "gm", type: "state",
    s: {
      g: "df",
      status: state.mode === "done" ? "ended" : "playing",
      mode: state.mode,
      players: state.players.map((p) => [p.name, p.hearts, p.out ? 1 : 0]),
      round: state.round,
      roundDone: state.roundDone,
      roundTotal: state.roundTotal,
      marks: state.marks,
      q: cur
        ? {
            p: cur.p,
            num: cur.num,
            phase: cur.phase,
            ok: cur.wasCorrect,
            to: cur.timeout ? 1 : 0,
            text: DF_QUESTIONS[cur.qIdx].q,
            ans: cur.phase === "resolved" ? DF_QUESTIONS[cur.qIdx].a : null,
            fin: state.mode === "finale"
              ? { no: state.finale.idx + 1 }
              : null,
            secs: QUESTION_SECONDS,
          }
        : null,
      vote: state.mode === "vote"
        ? {
            counts: state.players.map((_, i) =>
              Object.values(state.votes).filter((f) => f === i).length
            ),
            voters: Object.keys(state.votes).map(Number),
            eligible: alivePlayers().map(({ i }) => i),
            result: state.voteResult,
          }
        : null,
      fin: state.finale
        ? {
            a: state.finale.a,
            b: state.finale.b,
            st: state.finale.stechen ? 1 : 0,
            scores: state.mode === "done" ? state.finale.scores : null,
            reveal: state.mode === "done" ? finaleReveal() : null,
          }
        : null,
      win: state.winner,
    },
  };
}

function scheduleBroadcast() {
  if (!state || !state.onlineCode) return;
  if (broadcastTimer) return;
  broadcastTimer = setTimeout(() => {
    broadcastTimer = null;
    netPublish(state.onlineCode, snapshot());
  }, 350);
}

function onNetMessage(msg) {
  if (!msg || msg.from !== "p" || !state) return;

  if (msg.type === "hello") { scheduleBroadcast(); return; }

  if (
    msg.type === "joined" &&
    typeof msg.me === "number" &&
    state.players[msg.me] &&
    !(state.joined = state.joined || []).includes(msg.me)
  ) {
    state.joined.push(msg.me);
    soundBuzz();
    saveState();
    renderAll();
    return;
  }

  if (
    msg.type === "vote" &&
    state.mode === "vote" &&
    !state.voteResult &&
    msg.r === state.round &&
    typeof msg.voter === "number" && typeof msg.for === "number" &&
    msg.voter !== msg.for &&
    state.players[msg.voter] && !state.players[msg.voter].out &&
    state.players[msg.for] && !state.players[msg.for].out
  ) {
    const isNew = !(msg.voter in state.votes);
    state.votes[msg.voter] = msg.for;
    if (isNew) soundBuzz();
    saveState();
    renderAll();
  }
}

/* ================= SETUP ================= */
let setupNames = [];

document.getElementById("roleGmBtn").addEventListener("click", () => showView("setup"));
document.getElementById("backToRoleBtn").addEventListener("click", () => showView("role"));

const nameInput = document.getElementById("nameInput");
document.getElementById("addBtn").addEventListener("click", addName);
nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addName(); });

function addName() {
  const errEl = document.getElementById("setupError");
  errEl.textContent = "";
  const v = nameInput.value.trim();
  if (!v) return;
  if (setupNames.length >= 12) { errEl.textContent = "Maximal 12 Spieler."; return; }
  if (setupNames.some((n) => n.toLowerCase() === v.toLowerCase())) {
    errEl.textContent = "Name schon vergeben.";
    return;
  }
  setupNames.push(v);
  nameInput.value = "";
  nameInput.focus();
  renderNameList();
}

function renderNameList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  setupNames.forEach((n, i) => {
    const tag = document.createElement("span");
    tag.className = "df-name-tag";
    tag.innerHTML = escapeHtml(n) + '<button data-i="' + i + '">×</button>';
    tag.querySelector("button").addEventListener("click", () => {
      setupNames.splice(i, 1);
      renderNameList();
    });
    list.appendChild(tag);
  });
}

document.getElementById("startBtn").addEventListener("click", () => {
  const errEl = document.getElementById("setupError");
  if (setupNames.length < 3) {
    errEl.textContent = "Mindestens 3 Spieler nötig.";
    return;
  }
  state = {
    mode: "lobby",
    players: setupNames.map((n) => ({ name: n, hearts: 3, out: false })),
    deck: newDeck(),
    deckPos: 0,
    round: 0,
    queue: [],
    roundTotal: 0,
    roundDone: 0,
    marks: {},
    current: null,
    votes: {},
    voteResult: null,
    finale: null,
    winner: null,
    joined: [],
    onlineCode: makeGameCode(),
  };
  connectNet();
  saveState();
  renderAll();
});

function connectNet() {
  if (state && state.onlineCode) {
    netSubscribe(state.onlineCode, onNetMessage, scheduleBroadcast);
  }
}

/* ================= RUNDEN ================= */
function startNewRound() {
  state.mode = "round";
  state.round++;
  const alive = alivePlayers().map(({ i }) => i);
  state.queue = [...alive, ...alive]; // zwei Durchgänge
  state.roundTotal = state.queue.length;
  state.roundDone = 0;
  state.marks = {};
  alive.forEach((i) => (state.marks[i] = []));
  state.votes = {};
  state.voteResult = null;
  nextQuestion();
}

function nextQuestion() {
  if (state.queue.length === 0) { startVotePhase(); return; }
  const p = state.queue.shift();
  state.roundDone++;
  state.current = {
    p,
    qIdx: drawQuestion(),
    num: state.round + "-" + state.roundDone + "-" + Date.now() % 100000,
    phase: "question",
    wasCorrect: null,
    timeout: false,
  };
  startTimer();
  saveState();
  renderAll();
}

/* ================= TIMER ================= */
function startTimer() {
  stopTimer();
  deadline = Date.now() + QUESTION_SECONDS * 1000;
  timerInterval = setInterval(tickTimer, 250);
}
function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  deadline = null;
}
function secondsLeft() {
  if (!deadline) return null;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}
function tickTimer() {
  const el = document.getElementById("dfTimer");
  const s = secondsLeft();
  if (el && s !== null) {
    el.textContent = s;
    el.classList.toggle("low", s <= 10);
  }
  if (s === 0) {
    /* Zeit abgelaufen -> zählt als falsch */
    if (state.current && state.current.phase === "question") {
      state.current.timeout = true;
      markAnswer(false);
    } else {
      stopTimer();
    }
  }
}

/* ================= WERTUNG ================= */
function markAnswer(correct) {
  stopTimer();
  const cur = state.current;

  /* Finale & Stechen: Ergebnis bleibt geheim – neutraler Klick, sofort weiter */
  if (state.mode === "finale") { soundClick(); finaleRecord(correct); return; }
  if (state.mode === "stechen") { soundClick(); stechenRecord(correct); return; }

  cur.wasCorrect = correct;
  cur.phase = "resolved";

  /* Antwort-Verlauf für die Vote-Entscheidung merken (nur Hauptrunden) */
  if (state.mode === "round") {
    if (!state.marks[cur.p]) state.marks[cur.p] = [];
    state.marks[cur.p].push(correct);
  }

  if (correct) { soundCorrect(); flashPanel("flash-good"); }
  else { soundWrong(); flashPanel("flash-bad"); }

  saveState();
  renderAll();
}

function continueAfterResolve() {
  state.current = null;
  nextQuestion();
}

/* ================= VOTE-PHASE ================= */
function startVotePhase() {
  state.mode = "vote";
  state.current = null;
  state.votes = {};
  state.voteResult = null;
  stopTimer();
  saveState();
  renderAll();
  soundFanfare();
}

function endVoting() {
  const counts = state.players.map((_, i) =>
    Object.values(state.votes).filter((f) => f === i).length
  );
  const max = Math.max(...counts);
  if (max === 0) {
    /* niemand hat gevotet -> GM wählt manuell */
    renderVotePanel(true, alivePlayers().map(({ i }) => i));
    return;
  }
  const top = counts.map((c, i) => ({ c, i })).filter((x) => x.c === max && !state.players[x.i].out).map((x) => x.i);
  if (top.length > 1) {
    /* Gleichstand -> GM entscheidet unter den Führenden */
    renderVotePanel(true, top);
    return;
  }
  applyVoteResult(top[0], max);
}

function applyVoteResult(pIdx, count) {
  state.voteResult = { p: pIdx, count };
  state.players[pIdx].hearts--;
  const eliminated = state.players[pIdx].hearts <= 0;
  if (eliminated) state.players[pIdx].out = true;
  soundWrong();
  saveState();
  renderAll();
}

function continueAfterVote() {
  const res = state.voteResult;
  state.voteResult = null;
  state.votes = {};
  const wasElim = state.players[res.p].out;

  const proceed = () => {
    if (alivePlayers().length <= 2) startFinaleIntro();
    else { state.mode = "round"; startNewRound(); }
  };

  if (wasElim) {
    document.getElementById("elimName").textContent = state.players[res.p].name;
    document.getElementById("elimOverlay").classList.remove("hidden");
    document.getElementById("elimContinueBtn").onclick = () => {
      document.getElementById("elimOverlay").classList.add("hidden");
      proceed();
    };
  } else {
    proceed();
  }
}

/* ================= FINALE =================
   Beide Finalisten bekommen exakt DIESELBEN 10 Fragen.
   Es beginnt, wer mehr Herzen übrig hat (Gleichstand: Los).
   Der andere verlässt den Raum. Ergebnisse bleiben geheim:
   keine Sounds, keine Antwort-Anzeige, kein Zwischenstand –
   erst am Ende wird alles aufgedeckt.                        */

function finaleOrder() {
  const f = state.finale;
  return [f.first, f.first === f.a ? f.b : f.a];
}
function currentFinalist() {
  const f = state.finale;
  return f.stechen ? finaleOrder()[f.stechenStage] : finaleOrder()[f.stage];
}

/* Baut die Aufdeckung der 10 Finalfragen: pro Frage, wer (A/B) richtig lag.
   results[0] gehört finaleOrder()[0], results[1] gehört finaleOrder()[1]. */
function finaleReveal() {
  const f = state.finale;
  if (!f || !f.qs) return null;
  const order = finaleOrder();
  const resFor = {};
  resFor[order[0]] = f.results[0] || [];
  resFor[order[1]] = f.results[1] || [];
  const ra = resFor[f.a] || [];
  const rb = resFor[f.b] || [];
  return f.qs.map((qi, k) => ({
    q: DF_QUESTIONS[qi].q,
    a: DF_QUESTIONS[qi].a,
    ra: !!ra[k],
    rb: !!rb[k],
  }));
}

function startFinaleIntro() {
  const alive = alivePlayers();
  const a = alive[0].i, b = alive[1].i;

  /* Startspieler: mehr Herzen; bei Gleichstand wird ausgelost */
  const ha = state.players[a].hearts, hb = state.players[b].hearts;
  let first, drawn = false;
  if (ha > hb) first = a;
  else if (hb > ha) first = b;
  else { first = Math.random() < 0.5 ? a : b; drawn = true; }

  /* Die 10 gemeinsamen Fragen jetzt ziehen */
  const qs = [];
  for (let k = 0; k < 10; k++) qs.push(drawQuestion());

  state.mode = "finale";
  state.finale = {
    a, b, first, drawn, qs,
    stage: 0,          /* 0 = erster Finalist, 1 = zweiter */
    idx: 0,            /* Frage 0..9 innerhalb des Durchgangs */
    results: [[], []], /* geheim, pro Durchgang */
    scores: null,
    pending: null,     /* "switch" | "st-intro" | "st-mid" | "st-next" */
    stechen: false,
    stechenQ: null,
    stechenStage: 0,
    stechenRes: [null, null],
  };
  state.current = null;
  saveState();
  renderAll();

  const second = first === a ? b : a;
  document.getElementById("finaleNames").textContent =
    state.players[a].name + "  vs.  " + state.players[b].name;
  document.getElementById("finaleSubText").innerHTML =
    "Beide bekommen die <b>gleichen 10 Fragen</b> – die Ergebnisse bleiben bis zum Schluss geheim!<br><br>" +
    "<b>" + escapeHtml(state.players[first].name) + "</b> beginnt " +
    (drawn ? "(per Los entschieden)" : "(mehr Herzen übrig)") + ".<br>" +
    "👉 <b>" + escapeHtml(state.players[second].name) + "</b> verlässt so lange den Raum!";
  document.getElementById("finaleIntro").classList.remove("hidden");
  soundFanfare();
}
document.getElementById("finaleStartBtn").addEventListener("click", () => {
  document.getElementById("finaleIntro").classList.add("hidden");
  finaleAskNext();
});

function finaleAskNext() {
  const f = state.finale;
  f.pending = null;
  state.current = {
    p: currentFinalist(),
    qIdx: f.qs[f.idx],
    num: "F" + f.stage + "-" + f.idx + "-" + Date.now() % 100000,
    phase: "question", wasCorrect: null, timeout: false,
  };
  startTimer();
  saveState();
  renderAll();
}

function finaleRecord(correct) {
  const f = state.finale;
  f.results[f.stage].push(correct);
  f.idx++;
  state.current = null;

  if (f.idx >= 10) {
    if (f.stage === 0) {
      /* Erster Durchgang fertig -> Wechsel-Bildschirm */
      f.stage = 1;
      f.idx = 0;
      f.pending = "switch";
      saveState();
      renderAll();
    } else {
      finishFinale();
    }
  } else {
    finaleAskNext();
  }
}

function finishFinale() {
  const f = state.finale;
  const order = finaleOrder();
  const s0 = f.results[0].filter(Boolean).length;
  const s1 = f.results[1].filter(Boolean).length;
  /* scores in [a, b]-Reihenfolge ablegen */
  f.scores = [0, 0];
  f.scores[order[0] === f.a ? 0 : 1] = s0;
  f.scores[order[1] === f.a ? 0 : 1] = s1;

  if (s0 > s1) return crownWinner(order[0]);
  if (s1 > s0) return crownWinner(order[1]);

  /* Gleichstand -> Stechen mit gleicher Frage für beide */
  state.mode = "stechen";
  f.stechen = true;
  f.stechenStage = 0;
  f.stechenRes = [null, null];
  f.stechenQ = drawQuestion();
  f.pending = "st-intro";
  saveState();
  renderAll();
  soundFanfare();
}

/* ================= STECHEN =================
   Gleiche Frage für beide, nacheinander (Raum-Prinzip wie im
   Finale). Einer richtig + einer falsch = entschieden, sonst
   nächste Frage.                                             */

function stechenAsk() {
  const f = state.finale;
  f.pending = null;
  state.current = {
    p: currentFinalist(),
    qIdx: f.stechenQ,
    num: "S" + f.stechenStage + "-" + Date.now() % 100000,
    phase: "question", wasCorrect: null, timeout: false,
  };
  startTimer();
  saveState();
  renderAll();
}

function stechenRecord(correct) {
  const f = state.finale;
  f.stechenRes[f.stechenStage] = correct;
  state.current = null;

  if (f.stechenStage === 0) {
    f.stechenStage = 1;
    f.pending = "st-mid";
    saveState();
    renderAll();
    return;
  }

  /* Beide haben geantwortet -> vergleichen */
  const order = finaleOrder();
  const r = f.stechenRes;
  if (r[0] && !r[1]) return crownWinner(order[0]);
  if (r[1] && !r[0]) return crownWinner(order[1]);

  /* beide richtig oder beide falsch -> neue Frage */
  f.stechenQ = drawQuestion();
  f.stechenStage = 0;
  f.stechenRes = [null, null];
  f.pending = "st-next";
  saveState();
  renderAll();
}

/* Weiter-Knopf der Zwischen-Bildschirme (Wechsel / Stechen) */
function finalePendingContinue() {
  const f = state.finale;
  const p = f.pending;
  if (p === "switch") { finaleAskNext(); return; }
  if (p === "st-intro" || p === "st-mid" || p === "st-next") { stechenAsk(); return; }
}

/* ================= SIEGER ================= */
function crownWinner(pIdx) {
  stopTimer();
  state.mode = "done";
  state.winner = pIdx;
  state.current = null;
  saveState();
  renderAll();
  const f = state.finale;
  document.getElementById("winnerName").textContent = state.players[pIdx].name;
  document.getElementById("winnerScore").textContent =
    "Finale: " + state.players[f.a].name + " " + f.scores[0] + " : " + f.scores[1] + " " + state.players[f.b].name +
    (f.stechen ? " · entschieden im Stechen!" : "");
  document.getElementById("winnerOverlay").classList.remove("hidden");
  soundFanfare();
}
document.getElementById("newGameBtn").addEventListener("click", resetGame);
document.getElementById("revealBtn").addEventListener("click", () => {
  document.getElementById("winnerOverlay").classList.add("hidden");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Wirklich das ganze Spiel zurücksetzen?")) resetGame();
});
function resetGame() {
  stopTimer();
  if (state && state.onlineCode) {
    netPublish(state.onlineCode, { from: "gm", type: "state", s: { g: "df", status: "reset" } });
  }
  localStorage.removeItem(DF_KEY);
  state = null;
  setupNames = [];
  ["winnerOverlay", "elimOverlay", "finaleIntro"].forEach((id) =>
    document.getElementById(id).classList.add("hidden")
  );
  renderNameList();
  showView("role");
}

/* ================= RENDERING ================= */
function showView(which) {
  ["roleView", "setupView", "gameView"].forEach((id) =>
    document.getElementById(id).classList.toggle("hidden", id !== which + "View")
  );
}

function renderAll() {
  if (!state) { showView("role"); return; }
  showView("game");
  renderStatusbar();
  renderQPanel();
  renderGrid();
  scheduleBroadcast();
}

function renderStatusbar() {
  const roundChip = document.getElementById("roundChip");
  const qChip = document.getElementById("qCountChip");
  const codeChip = document.getElementById("codeChip");
  codeChip.textContent = "CODE: " + state.onlineCode;

  if (state.mode === "lobby") {
    roundChip.textContent = "📱 LOBBY";
    qChip.textContent = (state.joined || []).length + "/" + state.players.length + " DRIN";
  } else if (state.mode === "round") {
    roundChip.textContent = "RUNDE " + state.round;
    qChip.textContent = "FRAGE " + state.roundDone + "/" + state.roundTotal;
  } else if (state.mode === "vote") {
    roundChip.textContent = "🗳️ VOTING · RUNDE " + state.round;
    qChip.textContent = Object.keys(state.votes).length + " STIMMEN";
  } else if (state.mode === "finale") {
    const f = state.finale;
    roundChip.textContent = "🏆 FINALE";
    qChip.textContent = "DURCHGANG " + (f.stage + 1) + "/2 · FRAGE " + Math.min(f.idx + 1, 10) + "/10";
  } else if (state.mode === "stechen") {
    roundChip.textContent = "⚔️ STECHEN";
    qChip.textContent = "SUDDEN DEATH";
  } else {
    roundChip.textContent = "🏁 VORBEI";
    qChip.textContent = "";
  }
}

function renderQPanel() {
  const panel = document.getElementById("qPanel");

  if (state.mode === "lobby") {
    panel.classList.remove("hidden");
    const joinedCount = state.joined.length;
    panel.innerHTML =
      '<div class="df-vote-title">📱 LOBBY – JETZT BEITRETEN</div>' +
      '<div class="df-lobby-code">' + escapeHtml(state.onlineCode) + "</div>" +
      '<div class="df-sub" style="margin-bottom:18px;">Alle öffnen <b>df-handy.html</b>, geben den Code ein und wählen ihren Namen.<br>' +
      joinedCount + " von " + state.players.length + " Spielern sind drin.</div>" +
      '<div class="df-q-controls"><button class="df-btn red big" id="lobbyStartBtn" style="max-width:380px;">▶ SPIEL STARTEN</button></div>';
    document.getElementById("lobbyStartBtn").addEventListener("click", () => {
      startNewRound();
    });
    return;
  }

  if (state.mode === "vote") { renderVotePanel(false); return; }

  if (state.mode === "done") { renderFinaleReveal(); return; }

  /* Finale/Stechen: Zwischen-Bildschirme (Spielerwechsel etc.) */
  if ((state.mode === "finale" || state.mode === "stechen") && !state.current && state.finale && state.finale.pending) {
    panel.classList.remove("hidden");
    const f = state.finale;
    const order = finaleOrder();
    const n1 = escapeHtml(state.players[order[0]].name);
    const n2 = escapeHtml(state.players[order[1]].name);
    let title = "", sub = "";
    if (f.pending === "switch") {
      title = "🔄 SPIELERWECHSEL";
      sub = n1 + " ist fertig!<br>👉 Jetzt <b>" + n2 + "</b> reinholen – es warten die <b>gleichen 10 Fragen</b>.<br>(" + n1 + " darf zuschauen, aber nichts verraten!)";
    } else if (f.pending === "st-intro") {
      title = "⚔️ GLEICHSTAND – STECHEN!";
      sub = "Beide haben gleich viele Fragen richtig!<br>Jetzt gibt's die <b>gleiche Frage für beide</b>, nacheinander.<br>👉 <b>" + n2 + "</b> verlässt wieder den Raum, <b>" + n1 + "</b> beginnt.";
    } else if (f.pending === "st-mid") {
      title = "🔄 SPIELERWECHSEL";
      sub = "👉 Jetzt <b>" + n2 + "</b> reinholen – gleiche Frage!";
    } else if (f.pending === "st-next") {
      title = "⚔️ KEINE ENTSCHEIDUNG";
      sub = "Beide gleich – nächste Frage!<br>👉 <b>" + n2 + "</b> geht wieder raus, <b>" + n1 + "</b> beginnt.";
    }
    panel.innerHTML =
      '<div class="df-vote-title">' + title + "</div>" +
      '<div class="df-sub" style="margin-bottom:18px; font-size:0.95rem;">' + sub + "</div>" +
      '<div class="df-q-controls"><button class="df-btn red big" id="pendingBtn" style="max-width:380px;">WEITER →</button></div>';
    document.getElementById("pendingBtn").addEventListener("click", finalePendingContinue);
    return;
  }

  const cur = state.current;
  if (!cur) { panel.classList.add("hidden"); panel.innerHTML = ""; return; }
  panel.classList.remove("hidden");

  const qa = DF_QUESTIONS[cur.qIdx];
  const player = state.players[cur.p];
  const color = PLAYER_COLORS[cur.p % PLAYER_COLORS.length];

  let head = "FRAGE FÜR " + escapeHtml(player.name).toUpperCase();
  if (state.mode === "finale") {
    head = "FINALE · FRAGE " + (state.finale.idx + 1) + "/10 FÜR " + escapeHtml(player.name).toUpperCase();
  }
  if (state.mode === "stechen") {
    head = "⚔️ STECHEN · " + escapeHtml(player.name).toUpperCase();
  }

  if (cur.phase === "question") {
    panel.innerHTML =
      '<div class="df-timer" id="dfTimer">' + (secondsLeft() ?? QUESTION_SECONDS) + "</div>" +
      '<div class="df-q-for" style="--pc:' + color + '">' + head + "</div>" +
      '<div class="df-q-text">' + escapeHtml(qa.q) + "</div>" +
      '<div class="df-q-controls">' +
        '<button class="df-btn green" id="okBtn">✓ RICHTIG</button>' +
        '<button class="df-btn red" id="badBtn">✗ FALSCH</button>' +
        '<button class="df-btn cyan" id="peekBtn">👁 ANTWORT (HALTEN)</button>' +
      "</div>" +
      '<div class="df-peek-zone" id="peekZone"></div>';
    document.getElementById("okBtn").addEventListener("click", () => markAnswer(true));
    document.getElementById("badBtn").addEventListener("click", () => markAnswer(false));
    setupPeek(qa.a);
  } else {
    const good = cur.wasCorrect;
    panel.innerHTML =
      '<div class="df-q-for" style="--pc:' + color + '">' + head + "</div>" +
      '<div class="df-q-text" style="opacity:0.7; font-size:1rem;">' + escapeHtml(qa.q) + "</div>" +
      '<div class="df-resolved-answer">' + escapeHtml(qa.a) + "</div>" +
      '<div class="df-result-line ' + (good ? "good" : "bad") + '">' +
        (good
          ? "✓ " + escapeHtml(player.name) + " liegt richtig!"
          : (cur.timeout ? "⏰ Zeit abgelaufen! " : "✗ Falsch! ") + escapeHtml(player.name) + " – das merken wir uns fürs Voting…") +
      "</div>" +
      '<div class="df-q-controls"><button class="df-btn red" id="nextBtn">WEITER →</button></div>';
    document.getElementById("nextBtn").addEventListener("click", continueAfterResolve);
  }
}

/* Aufdeckung nach dem Finale: alle 10 Fragen + wer richtig/falsch lag */
function renderFinaleReveal() {
  const panel = document.getElementById("qPanel");
  panel.classList.remove("hidden");
  const f = state.finale;
  const rev = finaleReveal();
  if (!f || !rev) { panel.classList.add("hidden"); panel.innerHTML = ""; return; }

  const nameA = escapeHtml(state.players[f.a].name);
  const nameB = escapeHtml(state.players[f.b].name);
  const colA = PLAYER_COLORS[f.a % PLAYER_COLORS.length];
  const colB = PLAYER_COLORS[f.b % PLAYER_COLORS.length];
  const scoreA = f.scores ? f.scores[0] : rev.filter((r) => r.ra).length;
  const scoreB = f.scores ? f.scores[1] : rev.filter((r) => r.rb).length;

  const mark = (ok) =>
    '<span class="df-rev-mark ' + (ok ? "good" : "bad") + '">' + (ok ? "✓" : "✗") + "</span>";

  let rows = rev.map((r, k) =>
    '<div class="df-rev-row">' +
      '<span class="df-rev-no">' + (k + 1) + "</span>" +
      '<div class="df-rev-qa">' +
        '<div class="df-rev-q">' + escapeHtml(r.q) + "</div>" +
        '<div class="df-rev-a">→ ' + escapeHtml(r.a) + "</div>" +
      "</div>" +
      '<span class="df-rev-cell">' + mark(r.ra) + "</span>" +
      '<span class="df-rev-cell">' + mark(r.rb) + "</span>" +
    "</div>"
  ).join("");

  panel.innerHTML =
    '<div class="df-vote-title">📋 DIE 10 FINALE-FRAGEN AUFGEDECKT</div>' +
    '<div class="df-rev-head">' +
      '<span class="df-rev-no"></span>' +
      '<span class="df-rev-qa-head">Frage</span>' +
      '<span class="df-rev-cell" style="--pc:' + colA + '">' + nameA + "<br>" + scoreA + "/10</span>" +
      '<span class="df-rev-cell" style="--pc:' + colB + '">' + nameB + "<br>" + scoreB + "/10</span>" +
    "</div>" +
    '<div class="df-rev-list">' + rows + "</div>" +
    '<div class="df-q-controls"><button class="df-btn red" id="revealNewGameBtn">🔁 NEUES SPIEL</button></div>';
  const btn = document.getElementById("revealNewGameBtn");
  if (btn) btn.addEventListener("click", resetGame);
}

/* Vote-Panel: Live-Balken, Abstimmungsstand, Beenden / Tiebreak */
function renderVotePanel(tiebreak, tieCandidates) {
  const panel = document.getElementById("qPanel");
  panel.classList.remove("hidden");

  const alive = alivePlayers();
  const counts = state.players.map((_, i) =>
    Object.values(state.votes).filter((f) => f === i).length
  );
  const totalVotes = Object.keys(state.votes).length;
  const maxCount = Math.max(1, ...counts);

  /* Ergebnis-Ansicht nach Herz-Abzug */
  if (state.voteResult) {
    const r = state.voteResult;
    const p = state.players[r.p];
    panel.innerHTML =
      '<div class="df-vote-title">🗳️ DAS VOTING IST ENTSCHIEDEN</div>' +
      '<div class="df-resolved-answer" style="color:var(--pink); background:rgba(255,46,99,0.1); border-color:rgba(255,46,99,0.45);">' +
        escapeHtml(p.name) + " verliert ein Herz! (" + r.count + " Stimmen · " + Math.max(0, p.hearts) + " ❤ übrig)" +
      "</div>" +
      '<div class="df-q-controls"><button class="df-btn red" id="voteContinueBtn">WEITER →</button></div>';
    document.getElementById("voteContinueBtn").addEventListener("click", continueAfterVote);
    return;
  }

  /* Tiebreak / manuelle Wahl durch den GM */
  if (tiebreak) {
    const candidates = tieCandidates || alive.map(({ i }) => i);
    let btns = candidates
      .map((i) =>
        '<button class="df-btn" style="background:linear-gradient(180deg,#1e3f86,#0d1d44); border:2px solid ' +
        PLAYER_COLORS[i % PLAYER_COLORS.length] + ';" data-i="' + i + '">' +
        escapeHtml(state.players[i].name) + " (" + counts[i] + ")</button>"
      ).join("");
    panel.innerHTML =
      '<div class="df-vote-title">⚖️ ' + (Math.max(...counts) === 0 ? "KEINE STIMMEN – DU ENTSCHEIDEST" : "GLEICHSTAND – DU ENTSCHEIDEST") + "</div>" +
      '<div class="df-q-controls" style="flex-wrap:wrap;">' + btns + "</div>";
    panel.querySelectorAll("[data-i]").forEach((btn) =>
      btn.addEventListener("click", () => applyVoteResult(+btn.dataset.i, counts[+btn.dataset.i]))
    );
    return;
  }

  /* Live-Voting – klar strukturierte Kandidatenliste */
  const leadCount = Math.max(...counts);
  let bars = "";
  alive.forEach(({ p, i }) => {
    const c = counts[i];
    const w = Math.round((c / maxCount) * 100);
    const marks = (state.marks[i] || [])
      .map((ok) => '<span class="df-mark ' + (ok ? "good" : "bad") + '">' + (ok ? "✓" : "✗") + "</span>")
      .join("") || '<span class="df-vote-nomark">–</span>';
    const leading = c > 0 && c === leadCount ? " leading" : "";
    bars +=
      '<div class="df-vote-row' + leading + '" style="--pc:' + PLAYER_COLORS[i % PLAYER_COLORS.length] + '">' +
        '<div class="df-vote-info">' +
          '<span class="df-vote-name">' + escapeHtml(p.name) + "</span>" +
          '<span class="df-vote-marks">' + marks + "</span>" +
        "</div>" +
        '<div class="df-vote-bar"><div class="df-vote-fill" style="width:' + w + '%"></div></div>' +
        '<span class="df-vote-count">' + c + "</span>" +
      "</div>";
  });

  const allIn = totalVotes >= alive.length;
  panel.innerHTML =
    '<div class="df-vote-title">🗳️ WER HAT DIE DÜMMSTE ANTWORT GEGEBEN?</div>' +
    '<div class="df-vote-progress">' +
      '<div class="df-vote-progress-bar"><div class="df-vote-progress-fill" style="width:' +
        Math.round((totalVotes / Math.max(1, alive.length)) * 100) + '%"></div></div>' +
      '<span class="df-vote-progress-label">' + totalVotes + " / " + alive.length + " Stimmen" +
        (allIn ? " ✓ alle drin" : " abgegeben") + "</span>" +
    "</div>" +
    '<div class="df-vote-hint">✓/✗ = Antworten dieser Runde · Balken = erhaltene Stimmen</div>' +
    '<div class="df-vote-list">' + bars + "</div>" +
    '<div class="df-q-controls"><button class="df-btn red" id="endVoteBtn">VOTING BEENDEN → HERZ ABZIEHEN</button></div>';
  document.getElementById("endVoteBtn").addEventListener("click", endVoting);
}

function setupPeek(answer) {
  const btn = document.getElementById("peekBtn");
  const zone = document.getElementById("peekZone");
  const show = (e) => { e.preventDefault(); zone.innerHTML = '<div class="df-peek-answer">' + escapeHtml(answer) + "</div>"; };
  const hide = () => { zone.innerHTML = ""; };
  btn.addEventListener("mousedown", show);
  btn.addEventListener("touchstart", show, { passive: false });
  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((ev) => btn.addEventListener(ev, hide));
}

function flashPanel(cls) {
  const panel = document.getElementById("qPanel");
  panel.classList.remove("flash-good", "flash-bad");
  void panel.offsetWidth;
  panel.classList.add(cls);
  setTimeout(() => panel.classList.remove(cls), 800);
}

function renderGrid() {
  const grid = document.getElementById("playerGrid");
  grid.innerHTML = "";

  const inFinale = ["finale", "stechen", "done"].includes(state.mode);
  const f = state.finale;

  state.players.forEach((p, i) => {
    if (inFinale && f && i !== f.a && i !== f.b) return;

    const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
    const tile = document.createElement("div");
    const isActive = state.current && state.current.p === i;
    tile.className = "df-tile" + (p.out && !inFinale ? " out" : "") + (isActive ? " active" : "");
    tile.style.setProperty("--pc", color);

    let hearts = "";
    for (let h = 0; h < 3; h++) {
      hearts += '<span class="df-heart' + (h < p.hearts ? "" : " lost") + '">❤️</span>';
    }

    const joinedDot = (state.joined || []).includes(i)
      ? '<span class="df-joined-dot" title="verbunden"></span>'
      : "";

    let finaleScore = "";
    if (state.mode === "done" && f && f.scores) {
      const side = i === f.a ? 0 : 1;
      finaleScore = '<span class="df-finale-score">' + f.scores[side] + "/10</span>";
    }

    /* ✓/✗-Marker der laufenden Runde unter dem Avatar */
    let marks = "";
    if (state.mode === "round" || state.mode === "vote") {
      marks =
        '<div class="df-tile-marks">' +
        (state.marks[i] || [])
          .map((ok) => '<span class="df-mark ' + (ok ? "good" : "bad") + '">' + (ok ? "✓" : "✗") + "</span>")
          .join("") +
        "</div>";
    }

    const initials = p.name.trim().slice(0, 2).toUpperCase();
    tile.innerHTML =
      finaleScore +
      joinedDot +
      '<div class="df-hearts">' + hearts + "</div>" +
      '<div class="df-avatar">' + escapeHtml(initials) + "</div>" +
      marks +
      '<div class="df-nameplate">' + escapeHtml(p.name) + "</div>";
    grid.appendChild(tile);
  });
}

/* ================= START ================= */
state = loadState();
if (state && state.mode === "done") state = null;
if (state) {
  connectNet();
  /* laufender Timer geht bei Reload verloren -> Frage neu takten */
  if (state.current && state.current.phase === "question") startTimer();
  renderAll();
} else {
  showView("role");
}
