/* ============================================================
   Handy-Ansicht (Mitspieler)
   Zeigt bewusst nur das Nötigste:
   - eigenes Team + Punktestand (groß)
   - wer gerade am Zug ist
   - den Melde-Buzzer, wenn eine Frage geklaut werden kann
   Fragen & Board laufen auf dem Gameboard-Bildschirm.
   ============================================================ */

const JOIN_KEY = "quizabend_join_v1";
const TEAM_COLORS = ["#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040", "#2ee6d6", "#ff6ad5"];

let join = null;        // { code, team }
let snap = null;
let handSentFor = null;
let lastHello = 0;
let lastPhaseKey = null;
let lastScore = null;

try { join = JSON.parse(localStorage.getItem(JOIN_KEY)); } catch (e) {}
if (!join || !join.code) window.location.href = "index.html";

function saveJoin() {
  try { localStorage.setItem(JOIN_KEY, JSON.stringify(join)); } catch (e) {}
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- Verbindung ---------------- */
function sendHello() {
  const now = Date.now();
  if (now - lastHello < 5000) return;
  lastHello = now;
  netPublish(join.code, { from: "p", type: "hello" });
}
netSubscribe(join.code, onNetMessage, sendHello);
sendHello();

function onNetMessage(msg) {
  if (!msg || msg.from !== "gm" || msg.type !== "state") return;
  const s = msg.s;
  if (s.status === "ended") { showEnded(s.teams); return; }
  if (s.status === "reset") {
    localStorage.removeItem(JOIN_KEY);
    window.location.href = "index.html";
    return;
  }
  snap = s;
  reactToPhaseChange();
  render();
}

/* Sounds bei Phasenwechsel (richtig/falsch hört man auch am Handy) */
function reactToPhaseChange() {
  const q = snap.q;
  const key = q ? q.ci + "-" + q.qi + ":" + q.phase + ":" + (q.at ?? "") : "none";
  if (key === lastPhaseKey) return;
  const prev = lastPhaseKey;
  lastPhaseKey = key;
  if (prev === null) return;

  if (q && q.phase === "steal-select") soundWrong();
  else if (q && q.phase === "resolved") {
    if (q.ok === true) soundCorrect();
    else if (q.ok === false) soundWrong();
  }
}

/* ---------------- Ansichten ---------------- */
const elWaiting = document.getElementById("waiting");
const elTeamPick = document.getElementById("teamPick");
const elPlayer = document.getElementById("playerView");
const elEnded = document.getElementById("endedView");

function showOnly(el) {
  [elWaiting, elTeamPick, elPlayer, elEnded].forEach((e) =>
    e.classList.toggle("hidden", e !== el)
  );
}

document.getElementById("leaveBtn").addEventListener("click", () => {
  localStorage.removeItem(JOIN_KEY);
  window.location.href = "index.html";
});
document.getElementById("homeBtn").addEventListener("click", () => {
  localStorage.removeItem(JOIN_KEY);
  window.location.href = "index.html";
});

/* ---------------- Team wählen ---------------- */
function renderTeamPick() {
  showOnly(elTeamPick);
  const grid = document.getElementById("teamPickGrid");
  grid.innerHTML = "";
  snap.teams.forEach(([name], i) => {
    const btn = document.createElement("button");
    btn.className = "steal-btn";
    btn.style.setProperty("--tc", TEAM_COLORS[i]);
    btn.textContent = name;
    btn.addEventListener("click", () => {
      join.team = i;
      saveJoin();
      lastScore = null;
      render();
    });
    grid.appendChild(btn);
  });
}

/* ---------------- Haupt-Rendering ---------------- */
function render() {
  if (!snap) return;
  if (join.team === null || join.team === undefined) {
    renderTeamPick();
    return;
  }
  showOnly(elPlayer);

  const b = { points: BOARD_POINTS[snap.bi] };
  const myName = snap.teams[join.team][0];
  const myScore = snap.teams[join.team][1];
  const myColor = TEAM_COLORS[join.team];

  /* Team + Punkte */
  const card = document.getElementById("playerCard");
  card.style.setProperty("--tc", myColor);
  document.getElementById("playerTeam").textContent = myName;
  const scoreEl = document.getElementById("playerScore");
  scoreEl.textContent = myScore;
  scoreEl.classList.toggle("neg", myScore < 0);
  if (lastScore !== null && lastScore !== myScore) {
    scoreEl.classList.remove("pop");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("pop");
  }
  lastScore = myScore;

  /* Wer ist am Zug */
  const strip = document.getElementById("turnStrip");
  if (snap.turn === join.team) {
    strip.textContent = "🎯 DU BIST AM ZUG!";
    strip.className = "turn-strip me";
    strip.style.setProperty("--tc", myColor);
  } else {
    strip.textContent = "AM ZUG: " + snap.teams[snap.turn][0].toUpperCase();
    strip.className = "turn-strip";
    strip.style.setProperty("--tc", TEAM_COLORS[snap.turn]);
  }

  renderZone(b);
}

/* ---------------- Status / Buzzer ---------------- */
function renderZone(b) {
  const zone = document.getElementById("playerZone");
  const q = snap.q;

  if (!q) {
    zone.innerHTML = '<div class="player-status">Warte auf die nächste Frage…</div>';
    return;
  }

  const pts = b.points[q.qi];
  const half = pts / 2;
  const qKey = q.ci + "-" + q.qi;

  /* Fragekarte: Kategorie, Punkte und (mitgesendeter) Fragetext */
  let html =
    '<div class="q-card">' +
      '<div class="q-card-head">' + escapeHtml(q.cat || "") + " · " + pts + " PUNKTE</div>" +
      (q.rev ? '<div class="q-card-hint">Gesucht: die passende Frage zu dieser Antwort!</div>' : "") +
      '<div class="q-card-text">' + escapeHtml(q.text || "") + "</div>" +
      (q.phase === "resolved" && q.ans
        ? '<div class="q-card-answer">' + escapeHtml(q.ans) + "</div>"
        : "") +
    "</div>";

  if (q.phase === "answering") {
    const isMe = q.at === join.team;
    html +=
      '<div class="player-status' + (isMe ? " hot" : "") + '">' +
      (isMe
        ? "🔥 IHR SEID GEFRAGT!"
        : escapeHtml(snap.teams[q.at][0]) + " antwortet…") +
      "</div>";
  }

  if (q.phase === "steal-select") {
    const iTried = q.tried.includes(join.team);
    const alreadySent = handSentFor === qKey;
    if (iTried) {
      html += '<div class="player-status">Euer Team hatte diese Frage schon.</div>';
    } else if (alreadySent) {
      html += '<div class="hand-confirm">✋ Meldung gesendet – der Gamemaster entscheidet!</div>';
    } else {
      html +=
        '<button class="buzzer-btn" id="handBtn">✋<br>MELDEN!<br><span>+' + half + " / −" + half + "</span></button>";
    }
  }

  if (q.phase === "resolved") {
    html += '<div class="player-status">' + escapeHtml(q.res || "") + "</div>";
  }

  zone.innerHTML = html;

  const handBtn = document.getElementById("handBtn");
  if (handBtn) {
    handBtn.addEventListener("click", () => {
      handSentFor = qKey;
      soundBuzz();
      if (navigator.vibrate) navigator.vibrate(80);
      netPublish(join.code, { from: "p", type: "hand", team: join.team, q: qKey });
      render();
    });
  }
}

/* ---------------- Endstand ---------------- */
function showEnded(teams) {
  showOnly(elEnded);
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
