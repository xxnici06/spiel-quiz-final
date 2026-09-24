/* ============================================================
   Gameboard-Ansicht (großer Bildschirm / Beamer / TV)
   Reine Anzeige ohne Bedienung: Board, aktuelle Frage,
   Punktestand, wer am Zug ist. Antworten erscheinen erst
   nach der Auflösung durch den Gamemaster.
   ============================================================ */

const BOARD_KEY = "quizabend_board_v1";
const TEAM_COLORS = ["#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040", "#2ee6d6", "#ff6ad5"];
const TEAM_GLOWS = TEAM_COLORS.map((c) => c + "59");

let conn = null;   // { code }
let snap = null;
let lastHello = 0;
let lastPhaseKey = null;

try { conn = JSON.parse(localStorage.getItem(BOARD_KEY)); } catch (e) {}
if (!conn || !conn.code) window.location.href = "index.html";

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- Verbindung ---------------- */
function sendHello() {
  const now = Date.now();
  if (now - lastHello < 5000) return;
  lastHello = now;
  netPublish(conn.code, { from: "p", type: "hello" });
}
netSubscribe(conn.code, onNetMessage, sendHello);
sendHello();

function onNetMessage(msg) {
  if (!msg || msg.from !== "gm" || msg.type !== "state") return;
  const s = msg.s;
  if (s.status === "ended") { showEnded(s.teams); return; }
  if (s.status === "reset") {
    localStorage.removeItem(BOARD_KEY);
    window.location.href = "index.html";
    return;
  }
  snap = s;
  reactToPhaseChange();
  render();
}

/* Sounds + Flash bei Phasenwechsel */
function reactToPhaseChange() {
  const q = snap.q;
  const key = q ? q.ci + "-" + q.qi + ":" + q.phase + ":" + (q.at ?? "") : "none";
  if (key === lastPhaseKey) return;
  const prev = lastPhaseKey;
  lastPhaseKey = key;
  if (prev === null) return;

  if (q && q.phase === "steal-select") {
    soundWrong();
    flashPanel("flash-bad");
  } else if (q && q.phase === "resolved") {
    if (q.ok === true) { soundCorrect(); flashPanel("flash-good"); }
    else if (q.ok === false) { soundWrong(); flashPanel("flash-bad"); }
  } else if (q && q.phase === "answering") {
    soundClick();
  }
}

function flashPanel(cls) {
  const panel = document.getElementById("questionPanel");
  panel.classList.remove("flash-good", "flash-bad");
  void panel.offsetWidth;
  panel.classList.add(cls);
  setTimeout(() => panel.classList.remove(cls), 800);
}

/* ---------------- Ansichten ---------------- */
const elWaiting = document.getElementById("waiting");
const elLive = document.getElementById("liveView");
const elEnded = document.getElementById("endedView");

function showOnly(el) {
  [elWaiting, elLive, elEnded].forEach((e) => e.classList.toggle("hidden", e !== el));
}

document.getElementById("leaveBtn").addEventListener("click", () => {
  localStorage.removeItem(BOARD_KEY);
  window.location.href = "index.html";
});
document.getElementById("homeBtn").addEventListener("click", () => {
  localStorage.removeItem(BOARD_KEY);
  window.location.href = "index.html";
});

/* ---------------- Haupt-Rendering ---------------- */
function render() {
  if (!snap) return;
  showOnly(elLive);

  const b = BOARD_SETS[snap.set || 0].boards[snap.bi];

  document.getElementById("boardBadge").textContent = b.title;
  const badge = document.getElementById("turnBadge");
  badge.textContent = "AM ZUG: " + snap.teams[snap.turn][0].toUpperCase();
  badge.style.setProperty("--turn-color", TEAM_COLORS[snap.turn]);
  badge.style.setProperty("--turn-glow", TEAM_GLOWS[snap.turn]);

  const sb = document.getElementById("scoreboard");
  sb.innerHTML = "";
  snap.teams.forEach(([name, score], i) => {
    const card = document.createElement("div");
    card.className = "score-card" + (i === snap.turn ? " on-turn" : "");
    card.style.setProperty("--tc", TEAM_COLORS[i]);
    card.style.setProperty("--tc-glow", TEAM_GLOWS[i]);
    card.innerHTML =
      '<div class="nm">' + escapeHtml(name) + "</div>" +
      '<div class="val' + (score < 0 ? " neg" : "") + '">' + score + "</div>";
    sb.appendChild(card);
  });

  renderQuestion(b);
  renderBoard(b);
}

