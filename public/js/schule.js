/* ============================================================
   ZURÜCK IN DIE SCHULE · Gamemaster / Gameboard
   Alle bekommen dieselbe Frage, schreiben die Antwort auf ihre
   Tafel (Handy), nach 60 s wird aufgedeckt. Der Lehrer bewertet
   jede Tafel. Falsch = −1 Leben (Start: 2). Zwei Joker pro
   Spieler: 🔍 Spicken (3 s auf eine fremde Tafel) und 🙅 Jokertag
   (diese Frage aussetzen). Von Klasse 1 bis 12.
   ============================================================ */

const PLAYER_COLORS = ["#ff5470","#3ddc84","#4a9fff","#ffd24a","#b478ff","#ff9040","#2ee6d6","#ff6ad5","#9dff57","#ff4a4a","#57c8ff","#ffe14a"];
const SUBJECT_META = {
  "Mathe":               { c:"#ffd866", e:"➗" },
  "Allgemeinbildung":      { c:"#7ec8ff", e:"🌍" },
  "Deutsch":             { c:"#ffb27a", e:"📖" },
  "Natur und Technik": { c:"#8ce99a", e:"🔬" },
};
const LIVES = 2;
const QUESTION_SECONDS = 60;

let state = null;      // Gesamtzustand
let drawings = {};     // index -> dataURL (aktuelle Frage)
let sub = null;        // Netz-Abo
let timerInt = null, timerEnd = 0;
let pending = null;    // { elim:[], gradeUp:bool } zwischen Overlays

let setupNames = [];   // Namen im Setup

function $(id){ return document.getElementById(id); }
function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function col(i){ return PLAYER_COLORS[i % PLAYER_COLORS.length]; }

/* ---------------- Rollen- / Setup-UI ---------------- */
$("roleGmBtn").addEventListener("click", () => {
  $("roleView").classList.add("hidden");
  $("setupView").classList.remove("hidden");
});
$("backToRoleBtn").addEventListener("click", () => {
  $("setupView").classList.add("hidden");
  $("roleView").classList.remove("hidden");
});
$("addBtn").addEventListener("click", addName);
$("nameInput").addEventListener("keydown", (e) => { if(e.key === "Enter") addName(); });

function addName(){
  const inp = $("nameInput");
  const name = inp.value.trim();
  $("setupError").textContent = "";
  if(!name) return;
  if(setupNames.length >= 10){ $("setupError").textContent = "Maximal 10 Spieler."; return; }
  if(setupNames.some(n => n.toLowerCase() === name.toLowerCase())){ $("setupError").textContent = "Name schon vergeben."; return; }
  setupNames.push(name);
  inp.value = "";
  inp.focus();
  renderSetupNames();
}
function renderSetupNames(){
  $("nameList").innerHTML = setupNames.map((n, i) =>
    '<span class="sch-name-chip" style="--pc:' + col(i) + '">' + escapeHtml(n) +
    ' <button data-i="' + i + '">✕</button></span>'
  ).join("");
  $("nameList").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => { setupNames.splice(+b.dataset.i, 1); renderSetupNames(); });
  });
}

$("startBtn").addEventListener("click", () => {
  $("setupError").textContent = "";
  if(setupNames.length < 2){ $("setupError").textContent = "Mindestens 2 Spieler."; return; }
  startGame();
});

