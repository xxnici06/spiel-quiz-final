/* ============================================================
   Mitspieler-Panel (Gamemaster-Setup + Spiel)
   Zeigt Beitritts-Link, QR-Code und – sobald ein Spiel läuft –
   den Spielcode. Funktioniert lokal wie auf dem Hosting.
   ============================================================ */

(function () {
  const STATE_KEY = "quizabend_state_v1";

  let bases = [location.origin.replace(/\/$/, "")];
  let baseIndex = 0;

  /* ---------- Stil ---------- */
  const style = document.createElement("style");
  style.textContent = `
  .cp-fab{position:fixed; right:16px; bottom:16px; z-index:9998;
    font-family:'Exo 2',sans-serif; font-weight:800; font-style:italic; letter-spacing:.04em;
    border:1px solid var(--cell-border,#3a63c0); cursor:pointer; color:#fff; font-size:.9rem;
    background:linear-gradient(180deg,#1e3f86,#0d1d44); border-radius:999px; padding:12px 20px;
    box-shadow:0 8px 22px rgba(0,0,0,.45);}
  .cp-fab:hover{filter:brightness(1.15);}
  .cp-overlay{position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center;
    background:rgba(4,10,26,.78); backdrop-filter:blur(3px); padding:20px;}
  .cp-card{max-width:520px; width:100%; max-height:92vh; overflow-y:auto;
    background:linear-gradient(180deg,#10224e,#0c1a3d); border:1px solid rgba(58,99,192,.5);
    border-radius:22px; padding:24px 24px 26px; box-shadow:0 30px 70px rgba(0,0,0,.55);}
  .cp-card h2{font-family:'Exo 2',sans-serif; font-weight:900; font-style:italic; margin:0 0 4px; font-size:1.3rem;
    color:#f5f7ff; text-align:center;}
  .cp-sub{text-align:center; color:#8fa0cc; font-size:.82rem; margin:0 0 16px;}
  .cp-qr{background:#fff; border-radius:16px; padding:14px; width:230px; height:230px; margin:0 auto 14px;
    display:flex; align-items:center; justify-content:center;}
  .cp-qr img{width:100%; height:100%; display:block; image-rendering:pixelated;}
  .cp-code{text-align:center; margin:0 0 14px;}
  .cp-code .lbl{font-size:.68rem; letter-spacing:.2em; color:#8fa0cc; text-transform:uppercase;}
  .cp-code .val{font-family:'Exo 2',sans-serif; font-weight:900; font-style:italic; font-size:2rem;
    letter-spacing:.32em; color:#ffd24a;}
  .cp-link{display:flex; gap:8px; margin-bottom:12px;}
  .cp-link input{flex:1; min-width:0; background:rgba(255,255,255,.05); border:1px solid rgba(58,99,192,.45);
    color:#f5f7ff; border-radius:12px; padding:11px 12px; font-size:.9rem; font-family:'Work Sans',sans-serif;}
  .cp-btn{font-family:'Exo 2',sans-serif; font-weight:800; font-style:italic; letter-spacing:.04em;
    border:1px solid var(--cell-border,#3a63c0); background:linear-gradient(180deg,#1e3f86,#0d1d44);
    color:#fff; border-radius:12px; padding:11px 16px; cursor:pointer; font-size:.85rem;}
  .cp-btn:hover{filter:brightness(1.15);}
  .cp-row{display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:12px;}
  .cp-chip{font-size:.75rem; padding:7px 12px; border-radius:999px; cursor:pointer;
    background:rgba(255,255,255,.05); border:1px solid rgba(58,99,192,.4); color:#8fa0cc;}
  .cp-chip.active{border-color:#ffd24a; color:#ffd24a; background:rgba(255,210,74,.08);}
  .cp-note{font-size:.76rem; color:#8fa0cc; line-height:1.5; text-align:center; margin:4px 0 0;}
  .cp-close{position:sticky; top:0; float:right; background:transparent; border:none; color:#8fa0cc;
    font-size:1.6rem; cursor:pointer; line-height:1; margin:-6px -6px 0 0;}
  `;
  document.head.appendChild(style);

  /* ---------- Hilfsfunktionen ---------- */
  function currentCode() {
    try {
      const s = JSON.parse(localStorage.getItem(STATE_KEY));
      return s && s.onlineCode ? s.onlineCode : null;
    } catch (e) { return null; }
  }
  function activeBase() { return bases[baseIndex] || location.origin.replace(/\/$/, ""); }
  function joinLink() {
    const code = currentCode();
    return activeBase() + "/jeopardy.html" + (code ? "?code=" + code : "");
  }

  /* Nur beim lokalen Testen (localhost) zusätzliche Netz-Adressen anbieten. */
  async function loadExtraBases() {
    if (!/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) return;
    try {
      const r = await fetch("/lan-info", { cache: "no-store" });
      const j = await r.json();
      (j.urls || []).forEach((u) => { if (!bases.includes(u)) bases.push(u); });
      if (bases.length > 1) baseIndex = 1; // die LAN-Adresse ist für Handys nützlicher
    } catch (e) {}
  }

  /* ---------- Panel ---------- */
  let overlay = null;

  function render() {
    if (!overlay) return;
    const link = joinLink();
    const code = currentCode();
    const chips = bases.length > 1
      ? `<div class="cp-row">${bases.map((b, i) =>
          `<span class="cp-chip ${i === baseIndex ? "active" : ""}" data-base="${i}">${b.replace(/^https?:\/\//, "")}</span>`
        ).join("")}</div>`
      : "";

    overlay.querySelector(".cp-card").innerHTML = `
      <button class="cp-close" title="Schliessen">&times;</button>
      <h2>📱 Mitspieler & Gameboard</h2>
      <p class="cp-sub">Handy-Kamera auf den Code halten – oder Link öffnen und ${code ? "Code eingeben" : "Rolle wählen"}.</p>
      <div class="cp-qr"><img alt="QR-Code zum Beitreten" src="/qr?text=${encodeURIComponent(link)}"></div>
      ${code ? `<div class="cp-code"><div class="lbl">Spielcode</div><div class="val">${code}</div></div>` : ""}
      <div class="cp-link">
        <input type="text" readonly value="${link}">
        <button class="cp-btn" data-act="copy">Kopieren</button>
      </div>
      ${chips}
      <p class="cp-note">Der QR-Code führt Mitspieler direkt zur Team-Auswahl. Für das grosse Bild (Beamer/TV) den Link öffnen und «Gameboard» wählen.</p>
    `;
    wire();
  }

  function wire() {
    const card = overlay.querySelector(".cp-card");
    card.querySelector(".cp-close").onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    card.querySelectorAll("[data-base]").forEach((el) => {
      el.onclick = () => { baseIndex = +el.dataset.base; render(); };
    });
    const copyBtn = card.querySelector('[data-act="copy"]');
    if (copyBtn) copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(joinLink());
        copyBtn.textContent = "Kopiert ✓";
        setTimeout(() => (copyBtn.textContent = "Kopieren"), 1500);
      } catch (e) {
        card.querySelector(".cp-link input").select();
      }
    };
  }

  function open() {
    overlay = document.createElement("div");
    overlay.className = "cp-overlay";
    overlay.innerHTML = `<div class="cp-card"></div>`;
    document.body.appendChild(overlay);
    render();
  }
  function close() { if (overlay) { overlay.remove(); overlay = null; } }

  const fab = document.createElement("button");
  fab.className = "cp-fab";
  fab.textContent = "📱 Mitspieler";
  fab.onclick = open;
  document.body.appendChild(fab);

  loadExtraBases();
})();