/* ---------------- Frage ---------------- */
function renderQuestion(b) {
  const panel = document.getElementById("questionPanel");
  const q = snap.q;
  if (!q) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }
  panel.classList.remove("hidden");

  const cat = b.categories[q.ci];
  const qa = cat.qa[q.qi];
  const pts = b.points[q.qi];
  const half = pts / 2;

  let html =
    '<div class="qp-head">' +
      '<span class="qp-chip">' + escapeHtml(cat.name) + "</span>" +
      '<span class="qp-chip blue">' + pts + " PUNKTE</span>";

  if (q.phase === "answering") {
    html +=
      '<span class="qp-chip team" style="--tc:' + TEAM_COLORS[q.at] + '">' +
        escapeHtml(snap.teams[q.at][0]) + (q.steal ? " · MELDET SICH" : " · AM ZUG") +
      "</span>";
  }
  html += "</div>";

  if (cat.reverse) {
    html += '<div class="qp-hint">Gesucht: die passende Frage zu dieser Antwort!</div>';
  }
  html += '<div class="qp-question">' + escapeHtml(qa.q) + "</div>";

  if (q.phase === "steal-select") {
    html +=
      '<div class="qp-steal-title">FALSCH!</div>' +
      '<div class="qp-steal-sub">Jetzt am Handy melden! Richtig: +' + half + " · Falsch: −" + half + "</div>";
  }

  if (q.phase === "resolved") {
    html +=
      '<div class="qp-resolved-answer">' + escapeHtml(qa.a) + "</div>" +
      '<div class="qp-result-line">' + escapeHtml(q.res || "") + "</div>";
  }

  panel.innerHTML = html;
}

/* ---------------- Board (nur Ansicht) ---------------- */
function renderBoard(b) {
  const el = document.getElementById("board");
  el.innerHTML = "";

  b.categories.forEach((cat) => {
    const pill = document.createElement("div");
    pill.className = "cat-pill";
    pill.textContent = cat.name;
    el.appendChild(pill);
  });

  b.points.forEach((pt, qi) => {
    b.categories.forEach((cat, ci) => {
      const cell = document.createElement("div");
      const used = snap.used[ci][qi] === "1";
      const isActive = snap.q && snap.q.ci === ci && snap.q.qi === qi;
      cell.className = "cell locked" + (used ? " used" : "") + (isActive ? " active" : "");
      cell.textContent = used ? "" : pt;
      el.appendChild(cell);
    });
  });
}

/* ---------------- Endstand ---------------- */
function showEnded(teams) {
  showOnly(elEnded);
  soundFanfare();
  const ranked = [...teams].sort((a, b) => b[1] - a[1]);
  const podium = document.getElementById("podium");
  podium.innerHTML = "";
  ranked.forEach(([name, score], i) => {
    const row = document.createElement("div");
    row.className = "rank-row" + (i === 0 ? " first" : "");
    row.innerHTML =
      '<div class="rank-left">' +
        '<span class="rank-num">#' + (i + 1) + "</span>" +
        '<span class="rank-name">' + escapeHtml(name) + "</span>" +
      "</div>" +
      '<span class="rank-score' + (score < 0 ? " neg" : "") + '">' + score + "</span>";
    podium.appendChild(row);
  });
}
