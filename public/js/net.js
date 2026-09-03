/* ============================================================
   Netzwerk-Schicht über den eigenen Server (WebSocket)
   Gleiche Funktionen wie zuvor (makeGameCode / netPublish /
   netSubscribe), damit der restliche Spielcode unverandert
   funktioniert - nur laeuft alles jetzt ueber deinen Server
   statt ueber ntfy.sh. Kein Ratenlimit, kein fremder Dienst.
   ============================================================ */

/* Der WebSocket laeuft auf demselben Host wie die Seite:
   http -> ws, https -> wss. Funktioniert lokal wie online. */
const WS_URL =
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host;

/* Gut lesbares Code-Alphabet ohne verwechselbare Zeichen (0/O, 1/I) */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeGameCode() {
  let code = "";
  const rnd = new Uint32Array(6);
  crypto.getRandomValues(rnd);
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[rnd[i] % CODE_ALPHABET.length];
  return code;
}

function normCode(code) {
  return String(code).trim().toUpperCase();
}

/* ------------------------------------------------------------
   Pro Spielcode wird eine WebSocket-Verbindung aufgebaut und
   offen gehalten. Sowohl Senden als auch Empfangen laufen
   darueber. Bei Verbindungsabbruch wird automatisch neu
   verbunden.
   ------------------------------------------------------------ */
const _conns = {}; // code -> { ws, listeners:Set, onconnect:Set, queue:[] }

function _ensureConn(code) {
  code = normCode(code);
  let c = _conns[code];
  if (c && c.ws && (c.ws.readyState === WebSocket.OPEN || c.ws.readyState === WebSocket.CONNECTING)) {
    return c;
  }

  c = _conns[code] || { listeners: new Set(), onconnect: new Set(), queue: [] };
  _conns[code] = c;

  const ws = new WebSocket(WS_URL);
  c.ws = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "__join", code: code }));
    while (c.queue.length) ws.send(c.queue.shift());
    c.onconnect.forEach((fn) => { try { fn(); } catch (e) {} });
  };

  ws.onmessage = (e) => {
    let payload;
    try { payload = JSON.parse(e.data); } catch (err) { return; }
    if (payload && payload.type === "__join") return;
    c.listeners.forEach((fn) => { try { fn(payload); } catch (err) {} });
  };

  ws.onclose = () => {
    setTimeout(() => {
      if (_conns[code] && _conns[code].listeners.size > 0) _ensureConn(code);
    }, 1500);
  };

  ws.onerror = () => { try { ws.close(); } catch (e) {} };

  return c;
}

/* Nachricht senden (feuert und vergisst) */
async function netPublish(code, payload) {
  const c = _ensureConn(code);
  const data = JSON.stringify(payload);
  if (c.ws.readyState === WebSocket.OPEN) {
    c.ws.send(data);
  } else {
    c.queue.push(data);
  }
  return true;
}

/* Nachrichten empfangen. onMessage(payload) pro Nachricht,
   onConnect() bei (Wieder-)Verbindung. Gibt Objekt mit close(). */
function netSubscribe(code, onMessage, onConnect) {
  const c = _ensureConn(code);
  if (onMessage) c.listeners.add(onMessage);
  if (onConnect) c.onconnect.add(onConnect);

  if (onConnect && c.ws.readyState === WebSocket.OPEN) {
    try { onConnect(); } catch (e) {}
  }

  return {
    close: function () {
      if (onMessage) c.listeners.delete(onMessage);
      if (onConnect) c.onconnect.delete(onConnect);
      if (c.listeners.size === 0) {
        try { c.ws.close(); } catch (e) {}
        delete _conns[normCode(code)];
      }
    },
  };
}
