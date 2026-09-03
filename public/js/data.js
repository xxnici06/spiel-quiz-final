/* ============================================================
   JEOPARDY · 10 Themen-Sets mit je 2 Runden
   Runde 1 (Board 1): 100–500 · Runde 2 (Board 2): 200–1000

   Zielgruppe: junge Erwachsene (ca. 19–25), Deutschschweiz.
   Hochdeutsch, «ss» statt «ß», keine erklärenden Klammern in den Fragen.

   SCHWIERIGKEITSKURVE – in JEDER Kategorie gleich aufgebaut:
     Stufe 1  = lockerer Einstieg, weiss fast jede*r
     Stufe 2  = solides Allgemeinwissen
     Stufe 3  = anspruchsvoll, kurz überlegen
     Stufe 4  = schwer, nur wer sich auskennt
     Stufe 5  = richtig knifflig
   Runde 2 hat dieselbe Kurve, liegt aber durchgehend ein Level höher.

   100 Kategorien – jede kommt nur EINMAL vor, keine Wiederholungen.
   Spezial-Typ  type:"flag"  → Fragetext ist eine Flaggen-Emoji.
   ============================================================ */

const BOARD_POINTS = [[100, 200, 300, 400, 500], [200, 400, 600, 800, 1000]];

const BOARD_SETS = [

  /* ========================================================== SET 1 · SCHWEIZ */
  {
    name: "Schweiz",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Kantone", qa: [
          { q: "Welcher Kanton ist flächenmässig der grösste?", a: "Graubünden" },
          { q: "In welchem Kanton liegt die Stadt Lugano?", a: "Im Tessin" },
          { q: "Welcher Kanton trat 1979 als jüngster der Eidgenossenschaft bei?", a: "Der Kanton Jura" },
          { q: "Wie heissen die zwei Halbkantone, die zusammen das Appenzell bilden?", a: "Ausserrhoden und Innerrhoden" },
          { q: "Welcher Kanton hat als einziger drei Amtssprachen?", a: "Graubünden" },
        ]},
        { name: "Schweizer Berge", qa: [
          { q: "Wie heisst der Berg bei Zermatt mit der markanten Pyramidenform?", a: "Das Matterhorn" },
          { q: "Wie heisst der Hausberg von Luzern mit Zahnradbahn?", a: "Der Pilatus" },
          { q: "Wie heisst der höchste Gipfel der Schweiz?", a: "Die Dufourspitze" },
          { q: "Wie heissen die drei berühmten Berner Oberländer Gipfel nebeneinander?", a: "Eiger, Mönch und Jungfrau" },
          { q: "Wie hoch ist das Matterhorn ungefähr, auf hundert Meter genau?", a: "Rund 4478 Meter" },
        ]},
        { name: "Typisch Schweizerdeutsch", qa: [
          { q: "Was ist ein «Velo»?", a: "Ein Fahrrad" },
          { q: "Was ist ein «Zvieri»?", a: "Eine kleine Zwischenmahlzeit am Nachmittag" },
          { q: "Was bedeutet «Pflotsch»?", a: "Matschiger, halb geschmolzener Schnee" },
          { q: "Was meint man mit «es hät solangs hät»?", a: "Solange der Vorrat reicht" },
          { q: "Was bedeutet «gäbig»?", a: "Praktisch, handlich, angenehm" },
        ]},
        { name: "Schweizer Süssigkeiten & Marken", qa: [
          { q: "Welche dreieckige Schokolade ist ein Schweizer Wahrzeichen?", a: "Toblerone" },
          { q: "Welche Schweizer Guetzli-Marke ist für ihr «Bretzeli» und Waffelgebäck bekannt?", a: "Kambly" },
          { q: "Welche Getränkemarke aus Molke stammt aus dem Kanton Aargau?", a: "Rivella" },
          { q: "Welche Kräuterzucker-Marke aus dem Emmental wirbt mit «Wer hat's erfunden?»", a: "Ricola" },
          { q: "Welche Schweizer Firma ist einer der grössten Kakao- und Schokoladenverarbeiter der Welt und beliefert die Industrie?", a: "Barry Callebaut" },
        ]},
        { name: "Feste & Brauchtum", qa: [
          { q: "An welchem Datum ist der Schweizer Nationalfeiertag?", a: "Am 1. August" },
          { q: "Welche Schneemann-Figur wird am Zürcher Sechseläuten verbrannt?", a: "Der Böögg" },
          { q: "Wie heisst der grosse Karneval in Basel mit «Morgestraich»?", a: "Die Basler Fasnacht" },
          { q: "Wie heisst der laute Glocken- und Lichterumzug in Küssnacht am 5. Dezember?", a: "Das Klausjagen" },
          { q: "In welchem Kanton ziehen an der Fasnacht die zottligen «Tschäggättä»-Masken durch die Dörfer?", a: "Im Wallis" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Schweizer Geschichte", qa: [
          { q: "In welchem Jahr schworen die drei Urkantone der Sage nach den Rütlischwur?", a: "1291" },
          { q: "In welchem Jahr wurde die Schweiz zum modernen Bundesstaat?", a: "1848" },
          { q: "Welche verlorene Schlacht von 1515 leitete die Schweizer Neutralität ein?", a: "Die Schlacht bei Marignano" },
          { q: "Welcher Reformator prägte im 16. Jahrhundert die Stadt Genf?", a: "Johannes Calvin" },
          { q: "Wie hiess die zentralistische Republik, die Napoleon 1798 in der Schweiz einrichtete?", a: "Die Helvetische Republik" },
        ]},
        { name: "Politik & direkte Demokratie", qa: [
          { q: "Wie viele Mitglieder hat der Bundesrat?", a: "7" },
          { q: "Wie heisst die kleine Parlamentskammer mit 46 Sitzen?", a: "Der Ständerat" },
          { q: "Wie viele beglaubigte Unterschriften braucht ein fakultatives Referendum innerhalb von 100 Tagen?", a: "50'000" },
          { q: "Wie nennt man die Regel, nach der die grossen Parteien fest im Bundesrat vertreten sind?", a: "Die Zauberformel" },
          { q: "In welchem Kanton stimmt man neben Appenzell Innerrhoden noch an einer «Landsgemeinde» unter freiem Himmel ab?", a: "Im Kanton Glarus" },
        ]},
        { name: "Wissenschaft aus der Schweiz", qa: [
          { q: "Welcher Schweizer Ingenieur erfand den Klettverschluss, inspiriert von Kletten im Hundefell?", a: "George de Mestral" },
          { q: "Welches rote Mehrzweckmesser mit Werkzeugen ist eine Schweizer Erfindung?", a: "Das Schweizer Taschenmesser" },
          { q: "Welcher Schweizer Chemiker entdeckte 1943 die Wirkung von LSD?", a: "Albert Hofmann" },
          { q: "Welches Grossforschungszentrum bei Genf betreibt den weltgrössten Teilchenbeschleuniger?", a: "Das CERN" },
          { q: "Welcher Schweizer erfand den überall verbreiteten «Rex»-Sparschäler?", a: "Alfred Neweczerzal" },
        ]},
        { name: "Schweizer Persönlichkeiten", qa: [
          { q: "Welcher Schweizer gewann 20 Grand-Slam-Titel im Tennis?", a: "Roger Federer" },
          { q: "Welcher Genfer gründete das Rote Kreuz?", a: "Henri Dunant" },
          { q: "Welche Autorin schrieb den Roman «Heidi»?", a: "Johanna Spyri" },
          { q: "Welcher Schweizer Künstler ist für seine dünnen, langgezogenen Bronzefiguren weltberühmt?", a: "Alberto Giacometti" },
          { q: "Welcher Schweizer Psychiater begründete die analytische Psychologie mit Begriffen wie «Archetyp»?", a: "Carl Gustav Jung" },
        ]},
        { name: "Flüsse, Seen & Pässe", qa: [
          { q: "Welcher grosse Fluss fliesst durch Basel Richtung Norden?", a: "Der Rhein" },
          { q: "An welchem See liegen Lausanne und Genf?", a: "Am Genfersee" },
          { q: "Welcher Alpenpass verbindet Uri mit dem Tessin und hat einen berühmten Basistunnel?", a: "Der Gotthard" },
          { q: "Wie heisst der grösste See, der komplett in der Schweiz liegt?", a: "Der Neuenburgersee" },
          { q: "Aus welchem kleinen Bergsee am Oberalp entspringt der Vorderrhein?", a: "Dem Tomasee" },
        ]},
      ]},
    ],
  },

  /* ========================================================== SET 2 · MUSIK */
  {
    name: "Musik",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Rap & Hip-Hop", qa: [
          { q: "Welcher US-Rapper nennt sich «Slim Shady»?", a: "Eminem" },
          { q: "Aus welcher Region der USA stammt der Westcoast-Rap von Dr. Dre und Snoop Dogg?", a: "Aus Los Angeles / Kalifornien" },
          { q: "Welcher Rapper veröffentlichte das Album «good kid, m.A.A.d city»?", a: "Kendrick Lamar" },
          { q: "Welcher 1997 erschossene Rapper hiess bürgerlich Christopher Wallace?", a: "The Notorious B.I.G." },
          { q: "Welches Produzenten-Duo um Pharrell Williams prägte in den 2000ern den «Neptunes»-Sound?", a: "The Neptunes" },
        ]},
        { name: "Rockbands", qa: [
          { q: "Von welcher Band stammt «Bohemian Rhapsody»?", a: "Queen" },
          { q: "Welche australische Band ist für «Highway to Hell» bekannt?", a: "AC/DC" },
          { q: "Welche Band nahm das Album «Nevermind» mit dem schwimmenden Baby auf dem Cover auf?", a: "Nirvana" },
          { q: "Welche Band um Sänger Chris Martin machte «Yellow» und «Viva la Vida»?", a: "Coldplay" },
          { q: "Welche britische Band nahm das Konzeptalbum «The Wall» auf?", a: "Pink Floyd" },
        ]},
        { name: "One-Hit-Wonder & Ohrwürmer", qa: [
          { q: "Welches Lied von Los del Río mit eigenem Tanz war Mitte der 90er ein Welthit?", a: "«Macarena»" },
          { q: "Welcher Song von Rick Astley steckt hinter dem «Rickroll»?", a: "«Never Gonna Give You Up»" },
          { q: "Welche Band sang 1997 «Barbie Girl»?", a: "Aqua" },
          { q: "Welcher norwegische Act landete 2013 mit «The Fox» einen viralen Hit?", a: "Ylvis" },
          { q: "Welcher a-ha-Song von 1985 hat ein berühmtes halb gezeichnetes Musikvideo?", a: "«Take On Me»" },
        ]},
        { name: "Instrumente & Noten", qa: [
          { q: "Wie viele Saiten hat eine normale Gitarre?", a: "6" },
          { q: "Welches Tasteninstrument hat 88 Tasten?", a: "Das Klavier" },
          { q: "Wie nennt man das Vorzeichen, das eine Note um einen Halbton erhöht?", a: "Das Kreuz" },
          { q: "Welches Instrument mit Pfeifen und Registern ist das grösste in einer Kirche?", a: "Die Orgel" },
          { q: "Wie lautet der italienische Fachbegriff für «allmählich lauter werden»?", a: "Crescendo" },
        ]},
        { name: "Musik aus den 80ern", qa: [
          { q: "Welcher Weihnachts-Dauerbrenner von Wham! stammt aus dem Jahr 1984?", a: "«Last Christmas»" },
          { q: "Welche Sängerin wurde in den 80ern mit «Like a Virgin» zur «Queen of Pop»?", a: "Madonna" },
          { q: "Welcher 14-minütige Michael-Jackson-Kurzfilm von 1983 zeigt tanzende Zombies?", a: "«Thriller»" },
          { q: "Welche Benefiz-Supergroup sang 1984 «Do They Know It's Christmas?»", a: "Band Aid" },
          { q: "Welcher österreichische Sänger hatte 1985 mit «Rock Me Amadeus» einen US-Nummer-1-Hit?", a: "Falco" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Klassik & Komponisten", qa: [
          { q: "Welcher gehörlos gewordene Komponist schrieb die 9. Sinfonie mit der «Ode an die Freude»?", a: "Ludwig van Beethoven" },
          { q: "Welches Wunderkind aus Salzburg komponierte «Die Zauberflöte»?", a: "Wolfgang Amadeus Mozart" },
          { q: "Welcher Barockkomponist schrieb «Die vier Jahreszeiten»?", a: "Antonio Vivaldi" },
          { q: "Welcher russische Komponist schrieb die Ballette «Schwanensee» und «Der Nussknacker»?", a: "Pjotr Tschaikowski" },
          { q: "Welcher Komponist schuf «Der Ring des Nibelungen» und liess in Bayreuth ein eigenes Festspielhaus bauen?", a: "Richard Wagner" },
        ]},
        { name: "Eurovision Song Contest", qa: [
          { q: "Welche schwedische Gruppe gewann 1974 mit «Waterloo»?", a: "ABBA" },
          { q: "Welche italienische Rockband gewann 2021 mit «Zitti e buoni»?", a: "Måneskin" },
          { q: "Welcher Act gewann 2024 mit «The Code» für die Schweiz?", a: "Nemo" },
          { q: "Welche kanadische Sängerin gewann 1988 für die Schweiz?", a: "Céline Dion" },
          { q: "Welches Land ausserhalb Europas nimmt seit 2015 fest am ESC teil?", a: "Australien" },
        ]},
        { name: "Elektronische Musik & DJs", qa: [
          { q: "Welches französische Duo tritt mit Roboterhelmen auf und machte «Get Lucky»?", a: "Daft Punk" },
          { q: "Welcher schwedische DJ von «Wake Me Up» und «Levels» starb 2018?", a: "Avicii" },
          { q: "Welche Band aus Düsseldorf gilt als Wegbereiter elektronischer Popmusik?", a: "Kraftwerk" },
          { q: "In welchem Land findet das grosse Dance-Festival «Tomorrowland» statt?", a: "In Belgien" },
          { q: "Welches schwedische DJ-Trio machte «Don't You Worry Child»?", a: "Swedish House Mafia" },
        ]},
        { name: "Alben & Rekorde", qa: [
          { q: "Welches Album von Michael Jackson gilt als meistverkauftes aller Zeiten?", a: "«Thriller»" },
          { q: "Welche britische Sängerin benannte ihre Alben «19», «21» und «25» nach ihrem Alter?", a: "Adele" },
          { q: "Welche US-Band hält mit «Their Greatest Hits (1971–1975)» eines der meistverkauften Alben der USA?", a: "Eagles" },
          { q: "Welches Pink-Floyd-Album stand über 900 Wochen in den US-Charts?", a: "«The Dark Side of the Moon»" },
          { q: "Welcher Song von Lil Nas X stand 2019 rekordverdächtige 19 Wochen an der Spitze der US-Charts?", a: "«Old Town Road»" },
        ]},
        { name: "Frontleute & Bandmitglieder", qa: [
          { q: "Wer war der Leadsänger von Queen?", a: "Freddie Mercury" },
          { q: "Wie hiessen die vier Beatles mit Vornamen?", a: "John, Paul, George und Ringo" },
          { q: "Wie heisst der Leadsänger von U2?", a: "Bono" },
          { q: "Welcher Gitarrist von Guns N' Roses trägt Zylinder und Lockenmähne?", a: "Slash" },
          { q: "Welcher Nirvana-Schlagzeuger gründete danach die Foo Fighters?", a: "Dave Grohl" },
        ]},
      ]},
    ],
  },

  /* ================================================= SET 3 · FILM & SERIEN */
  {
    name: "Film & Serien",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Superhelden im Kino", qa: [
          { q: "Welcher Held wird von einer radioaktiven Spinne gebissen?", a: "Spider-Man" },
          { q: "Wie heisst die Heimatstadt von Batman?", a: "Gotham City" },
          { q: "Welcher lila Titan sammelt die Infinity-Steine?", a: "Thanos" },
          { q: "Welches Metall bildet Wolverines Skelett und Krallen?", a: "Adamantium" },
          { q: "Wie lautet der bürgerliche Name von Iron Man?", a: "Tony Stark" },
        ]},
        { name: "Animations- & Pixar-Filme", qa: [
          { q: "Welcher kleine Clownfisch wird in einem Pixar-Film gesucht?", a: "Nemo" },
          { q: "In welchem Pixar-Film hebt ein Haus mit tausenden Ballons ab?", a: "Oben" },
          { q: "Welches japanische Studio drehte «Chihiros Reise ins Zauberland»?", a: "Studio Ghibli" },
          { q: "Wie heisst der Cowboy in «Toy Story»?", a: "Woody" },
          { q: "In welchem Land spielt der Pixar-Film «Coco»?", a: "In Mexiko" },
        ]},
        { name: "Netflix-Serien", qa: [
          { q: "In welcher Serie kämpfen Kinder aus Hawkins gegen das «Upside Down»?", a: "Stranger Things" },
          { q: "In welcher spanischen Serie tragen die Räuber Dalí-Masken?", a: "Haus des Geldes" },
          { q: "In welcher südkoreanischen Serie spielen Hochverschuldete um tödliche Kinderspiele?", a: "Squid Game" },
          { q: "In welcher Serie spielt Henry Cavill den Hexer Geralt von Riva?", a: "The Witcher" },
          { q: "Welche Netflix-Serie erzählt vom Leben der britischen Königsfamilie?", a: "The Crown" },
        ]},
        { name: "Filmzitate", qa: [
          { q: "Aus welcher Filmreihe stammt «Möge die Macht mit dir sein»?", a: "Star Wars" },
          { q: "In welchem Film heisst es «Das Leben ist wie eine Schachtel Pralinen»?", a: "Forrest Gump" },
          { q: "Aus welchem Film stammt «Ich mache ihm ein Angebot, das er nicht ablehnen kann»?", a: "Der Pate" },
          { q: "In welchem Film sagt die Hauptfigur «Sag hallo zu meinem kleinen Freund»?", a: "Scarface" },
          { q: "Aus welchem Film stammt «Wir brauchen ein grösseres Boot»?", a: "Der weisse Hai" },
        ]},
        { name: "Bond, Jedi & Franchises", qa: [
          { q: "Wie lautet die Agentennummer von James Bond?", a: "007" },
          { q: "Welche Waffe führen die Jedi-Ritter?", a: "Das Lichtschwert" },
          { q: "Welcher Schauspieler war der erste Kino-James-Bond?", a: "Sean Connery" },
          { q: "In welcher Reihe fährt eine Crew um Dominic Toretto sehr schnelle Autos?", a: "Fast & Furious" },
          { q: "Wie heisst die Verbrecherorganisation mit dem Kraken-Logo in vielen Bond-Filmen?", a: "SPECTRE" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Regisseure", qa: [
          { q: "Welcher Regisseur drehte «Jurassic Park» und «E.T.»?", a: "Steven Spielberg" },
          { q: "Welcher Regisseur ist für «Pulp Fiction» und «Kill Bill» bekannt?", a: "Quentin Tarantino" },
          { q: "Welcher Regisseur drehte «Inception», «Interstellar» und «Oppenheimer»?", a: "Christopher Nolan" },
          { q: "Welcher Regisseur schuf «Alien», «Blade Runner» und «Gladiator»?", a: "Ridley Scott" },
          { q: "Welcher japanische Regisseur drehte «Die sieben Samurai»?", a: "Akira Kurosawa" },
        ]},
        { name: "Oscars & Filmpreise", qa: [
          { q: "Welcher südkoreanische Film gewann 2020 den Oscar als «Bester Film»?", a: "Parasite" },
          { q: "Welcher Stummfilmstar mit Melone nannte seine Figur «der Tramp»?", a: "Charlie Chaplin" },
          { q: "Welche drei Filme teilen sich mit je 11 Oscars den Rekord?", a: "«Ben Hur», «Titanic» und «Der Herr der Ringe: Die Rückkehr des Königs»" },
          { q: "Welcher Schauspieler lehnte 1973 seinen Oscar für «Der Pate» aus Protest ab?", a: "Marlon Brando" },
          { q: "Welche Schauspielerin gewann mit vier Stück die meisten Schauspiel-Oscars?", a: "Katharine Hepburn" },
        ]},
        { name: "Sitcoms", qa: [
          { q: "In welcher Sitcom trifft sich die Clique im Café «Central Perk»?", a: "Friends" },
          { q: "In welcher Sitcom arbeiten Jim und Pam in einer Papierfirma in Scranton?", a: "The Office" },
          { q: "Welcher Physiker in «The Big Bang Theory» besteht auf seinem festen Sofaplatz?", a: "Sheldon Cooper" },
          { q: "In welcher Zeichentrick-Sitcom lebt Familie Griffin in der Stadt Quahog?", a: "Family Guy" },
          { q: "Welche New Yorker Sitcom der 1990er gilt als «Serie über nichts»?", a: "Seinfeld" },
        ]},
        { name: "Horror & Thriller", qa: [
          { q: "Welcher Fisch-Horrorfilm von 1975 machte Angst vorm Baden im Meer?", a: "Der weisse Hai" },
          { q: "Welcher maskierte Killer geht in der Reihe «Halloween» um?", a: "Michael Myers" },
          { q: "Welcher Clown steigt in Stephen Kings «Es» aus der Kanalisation?", a: "Pennywise" },
          { q: "Welcher Film mit Hannibal Lecter gewann 1992 den Oscar als bester Film?", a: "Das Schweigen der Lämmer" },
          { q: "Welcher Regisseur und frühere Comedian drehte «Get Out» und «Nope»?", a: "Jordan Peele" },
        ]},
        { name: "Schauspieler & ihre Rollen", qa: [
          { q: "Welcher Schauspieler spielt den Piraten Jack Sparrow?", a: "Johnny Depp" },
          { q: "Welcher Schauspieler spielte Walter White in «Breaking Bad»?", a: "Bryan Cranston" },
          { q: "Welche Schauspielerin spielt Hermine Granger in den Harry-Potter-Filmen?", a: "Emma Watson" },
          { q: "Welcher Schauspieler gewann posthum einen Oscar für den Joker in «The Dark Knight»?", a: "Heath Ledger" },
          { q: "Welcher britische Schauspieler verkörperte sowohl Gandalf als auch Magneto?", a: "Ian McKellen" },
        ]},
      ]},
    ],
  },

  /* =============================================== SET 4 · GAMES & INTERNET */
  {
    name: "Games & Internet",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Videospiel-Klassiker", qa: [
          { q: "In welchem Spiel baut und gräbt man alles aus Blöcken?", a: "Minecraft" },
          { q: "Wie heisst der Klempner-Held von Nintendo?", a: "Mario" },
          { q: "In welchem Spiel sucht man an Bord eines Raumschiffs den «Impostor»?", a: "Among Us" },
          { q: "Welche gelbe Figur frisst sich durch ein Labyrinth und flieht vor Geistern?", a: "Pac-Man" },
          { q: "In welchem Land wurde das Puzzlespiel «Tetris» erfunden?", a: "In der Sowjetunion / Russland" },
        ]},
        { name: "Nintendo", qa: [
          { q: "Wie heisst Marios grüner Dinosaurier-Begleiter?", a: "Yoshi" },
          { q: "Welche Nintendo-Konsole von 2017 funktioniert unterwegs und am Fernseher?", a: "Die Nintendo Switch" },
          { q: "Wie heisst die Prinzessin, die der Held Link retten muss?", a: "Zelda" },
          { q: "In welcher Nintendo-Reihe fängt man Taschenmonster?", a: "Pokémon" },
          { q: "Wie lautet das Kürzel von Nintendos erster grosser Heimkonsole der 1980er?", a: "NES" },
        ]},
        { name: "Social-Media-Apps", qa: [
          { q: "Auf welcher App teilt man kurze Hochkant-Videos, benannt nach einem Uhrgeräusch?", a: "TikTok" },
          { q: "Wie hiess die Plattform «X» früher?", a: "Twitter" },
          { q: "Welche App für verschwindende Fotos hat ein Geist als Logo?", a: "Snapchat" },
          { q: "Welcher Konzern besitzt Instagram und WhatsApp?", a: "Meta" },
          { q: "Aus welcher Lipsync-App ging TikTok 2018 hervor?", a: "Musical.ly" },
        ]},
        { name: "Internet-Abkürzungen", qa: [
          { q: "Wofür steht «LOL»?", a: "Laughing Out Loud" },
          { q: "Wofür steht «FYI»?", a: "For Your Information" },
          { q: "Wofür steht «FOMO»?", a: "Fear Of Missing Out" },
          { q: "Wofür steht «DIY»?", a: "Do It Yourself" },
          { q: "Wofür steht «IYKYK»?", a: "If You Know You Know" },
        ]},
        { name: "Memes", qa: [
          { q: "Wie nennt man ein lustiges Bild mit Text, das sich viral verbreitet?", a: "Ein Meme" },
          { q: "Welches Meme zeigt einen Mann, der sich nach einer anderen Frau umdreht?", a: "Distracted Boyfriend" },
          { q: "Welche Hunderasse ist im Meme «Doge» zu sehen?", a: "Ein Shiba Inu" },
          { q: "In welchem Meme wird eine Katze am Esstisch von einer Frau angeschrien?", a: "Woman Yelling at a Cat" },
          { q: "Welche Abkürzung im Netz-Slang spottet über Menschen ohne eigene Meinung, wie eine Computerfigur?", a: "NPC" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "E-Sport & Streaming", qa: [
          { q: "Auf welcher Plattform mit lila Logo streamen Gamer live?", a: "Twitch" },
          { q: "In welchem Taktikshooter von Riot legt oder entschärft man den «Spike»?", a: "Valorant" },
          { q: "Welches Valve-Spiel veranstaltet das Millionen-Turnier «The International»?", a: "Dota 2" },
          { q: "Welcher Battle-Royale-Titel von Epic Games ist für Tänze und «Bauen» bekannt?", a: "Fortnite" },
          { q: "Welcher schwedische YouTuber war jahrelang der abonnentenstärkste Einzelkanal?", a: "PewDiePie" },
        ]},
        { name: "Konsolen-Geschichte", qa: [
          { q: "Welche Firma stellt die PlayStation her?", a: "Sony" },
          { q: "Wie hiess Segas 16-Bit-Konsole, der grosse Rivale des Super Nintendo?", a: "Das Mega Drive" },
          { q: "Welche Spielkonsole brachte Microsoft 2001 heraus?", a: "Die Xbox" },
          { q: "Welche Nintendo-Konsole führte 2006 die Bewegungssteuerung breit ein?", a: "Die Wii" },
          { q: "Welche Konsole machte Sony 1994 mit CD-Laufwerk als Standard zum Verkaufsschlager?", a: "Die PlayStation" },
        ]},
        { name: "Tech-Konzerne & Gründer", qa: [
          { q: "Wer gründete Microsoft zusammen mit Paul Allen?", a: "Bill Gates" },
          { q: "Wie heisst der Chef von Tesla und SpaceX?", a: "Elon Musk" },
          { q: "Welche zwei Steves gründeten Apple?", a: "Steve Jobs und Steve Wozniak" },
          { q: "Wie heissen die beiden Gründer von Google?", a: "Larry Page und Sergey Brin" },
          { q: "An welcher US-Universität startete Mark Zuckerberg 2004 Facebook?", a: "In Harvard" },
        ]},
        { name: "Programmieren & Web", qa: [
          { q: "Welche Programmiersprache mit Schlangen-Namen ist bei Einsteigern besonders beliebt?", a: "Python" },
          { q: "Wofür steht «HTML»?", a: "HyperText Markup Language" },
          { q: "Welche Sprache läuft im Browser und macht Webseiten interaktiv?", a: "JavaScript" },
          { q: "Wofür steht das «HTTP» in einer Webadresse?", a: "HyperText Transfer Protocol" },
          { q: "Wer entwickelte die Programmiersprache «C++»?", a: "Bjarne Stroustrup" },
        ]},
        { name: "Open-World & Rollenspiele", qa: [
          { q: "In welcher Reihe klaut man Autos in «Los Santos» und «Liberty City»?", a: "Grand Theft Auto" },
          { q: "Welches polnische Studio machte «The Witcher 3» und «Cyberpunk 2077»?", a: "CD Projekt Red" },
          { q: "In welchem Bethesda-Spiel ruft man «Fus Ro Dah» und kämpft gegen Drachen?", a: "Skyrim" },
          { q: "Welche Reihe von FromSoftware prägte das «Soulslike»-Genre?", a: "Dark Souls" },
          { q: "Wie heisst die weite Spielwelt in «The Legend of Zelda: Breath of the Wild»?", a: "Hyrule" },
        ]},
      ]},
    ],
  },

  /* ========================================================== SET 5 · SPORT */
  {
    name: "Sport",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Fussball-WM", qa: [
          { q: "Wie viele Spieler einer Mannschaft stehen gleichzeitig auf dem Feld?", a: "11" },
          { q: "Welches Land wurde 2022 in Katar Weltmeister?", a: "Argentinien" },
          { q: "Welches Land hat mit fünf Titeln die meisten WM gewonnen?", a: "Brasilien" },
          { q: "In welchem Land fand die erste Fussball-WM 1930 statt?", a: "In Uruguay" },
          { q: "Welcher Franzose erzielte im WM-Finale 1998 zwei Kopfballtore?", a: "Zinédine Zidane" },
        ]},
        { name: "Tennis", qa: [
          { q: "Wie nennt man einen Aufschlag, den der Gegner gar nicht berührt?", a: "Ein Ass" },
          { q: "Auf welchem Belag wird Wimbledon gespielt?", a: "Auf Rasen" },
          { q: "Welcher Serbe gewann die meisten Grand-Slam-Titel im Herren-Einzel?", a: "Novak Đoković" },
          { q: "Wie heisst der Punktestand, wenn beide Spieler bei 40 stehen?", a: "Einstand" },
          { q: "Welche beiden US-Schwestern dominierten das Damentennis der 2000er?", a: "Venus und Serena Williams" },
        ]},
        { name: "Wintersport", qa: [
          { q: "Wie nennt man das Fahren einen Hang hinunter auf zwei schmalen Brettern?", a: "Skifahren" },
          { q: "Welche Sportart kombiniert Langlauf und Gewehrschiessen?", a: "Biathlon" },
          { q: "In welchem Bündner Ort fanden bereits zweimal Olympische Winterspiele statt?", a: "In St. Moritz" },
          { q: "Wie heisst die gefürchtete Abfahrtsstrecke in Kitzbühel?", a: "Die Streif" },
          { q: "Wie heisst der Eiskanal-Sport, bei dem man kopfvoran auf einem kleinen Schlitten liegt?", a: "Skeleton" },
        ]},
        { name: "Basketball", qa: [
          { q: "Wie viele Punkte zählt ein normaler Korb aus dem Feld?", a: "2" },
          { q: "Wie viele Punkte bringt ein Wurf von hinter der Dreierlinie?", a: "3" },
          { q: "Welcher Spieler wird «His Airness» genannt und gewann sechs Titel mit Chicago?", a: "Michael Jordan" },
          { q: "In welcher Profiliga spielen die Lakers und die Celtics?", a: "In der NBA" },
          { q: "Wie heisst der Wurf, bei dem der Ball von oben in den Korb gestopft wird?", a: "Dunk" },
        ]},
        { name: "Leichtathletik & Schwimmen", qa: [
          { q: "Über welche kurze Distanz läuft der klassische Sprint im Stadion?", a: "100 Meter" },
          { q: "Welcher Jamaikaner hält die Weltrekorde über 100 und 200 Meter?", a: "Usain Bolt" },
          { q: "Wie lang ist ein Marathon ungefähr?", a: "42,195 Kilometer" },
          { q: "Welcher US-Schwimmer gewann 2008 acht Goldmedaillen bei einem einzigen Spiel?", a: "Michael Phelps" },
          { q: "Wie heisst die Disziplin, bei der man sich mit einer Stange über eine hohe Latte katapultiert?", a: "Stabhochsprung" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Formel 1", qa: [
          { q: "Welcher Deutsche gewann in den 2000ern sieben Formel-1-Weltmeistertitel?", a: "Michael Schumacher" },
          { q: "Welcher Brite gewann ebenfalls sieben Titel, die meisten davon mit Mercedes?", a: "Lewis Hamilton" },
          { q: "In welchem Land liegt die Traditionsrennstrecke Monza?", a: "In Italien" },
          { q: "Welches Team ist das erfolgreichste und älteste der Formel-1-Geschichte?", a: "Ferrari" },
          { q: "In welchem Fürstentum an der Côte d'Azur findet der prestigeträchtigste Stadtkurs statt?", a: "In Monaco" },
        ]},
        { name: "Olympische Spiele", qa: [
          { q: "Wie viele Ringe zeigt das olympische Symbol?", a: "5" },
          { q: "In welcher Stadt fanden 2021 die verschobenen Sommerspiele statt?", a: "In Tokio" },
          { q: "In welchem Land liegt Olympia, der antike Ursprungsort der Spiele?", a: "In Griechenland" },
          { q: "Welche Stadt richtete 1896 die ersten modernen Sommerspiele aus?", a: "Athen" },
          { q: "Welche Kletter-Disziplin wurde 2021 zusammen mit Skateboard und Surfen neu olympisch?", a: "Sportklettern" },
        ]},
        { name: "Radsport", qa: [
          { q: "Welches dreiwöchige Radrennen führt jeden Juli durch Frankreich?", a: "Die Tour de France" },
          { q: "Welche Trikotfarbe trägt der Gesamtführende der Tour de France?", a: "Gelb" },
          { q: "Wie heisst die grosse italienische Landesrundfahrt?", a: "Der Giro d'Italia" },
          { q: "Welcher Brite gewann 2012 als erster die Tour de France?", a: "Bradley Wiggins" },
          { q: "Wie nennt man die drei grossen Landesrundfahrten Frankreich, Italien und Spanien zusammen?", a: "Die Grand Tours" },
        ]},
        { name: "American Football & Baseball", qa: [
          { q: "Wie heisst das Endspiel der US-Football-Liga NFL?", a: "Der Super Bowl" },
          { q: "Wie viele Punkte bringt ein «Touchdown»?", a: "6" },
          { q: "Wie heisst im Baseball der Schlag, bei dem der Ball über den Zaun fliegt?", a: "Ein Homerun" },
          { q: "Welche New Yorker Mannschaft hat die meisten World-Series-Titel im Baseball?", a: "Die New York Yankees" },
          { q: "Wie viele Feldspieler einer Baseballmannschaft stehen bei der Verteidigung auf dem Feld?", a: "9" },
        ]},
        { name: "Spitznamen & Rekorde", qa: [
          { q: "Welcher Boxer nannte sich selbst «The Greatest»?", a: "Muhammad Ali" },
          { q: "Welcher Fussballer wird kurz «CR7» genannt?", a: "Cristiano Ronaldo" },
          { q: "Welcher Argentinier erzielte 1986 das Tor mit der «Hand Gottes»?", a: "Diego Maradona" },
          { q: "Welcher Tennisprofi wird wegen seiner Sandplatz-Dominanz «King of Clay» genannt?", a: "Rafael Nadal" },
          { q: "Welcher Leichtathlet hält seit 1991 mit 8,95 Metern den Weitsprung-Weltrekord?", a: "Mike Powell" },
        ]},
      ]},
    ],
  },

  /* ====================================================== SET 6 · GESCHICHTE */
  {
    name: "Geschichte",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Antikes Rom & Griechenland", qa: [
          { q: "Welche Stadt war das Machtzentrum des Römischen Reichs?", a: "Rom" },
          { q: "Welcher römische Feldherr wurde an den «Iden des März» ermordet?", a: "Julius Cäsar" },
          { q: "Wer war der erste römische Kaiser?", a: "Augustus" },
          { q: "Welcher Vulkan verschüttete 79 n. Chr. die Stadt Pompeji?", a: "Der Vesuv" },
          { q: "Welcher griechische Stadtstaat war für seine harte militärische Erziehung berühmt?", a: "Sparta" },
        ]},
        { name: "Mittelalter & Ritter", qa: [
          { q: "Wie nennt man den Zweikampf zweier berittener Ritter mit Lanzen?", a: "Das Lanzenstechen" },
          { q: "Wie nannte man einen jungen Mann in Ausbildung, der einem Ritter diente?", a: "Ein Knappe" },
          { q: "Welche Seuche raffte im 14. Jahrhundert rund ein Drittel Europas dahin?", a: "Die Pest" },
          { q: "Welches Dokument zwang König Johann Ohneland 1215 in England zu Zugeständnissen?", a: "Die Magna Carta" },
          { q: "Welche Bäuerin führte Frankreich im Hundertjährigen Krieg zu Siegen und wurde verbrannt?", a: "Jeanne d'Arc" },
        ]},
        { name: "Entdecker & Seefahrer", qa: [
          { q: "Wer erreichte 1492 im Auftrag Spaniens Amerika?", a: "Christoph Kolumbus" },
          { q: "Welcher Portugiese leitete die erste Weltumseglung, die 1522 vollendet wurde?", a: "Ferdinand Magellan" },
          { q: "Nach welchem Italiener wurde der Kontinent Amerika benannt?", a: "Amerigo Vespucci" },
          { q: "Welcher Brite umsegelte im 18. Jahrhundert dreimal den Pazifik und kartierte Australiens Ostküste?", a: "James Cook" },
          { q: "Welcher Portugiese fand 1498 den Seeweg um Afrika nach Indien?", a: "Vasco da Gama" },
        ]},
        { name: "Zweiter Weltkrieg", qa: [
          { q: "In welchem Jahr endete der Zweite Weltkrieg in Europa?", a: "1945" },
          { q: "Mit dem Überfall auf welches Land begann der Krieg im September 1939?", a: "Auf Polen" },
          { q: "Wie heisst der Tag der alliierten Landung in der Normandie 1944?", a: "Der D-Day" },
          { q: "Auf welche zwei japanischen Städte warfen die USA 1945 Atombomben?", a: "Hiroshima und Nagasaki" },
          { q: "Wie heisst die Luftschlacht von 1940 über Grossbritannien?", a: "Die Luftschlacht um England" },
        ]},
        { name: "Altes Ägypten & Pyramiden", qa: [
          { q: "Wie nennt man die riesigen Königsgräber von Gizeh?", a: "Pyramiden" },
          { q: "Welcher jung gestorbene Pharao wurde 1922 fast unversehrt gefunden?", a: "Tutanchamun" },
          { q: "Wie heisst die Löwenfigur mit Menschenkopf bei den Pyramiden von Gizeh?", a: "Die Sphinx" },
          { q: "Wie heisst die ägyptische Bilderschrift?", a: "Hieroglyphen" },
          { q: "Welcher Fund ermöglichte 1822 die Entzifferung der Hieroglyphen?", a: "Der Stein von Rosette" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Französische Revolution & Napoleon", qa: [
          { q: "In welchem Jahr wurde die Bastille gestürmt?", a: "1789" },
          { q: "Mit welchem Gerät wurden während der Revolution die Verurteilten hingerichtet?", a: "Mit der Guillotine" },
          { q: "In welcher Schlacht wurde Napoleon 1815 endgültig besiegt?", a: "Bei Waterloo" },
          { q: "Auf welche abgelegene Atlantikinsel wurde Napoleon nach 1815 verbannt?", a: "Nach St. Helena" },
          { q: "Wie hiess Napoleons erste Frau, von der er sich 1809 mangels Erben trennte?", a: "Joséphine" },
        ]},
        { name: "Kalter Krieg", qa: [
          { q: "Welche Mauer teilte von 1961 bis 1989 eine Stadt in zwei Hälften?", a: "Die Berliner Mauer" },
          { q: "Welche zwei Supermächte standen sich im Kalten Krieg gegenüber?", a: "USA und Sowjetunion" },
          { q: "Welche Krise brachte die Welt 1962 an den Rand eines Atomkriegs?", a: "Die Kubakrise" },
          { q: "Wie hiess das Militärbündnis des Ostblocks?", a: "Der Warschauer Pakt" },
          { q: "Welcher sowjetische Staatschef leitete mit «Glasnost» und «Perestroika» Reformen ein?", a: "Michail Gorbatschow" },
        ]},
        { name: "Könige & Königinnen", qa: [
          { q: "Welche britische Königin regierte von 1952 bis 2022?", a: "Elizabeth II." },
          { q: "Welcher englische König hatte sechs Ehefrauen?", a: "Heinrich VIII." },
          { q: "Welcher «Sonnenkönig» liess Versailles zu einem gewaltigen Schloss ausbauen?", a: "Ludwig XIV." },
          { q: "Welche englische Herrscherin wird «die jungfräuliche Königin» genannt?", a: "Elisabeth I." },
          { q: "Welcher letzte Zar Russlands wurde 1918 mit seiner Familie erschossen?", a: "Nikolaus II." },
        ]},
        { name: "Erfindungen der Industrialisierung", qa: [
          { q: "Welche Maschine trieb ab dem 18. Jahrhundert Fabriken und Lokomotiven an?", a: "Die Dampfmaschine" },
          { q: "Welcher Schotte verbesserte die Dampfmaschine so stark, dass eine Leistungseinheit nach ihm heisst?", a: "James Watt" },
          { q: "Wer baute 1885 das erste praxistaugliche Automobil mit Verbrennungsmotor?", a: "Carl Benz" },
          { q: "Wer meldete 1876 das Telefon zum Patent an?", a: "Alexander Graham Bell" },
          { q: "Welche Erfindung von Johannes Gutenberg um 1450 revolutionierte die Verbreitung von Wissen?", a: "Der Buchdruck mit beweglichen Lettern" },
        ]},
        { name: "Weltreiche & Kolonien", qa: [
          { q: "Von welcher Stadt aus wurde das Römische Reich regiert?", a: "Von Rom" },
          { q: "Welches Reich unter Dschingis Khan beherrschte im 13. Jahrhundert das grösste zusammenhängende Landgebiet der Geschichte?", a: "Das Mongolische Reich" },
          { q: "Welches Land beherrschte im 16. Jahrhundert weite Teile Süd- und Mittelamerikas?", a: "Spanien" },
          { q: "Über welches Reich sagte man im 19. Jahrhundert, in ihm gehe «die Sonne nie unter»?", a: "Das Britische Empire" },
          { q: "Welches Reich ging 1453 mit der Eroberung Konstantinopels durch die Osmanen unter?", a: "Das Byzantinische Reich" },
        ]},
      ]},
    ],
  },

  /* ================================================ SET 7 · GEOGRAFIE & WELT */
  {
    name: "Geografie & Welt",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Hauptstädte", qa: [
          { q: "Wie heisst die Hauptstadt von Spanien?", a: "Madrid" },
          { q: "Wie heisst die Hauptstadt von Kanada?", a: "Ottawa" },
          { q: "Wie heisst die Hauptstadt von Australien?", a: "Canberra" },
          { q: "Wie heisst die Hauptstadt von Marokko?", a: "Rabat" },
          { q: "Wie heisst die Hauptstadt von Kasachstan?", a: "Astana" },
        ]},
        { name: "Flaggen", type: "flag", qa: [
          { q: "🇮🇹", a: "Italien" },
          { q: "🇸🇪", a: "Schweden" },
          { q: "🇧🇷", a: "Brasilien" },
          { q: "🇿🇦", a: "Südafrika" },
          { q: "🇧🇹", a: "Bhutan" },
        ]},
        { name: "Flüsse & Gebirge der Welt", qa: [
          { q: "Welcher Fluss fliesst durch Ägypten und gilt als einer der längsten der Welt?", a: "Der Nil" },
          { q: "Welches Gebirge bildet die Grenze zwischen Europa und Asien?", a: "Der Ural" },
          { q: "Welcher Fluss führt das meiste Wasser der Welt?", a: "Der Amazonas" },
          { q: "Wie heisst das höchste Gebirge der Erde?", a: "Der Himalaya" },
          { q: "Welcher Fluss fliesst durch Wien, Budapest und Belgrad?", a: "Die Donau" },
        ]},
        { name: "Inseln & Meere", qa: [
          { q: "Welche italienische Mittelmeerinsel trägt den Vulkan Ätna?", a: "Sizilien" },
          { q: "Wie heisst die grösste Insel der Welt?", a: "Grönland" },
          { q: "Welches Meer liegt zwischen Europa und Afrika?", a: "Das Mittelmeer" },
          { q: "Welcher See in Sibirien ist der tiefste der Erde?", a: "Der Baikalsee" },
          { q: "Welches Binnenmeer in Zentralasien ist seit Jahrzehnten fast ausgetrocknet?", a: "Der Aralsee" },
        ]},
        { name: "Wüsten & Vulkane", qa: [
          { q: "Wie heisst die grösste Wüste Afrikas?", a: "Die Sahara" },
          { q: "Welcher Vulkan bei Neapel zerstörte im Jahr 79 die Stadt Pompeji?", a: "Der Vesuv" },
          { q: "Welche Wüste in Südamerika gilt als trockenste der Welt?", a: "Die Atacama" },
          { q: "In welchem US-Bundesstaat liegt der aktive Vulkan Kilauea?", a: "Auf Hawaii" },
          { q: "Wie heisst der Gürtel rund um den Pazifik mit besonders vielen Vulkanen und Erdbeben?", a: "Der pazifische Feuerring" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Grenzen & Nachbarländer", qa: [
          { q: "Welches Land hat als einziges eine Landgrenze zu Portugal?", a: "Spanien" },
          { q: "An wie viele Länder grenzt die Schweiz?", a: "An 5" },
          { q: "Welches Land teilt sich mit Russland den Rekord von 14 Nachbarländern?", a: "China" },
          { q: "Welche zwei Länder teilen sich die längste Landgrenze der Welt?", a: "Kanada und die USA" },
          { q: "Welches Land liegt vollständig innerhalb Südafrikas?", a: "Lesotho" },
        ]},
        { name: "Megastädte & Bauwerke", qa: [
          { q: "In welcher Stadt steht der Eiffelturm?", a: "In Paris" },
          { q: "In welcher Stadt steht das höchste Gebäude der Welt, der Burj Khalifa?", a: "In Dubai" },
          { q: "Welche japanische Metropolregion gilt als die bevölkerungsreichste der Welt?", a: "Tokio" },
          { q: "In welcher Stadt steht die Statue «Cristo Redentor» über der Bucht?", a: "In Rio de Janeiro" },
          { q: "In welcher Stadt steht das antike Amphitheater «Kolosseum»?", a: "In Rom" },
        ]},
        { name: "Länder & Kontinente", qa: [
          { q: "Auf welchem Kontinent liegt Ägypten?", a: "In Afrika" },
          { q: "Welches ist flächenmässig das grösste Land der Erde?", a: "Russland" },
          { q: "Welches südamerikanische Land trägt den Äquator im Namen?", a: "Ecuador" },
          { q: "Welcher Inselstaat in Südostasien besteht aus über 17'000 Inseln?", a: "Indonesien" },
          { q: "Welcher ist der flächenmässig kleinste Staat der Welt?", a: "Die Vatikanstadt" },
        ]},
        { name: "Nationalgerichte & Währungen", qa: [
          { q: "In welchem Land isst man traditionell Sushi?", a: "In Japan" },
          { q: "Wie heisst die Währung Japans?", a: "Der Yen" },
          { q: "Aus welchem Land stammt das Reisgericht «Paella»?", a: "Aus Spanien" },
          { q: "Welche Währung hatte Deutschland vor dem Euro?", a: "Die D-Mark" },
          { q: "Aus welchem Land stammt das scharfe, fermentierte Kohlgericht «Kimchi»?", a: "Aus Südkorea" },
        ]},
        { name: "Extreme der Erde", qa: [
          { q: "Wie heisst der höchste Berg der Erde?", a: "Der Mount Everest" },
          { q: "Wie heisst die tiefste bekannte Stelle der Ozeane im Marianengraben?", a: "Das Challengertief" },
          { q: "Welcher Kontinent ist der kälteste und trockenste?", a: "Die Antarktis" },
          { q: "Welcher extrem salzige See liegt am tiefsten Punkt der Landoberfläche?", a: "Das Tote Meer" },
          { q: "In welchem Land liegt das Death Valley, wo eine der höchsten Lufttemperaturen gemessen wurde?", a: "In den USA" },
        ]},
      ]},
    ],
  },

  /* ============================================ SET 8 · NATUR & TECHNIK */
  {
    name: "Natur & Technik",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Der menschliche Körper", qa: [
          { q: "Welches Organ pumpt das Blut durch den Körper?", a: "Das Herz" },
          { q: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?", a: "32" },
          { q: "Wie heisst das grösste Organ des Menschen?", a: "Die Haut" },
          { q: "Wie viele Knochen hat ein erwachsener Mensch ungefähr?", a: "206" },
          { q: "Wie heisst der Muskel unter der Lunge, der die Atmung antreibt?", a: "Das Zwerchfell" },
        ]},
        { name: "Das Sonnensystem", qa: [
          { q: "Welcher Planet wird «der rote Planet» genannt?", a: "Der Mars" },
          { q: "Welcher ist der grösste Planet des Sonnensystems?", a: "Jupiter" },
          { q: "Welcher Planet hat die auffälligsten Ringe?", a: "Saturn" },
          { q: "Welcher Planet ist der sonnennächste?", a: "Merkur" },
          { q: "Welcher Himmelskörper verlor 2006 seinen Status als Planet?", a: "Pluto" },
        ]},
        { name: "Chemische Elemente", qa: [
          { q: "Welches Element hat das Symbol «O»?", a: "Sauerstoff" },
          { q: "Welches Element hat das Symbol «Au»?", a: "Gold" },
          { q: "Welches Gas ist mit Abstand am häufigsten in der Luft?", a: "Stickstoff" },
          { q: "Welches Metall ist bei Zimmertemperatur flüssig?", a: "Quecksilber" },
          { q: "Welches ist das leichteste Element im Periodensystem?", a: "Wasserstoff" },
        ]},
        { name: "Tiere & Naturrekorde", qa: [
          { q: "Welches ist das grösste Tier der Erde?", a: "Der Blauwal" },
          { q: "Welches ist das schnellste Landtier?", a: "Der Gepard" },
          { q: "Welcher Vogel kann als einziger auch rückwärts fliegen?", a: "Der Kolibri" },
          { q: "Welches Tier hat drei Herzen und blaues Blut?", a: "Der Krake" },
          { q: "Bei welchem Tier trägt das Männchen die Jungen im Bauch aus?", a: "Beim Seepferdchen" },
        ]},
        { name: "Physik im Alltag", qa: [
          { q: "In welche Richtung fällt ein losgelassener Gegenstand?", a: "Nach unten" },
          { q: "Was ist schneller: Schall oder Licht?", a: "Licht" },
          { q: "Wie heisst die Kraft, die uns auf dem Boden hält?", a: "Die Schwerkraft" },
          { q: "Bei wie viel Grad Celsius gefriert reines Wasser?", a: "Bei 0 Grad" },
          { q: "Wie nennt man den Übergang von flüssig zu gasförmig?", a: "Verdampfen" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Weltraumfahrt & Astronauten", qa: [
          { q: "Wer betrat 1969 als erster Mensch den Mond?", a: "Neil Armstrong" },
          { q: "Wie hiess der erste Mensch im Weltall im Jahr 1961?", a: "Juri Gagarin" },
          { q: "Wie heisst die bemannte Raumstation, die seit 1998 die Erde umkreist?", a: "Die ISS" },
          { q: "Welches NASA-Programm brachte in den 1960er- und 70er-Jahren Menschen zum Mond?", a: "Das Apollo-Programm" },
          { q: "Welches Weltraumteleskop löste 2022 Hubble als leistungsstärkstes ab?", a: "Das James-Webb-Teleskop" },
        ]},
        { name: "Mathematik & Zahlen", qa: [
          { q: "Wie viel ist 12 mal 12?", a: "144" },
          { q: "Wie nennt man eine Zahl, die nur durch 1 und sich selbst teilbar ist?", a: "Eine Primzahl" },
          { q: "Wie heisst die Kreiszahl mit dem ungefähren Wert 3,14?", a: "Pi" },
          { q: "Wie heisst der Lehrsatz für rechtwinklige Dreiecke: a² plus b² gleich c²?", a: "Der Satz des Pythagoras" },
          { q: "Wie heisst die Zahlenfolge 1, 1, 2, 3, 5, 8, 13 …?", a: "Die Fibonacci-Folge" },
        ]},
        { name: "Forschung & Nobelpreise", qa: [
          { q: "Welcher Physiker stellte die Relativitätstheorie auf?", a: "Albert Einstein" },
          { q: "Welche Forscherin gewann Nobelpreise in Physik und in Chemie?", a: "Marie Curie" },
          { q: "Wer entdeckte 1928 das Penicillin?", a: "Alexander Fleming" },
          { q: "Wer stellte mit «Die Entstehung der Arten» die Evolutionstheorie auf?", a: "Charles Darwin" },
          { q: "In welcher Stadt werden die Nobelpreise ausser dem Friedensnobelpreis verliehen?", a: "In Stockholm" },
        ]},
        { name: "Wetter & Klima", qa: [
          { q: "Wie nennt man gefrorene Niederschlagskörner, die bei Sommergewittern fallen?", a: "Hagel" },
          { q: "Wie heissen die tropischen Wirbelstürme im Atlantik?", a: "Hurrikane" },
          { q: "Wie heisst das pazifische Klimaphänomen, benannt nach «der Junge» auf Spanisch?", a: "El Niño" },
          { q: "Welches Gas gilt als Haupttreiber des menschengemachten Klimawandels?", a: "Kohlendioxid" },
          { q: "Wie nennt man die Grenzlinie, an der eine Warmluftmasse auf eine Kaltluftmasse trifft?", a: "Eine Front" },
        ]},
        { name: "Autos & Motoren", qa: [
          { q: "Welche Automarke hat einen Stern mit drei Zacken im Logo?", a: "Mercedes-Benz" },
          { q: "Welche Automarke hat vier Ringe im Logo?", a: "Audi" },
          { q: "Wofür steht die Abkürzung «PS» bei der Motorleistung?", a: "Pferdestärke" },
          { q: "Welche italienische Sportwagenmarke hat ein springendes Pferd im Logo?", a: "Ferrari" },
          { q: "Wie heisst der Motortyp ohne Hubkolben, den Mazda im RX-7 einsetzte?", a: "Der Wankelmotor" },
        ]},
      ]},
    ],
  },

  /* ================================== SET 9 · ESSEN, TRINKEN & ALLTAG */
  {
    name: "Essen & Trinken",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Obst & Gemüse", qa: [
          { q: "Welche Frucht ist gelb, krumm und wächst in Büscheln?", a: "Die Banane" },
          { q: "Welches Gemüse treibt einem beim Schneiden die Tränen in die Augen?", a: "Die Zwiebel" },
          { q: "Welche rote Frucht trägt ihre Samen aussen auf der Schale?", a: "Die Erdbeere" },
          { q: "Welche scharfe Knolle soll der Sage nach Vampire vertreiben?", a: "Der Knoblauch" },
          { q: "Was ist die Tomate botanisch gesehen: eine Beere, ein Kerngewächs oder ein Wurzelgemüse?", a: "Eine Beere" },
        ]},
        { name: "Gewürze & Kräuter", qa: [
          { q: "Welches weisse Würzmittel steht neben Pfeffer auf fast jedem Tisch?", a: "Salz" },
          { q: "Welches Gewürz gibt Currypulver und Senf seine gelbe Farbe?", a: "Kurkuma" },
          { q: "Welches Kraut gehört klassisch auf eine Pizza Margherita?", a: "Basilikum" },
          { q: "Welches Gewürz ist nach Gewicht das teuerste der Welt?", a: "Safran" },
          { q: "Woraus besteht das Gewürz «Kapern»?", a: "Aus eingelegten Blütenknospen des Kapernstrauchs" },
        ]},
        { name: "Käse & Milchprodukte", qa: [
          { q: "Welcher Schweizer Käse mit grossen Löchern ist nach einer Region benannt?", a: "Emmentaler" },
          { q: "Aus welchem Land stammt der Hartkäse «Parmesan»?", a: "Aus Italien" },
          { q: "Welcher französische Blauschimmelkäse reift in Kalksteinhöhlen?", a: "Roquefort" },
          { q: "Wie nennt man das kurze Erhitzen von Milch, um sie haltbarer zu machen?", a: "Pasteurisieren" },
          { q: "Welches abgeseihte, besonders dicke Milchprodukt trägt den Namen eines Mittelmeerlandes?", a: "Griechischer Joghurt" },
        ]},
        { name: "Getränke & Cocktails", qa: [
          { q: "Welches Heissgetränk gewinnt man aus gerösteten Bohnen?", a: "Kaffee" },
          { q: "Welcher Cocktail aus Rum, Limette, Minze und Zucker stammt aus Kuba?", a: "Der Mojito" },
          { q: "Welche Spirituose ist neben Campari und Wermut die Basis eines «Negroni»?", a: "Gin" },
          { q: "Aus welchem Land stammt der Reiswein «Sake»?", a: "Aus Japan" },
          { q: "Welchen Cocktail bestellt James Bond «geschüttelt, nicht gerührt»?", a: "Den Martini" },
        ]},
        { name: "Frühstück weltweit", qa: [
          { q: "Welche Bohnen gehören klassisch zum «English Breakfast»?", a: "Baked Beans" },
          { q: "Welches ringförmige Gebäck essen die US-Amerikaner gern zum Kaffee?", a: "Den Donut" },
          { q: "Wie heisst das französische Buttergebäck in Halbmondform?", a: "Das Croissant" },
          { q: "Welchen dunklen Hefe-Aufstrich lieben oder hassen die Australier?", a: "Vegemite" },
          { q: "Wie heisst der Getreidebrei mit Obst und Nüssen, den ein Schweizer Arzt erfand?", a: "Das Birchermüesli" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Herkunft von Gerichten", qa: [
          { q: "Aus welchem Land stammt die Pizza?", a: "Aus Italien" },
          { q: "Aus welchem Land stammt das Fleischgericht «Gulasch»?", a: "Aus Ungarn" },
          { q: "Aus welchem Land stammt «Ceviche», in Zitrussaft marinierter roher Fisch?", a: "Aus Peru" },
          { q: "Aus welcher Weltregion stammen «Hummus» und «Falafel» ursprünglich?", a: "Aus dem Nahen Osten" },
          { q: "Aus welchem Land stammt das gebratene Nudelgericht «Pad Thai»?", a: "Aus Thailand" },
        ]},
        { name: "Süssspeisen & Desserts", qa: [
          { q: "Welche italienische Nachspeise aus Kaffee und Mascarpone heisst übersetzt «zieh mich hoch»?", a: "Tiramisu" },
          { q: "Welches französische Dessert hat eine Karamellkruste, die man mit dem Löffel aufklopft?", a: "Crème brûlée" },
          { q: "Wie heisst der zerrissene, mit Puderzucker bestäubte österreichische Pfannkuchen?", a: "Der Kaiserschmarrn" },
          { q: "Welches Baiser-Dessert mit Sahne und Früchten ist nach einer russischen Ballerina benannt?", a: "Die Pavlova" },
          { q: "Aus welcher Küche stammt die Blätterteig-Nuss-Honig-Süssigkeit «Baklava»?", a: "Aus der türkischen bzw. osmanischen Küche" },
        ]},
        { name: "Kaffee & Tee", qa: [
          { q: "Welcher Kaffee besteht aus Espresso mit viel aufgeschäumter Milch?", a: "Cappuccino" },
          { q: "Aus welchem Land stammt die Kaffeepflanze ursprünglich?", a: "Aus Äthiopien" },
          { q: "Wie nennt man einen Espresso, der mit zusätzlichem Wasser gestreckt wird?", a: "Caffè lungo" },
          { q: "Welche Teesorte wird in Japan zu feinem Pulver «Matcha» vermahlen?", a: "Grüner Tee" },
          { q: "In welchem Land wird pro Kopf am meisten Tee getrunken?", a: "In der Türkei" },
        ]},
        { name: "Fast Food & Ketten", qa: [
          { q: "Welche Fast-Food-Kette hat goldene Bögen als Logo?", a: "McDonald's" },
          { q: "Welche längliche Sandwich-Form ist die Spezialität von «Subway»?", a: "Das Sub / Baguette-Sandwich" },
          { q: "Aus welchem US-Bundesstaat stammt die Burgerkette «In-N-Out»?", a: "Aus Kalifornien" },
          { q: "Wofür stehen die drei Buchstaben «KFC»?", a: "Kentucky Fried Chicken" },
          { q: "Welche Pizzakette hat einen halb roten, halb blauen Kreis mit drei Punkten als Logo?", a: "Domino's" },
        ]},
        { name: "Küchentechnik & Begriffe", qa: [
          { q: "Wie nennt man das Garen von Lebensmitteln in sprudelndem Wasser?", a: "Kochen" },
          { q: "Wie nennt man das kurze, scharfe Anbraten bei hoher Hitze?", a: "Sautieren" },
          { q: "Was bedeutet «al dente» bei Pasta?", a: "Bissfest" },
          { q: "Wie nennt man steif geschlagenes Eiweiss?", a: "Eischnee" },
          { q: "Wie heisst die französische Grundsauce aus Butter, Mehl und Milch?", a: "Béchamel" },
        ]},
      ]},
    ],
  },

  /* ============================================ SET 10 · POPKULTUR & KURIOSES */
  {
    name: "Popkultur & Kurioses",
    boards: [
      { title: "BOARD 1", points: BOARD_POINTS[0], categories: [
        { name: "Berühmte Logos & Marken", qa: [
          { q: "Welche Marke hat einen angebissenen Apfel als Logo?", a: "Apple" },
          { q: "Welcher Sportartikelhersteller hat einen geschwungenen Haken, den «Swoosh»?", a: "Nike" },
          { q: "Welche bayerische Automarke hat ein blau-weisses Rundlogo?", a: "BMW" },
          { q: "Welche Modemarke trägt ein grünes Krokodil als Logo?", a: "Lacoste" },
          { q: "Welche Fast-Food-Kette hat einen bärtigen Colonel als Markengesicht?", a: "KFC" },
        ]},
        { name: "Trash-TV & Reality", qa: [
          { q: "In welcher Kuppelshow sucht ein Landwirt eine Partnerin?", a: "Bauer sucht Frau" },
          { q: "In welcher Show ziehen Promis in ein australisches Dschungelcamp?", a: "Ich bin ein Star – Holt mich hier raus!" },
          { q: "In welchem Format sucht ein einzelner Junggeselle unter vielen Frauen eine Partnerin?", a: "Der Bachelor" },
          { q: "Welche US-Familie ist seit 2007 mit «Keeping Up with the …» im Reality-TV?", a: "Die Kardashians" },
          { q: "In welcher Sendung tauschen zwei Mütter für einige Tage die Familie?", a: "Frauentausch" },
        ]},
        { name: "Rekorde", qa: [
          { q: "In welchem Buch werden die kuriosen «Weltrekorde» gesammelt?", a: "Im Guinness-Buch der Rekorde" },
          { q: "Welches ist das grösste an Land lebende Tier?", a: "Der Afrikanische Elefant" },
          { q: "Welches Land hat die meisten Einwohner der Welt?", a: "Indien" },
          { q: "Wie viele Farben hat ein Regenbogen klassischerweise?", a: "7" },
          { q: "In welchem Land lebte Robert Wadlow, mit rund 2,72 Metern der grösste je vermessene Mensch?", a: "In den USA" },
        ]},
        { name: "Aberglaube & Phobien", qa: [
          { q: "Welche Zahl gilt in westlichen Ländern als Unglückszahl?", a: "13" },
          { q: "Was bringt es dem Aberglauben nach, wenn eine schwarze Katze von links den Weg kreuzt?", a: "Pech" },
          { q: "Wie heisst die Angst vor engen Räumen?", a: "Klaustrophobie" },
          { q: "Wie heisst die Angst vor Spinnen?", a: "Arachnophobie" },
          { q: "Wie heisst die Angst vor der Zahl 13?", a: "Triskaidekaphobie" },
        ]},
        { name: "Spielzeug & Kindheit", qa: [
          { q: "Welche bunten Steckbausteine aus Dänemark kann man zusammenstecken?", a: "Lego" },
          { q: "Welche Mattel-Puppe hat einen Freund namens Ken?", a: "Barbie" },
          { q: "Welcher drehbare Würfel mit sechs Farben wurde in den 80ern zum Welthit?", a: "Der Zauberwürfel" },
          { q: "Welche formbare Knetmasse heisst wörtlich «Spiel-Teig»?", a: "Play-Doh" },
          { q: "Welche japanischen Sammelkarten mit Pikachu tauschten Kinder weltweit?", a: "Pokémon-Karten" },
        ]},
      ]},
      { title: "BOARD 2", points: BOARD_POINTS[1], categories: [
        { name: "Zeichentrick- & Comicfiguren", qa: [
          { q: "Welche Maus ist das Maskottchen von Disney?", a: "Micky Maus" },
          { q: "Welches gelbe Schwamm-Wesen wohnt in einer Ananas auf dem Meeresgrund?", a: "SpongeBob" },
          { q: "Welcher belgische Comic-Reporter reist mit seinem Hund Struppi um die Welt?", a: "Tim" },
          { q: "Welches gallische Dorf trotzt mit Zaubertrank den Römern?", a: "Das Dorf von Asterix und Obelix" },
          { q: "Wie heisst die zynische Zeichentrick-Figur, ein fauler Kater, der Lasagne liebt?", a: "Garfield" },
        ]},
        { name: "Modewelt & Designer", qa: [
          { q: "Welche französische Marke steht für das «kleine Schwarze» und das Parfüm «No. 5»?", a: "Chanel" },
          { q: "Welche italienische Marke hat einen Medusenkopf als Logo?", a: "Versace" },
          { q: "Welcher Deutsche war jahrzehntelang der Chefdesigner von Chanel?", a: "Karl Lagerfeld" },
          { q: "Welche Luxusmarke ist für ihr Monogramm-Muster mit den Initialen «LV» bekannt?", a: "Louis Vuitton" },
          { q: "In welcher Stadt findet neben Paris, Mailand und London die vierte grosse Fashion Week statt?", a: "In New York" },
        ]},
        { name: "Urban Legends & Verschwörungen", qa: [
          { q: "Welches Seeungeheuer soll in einem schottischen See leben?", a: "Nessie" },
          { q: "In welchem abgeriegelten US-Militärgebiet in Nevada sollen laut Gerüchten Ausserirdische liegen?", a: "In der Area 51" },
          { q: "Welcher haarige Waldmensch treibt angeblich in den Wäldern Nordamerikas sein Unwesen?", a: "Bigfoot" },
          { q: "In welchem «Dreieck» im Atlantik sollen Schiffe und Flugzeuge spurlos verschwinden?", a: "Im Bermudadreieck" },
          { q: "Welcher Beatle soll laut einer Verschwörungstheorie schon 1966 gestorben und ersetzt worden sein?", a: "Paul McCartney" },
        ]},
        { name: "Symbole & Redewendungen", qa: [
          { q: "Welche Farbe entsteht, wenn man Blau und Gelb mischt?", a: "Grün" },
          { q: "Wofür steht das Schwenken einer weissen Fahne im Kampf?", a: "Für Kapitulation" },
          { q: "Was bedeutet die Redewendung «ins Gras beissen»?", a: "Sterben" },
          { q: "Welche Farbe trägt die Trauer traditionell in weiten Teilen Asiens statt Schwarz?", a: "Weiss" },
          { q: "Aus welchem Bereich stammt die Redewendung «etwas auf die lange Bank schieben»?", a: "Aus alten Gerichtssälen, wo Akten auf der Bank liegen blieben" },
        ]},
        { name: "Berühmte Duos & Trios", qa: [
          { q: "Welche zwei Zeichentrickfiguren jagen sich ewig als Katze und Maus?", a: "Tom und Jerry" },
          { q: "Welches Comedy-Duo der Stummfilmzeit war als «Dick und Doof» bekannt?", a: "Laurel und Hardy" },
          { q: "Wie heissen die drei Hauptfiguren der «Harry Potter»-Reihe?", a: "Harry, Ron und Hermine" },
          { q: "Welches Krimi-Duo ermittelt von der Baker Street 221B aus?", a: "Sherlock Holmes und Dr. Watson" },
          { q: "Wie heissen die beiden mürrischen alten Männer auf dem Balkon der «Muppet Show»?", a: "Statler und Waldorf" },
        ]},
      ]},
    ],
  },
];

/* Für Node nutzbar machen (im Browser ignoriert). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BOARD_POINTS, BOARD_SETS };
}
