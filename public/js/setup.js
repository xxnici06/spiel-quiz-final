/* Startseite: drei Rollen – Gamemaster, Mitspielen (Handy), Gameboard (Anzeige) */

const STORAGE_KEY = "quizabend_state_v1";
const JOIN_KEY = "quizabend_join_v1";   // Mitspieler:  { code, team }
const BOARD_KEY = "quizabend_board_v1"; // Gameboard:   { code }
const NAMES_KEY = "quizabend_names_v1"; // zuletzt genutzte Teamnamen + Anzahl

/* Direktbeitritt per QR-Code: ?code=ABC123[&role=board]
   -> Team-Handy oder Gameboard sofort verbinden, ohne Tippen. */
(function () {
  const params = new URLSearchParams(location.search);
  const code = (params.get("code") || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(code)) return;
  try {
    if (params.get("role") === "board") {
      localStorage.setItem(BOARD_KEY, JSON.stringify({ code }));
      location.replace("viewer.html");
    } else {
      localStorage.setItem(JOIN_KEY, JSON.stringify({ code, team: null }));
      location.replace("player.html");
    }
  } catch (e) {}
})();

const modeChoice = document.getElementById("modeChoice");
const gmSetup = document.getElementById("gmSetup");
const joinSetup = document.getElementById("joinSetup");

let joinTarget = null; // "player" | "board"

function show(el) {
  modeChoice.classList.add("hidden");
  gmSetup.classList.add("hidden");
  joinSetup.classList.add("hidden");
  el.classList.remove("hidden");
}

document.getElementById("modeGmBtn").addEventListener("click", () => show(gmSetup));

document.getElementById("modeJoinBtn").addEventListener("click", () => {
  joinTarget = "player";
  document.getElementById("joinTitle").textContent =
    "Dein Handy wird zum Buzzer – gib den Spielcode ein";
  show(joinSetup);
  setTimeout(() => document.getElementById("joinCode").focus(), 50);
});

document.getElementById("modeBoardBtn").addEventListener("click", () => {
  joinTarget = "board";
  document.getElementById("joinTitle").textContent =
    "Grosser Bildschirm mit Board & Fragen – gib den Spielcode ein";
  show(joinSetup);
  setTimeout(() => document.getElementById("joinCode").focus(), 50);
});

document.getElementById("backBtn1").addEventListener("click", () => show(modeChoice));
document.getElementById("backBtn2").addEventListener("click", () => show(modeChoice));

const TEAM_COLORS = ["#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040", "#2ee6d6", "#ff6ad5"];

/* Letzte Einstellungen laden */
let savedNames = [];
let teamCount = 4;
try {
  const s = JSON.parse(localStorage.getItem(NAMES_KEY));
  if (s && Array.isArray(s.names)) {
    savedNames = s.names;
    if (s.count >= 2 && s.count <= 8) teamCount = s.count;
  }
} catch (e) {}

let setIndex = 0;

/* ---------- Fragen-Set wählen ---------- */
const setGrid = document.getElementById("setGrid");
function renderSetGrid() {
  setGrid.innerHTML = "";
  BOARD_SETS.forEach((set, i) => {
    const r1 = set.boards[0].categories.map((c) => c.name).join(" · ");
    const r2 = set.boards[1].categories.map((c) => c.name).join(" · ");
    const card = document.createElement("button");
    card.type = "button";
    card.className = "set-card" + (i === setIndex ? " active" : "");
    card.innerHTML =
      '<span class="set-name">' + (i + 1) + ". " + set.name + "</span>" +
      '<span class="set-cats"><b>Runde 1:</b> ' + r1 + "</span>" +
      '<span class="set-cats"><b>Runde 2:</b> ' + r2 + "</span>";
    card.addEventListener("click", () => {
      setIndex = i;
      setGrid.querySelectorAll(".set-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
    setGrid.appendChild(card);
  });
}
renderSetGrid();

const randomBtn = document.getElementById("randomSetBtn");
if (randomBtn) {
  randomBtn.addEventListener("click", () => {
    setIndex = Math.floor(Math.random() * BOARD_SETS.length);
    renderSetGrid();
    const active = setGrid.querySelector(".set-card.active");
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ---------- Anzahl Teams 2–8 ---------- */
const countRow = document.getElementById("countRow");
function renderCountRow() {
  countRow.innerHTML = "";
  for (let n = 2; n <= 8; n++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "count-btn" + (n === teamCount ? " active" : "");
    btn.textContent = n;
    btn.addEventListener("click", () => {
      teamCount = n;
      renderCountRow();
      renderTeamInputs();
    });
    countRow.appendChild(btn);
  }
}
renderCountRow();

/* ---------- Team-Namen (bleiben beim Umschalten erhalten) ---------- */
function renderTeamInputs() {
  const wrap = document.getElementById("teamInputs");
  const existing = [...wrap.querySelectorAll("input")].map((inp) => inp.value);
  wrap.innerHTML = "";
  for (let i = 0; i < teamCount; i++) {
    const label = document.createElement("label");
    label.className = "team-input";
    label.innerHTML =
      '<span class="dot" style="background:' + TEAM_COLORS[i] + '"></span>' +
      '<input type="text" id="team' + i + '" maxlength="20" autocomplete="off">';
    wrap.appendChild(label);
    const inp = label.querySelector("input");
    inp.value = existing[i] || savedNames[i] || "Team " + (i + 1);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") startGame(); });
  }
}
renderTeamInputs();

/* ---------- Gamemaster: Spiel erstellen ---------- */
function startGame() {
  const teams = [];
  const names = [];
  for (let i = 0; i < teamCount; i++) {
    const v = document.getElementById("team" + i).value.trim();
    const name = v || "Team " + (i + 1);
    teams.push({ name, score: 0 });
    names.push(name);
  }

  try { localStorage.setItem(NAMES_KEY, JSON.stringify({ names, count: teamCount })); } catch (e) {}

  const state = {
    teams,
    turn: 0,
    boardIndex: 0,
    setIndex,
    used: [
      Array.from({ length: 5 }, () => [false, false, false, false, false]),
      Array.from({ length: 5 }, () => [false, false, false, false, false]),
    ],
    onlineCode: makeGameCode(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    alert("Konnte den Spielstand nicht speichern. Bitte einen anderen Browser verwenden.");
    return;
  }
  window.location.href = "game.html";
}
document.getElementById("startBtn").addEventListener("click", startGame);

/* ---------- Beitreten ---------- */
function doJoin() {
  const errEl = document.getElementById("joinError");
  errEl.textContent = "";
  const code = document.getElementById("joinCode").value.trim().toUpperCase();
  if (code.length !== 6) {
    errEl.textContent = "Der Code hat 6 Zeichen.";
    return;
  }
  try {
    if (joinTarget === "board") {
      localStorage.setItem(BOARD_KEY, JSON.stringify({ code }));
      window.location.href = "viewer.html";
    } else {
      localStorage.setItem(JOIN_KEY, JSON.stringify({ code, team: null }));
      window.location.href = "player.html";
    }
  } catch (e) {}
}
document.getElementById("joinBtn").addEventListener("click", doJoin);
document.getElementById("joinCode").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doJoin();
});