/* ---------------- Spielstart ---------------- */
function startGame(){
  let code;
  try{ code = makeGameCode(); }
  catch(e){ code = "SCHULE"; }
  state = {
    status: "playing",
    code,
    players: setupNames.map(n => ({ name:n, lives:LIVES, out:false, spy:true, skip:true })),
    gi: 0, qi: 0,
    phase: "lobby",
    seated: {}, submitted: {}, skipped: {}, marks: {}, started: {},
    winner: null,
  };
  drawings = {};

  /* Ansicht ZUERST umschalten – so erscheint das Brett auch dann,
     wenn der Verbindungsaufbau (z. B. lokal per file://) hakt. */
  $("setupView").classList.add("hidden");
  $("roleView").classList.add("hidden");
  $("gameView").classList.remove("hidden");
  $("codeChip").textContent = code;

  /* Netzwerk absichern, damit ein Fehler den Start nie blockiert. */
  try{
    if(sub){ try{ sub.close(); }catch(e){} }
    sub = netSubscribe(code, onNet, () => broadcast());
  }catch(e){
    console.warn("Verbindung konnte nicht aufgebaut werden:", e);
  }

  /* Kein Timer, keine Frage – erst warten, bis alle sitzen. */
  broadcast();
  render();
}

/* Startet die erste Frage, sobald alle auf ihren Plätzen sitzen. */
function beginRound(){
  if(!state || state.phase !== "lobby") return;
  loadQuestion();
}

function curGrade(){ return SCHULE_GRADES[state.gi]; }
function gradeLabel(){ return curGrade().klasse; }
function qCount(){ return curGrade().questions.length; }
function qkey(){ return state.gi + "-" + state.qi; }
function currentQ(){ return curGrade().questions[state.qi]; }

function loadQuestion(){
  state.phase = "answering";
  state.submitted = {}; state.skipped = {}; state.marks = {}; state.started = {};
  drawings = {};
  startTimer();
  broadcast();
  render();
}

/* ---------------- Timer ---------------- */
function startTimer(){
  stopTimer();
  timerEnd = Date.now() + QUESTION_SECONDS * 1000;
  updateTimer();
  timerInt = setInterval(updateTimer, 250);
}
function stopTimer(){ if(timerInt){ clearInterval(timerInt); timerInt = null; } }
function updateTimer(){
  const el = $("timer");
  if(!el) return;
  const s = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
  el.textContent = s;
  el.classList.toggle("low", s <= 10);
  if(s === 0){ stopTimer(); if(state && state.phase === "answering") reveal(); }
}

/* ---------------- Netz: Nachrichten der Handys ---------------- */
function onNet(msg){
  if(!msg || msg.from !== "p" || !state) return;
  if(msg.type === "hello"){ broadcast(); return; }
  if(msg.type === "joined"){
    if(typeof msg.me === "number" && state.players[msg.me]) state.seated[msg.me] = true;
    broadcast();
    if(state.phase === "lobby") render();
    return;
  }
  const i = msg.me;
  if(typeof i !== "number" || !state.players[i]) return;

  if(msg.type === "draw"){
    if(msg.q === qkey() && state.phase === "answering"){
      drawings[i] = msg.img;
      if(!state.started[i] && !state.submitted[i]){ state.started[i] = true; render(); }
    }
    return;
  }
  if(msg.type === "submit"){
    if(msg.q === qkey()){
      if(msg.img) drawings[i] = msg.img;
      state.submitted[i] = true; state.started[i] = true;
      broadcast(); render();
    }
    return;
  }
  if(msg.type === "joker"){
    if(msg.kind === "spy"){ state.players[i].spy = false; }
    else if(msg.kind === "skip" && state.phase === "answering"){
      state.players[i].skip = false; state.skipped[i] = true;
    }
    broadcast(); render();
    return;
  }
}

/* ---------------- Snapshot senden ---------------- */
function broadcast(){
  if(!state) return;
  const showQ = (state.phase === "answering" || state.phase === "reveal");
  const q = showQ ? currentQ() : null;
  const s = {
    g: "schule",
    status: state.status === "ended" ? "ended" : "playing",
    phase: state.phase,
    grade: gradeLabel(), qi: state.qi, qtotal: qCount(),
    qkey: qkey(),
    subject: q ? q.subject : null,
    text: q ? q.q : null,
    answer: (state.phase === "reveal" && q) ? q.a : null,
    players: state.players.map(p => [p.name, p.lives, p.out ? 1 : 0, p.spy ? 1 : 0, p.skip ? 1 : 0]),
    seated: state.players.map((_, i) => state.seated && state.seated[i] ? 1 : 0),
    submitted: state.players.map((_, i) => state.submitted[i] ? 1 : 0),
    skipped: state.players.map((_, i) => state.skipped[i] ? 1 : 0),
    started: state.players.map((_, i) => state.started[i] ? 1 : 0),
    marks: state.players.map((_, i) => state.marks[i] || null),
    win: state.winner,
  };
  netPublish(state.code, { from: "gm", type: "state", s });
}

