# 🎮 Spieleabend online stellen – Schritt für Schritt

Diese Anleitung bringt dein Spiel dauerhaft ins Internet – kostenlos, ohne
Ratenlimit, erreichbar für alle (auch von unterwegs). Der Server macht zwei
Dinge: Er liefert die Spielseiten aus **und** übernimmt das Live-Syncing
zwischen Gamemaster, Gameboard und Handys.

Du brauchst nur zwei kostenlose Konten: **GitHub** (für den Code) und
**Render** (fürs Hosting). Zeitaufwand: ~15 Minuten beim ersten Mal.

---

## Was ist in diesem Ordner?

```
spieleabend-server/
├── server.js          ← der Server (liefert Seiten + Sync)
├── package.json       ← sagt Render, was zu installieren ist
├── .gitignore
├── ANLEITUNG.md       ← diese Datei
└── public/            ← das komplette Spiel (Jeopardy + Der Dümmste fliegt)
    ├── index.html
    ├── ... (alle Spieldateien)
    └── js/net.js      ← wurde für den eigenen Server umgebaut
```

Du musst an den Dateien **nichts** ändern. Nur hochladen und deployen.

---

## Schritt 1 – GitHub-Repository anlegen

1. Geh auf **https://github.com** und logge dich ein (oder erstelle ein
   kostenloses Konto).
2. Klick oben rechts auf **+** → **New repository**.
3. Gib einen Namen ein, z. B. `spieleabend`.
4. Setz es auf **Public** (Private geht auch, Public ist einfacher).
5. Klick **Create repository**. Lass die Seite offen.

## Schritt 2 – Dateien hochladen

1. Auf der neuen Repo-Seite: Link **„uploading an existing file“** anklicken
   (oder **Add file → Upload files**).
2. **Wichtig:** Zieh den **Inhalt** dieses Ordners hinein, nicht den Ordner
   selbst. Am einfachsten: Markiere im entpackten `spieleabend-server`-Ordner
   alle Elemente (`server.js`, `package.json`, `.gitignore`, `public`-Ordner)
   und zieh sie ins Browser-Fenster.
   - Der `public`-Ordner mit allen Unterdateien wird mit hochgeladen.
   - Falls `.gitignore` nicht mitkommt (manche Systeme verstecken es): kein
     Problem, es ist nicht zwingend nötig.
3. Unten **Commit changes** klicken. Warte, bis alle Dateien erscheinen.

Prüfe kurz: Im Repo sollten `server.js`, `package.json` und der Ordner
`public` sichtbar sein. Wenn `public` fehlt oder die Dateien einzeln lose
herumliegen, lösch das Repo und lade nochmal sauber hoch.

## Schritt 3 – Bei Render deployen

1. Geh auf **https://render.com** und registriere dich – am schnellsten mit
   dem Button **„Sign in with GitHub“**. Erlaube Render den Zugriff.
2. Klick auf **New +** → **Web Service**.
3. Wähl dein `spieleabend`-Repository aus der Liste (ggf. **Connect** /
   Zugriff erlauben).
4. Render fragt ein paar Felder ab. Trag ein bzw. prüfe:
   - **Name:** frei wählbar, z. B. `spieleabend` (wird Teil der URL).
   - **Region:** Frankfurt (EU Central), falls verfügbar.
   - **Branch:** `main`.
   - **Runtime / Language:** **Node**.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**.
5. Klick unten **Create Web Service** (oder **Deploy**).
6. Render baut jetzt alles. Warte 1–3 Minuten, bis oben **„Live“** in Grün
   steht.

## Schritt 4 – Losspielen

Oben auf der Render-Seite steht deine URL, z. B.:

```
https://spieleabend.onrender.com
```

- **Öffne diese URL** – die Spielauswahl erscheint. Das ist deine
  Gamemaster-/Startseite.
- **Diese URL verschickst du an alle.** Deine Freunde öffnen sie am Handy und
  gehen dort auf „Mitspielen“. Kein Datei-Verschicken mehr nötig – alles läuft
  über den Link.

Fertig! Der Ablauf im Spiel bleibt exakt wie gehabt (Gamemaster starten →
Code ansagen → Mitspieler/Gameboard geben den Code ein).

---

## Gut zu wissen

- **Erster Aufruf nach längerer Pause dauert ~30 Sekunden.** Der kostenlose
  Render-Server „schläft“ nach ~15 Minuten ohne Nutzung ein und muss beim
  nächsten Aufruf kurz aufwachen. Einfach die Startseite einmal öffnen und
  kurz warten – danach läuft alles flüssig. Tipp: Ruf die URL 1 Minute vor
  dem Spieleabend schon mal auf.

- **Änderungen am Spiel:** Lädst du später neue Dateien ins GitHub-Repo hoch,
  baut Render automatisch neu. Nichts weiter zu tun.

- **Eigener Name:** Den Teil vor `.onrender.com` legst du in Schritt 3 über
  das Feld **Name** fest.

- **Kosten:** Der Free-Tier von Render kostet nichts und hat für einen
  Spieleabend keine relevanten Limits.

---

## Wenn etwas nicht klappt

- **„Build failed“ bei Render:** Meist stimmt die Ordnerstruktur im Repo
  nicht. `package.json` und `server.js` müssen **direkt** im Repo liegen (nicht
  in einem Unterordner), und der `public`-Ordner daneben.
- **Seite lädt, aber Mitspieler verbinden nicht:** Stell sicher, dass du die
  **Render-URL** benutzt (`https://…onrender.com`) und nicht eine lokale Datei.
  Über den Server läuft der Sync automatisch.
- **Alles offline testen (ohne Render):** Wenn du Node auf dem PC hast, im
  Ordner `npm install` und dann `npm start` ausführen und
  `http://localhost:3000` öffnen. Andere Geräte im selben WLAN erreichen dich
  dann über `http://<deine-lokale-IP>:3000`.

Viel Spaß beim Spieleabend! 🎉
