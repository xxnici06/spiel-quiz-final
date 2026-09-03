# 🎮 Spieleabend online stellen – Schritt für Schritt

Dieselbe Vorgehensweise wie bisher: Code zu **GitHub**, dann bei **Render**
deployen. Der Server liefert die Spielseiten aus **und** übernimmt das
Live-Syncing zwischen Gamemaster, Gameboard und Handys. Keine Datenbank,
kein Konto für die Mitspieler, nichts wird gespeichert.

Zeitaufwand beim ersten Mal ~15 Minuten. Danach reicht ein Datei-Upload,
Render baut automatisch neu.

---

## Was ist neu (Stand dieser Version)

- **Jeopardy komplett überarbeitet:** 10 Themen-Sets statt 5, jedes mit
  2 Runden. 100 verschiedene Kategorien, keine Wiederholungen. Die
  Schwierigkeit steigt in **jeder** Kategorie sauber von leicht (Stufe 1)
  bis knifflig (Stufe 5); Runde 2 liegt durchgehend ein Level höher.
- **Mitspieler-Panel:** Knopf **„📱 Mitspieler"** unten rechts (auf der
  Startseite und im Spiel). Zeigt **Beitritts-Link + QR-Code** und, sobald
  ein Spiel läuft, den **Spielcode**. Handy-Kamera draufhalten – landet
  direkt bei der Team-Auswahl.
- **QR auf dem Gameboard:** Nachzügler können den Code direkt vom
  Beamer/TV scannen.
- **Bedienung für den Gamemaster:** Tastatur-Kürzel während einer Frage
  (`1` richtig · `2` falsch · `A` Antwort ein-/ausblenden · `Esc` Feld
  doch offen lassen · `Enter` weiter). Neuer Knopf „Feld doch offen
  lassen", solange noch niemand geantwortet hat. Zähler „x/25 Felder"
  in der Kopfzeile.
- **Startseite:** Themen als 2-spaltige Übersicht mit Vorschau beider
  Runden, „🎲 Zufall"-Knopf, zuletzt genutzte Team-Namen werden gemerkt.
- „Der Dümmste fliegt" ist unverändert.

---

## Was ist in diesem Ordner?

```
spieleabend-server/
├── server.js          ← der Server (liefert Seiten + Sync + QR-Codes)
├── package.json        ← sagt Render, was zu installieren ist
├── .gitignore
├── ANLEITUNG.md        ← diese Datei
└── public/             ← das komplette Spiel
    ├── index.html … (alle Spieldateien)
    └── js/data.js      ← hier stehen alle Fragen
```

An den Dateien musst du **nichts** ändern. Nur hochladen und deployen.

---

## Schritt 1 – GitHub-Repository anlegen

1. Auf **https://github.com** einloggen (oder kostenlos registrieren).
2. Oben rechts **+** → **New repository**.
3. Namen vergeben, z. B. `spieleabend`.
4. Auf **Public** lassen (Private geht auch, Public ist einfacher).
5. **Create repository** klicken, Seite offen lassen.

## Schritt 2 – Dateien hochladen

1. Auf der Repo-Seite **„uploading an existing file"** anklicken
   (oder **Add file → Upload files**).
2. **Wichtig:** den **Inhalt** dieses Ordners hineinziehen, nicht den
   Ordner selbst: `server.js`, `package.json`, `.gitignore` und den
   ganzen Ordner `public`.
3. Unten **Commit changes**. Warten, bis alle Dateien erscheinen.

Prüfen: `server.js`, `package.json` und der Ordner `public` müssen im
Repo sichtbar sein. Liegen die Dateien lose herum oder fehlt `public`,
Repo löschen und sauber neu hochladen.

## Schritt 3 – Bei Render deployen

1. Auf **https://render.com** registrieren – am schnellsten mit
   **„Sign in with GitHub"**. Render den Zugriff erlauben.
2. **New +** → **Web Service**.
3. Das `spieleabend`-Repository auswählen (ggf. **Connect** / Zugriff
   erlauben).
4. Felder prüfen bzw. eintragen:
   - **Name:** frei wählbar, z. B. `spieleabend` (wird Teil der URL).
   - **Region:** Frankfurt (EU Central), falls verfügbar.
   - **Branch:** `main`.
   - **Runtime / Language:** **Node**.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**.
5. **Create Web Service** klicken.
6. Render baut alles. 1–3 Minuten warten, bis oben **„Live"** in Grün steht.

## Schritt 4 – Losspielen

Oben auf der Render-Seite steht deine URL, z. B.
`https://spieleabend.onrender.com`.

- **Diese URL öffnen** – die Spielauswahl erscheint (Jeopardy oder Der
  Dümmste fliegt). Das ist deine Gamemaster-Seite.
- Bei Jeopardy: **Gamemaster** → Thema und Anzahl Teams wählen →
  **Spiel starten**.
- **Diese URL verschickst du an alle** – oder du klickst im Spiel auf
  **„📱 Mitspieler"** und lässt alle den QR-Code scannen.
- **Gameboard** (Beamer/TV): URL öffnen → **Gameboard** → Code eingeben.

---

## Ablauf & Wertung

Die Teams sind reihum am Zug und wählen ein Feld. **Richtig** = volle
Punkte. **Falsch** = die Hälfte Abzug, dann dürfen sich die anderen Teams
per Handy melden: richtig bringt die halben Punkte, falsch kostet ebenfalls
die Hälfte. Nach Runde 1 geht es weiter zu Runde 2 mit doppelten Punkten.

---

## Gut zu wissen

- **Erster Aufruf nach längerer Pause dauert ~30 Sekunden.** Der kostenlose
  Render-Server „schläft" nach ~15 Minuten ohne Nutzung ein. Tipp: URL
  eine Minute vor dem Spieleabend schon einmal öffnen.
- **Änderungen am Spiel:** neue Dateien ins GitHub-Repo laden – Render
  baut automatisch neu.
- **Eigene Fragen:** alles steht in `public/js/data.js`. Struktur ist
  selbsterklärend, einfach Texte austauschen.
- **Kosten:** Der Free-Tier von Render kostet nichts und hat für einen
  Spieleabend keine relevanten Limits.

## Wenn etwas nicht klappt

- **„Build failed" bei Render:** `package.json` und `server.js` müssen
  **direkt** im Repo liegen (nicht in einem Unterordner), `public`
  daneben.
- **Seite lädt, aber Mitspieler verbinden nicht:** die **Render-URL**
  benutzen (`https://…onrender.com`), keine lokale Datei. Der Sync läuft
  automatisch über den Server.
- **QR-Code bleibt leer:** einmal neu deployen, damit `npm install` das
  Paket `qrcode` mitzieht.
- **Lokal testen (ohne Render):** mit Node auf dem PC im Ordner
  `npm install`, dann `npm start`, und `http://localhost:3000` öffnen.
  Andere Geräte im selben WLAN erreichen dich über
  `http://<deine-lokale-IP>:3000` – das Mitspieler-Panel zeigt die
  passende Adresse an.

Viel Spass beim Spieleabend! 🎉
