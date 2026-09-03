/* ============================================================
   Spiellogik (Gamemaster-Gerät)
   Lokales Spiel wie gehabt + Live-Übertragung an Mitspieler:
   - Nach jeder Änderung wird ein kompakter Zustand gesendet
   - Mitspieler senden "hello" (Zustand anfordern) und
     "hand" (Ich melde mich!) über denselben Kanal
   ============================================================ */

const STORAGE_KEY = "quizabend_state_v1";
const TEAM_COLORS = ["#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040", "#2ee6d6", "#ff6ad5"];
const TEAM_GLOWS = TEAM_COLORS.map((c) => c + "59"); /* Hex mit ~35% Alpha */

let state = null;
let activeQ = null;
// activeQ = { ci, qi, answeringTeam, isSteal, alreadyTried:[], phase, resultText? }
// phase: "answering" | "steal-select" | "resolved"
let raisedHands = []; // [{team}] in Meldereihenfolge, nur während steal-select

/* ---------------- State laden / speichern ---------------- */
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

state = loadState();
if (!state || !state.teams) {
  window.location.href = "jeopardy.html";
}

/* ---------------- Online: Senden & Empfangen ---------------- */
let broadcastTimer = null;

function snapshot() {
  return {
    from: "gm",
    type: "state",
    s: {
      teams: state.teams.map((t) => [t.name, t.score]),
      turn: state.turn,
      bi: state.boardIndex,
      set: state.setIndex || 0,
      used: usedGrid().map((col) => col.map((u) => (u ? "1" : "0")).join("")),
      q: activeQ
        ? (() => {
            const cat = board().categories[activeQ.ci];
            const qa = cat.qa[activeQ.qi];
            return {
              ci: activeQ.ci,
              qi: activeQ.qi,
              phase: activeQ.phase,
              at: activeQ.answeringTeam,
              steal: activeQ.isSteal,
              tried: activeQ.alreadyTried,
              res: activeQ.resultText || null,
              ok: activeQ.ok === undefined ? null : activeQ.ok,
              text: qa.q,                 // Fragetext für die Handys
              cat: cat.name,
              rev: !!cat.reverse,
              ans: activeQ.phase === "resolved" ? qa.a : null, // Antwort erst nach Auflösung
            };
          })()
        : null,
      done: boardIsDone(),
      status: "playing",
    },
  };
}

/* Gebündelt senden (max. ~1 Nachricht pro Sekunde, spart Rate-Limit) */
function scheduleBroadcast() {
  if (!state.onlineCode) return;
  if (broadcastTimer) return;
  broadcastTimer = setTimeout(() => {
    broadcastTimer = null;
    netPublish(state.onlineCode, snapshot());
  }, 350);
}

function onNetMessage(msg) {
  if (!msg || msg.from !== "p") return;

  if (msg.type === "hello") {
    scheduleBroadcast(); // Neuling bekommt den aktuellen Stand
  }

  if (
    msg.type === "hand" &&
    activeQ &&
    activeQ.phase === "steal-select" &&
    msg.q === activeQ.ci + "-" + activeQ.qi &&
    typeof msg.team === "number" &&
    msg.team >= 0 && msg.team < state.teams.length &&
    !activeQ.alreadyTried.includes(msg.team) &&
    !raisedHands.some((h) => h.team === msg.team)
  ) {
    raisedHands.push({ team: msg.team });
    soundBuzz(); // 🔔 Meldung eingegangen!
    renderQuestionPanel();
  }
}

if (state && state.onlineCode) {
  netSubscribe(state.onlineCode, onNetMessage, scheduleBroadcast);
}

/* ---------------- Helfer ---------------- */
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function board() { return BOARD_SETS[state.setIndex || 0].boards[state.boardIndex]; }
function usedGrid() { return state.used[state.boardIndex]; }
function boardIsDone() { return usedGrid().every((col) => col.every(Boolean)); }
function nextTurn() { state.turn = (state.turn + 1) % state.teams.length; }

/* ---------------- Rendering: Kopfzeile ---------------- */
function renderTopline() {
  const played = usedGrid().reduce((s, col) => s + col.filter(Boolean).length, 0);
  const setName = BOARD_SETS[state.setIndex || 0].name;
  document.getElementById("boardBadge").textContent =
    setName + " · " + board().title + " · " + played + "/25";
  const badge = document.getElementById("turnBadge");
  const t = state.teams[state.turn];
  badge.textContent = "AM ZUG: " + t.name.toUpperCase();
  badge.style.setProperty("--turn-color", TEAM_COLORS[state.turn]);
  badge.style.setProperty("--turn-glow", TEAM_GLOWS[state.turn]);

  const chip = document.getElementById("codeChip");
  if (state.onlineCode) {
    chip.textContent = "CODE: " + state.onlineCode;
    chip.classList.remove("hidden");
  }
}