/* ---------------- Aufdecken & Bewerten ---------------- */
function reveal(){
  stopTimer();
  state.phase = "reveal";
  if(typeof soundBuzz === "function") soundBuzz();
  broadcast();
  render();
}
function setMark(i, val){
  if(state.players[i].out || state.skipped[i]) return;
  state.marks[i] = (state.marks[i] === val) ? null : val;
  broadcast();
  render();
}
function markAllOk(){
  state.players.forEach((p, i) => { if(!p.out && !state.skipped[i]) state.marks[i] = "ok"; });
  broadcast(); render();
}

function applyAndNext(){
  stopTimer();
  const elim = [];
  state.players.forEach((p, i) => {
    if(p.out || state.skipped[i]) return;
    if(state.marks[i] === "bad"){
      p.lives--;
      if(p.lives <= 0){ p.lives = 0; p.out = true; elim.push(i); }
    }
  });

  let gradeUp = false;
  state.qi++;
  if(state.qi >= qCount()){ state.qi = 0; state.gi++; gradeUp = true; }

  drawings = {}; state.submitted = {}; state.skipped = {}; state.marks = {}; state.started = {};
  pending = { elim, gradeUp };

  if(elim.length){ showElim(elim); }
  else afterElim();
}

function showElim(elim){
  if(typeof soundWrong === "function") soundWrong();
  $("elimList").innerHTML = elim.map(i => escapeHtml(state.players[i].name)).join("<br>");
  $("elimOverlay").classList.remove("hidden");
}
$("elimContinueBtn").addEventListener("click", () => {
  $("elimOverlay").classList.add("hidden");
  afterElim();
});

function afterElim(){
  const active = state.players.filter(p => !p.out).length;
  if(active <= 1 || state.gi >= SCHULE_GRADES.length){ endGame(); return; }
  if(pending && pending.gradeUp){ showGradeOverlay(); }
  else loadQuestion();
}

function showGradeOverlay(){
  if(typeof soundCorrect === "function") soundCorrect();
  $("gradeOvText").textContent = "Klasse " + gradeLabel() + "!";
  $("gradeOverlay").classList.remove("hidden");
}
$("gradeContinueBtn").addEventListener("click", () => {
  $("gradeOverlay").classList.add("hidden");
  loadQuestion();
});

/* ---------------- Spielende ---------------- */
function endGame(){
  stopTimer();
  state.status = "ended";
  state.phase = "gameover";
  let best = -1, wi = null;
  state.players.forEach((p, i) => { if(p.lives > best){ best = p.lives; wi = i; } });
  state.winner = best > 0 ? wi : null;
  broadcast();
  render();
}

/* ---------------- Reset ---------------- */
$("resetBtn").addEventListener("click", () => {
  if(!confirm("Spiel wirklich zurücksetzen?")) return;
  doReset();
});
$("newGameBtn").addEventListener("click", doReset);
function doReset(){
  stopTimer();
  if(state){ try{ netPublish(state.code, { from:"gm", type:"state", s:{ g:"schule", status:"reset" } }); }catch(e){} }
  if(sub){ try{ sub.close(); }catch(e){} sub = null; }
  location.reload();
}

