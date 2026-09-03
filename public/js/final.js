/* Endstand: Ranking aus dem Spielstand anzeigen */

const STORAGE_KEY = "quizabend_state_v1";

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let state = null;
try {
  state = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch (e) {}

if (!state || !state.teams) {
  window.location.href = "index.html";
} else {
  const ranked = [...state.teams].sort((a, b) => b.score - a.score);
  const podium = document.getElementById("podium");
  ranked.forEach((t, i) => {
    const row = document.createElement("div");
    row.className = "rank-row" + (i === 0 ? " first" : "");
    row.innerHTML =
      '<div class="rank-left">' +
        '<span class="rank-num">#' + (i + 1) + "</span>" +
        '<span class="rank-name">' + escapeHtml(t.name) + "</span>" +
      "</div>" +
      '<span class="rank-score' + (t.score < 0 ? " neg" : "") + '">' + t.score + "</span>";
    podium.appendChild(row);
  });
}

document.getElementById("newGameBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = "index.html";
});