/* ---------------- Rendering: Punktestand ---------------- */
function renderScoreboard() {
  const sb = document.getElementById("scoreboard");
  sb.innerHTML = "";
  state.teams.forEach((t, i) => {
    const card = document.createElement("div");
    card.className =
      "score-card" +
      (i === state.turn ? " on-turn" : "") +
      (pendingPop === i ? " score-pop" : "");
    card.style.setProperty("--tc", TEAM_COLORS[i]);
    card.style.setProperty("--tc-glow", TEAM_GLOWS[i]);
    card.innerHTML =
      '<div class="nm">' + escapeHtml(t.name) + "</div>" +
      '<div class="val' + (t.score < 0 ? " neg" : "") + '">' + t.score + "</div>";
    sb.appendChild(card);
  });
  pendingPop = null;
}

/* ---------------- Rendering: Board ---------------- */
function renderBoard() {
  const el = document.getElementById("board");
  el.innerHTML = "";
  const b = board();

  b.categories.forEach((cat) => {
    const pill = document.createElement("div");
    pill.className = "cat-pill";
    pill.textContent = cat.name;
    el.appendChild(pill);
  });

  b.points.forEach((pt, qi) => {
    b.categories.forEach((cat, ci) => {
      const cell = document.createElement("div");
      const used = usedGrid()[ci][qi];
      const locked = !!activeQ;
      cell.className = "cell" + (used ? " used" : locked ? " locked" : "");
      cell.textContent = used ? "" : pt;
      if (!used && !locked) {
        cell.addEventListener("click", () => openQuestion(ci, qi));
      }
      el.appendChild(cell);
    });
  });

  const doneEl = document.getElementById("boardDone");
  const btn = document.getElementById("nextBoardBtn");
  if (boardIsDone() && !activeQ) {
    doneEl.classList.remove("hidden");
    btn.textContent = state.boardIndex === 0 ? "SPRINGE ZUM NÄCHSTEN BOARD →" : "ZUR SIEGEREHRUNG →";
  } else {
    doneEl.classList.add("hidden");
  }
}

