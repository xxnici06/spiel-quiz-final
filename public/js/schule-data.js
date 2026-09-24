/* ============================================================
   ZURÜCK IN DIE SCHULE · Fragenpool
   12 Klassen (1–12), jede Klasse 3 Fragen aus 3 Fächern.
   Fächer: Geografie · Natur und Technik · Mathematik ·
           Englisch · Deutsch · Französisch
   Schwierigkeit steigt mit der Klassenstufe.
   Antworten sind kurz – man schreibt sie auf die Tafel.
   ============================================================ */

const SCHULE_GRADES = [
  /* ---- Klasse 1 ---- */
  [
    { subject: "Mathematik", q: "Wie viel ist 2 + 3?", a: "5" },
    { subject: "Deutsch", q: "Mit welchem Buchstaben beginnt das Wort «Apfel»?", a: "A" },
    { subject: "Natur und Technik", q: "Welche Farbe hat der Himmel bei schönem Wetter?", a: "Blau" },
  ],
  /* ---- Klasse 2 ---- */
  [
    { subject: "Geografie", q: "In welchem Land wohnst du?", a: "Schweiz" },
    { subject: "Englisch", q: "Was heisst «Hund» auf Englisch?", a: "Dog" },
    { subject: "Französisch", q: "Was heisst «rot» auf Französisch?", a: "Rouge" },
  ],
  /* ---- Klasse 3 ---- */
  [
    { subject: "Deutsch", q: "Wie lautet die Mehrzahl von «Kind»?", a: "Kinder" },
    { subject: "Natur und Technik", q: "Wie viele Beine hat eine Spinne?", a: "8" },
    { subject: "Französisch", q: "Was heisst «danke» auf Französisch?", a: "Merci" },
  ],
  /* ---- Klasse 4 ---- */
  [
    { subject: "Mathematik", q: "Wie viel ist 7 × 8?", a: "56" },
    { subject: "Geografie", q: "Wie heisst die Hauptstadt der Schweiz?", a: "Bern" },
    { subject: "Englisch", q: "Was heisst «Montag» auf Englisch?", a: "Monday" },
  ],
  /* ---- Klasse 5 ---- */
  [
    { subject: "Deutsch", q: "Wie schreibt man den vierten Wochentag richtig?", a: "Donnerstag" },
    { subject: "Natur und Technik", q: "Welches Organ pumpt das Blut durch den Körper?", a: "Herz" },
    { subject: "Französisch", q: "Wie beginnt man den Satz «Ich heisse …» auf Französisch?", a: "Je m'appelle" },
  ],
  /* ---- Klasse 6 ---- */
  [
    { subject: "Mathematik", q: "Wie viel ist 144 : 12?", a: "12" },
    { subject: "Geografie", q: "Wie heisst der längste Fluss der Welt?", a: "Nil" },
    { subject: "Englisch", q: "Wie lautet die Vergangenheit von «go»?", a: "Went" },
  ],
  /* ---- Klasse 7 ---- */
  [
    { subject: "Deutsch", q: "Wie nennt man Wörter mit gegensätzlicher Bedeutung (gross–klein)?", a: "Antonyme" },
    { subject: "Natur und Technik", q: "Wie lautet die chemische Formel von Wasser?", a: "H2O" },
    { subject: "Französisch", q: "Was heisst «die Schule» auf Französisch?", a: "L'école" },
  ],
  /* ---- Klasse 8 ---- */
  [
    { subject: "Mathematik", q: "Löse: 3x = 27. Wie gross ist x?", a: "9" },
    { subject: "Geografie", q: "Wie heisst der höchste Berg der Welt?", a: "Mount Everest" },
    { subject: "Englisch", q: "Was heisst «Umwelt» auf Englisch?", a: "Environment" },
  ],
  /* ---- Klasse 9 ---- */
  [
    { subject: "Deutsch", q: "Wie heisst der erste der vier deutschen Fälle?", a: "Nominativ" },
    { subject: "Natur und Technik", q: "Welches Gas geben Pflanzen bei der Photosynthese ab?", a: "Sauerstoff" },
    { subject: "Französisch", q: "Was heisst «gestern» auf Französisch?", a: "Hier" },
  ],
  /* ---- Klasse 10 ---- */
  [
    { subject: "Mathematik", q: "Wie lautet der Satz des Pythagoras als Formel?", a: "a² + b² = c²" },
    { subject: "Geografie", q: "Wie heisst die Hauptstadt von Kanada?", a: "Ottawa" },
    { subject: "Englisch", q: "Wie lautet das Past Participle von «to write»?", a: "Written" },
  ],
  /* ---- Klasse 11 ---- */
  [
    { subject: "Deutsch", q: "Wer schrieb das Drama «Faust»?", a: "Goethe" },
    { subject: "Englisch", q: "Was heisst «Nachhaltigkeit» auf Englisch?", a: "Sustainability" },
    { subject: "Französisch", q: "Was heisst «immer» auf Französisch?", a: "Toujours" },
  ],
  /* ---- Klasse 12 ---- */
  [
    { subject: "Mathematik", q: "Wie lautet die Ableitung von x²?", a: "2x" },
    { subject: "Geografie", q: "Wie heisst die Hauptstadt von Australien?", a: "Canberra" },
    { subject: "Natur und Technik", q: "Wie heisst die Kraft, die zwei Massen zueinander zieht?", a: "Gravitation" },
  ],
];
