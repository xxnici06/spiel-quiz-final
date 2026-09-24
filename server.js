/* ============================================================
   Spieleabend · Server
   - Liefert die statischen Spieldateien aus dem Ordner /public
   - Übernimmt das Echtzeit-Syncing per WebSocket:
     Jeder Spielcode ist ein "Raum". Nachrichten, die in einem
     Raum ankommen, werden an alle anderen im selben Raum
     weitergeleitet (wie vorher ntfy.sh, nur auf deinem Server).
   Keine Datenbank, kein Konto, nichts wird gespeichert.
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

/* ---------- Statische Dateien ausliefern ---------- */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  /* URL säubern und auf den public-Ordner beschränken (kein Ausbrechen) */
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const safePath = path
    .normalize(urlPath)
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Nicht gefunden: " + safePath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

/* ---------- WebSocket-Syncing ---------- */
const wss = new WebSocketServer({ server });

/* rooms: code -> Set von Verbindungen */
const rooms = new Map();

function joinRoom(code, ws) {
  if (!rooms.has(code)) rooms.set(code, new Set());
  rooms.get(code).add(ws);
  ws._code = code;
}

function leaveRoom(ws) {
  const code = ws._code;
  if (code && rooms.has(code)) {
    const set = rooms.get(code);
    set.delete(ws);
    if (set.size === 0) rooms.delete(code);
  }
}

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => { ws.isAlive = true; });

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch (e) { return; }

    /* Beitritt zu einem Raum */
    if (msg.type === "__join" && typeof msg.code === "string") {
      joinRoom(msg.code, ws);
      return;
    }

    /* Spielnachricht: an alle anderen im selben Raum weiterreichen */
    const code = ws._code;
    if (!code || !rooms.has(code)) return;
    const data = raw.toString();
    for (const peer of rooms.get(code)) {
      if (peer !== ws && peer.readyState === peer.OPEN) {
        peer.send(data);
      }
    }
  });

  ws.on("close", () => leaveRoom(ws));
  ws.on("error", () => leaveRoom(ws));
});

/* Tote Verbindungen regelmäßig aussortieren (Handys, die weg sind) */
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) { leaveRoom(ws); return ws.terminate(); }
    ws.isAlive = false;
    try { ws.ping(); } catch (e) {}
  });
}, 30000);

server.listen(PORT, () => {
  console.log("Spieleabend-Server läuft auf Port " + PORT);
});