/* ---------------- Frage öffnen ---------------- */
function openQuestion(ci, qi) {
  soundClick();
  peekVisible = false;
  activeQ = {
    ci, qi,
    answeringTeam: state.turn,
    isSteal: false,
    alreadyTried: [],
    phase: "answering",
  };
  raisedHands = [];
  renderAll();
  document.getElementById("questionPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------- Frage rendern ---------------- */
function renderQuestionPanel() {
  const panel = document.getElementById("questionPanel");
  if (!activeQ) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }
  panel.classList.remove("hidden");

  const b = board();
  const cat = b.categories[activeQ.ci];
  const qa = cat.qa[activeQ.qi];
  const pts = b.points[activeQ.qi];
  const half = pts / 2;

  if (activeQ.phase === "answering") {
    const team = state.teams[activeQ.answeringTeam];
    const winPts = activeQ.isSteal ? half : pts;
    panel.innerHTML =
      '<div class="qp-head">' +
        '<span class="qp-chip">' + escapeHtml(cat.name) + "</span>" +
        '<span class="qp-chip blue">' + pts + " PUNKTE</span>" +
        '<span class="qp-chip team" style="--tc:' + TEAM_COLORS[activeQ.answeringTeam] + '">' +
          escapeHtml(team.name) + (activeQ.isSteal ? " · MELDET SICH" : "") +
        "</span>" +
      "</div>" +
      (cat.reverse ? '<div class="qp-hint">Gesucht: die passende Frage zu dieser Antwort!</div>' : "") +
      '<div class="qp-question">' + escapeHtml(qa.q) + "</div>" +
      '<div id="peekZone"></div>' +
      '<div class="qp-controls">' +
        '<button class="btn-green" id="correctBtn">✓ RICHTIG (+' + winPts + ")</button>" +
        '<button class="btn-red" id="wrongBtn">✗ FALSCH (−' + half + ")</button>" +
        '<button class="btn-blue" id="peekBtn">👁 Antwort (nur GM)</button>' +
      "</div>" +
      (canCancel()
        ? '<div class="qp-cancel"><button class="btn-ghost small" id="cancelBtn">↩︎ Feld doch offen lassen</button>' +
          '<span class="qp-keys">Tasten: <b>1</b> richtig · <b>2</b> falsch · <b>A</b> Antwort · <b>Esc</b> zurück</span></div>'
        : '<div class="qp-cancel"><span class="qp-keys">Tasten: <b>1</b> richtig · <b>2</b> falsch · <b>A</b> Antwort</span></div>');

    document.getElementById("correctBtn").addEventListener("click", onCorrect);
    document.getElementById("wrongBtn").addEventListener("click", onWrong);
    setupPeekButton(qa.a);
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", cancelQuestion);
  }

  if (activeQ.phase === "steal-select") {
    /* Gemeldete Teams zuerst, mit Melde-Reihenfolge */
    const handOrder = new Map(raisedHands.map((h, idx) => [h.team, idx + 1]));
    const candidates = state.teams
      .map((t, i) => ({ t, i }))
      .filter(({ i }) => !activeQ.alreadyTried.includes(i))
      .sort((a, b) => (handOrder.get(a.i) || 99) - (handOrder.get(b.i) || 99));

    let buttons = candidates
      .map(({ t, i }) => {
        const nr = handOrder.get(i);
        return (
          '<button class="steal-btn' + (nr ? " raised" : "") + '" data-i="' + i +
          '" style="--tc:' + TEAM_COLORS[i] + '">' +
          (nr ? "✋ " + nr + ". " : "") + escapeHtml(t.name) +
          "</button>"
        );
      })
      .join("");
    buttons += '<button class="btn-ghost" id="nobodyBtn">Niemand meldet sich</button>';

    panel.innerHTML =
      '<div class="qp-head">' +
        '<span class="qp-chip">' + escapeHtml(cat.name) + "</span>" +
        '<span class="qp-chip blue">' + pts + " PUNKTE</span>" +
      "</div>" +
      '<div class="qp-question" style="font-size:1.1rem; opacity:0.75;">' + escapeHtml(qa.q) + "</div>" +
      '<div class="qp-steal-title">FALSCH!</div>' +
      '<div class="qp-steal-sub">Welches Team meldet sich? (Richtig: +' + half + " · Falsch: −" + half + ") – Meldungen von den Handys erscheinen hier live.</div>" +
      '<div class="steal-grid">' + buttons + "</div>";

    panel.querySelectorAll(".steal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeQ.answeringTeam = +btn.dataset.i;
        activeQ.isSteal = true;
        activeQ.phase = "answering";
        raisedHands = [];
        renderAll();
      });
    });
    document.getElementById("nobodyBtn").addEventListener("click", () => resolveQuestion(null));
  }

  if (activeQ.phase === "resolved") {
    panel.innerHTML =
      '<div class="qp-head">' +
        '<span class="qp-chip">' + escapeHtml(cat.name) + "</span>" +
        '<span class="qp-chip blue">' + pts + " PUNKTE</span>" +
      "</div>" +
      '<div class="qp-question" style="font-size:1.05rem; opacity:0.7;">' + escapeHtml(qa.q) + "</div>" +
      '<div class="qp-resolved-answer">' + escapeHtml(qa.a) + "</div>" +
      '<div class="qp-result-line">' + escapeHtml(activeQ.resultText) + "</div>" +
      '<div class="qp-controls"><button class="btn-red" id="continueBtn">WEITER →</button></div>';

    document.getElementById("continueBtn").addEventListener("click", closeQuestion);
  }
}

/* Antwort-Spickzettel für den Gamemaster: umschaltbar (nur auf diesem Gerät) */
let peekVisible = false;
function setupPeekButton(answer) {
  const btn = document.getElementById("peekBtn");
  const zone = document.getElementById("peekZone");
  const paint = () => {
    zone.innerHTML = peekVisible
      ? '<div class="peek-answer">Lösung: ' + escapeHtml(answer) + "</div>"
      : "";
    btn.textContent = peekVisible ? "🙈 Antwort verbergen" : "👁 Antwort (nur GM)";
  };
  btn.onclick = () => { peekVisible = !peekVisible; paint(); };
  paint();
}
function togglePeek() { const b = document.getElementById("peekBtn"); if (b) b.click(); }

/* Ein frisch geöffnetes Feld darf noch zurückgelegt werden (niemand hat geantwortet). */
function canCancel() {
  return activeQ && activeQ.phase === "answering" && !activeQ.isSteal &&
         activeQ.alreadyTried.length === 0;
}
function cancelQuestion() {
  if (!canCancel()) return;
  activeQ = null;
  raisedHands = [];
  peekVisible = false;
  saveState();
  renderAll();
}

