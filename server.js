/* ============================================================
   Spieleabend · Server (Sync + statische Dateien)

   - Liefert die Spieldateien aus /public aus
   - Übernimmt das Echtzeit-Syncing per WebSocket:
     Jeder Spielcode ist ein "Raum". Nachrichten in einem Raum
     werden an alle anderen im selben Raum weitergeleitet.
   - Zusätzliche Hilfs-Endpunkte für die Desktop-App:
       GET /lan-info     -> { port, urls:[...] }  (Adressen im lokalen Netz)
       GET /qr?text=...  -> QR-Code als SVG

   Keine Datenbank, kein Konto, nichts wird gespeichert.

   Zwei Betriebsarten:
   - Als Website:      `node server.js`  (z. B. auf Render)
   - In der Desktop-App: main.js ruft startServer() auf
   ============================================================ */

const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { WebSocketServer } = require("ws");

let QRCode = null;
try { QRCode = require("qrcode"); } catch (e) { /* optional */ }

const PUBLIC_DIR = path.join(__dirname, "public");

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

/* ---------- Adressen im lokalen Netz ermitteln ---------- */
function lanAddresses() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const net of ifaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) out.push(net.address);
    }
  }
  return out;
}

/* ---------- HTTP-Handler ---------- */
function createRequestHandler(getPort) {
  return function handle(req, res) {
    const parsed = new URL(req.url, "http://localhost");
    let urlPath = decodeURIComponent(parsed.pathname);

    /* Hilfs-Endpunkt: Adressen im lokalen Netz */
    if (urlPath === "/lan-info") {
      res.writeHead(200, { "Content-Type": MIME[".json"] });
      const port = getPort();
      res.end(JSON.stringify({
        port,
        urls: lanAddresses().map((ip) => `http://${ip}:${port}`),
      }));
      return;
    }

    /* Hilfs-Endpunkt: QR-Code als SVG */
    if (urlPath === "/qr") {
      const text = parsed.searchParams.get("text") || "";
      if (!QRCode || !text) { res.writeHead(404); res.end(); return; }
      QRCode.toString(text, { type: "svg", margin: 1, width: 512 }, (err, svg) => {
        if (err) { res.writeHead(500); res.end(); return; }
        res.writeHead(200, { "Content-Type": MIME[".svg"], "Cache-Control": "no-store" });
        res.end(svg);
      });
      return;
    }

    if (urlPath === "/") urlPath = "/index.html";

    const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(PUBLIC_DIR, safePath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403); res.end("Forbidden"); return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Nicht gefunden: " + safePath);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
      /* Spieldateien immer frisch laden, damit ein Redeploy sofort greift. */
      if ([".html", ".js", ".css"].includes(ext)) headers["Cache-Control"] = "no-cache";
      res.writeHead(200, headers);
      res.end(data);
    });
  };
}

/* ---------- WebSocket-Syncing ---------- */
function attachWebSocket(server) {
  const wss = new WebSocketServer({ server });
  const rooms = new Map(); // code -> Set<ws>

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

      if (msg.type === "__join" && typeof msg.code === "string") {
        joinRoom(msg.code, ws);
        return;
      }
      const code = ws._code;
      if (!code || !rooms.has(code)) return;
      const data = raw.toString();
      for (const peer of rooms.get(code)) {
        if (peer !== ws && peer.readyState === peer.OPEN) peer.send(data);
      }
    });

    ws.on("close", () => leaveRoom(ws));
    ws.on("error", () => leaveRoom(ws));
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) { leaveRoom(ws); return ws.terminate(); }
      ws.isAlive = false;
      try { ws.ping(); } catch (e) {}
    });
  }, 30000);
  wss.on("close", () => clearInterval(interval));

  return wss;
}

/* ---------- Server starten (mit Port-Fallback) ---------- */
function startServer(preferredPort) {
  let actualPort = preferredPort || Number(process.env.PORT) || 3000;
  const handler = createRequestHandler(() => actualPort);
  const server = http.createServer(handler);
  attachWebSocket(server);

  return new Promise((resolve, reject) => {
    let attempts = 0;
    function tryListen(port) {
      actualPort = port;
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && attempts < 15) {
          attempts++;
          tryListen(port + 1);
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        server.removeAllListeners("error");
        resolve({ server, port: actualPort, urls: lanAddresses().map((ip) => `http://${ip}:${actualPort}`) });
      });
    }
    tryListen(actualPort);
  });
}

module.exports = { startServer, lanAddresses };

/* Direkt aufgerufen (Website-Betrieb) */
if (require.main === module) {
  startServer()
    .then(({ port, urls }) => {
      console.log("Spieleabend-Server läuft auf Port " + port);
      if (urls.length) console.log("Im lokalen Netz erreichbar unter: " + urls.join("  "));
    })
    .catch((err) => {
      console.error("Server konnte nicht starten:", err);
      process.exit(1);
    });
}
