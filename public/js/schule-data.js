/* ============================================================
   ZURÜCK IN DIE SCHULE · Fragenpool
   Jede Klasse hat eine eigene Anzahl Fragen (1–4).
   Struktur: { klasse: <Anzeigenummer>, questions: [ {subject,q,a} ] }
   Fächer: Mathe · Allgemeinbildung · Deutsch · Natur und Technik
   Antworten sind kurz – man schreibt sie auf die Tafel.
   ============================================================ */

const SCHULE_GRADES = [
  { klasse: 1, questions: [
    { subject: "Mathe", q: "Was ergibt 9 − 4?", a: "5" },
    { subject: "Allgemeinbildung", q: "Welche Sinne hat der Mensch?", a: "Sehen, Hören, Riechen, Schmecken, Tasten" },
    { subject: "Deutsch", q: "Wie viele Silben hat das Wort «Apfel»?", a: "2" },
  ]},
  { klasse: 2, questions: [
    { subject: "Mathe", q: "Was ist 4 × 2?", a: "8" },
    { subject: "Allgemeinbildung", q: "Wie heissen unsere Nachbarländer?", a: "Deutschland, Frankreich, Italien, Österreich, Liechtenstein" },
    { subject: "Deutsch", q: "Was ist ein Nomen? Nenne ein Beispiel.", a: "Ein Namenwort, z. B. «Hund»" },
  ]},
  { klasse: 3, questions: [
    { subject: "Natur und Technik", q: "Welche drei Zustände kann Wasser haben?", a: "Fest, flüssig, gasförmig" },
  ]},
  { klasse: 4, questions: [
    { subject: "Mathe", q: "Punkt vor Strich: Rechne 3 + 4 × 5", a: "23" },
    { subject: "Allgemeinbildung", q: "Welche Hauptfarben hat die Flagge von Spanien?", a: "Rot und Gelb" },
    { subject: "Deutsch", q: "Unterstreiche das Subjekt im Satz «Der Hund bellt laut».", a: "Der Hund" },
  ]},
  { klasse: 5, questions: [
    { subject: "Mathe", q: "Runde 748 auf die nächste Hunderterstelle.", a: "700" },
    { subject: "Allgemeinbildung", q: "Was ist eine Demokratie?", a: "Eine Staatsform, in der das Volk bestimmt" },
    { subject: "Natur und Technik", q: "Welcher Planet ist am weitesten von der Sonne entfernt?", a: "Neptun" },
    { subject: "Deutsch", q: "Was ist ein Adjektiv?", a: "Ein Eigenschaftswort bzw. Wie-Wort" },
  ]},
  { klasse: 6, questions: [
    { subject: "Mathe", q: "Wie nennt man eine Zahl, die nur durch 1 und sich selbst teilbar ist?", a: "Primzahl" },
    { subject: "Allgemeinbildung", q: "In welcher Himmelsrichtung geht die Sonne auf?", a: "Im Osten" },
    { subject: "Deutsch", q: "Was ist das Gegenteil von «höflich»?", a: "Unhöflich" },
  ]},
  { klasse: 7, questions: [
    { subject: "Mathe", q: "Was bedeutet das Kürzel «EU»?", a: "Europäische Union" },
    { subject: "Allgemeinbildung", q: "Reptilien legen Eier – wie pflanzen sich Säugetiere fort?", a: "Sie gebären lebende Junge" },
    { subject: "Deutsch", q: "Was ist das Gegenteil von «leicht»?", a: "Schwer bzw. schwierig" },
  ]},
  { klasse: 8, questions: [
    { subject: "Mathe", q: "Wie berechnet man den Umfang eines Rechtecks?", a: "2 × (Länge + Breite)" },
    { subject: "Allgemeinbildung", q: "Was zeigt ein Barometer an?", a: "Den Luftdruck" },
  ]},
  { klasse: 9, questions: [
    { subject: "Mathe", q: "Wie lautet der Satz des Pythagoras?", a: "a² + b² = c²" },
    { subject: "Natur und Technik", q: "Was ist der pH-Wert einer neutralen Lösung?", a: "7" },
  ]},
  { klasse: 10, questions: [
    { subject: "Mathe", q: "Löse nach x auf: 2x + 6 = 14", a: "x = 4" },
    { subject: "Allgemeinbildung", q: "Wie heissen die drei Bereiche der Gewaltenteilung?", a: "Legislative, Exekutive, Judikative" },
    { subject: "Natur und Technik", q: "Welche Teilchen befinden sich im Atomkern?", a: "Protonen und Neutronen" },
    { subject: "Deutsch", q: "Nenne zwei rhetorische Stilmittel.", a: "Zum Beispiel Metapher und Vergleich" },
  ]},
  { klasse: 11, questions: [
    { subject: "Mathe", q: "Was ist die Ableitung von x²?", a: "2x" },
    { subject: "Allgemeinbildung", q: "Was ist die Funktion der UNO?", a: "Weltfrieden und internationale Zusammenarbeit sichern" },
  ]},
  { klasse: 13, questions: [
    { subject: "Natur und Technik", q: "Was beschreibt das Integral einer Funktion?", a: "Die Fläche unter dem Graphen" },
    { subject: "Allgemeinbildung", q: "Was war der Auslöser des Ersten Weltkriegs?", a: "Das Attentat von Sarajevo auf Franz Ferdinand" },
  ]},
];