/* ---------------- Rendering ---------------- */
function render(){
  if(!state) return;
  if(state.status === "ended"){ renderGameover(); return; }
  if(state.phase === "lobby"){ renderLobby(); return; }

  const q = currentQ();
  const meta = SUBJECT_META[q.subject] || { c:"#fff", e:"" };
  $("gradeChip").textContent = "KLASSE " + gradeLabel();
  $("subjectChip").textContent = meta.e + " " + q.subject;
  $("qCountChip").textContent = "FRAGE " + (state.qi + 1) + "/" + qCount();

  const badge = $("boardSubject");
  badge.textContent = meta.e + " " + q.subject;
  badge.style.setProperty("--sc", meta.c);
  $("boardQuestion").textContent = q.q;

  const timerEl = $("timer");
  timerEl.classList.toggle("hidden", state.phase !== "answering");

  const ans = $("boardAnswer");
  if(state.phase === "reveal"){
    ans.innerHTML = '<div class="sch-answer-reveal"><small>Musterlösung</small>' + escapeHtml(q.a) + "</div>";
  } else ans.innerHTML = "";

  renderControls();
  renderGrid();
}

function renderLobby(){
  stopTimer();
  const N = state.players.length;
  const seatedCount = state.players.filter((_, i) => state.seated[i]).length;

  $("gradeChip").textContent = "KLASSE " + gradeLabel();
  $("subjectChip").textContent = "🪑 Lobby";
  $("qCountChip").textContent = seatedCount + "/" + N + " SITZEN";

  const badge = $("boardSubject");
  badge.textContent = "🪑 Nehmt eure Plätze ein";
  badge.style.setProperty("--sc", "#e8dcc0");
  $("boardQuestion").textContent = seatedCount >= N
    ? "Alle sitzen – die Stunde kann beginnen!"
    : "Warten auf die Klasse …";
  $("boardAnswer").innerHTML = '<div class="sch-lobby-code">Mitspielen unter <b>schule-handy.html</b> · Code <b>' + state.code + "</b></div>";
  $("timer").classList.add("hidden");

  const hint = $("phaseHint");
  hint.textContent = seatedCount >= 2
    ? "Sobald alle auf ihren Stühlen sitzen, auf «Stunde beginnen» klicken."
    : "Öffnet schule-handy.html am Handy, gebt den Code ein und nehmt Platz.";

  const c = $("controls");
  c.innerHTML = '<button class="sch-btn green big" id="beginBtn">📖 STUNDE BEGINNEN</button>';
  $("beginBtn").addEventListener("click", beginRound);

  $("playerGrid").innerHTML = state.players.map((p, i) => {
    const seated = !!state.seated[i];
    return (
      '<div class="sch-seat' + (seated ? " seated" : "") + '" style="--pc:' + col(i) + '">' +
        '<div class="sch-seat-icon">' + (seated ? "🧑‍🎓" : "🪑") + "</div>" +
        '<div class="sch-seat-name">' + escapeHtml(p.name) + "</div>" +
        '<div class="sch-seat-status">' + (seated ? "sitzt bereit ✅" : "noch nicht da") + "</div>" +
      "</div>"
    );
  }).join("");
}

function renderControls(){
  const c = $("controls");
  const hint = $("phaseHint");
  if(state.phase === "answering"){
    hint.textContent = "Alle schreiben ihre Antwort auf die Tafel …";
    c.innerHTML = '<button class="sch-btn wood big" id="revealBtn">👀 JETZT AUFDECKEN</button>';
    $("revealBtn").addEventListener("click", reveal);
  } else if(state.phase === "reveal"){
    hint.textContent = "Bewerte jede Tafel: ✓ richtig · ✗ falsch (−1 Leben).";
    c.innerHTML =
      '<button class="sch-btn green" id="allOkBtn">✓ Alle richtig</button>' +
      '<button class="sch-btn red big" id="nextBtn">NÄCHSTE FRAGE →</button>';
    $("allOkBtn").addEventListener("click", markAllOk);
    $("nextBtn").addEventListener("click", applyAndNext);
  } else { hint.textContent = ""; c.innerHTML = ""; }
}

