/* Startseite: drei Rollen – Gamemaster, Mitspielen (Handy), Gameboard (Anzeige) */

const STORAGE_KEY = "quizabend_state_v1";
const JOIN_KEY = "quizabend_join_v1";   // Mitspieler:  { code, team }
const BOARD_KEY = "quizabend_board_v1"; // Gameboard:   { code }

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
});

document.getElementById("modeBoardBtn").addEventListener("click", () => {
  joinTarget = "board";
  document.getElementById("joinTitle").textContent =
    "Großer Bildschirm mit Board & Fragen – gib den Spielcode ein";
  show(joinSetup);
});

document.getElementById("backBtn1").addEventListener("click", () => show(modeChoice));
document.getElementById("backBtn2").addEventListener("click", () => show(modeChoice));

const TEAM_COLORS = ["#ff5470", "#3ddc84", "#4a9fff", "#ffd24a", "#b478ff", "#ff9040", "#2ee6d6", "#ff6ad5"];
let teamCount = 4;
let setIndex = 0;

/* Fragen-Set wählen: Karten mit Namen und Kategorie-Vorschau */
const setGrid = document.getElementById("setGrid");
BOARD_SETS.forEach((set, i) => {
  const cats = set.boards[0].categories.map((c) => c.name).join(" · ");
  const card = document.createElement("button");
  card.className = "set-card" + (i === setIndex ? " active" : "");
  card.innerHTML =
    '<span class="set-name">' + (i + 1) + ". " + set.name + "</span>" +
    '<span class="set-cats">' + cats + " …</span>";
  card.addEventListener("click", () => {
    setIndex = i;
    setGrid.querySelectorAll(".set-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
  });
  setGrid.appendChild(card);
});

/* Anzahl-Buttons 2–8 */
const countRow = document.getElementById("countRow");
for (let n = 2; n <= 8; n++) {
  const btn = document.createElement("button");
  btn.className = "count-btn" + (n === teamCount ? " active" : "");
  btn.textContent = n;
  btn.addEventListener("click", () => {
    teamCount = n;
    countRow.querySelectorAll(".count-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTeamInputs();
  });
  countRow.appendChild(btn);
}

/* Eingabefelder passend zur Anzahl (Namen bleiben beim Umschalten erhalten) */
function renderTeamInputs() {
  const wrap = document.getElementById("teamInputs");
  const existing = [...wrap.querySelectorAll("input")].map((inp) => inp.value);
  wrap.innerHTML = "";
  for (let i = 0; i < teamCount; i++) {
    const label = document.createElement("label");
    label.className = "team-input";
    label.innerHTML =
      '<span class="dot" style="background:' + TEAM_COLORS[i] + '"></span>' +
      '<input type="text" id="team' + i + '" maxlength="20">';
    wrap.appendChild(label);
    label.querySelector("input").value = existing[i] || "Team " + (i + 1);
  }
}
renderTeamInputs();

/* ---------- Gamemaster: Spiel erstellen ---------- */
document.getElementById("startBtn").addEventListener("click", () => {
  const teams = [];
  for (let i = 0; i < teamCount; i++) {
    const v = document.getElementById("team" + i).value.trim();
    teams.push({ name: v || "Team " + (i + 1), score: 0 });
  }

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
});

/* ---------- Beitreten ---------- */
document.getElementById("joinBtn").addEventListener("click", () => {
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
});
