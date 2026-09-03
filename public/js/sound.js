/* ============================================================
   Sounds – synthetisch per Web Audio API (keine Dateien nötig)
   Browser erlauben Ton erst nach der ersten Nutzer-Interaktion,
   deshalb wird der AudioContext beim ersten Tippen entsperrt.
   ============================================================ */

let _audioCtx = null;

function _ctx() {
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

/* Beim ersten Tippen/Klicken entsperren (Handy-Anforderung) */
["pointerdown", "touchstart", "keydown"].forEach((ev) =>
  window.addEventListener(ev, () => _ctx(), { once: true, passive: true })
);

function _tone(freq, start, dur, type, vol, endFreq) {
  const ctx = _ctx();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/* ✓ Richtig: aufsteigender Dur-Dreiklang */
function soundCorrect() {
  _tone(523.25, 0.00, 0.16, "triangle", 0.25); // C5
  _tone(659.25, 0.10, 0.16, "triangle", 0.25); // E5
  _tone(783.99, 0.20, 0.30, "triangle", 0.28); // G5
}

/* ✗ Falsch: tiefer, absteigender Brummer */
function soundWrong() {
  _tone(220, 0.00, 0.28, "sawtooth", 0.16, 140);
  _tone(110, 0.00, 0.34, "square", 0.10, 80);
}

/* ✋ Melden/Buzzer: heller Doppel-Ding */
function soundBuzz() {
  _tone(880, 0.00, 0.12, "sine", 0.30);
  _tone(1174.66, 0.09, 0.28, "sine", 0.30); // D6
}

/* Leiser Klick (Feld auswählen) */
function soundClick() {
  _tone(600, 0, 0.06, "triangle", 0.12, 400);
}

/* Fanfare (Boardwechsel / Ende) */
function soundFanfare() {
  _tone(523.25, 0.00, 0.15, "triangle", 0.22);
  _tone(659.25, 0.12, 0.15, "triangle", 0.22);
  _tone(783.99, 0.24, 0.15, "triangle", 0.22);
  _tone(1046.5, 0.36, 0.45, "triangle", 0.28);
}