/* ---------------- Wertung ---------------- */
function onCorrect() {
  const pts = board().points[activeQ.qi];
  const gain = activeQ.isSteal ? pts / 2 : pts;
  state.teams[activeQ.answeringTeam].score += gain;
  soundCorrect();
  flashPanel("flash-good");
  popScore(activeQ.answeringTeam);
  resolveQuestion(
    state.teams[activeQ.answeringTeam].name + " beantwortet richtig: +" + gain + " Punkte",
    true
  );
}

function onWrong() {
  const pts = board().points[activeQ.qi];
  const half = pts / 2;
  state.teams[activeQ.answeringTeam].score -= half;
  activeQ.alreadyTried.push(activeQ.answeringTeam);
  soundWrong();
  flashPanel("flash-bad");
  popScore(activeQ.answeringTeam);
  saveState();

  const remaining = state.teams.filter((_, i) => !activeQ.alreadyTried.includes(i));
  if (remaining.length > 0) {
    activeQ.phase = "steal-select";
    raisedHands = [];
    renderAll();
  } else {
    resolveQuestion("Kein Team hat die Frage richtig beantwortet.", false);
  }
}

function resolveQuestion(resultText, ok) {
  activeQ.phase = "resolved";
  activeQ.resultText = resultText || "Niemand hat sich gemeldet – keine weiteren Punkte.";
  activeQ.ok = ok === undefined ? null : ok;
  raisedHands = [];
  saveState();
  renderAll();
}

/* Kurzer Leucht-/Wackel-Effekt auf dem Fragen-Panel */
function flashPanel(cls) {
  const panel = document.getElementById("questionPanel");
  panel.classList.remove("flash-good", "flash-bad");
  void panel.offsetWidth; // Animation neu starten
  panel.classList.add(cls);
  setTimeout(() => panel.classList.remove(cls), 800);
}

/* Punktzahl kurz aufploppen lassen (nach dem nächsten Rendern) */
let pendingPop = null;
function popScore(teamIdx) { pendingPop = teamIdx; }

function closeQuestion() {
  usedGrid()[activeQ.ci][activeQ.qi] = true;
  activeQ = null;
  raisedHands = [];
  nextTurn();
  saveState();
  renderAll();
}

/* ---------------- Board-Wechsel / Ende ---------------- */
document.getElementById("nextBoardBtn").addEventListener("click", () => {
  if (state.boardIndex === 0) {
    soundFanfare();
    state.boardIndex = 1;
    saveState();
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    if (state.onlineCode) {
      netPublish(state.onlineCode, {
        from: "gm",
        type: "state",
        s: { status: "ended", teams: state.teams.map((t) => [t.name, t.score]) },
      });
    }
    window.location.href = "final.html";
  }
});

/* ---------------- Reset ---------------- */
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Wirklich das ganze Spiel zurücksetzen?")) {
    if (state.onlineCode) {
      netPublish(state.onlineCode, { from: "gm", type: "state", s: { status: "reset" } });
    }
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "jeopardy.html";
  }
});

/* ---------------- Tastatur-Kürzel (Gamemaster) ---------------- */
document.addEventListener("keydown", (e) => {
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (!activeQ) return;
  const k = (e.key || "").toLowerCase();
  const c = e.code || "";
  const is = (...vals) => vals.includes(k) || vals.includes(c);
  const enter = is("enter", " ", "spacebar", "Enter", "NumpadEnter", "Space");
  const back = is("escape", "backspace", "Escape", "Backspace");

  if (activeQ.phase === "answering") {
    if (is("1", "r", "Digit1", "Numpad1", "KeyR")) { e.preventDefault(); onCorrect(); }
    else if (is("2", "f", "Digit2", "Numpad2", "KeyF")) { e.preventDefault(); onWrong(); }
    else if (is("a", "KeyA")) { e.preventDefault(); togglePeek(); }
    else if (back && canCancel()) { e.preventDefault(); cancelQuestion(); }
  } else if (activeQ.phase === "steal-select") {
    if (is("0", "n", "Digit0", "Numpad0", "KeyN")) { e.preventDefault(); resolveQuestion(null); }
  } else if (activeQ.phase === "resolved") {
    if (enter) { e.preventDefault(); closeQuestion(); }
  }
});

/* ---------------- Alles rendern (+ live senden) ---------------- */
function renderAll() {
  renderTopline();
  renderScoreboard();
  renderQuestionPanel();
  renderBoard();
  scheduleBroadcast();
}
renderAll();