function renderGrid(){
  const grid = $("playerGrid");
  const reveal = state.phase === "reveal";
  grid.innerHTML = state.players.map((p, i) => {
    const dead = p.out;
    let cls = "sch-slate" + (dead ? " dead" : "");
    if(reveal && !dead && !state.skipped[i]){
      if(state.marks[i] === "ok") cls += " ok";
      else if(state.marks[i] === "bad") cls += " bad";
    }
    let lives = "";
    for(let h = 0; h < LIVES; h++) lives += '<span class="' + (h < p.lives ? "" : "lost") + '">❤️</span>';

    /* Jokersymbole (verfügbar = hell) */
    const jok = '<span style="opacity:' + (p.spy?1:0.25) + '">🔍</span> <span style="opacity:' + (p.skip?1:0.25) + '">🙅</span>';

    let body, status = "";
    if(dead){
      body = '<div class="sch-canvas-empty">—</div>';
      status = '<div class="sch-slate-status raus">DURCHGEFALLEN</div>';
    } else if(state.skipped[i]){
      body = '<div class="sch-canvas-empty">🙅 Jokertag</div>';
      status = '<div class="sch-slate-status skip">Frage ausgesetzt</div>';
    } else if(reveal){
      body = drawings[i]
        ? '<img src="' + drawings[i] + '" alt="">'
        : '<div class="sch-canvas-empty">keine Antwort</div>';
      status = '<div class="sch-mark-row">' +
        '<button class="sch-mark bad' + (state.marks[i]==="bad"?" sel":"") + '" data-i="' + i + '" data-v="bad">✗</button>' +
        '<button class="sch-mark ok' + (state.marks[i]==="ok"?" sel":"") + '" data-i="' + i + '" data-v="ok">✓</button>' +
        '</div>';
    } else {
      body = '<div class="sch-canvas-empty">' + (state.submitted[i] ? "🖊️" : (state.started[i] ? "✍️" : "…")) + '</div>';
      status = '<div class="sch-slate-status ' + (state.submitted[i] ? "done" : "") + '">' +
        (state.submitted[i] ? "✓ abgegeben" : (state.started[i] ? "schreibt …" : "wartet …")) + "</div>";
    }

    return (
      '<div class="' + cls + '" style="--pc:' + col(i) + '">' +
        '<div class="sch-slate-head">' +
          '<span class="sch-slate-name">' + escapeHtml(p.name) + "</span>" +
          '<span class="sch-slate-lives">' + lives + "</span>" +
        "</div>" +
        '<div class="sch-canvas-frame">' + body + "</div>" +
        '<div style="text-align:center; margin-top:6px; font-size:0.95rem;">' + jok + "</div>" +
        status +
      "</div>"
    );
  }).join("");

  grid.querySelectorAll(".sch-mark").forEach((b) => {
    b.addEventListener("click", () => setMark(+b.dataset.i, b.dataset.v));
  });
}

function renderGameover(){
  stopTimer();
  $("winnerName").textContent = state.winner !== null ? state.players[state.winner].name : "Unentschieden";
  const order = state.players.map((p, i) => i).sort((a, b) => state.players[b].lives - state.players[a].lives);
  $("standings").innerHTML = order.map((i, rank) => {
    const p = state.players[i];
    let lives = "";
    for(let h = 0; h < LIVES; h++) lives += (h < p.lives ? "❤️" : "🤍");
    return '<div class="sch-standing' + (rank===0 && state.winner!==null ? " first" : "") + '" style="--pc:' + col(i) + '">' +
      "<span>" + (rank===0 && state.winner!==null ? "🎓 " : "") + escapeHtml(p.name) + "</span>" +
      "<span>" + (p.out ? "durchgefallen" : lives) + "</span></div>";
  }).join("");
  $("winnerOverlay").classList.remove("hidden");
  broadcast();
}
