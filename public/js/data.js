/* ============================================================
   JEOPARDY · 6 Fragen-Sets mit je 2 Boards
   Board 1: 100–500 · Board 2: 200–1000
   Zielgruppe: junge Erwachsene (19–23) aus der Schweiz.
   Niveau angehoben. Faire Kurve:
     100 = einfacher Einstieg · 200 = solides Wissen · 300 = anspruchsvoll
     400 = schwer · 500 = richtig knifflig (auch eine schlaue Runde grübelt)
   Board 2 analog: 200 Einstieg … 1000 sehr schwer.
   Alles Hochdeutsch, keine erklärenden Klammern.
   ============================================================ */

const BOARD_POINTS = [[100, 200, 300, 400, 500], [200, 400, 600, 800, 1000]];

const BOARD_SETS = [

  /* ================= SET 1: SCHWEIZ ================= */
  {
    name: "Schweiz",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Kantone & Städte", qa: [
            { q: "Wie heisst die Hauptstadt der Schweiz?", a: "Bern" },
            { q: "Welcher Kanton ist flächenmässig der grösste?", a: "Graubünden" },
            { q: "Welcher ist der flächenmässig kleinste Kanton?", a: "Basel-Stadt" },
            { q: "Welcher Kanton trat 1979 als jüngster der Eidgenossenschaft bei?", a: "Der Kanton Jura" },
            { q: "Welcher Kanton hat die wenigsten Einwohner?", a: "Appenzell Innerrhoden" },
          ]},
          { name: "Berge & Seen", qa: [
            { q: "Wie heisst der pyramidenförmige Berg bei Zermatt?", a: "Das Matterhorn" },
            { q: "Wie heisst der höchste Berg der Schweiz?", a: "Die Dufourspitze" },
            { q: "Wie heisst der grösste See, der komplett in der Schweiz liegt?", a: "Der Neuenburgersee" },
            { q: "Wie heisst der längste Gletscher der Alpen, im Wallis?", a: "Der Aletschgletscher" },
            { q: "Wie heisst der kleine Bergsee, aus dem der Vorderrhein entspringt?", a: "Der Tomasee" },
          ]},
          { name: "Schweizer Marken", qa: [
            { q: "Welche zwei grossen Detailhändler dominieren den Schweizer Markt?", a: "Migros und Coop" },
            { q: "Aus welchem Grundstoff wird das Getränk Rivella hergestellt?", a: "Aus Molke" },
            { q: "In welcher Stadt hat die Uhrenmarke Swatch ihren Hauptsitz?", a: "In Biel" },
            { q: "Welcher Waadtländer erfand 1875 zusammen mit Nestlé die Milchschokolade?", a: "Daniel Peter" },
            { q: "In welchem Schwyzer Dorf werden die Victorinox-Taschenmesser hergestellt?", a: "In Ibach" },
          ]},
          { name: "Schweizerdeutsch", qa: [
            { q: "Was bedeutet «Velo»?", a: "Fahrrad" },
            { q: "Was bedeutet «Mutschli»?", a: "Ein kleines Brötchen" },
            { q: "Was bedeutet «Finken»?", a: "Hausschuhe" },
            { q: "Was bedeutet «Pflotsch»?", a: "Nasser Schneematsch" },
            { q: "Was bedeutet der Berner Ausdruck «äuä»?", a: "«Wohl / vielleicht», ein Ausdruck des Zweifels" },
          ]},
          { name: "Schweizer Küche", qa: [
            { q: "Wie heisst das Gericht aus geschmolzenem Käse, in das man Brot tunkt?", a: "Fondue" },
            { q: "Wie heisst das Berggericht aus Teigwaren, Kartoffeln, Käse und Zwiebeln mit Apfelmus?", a: "Älplermagronen" },
            { q: "Wie heisst die Zürcher Spezialität aus Kalbfleisch an einer Rahmsauce?", a: "Zürcher Geschnetzeltes" },
            { q: "Wie heisst die Bündner Spezialität, bei der Teig in Mangoldblätter gewickelt wird?", a: "Capuns" },
            { q: "Wie heisst der herzhafte Walliser Kuchen, dessen Name an eine Krankheit erinnert?", a: "Cholera" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "Schweizer Promis", qa: [
            { q: "Welcher Schweizer gilt als eine der grössten Tennis-Legenden aller Zeiten?", a: "Roger Federer" },
            { q: "Welche Rapperin aus Luzern wurde mit dem Song «Sonnenbrille» bekannt?", a: "Loredana" },
            { q: "Welcher Schweizer Eurodance-Star sang «Chihuahua»?", a: "DJ Bobo" },
            { q: "Welcher Rapper aus Lausanne ist einer der grössten Stars der Romandie?", a: "Stress" },
            { q: "Welcher Schweizer gestaltete die Kreaturen für den Film «Alien» und gewann dafür einen Oscar?", a: "H. R. Giger" },
          ]},
          { name: "Geschichte & Politik", qa: [
            { q: "Wie viele Mitglieder hat der Bundesrat?", a: "7" },
            { q: "In welchem Jahr wurde die Schweiz zum modernen Bundesstaat?", a: "1848" },
            { q: "Welche drei Urkantone schlossen 1291 den Bund?", a: "Uri, Schwyz und Unterwalden" },
            { q: "In welchem Jahr erhielten die Schweizer Frauen national das Stimmrecht?", a: "1971" },
            { q: "Wie nennt man die informelle Verteilung der Bundesratssitze auf die grossen Parteien?", a: "Die Zauberformel" },
          ]},
          { name: "Rund um die Schweiz", qa: [
            { q: "Wie viele offizielle Landessprachen hat die Schweiz?", a: "4" },
            { q: "Welche ist die vierte Landessprache neben Deutsch, Französisch und Italienisch?", a: "Rätoromanisch" },
            { q: "Wofür steht das Kürzel «CH» ausgeschrieben?", a: "Confoederatio Helvetica" },
            { q: "Wie heisst das höchstgelegene, ganzjährig bewohnte Dorf Europas in Graubünden?", a: "Juf" },
            { q: "Welche deutsche Gemeinde ist vollständig von Schweizer Gebiet umschlossen?", a: "Büsingen am Hochrhein" },
          ]},
          { name: "Was ist die Frage?", reverse: true, qa: [
            { q: "Dieses geflochtene Gebäck isst man traditionell am Sonntag.", a: "Was ist der Zopf?" },
            { q: "Dieser 57 Kilometer lange Tunnel ist der längste Eisenbahntunnel der Welt.", a: "Was ist der Gotthard-Basistunnel?" },
            { q: "Dieser Konzern mit Sitz in Vevey ist der grösste Lebensmittelkonzern der Welt.", a: "Was ist Nestlé?" },
            { q: "Dieser Genfer gründete das Rote Kreuz und erhielt den ersten Friedensnobelpreis.", a: "Wer ist Henri Dunant?" },
            { q: "Dieser Schweizer Chemiker entdeckte 1938 die Wirkung von LSD.", a: "Wer ist Albert Hofmann?" },
          ]},
          { name: "Öffentlicher Verkehr", qa: [
            { q: "Wie heisst die grösste Bahngesellschaft der Schweiz?", a: "Die SBB" },
            { q: "Wie heisst das Abo, mit dem man in der ganzen Schweiz unbegrenzt ÖV fährt?", a: "Das Generalabonnement" },
            { q: "Wie heisst das vergünstigte Nacht-Abo für unter 25-Jährige?", a: "seven25" },
            { q: "Welche Panoramabahn gilt als «langsamster Schnellzug der Welt»?", a: "Der Glacier Express" },
            { q: "Aus welchem berühmten Musikstück stammt die Melodie des Postauto-Horns?", a: "Aus der Wilhelm-Tell-Ouvertüre von Rossini" },
          ]},
        ],
      },
    ],
  },

  /* ================= SET 2: INTERNET & GAMES ================= */
  {
    name: "Internet & Games",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Social Media", qa: [
            { q: "Auf welcher App teilt man kurze, vertikale Videos?", a: "TikTok" },
            { q: "Wie hiess die Plattform «X» früher?", a: "Twitter" },
            { q: "Wie heisst der chinesische Mutterkonzern von TikTok?", a: "ByteDance" },
            { q: "Aus welcher App ging TikTok im Jahr 2018 hervor?", a: "Musical.ly" },
            { q: "Für wie viel kaufte Facebook 2012 Instagram ungefähr?", a: "Für rund 1 Milliarde Dollar" },
          ]},
          { name: "Memes", qa: [
            { q: "Wie nennt man ein lustiges Bild mit Text, das sich im Netz verbreitet?", a: "Ein Meme" },
            { q: "Wie nennt man es, wenn man mit «Never Gonna Give You Up» reingelegt wird?", a: "Rickroll" },
            { q: "Wie heisst das Meme, in dem ein Mann einer anderen Frau nachschaut?", a: "Distracted Boyfriend" },
            { q: "Wie heisst das Meme mit der Katze, die an einem Esstisch angeschrien wird?", a: "Woman Yelling at a Cat" },
            { q: "Wie heisst das Meme-Format, bei dem ein Gehirn in Stufen immer heller leuchtet?", a: "Expanding Brain" },
          ]},
          { name: "Gaming", qa: [
            { q: "In welchem Spiel baut man alles aus Blöcken?", a: "Minecraft" },
            { q: "In welchem Spiel sucht man heimlich den «Impostor»?", a: "Among Us" },
            { q: "In welchem Taktik-Shooter von Riot legt oder entschärft man den «Spike»?", a: "Valorant" },
            { q: "Wie heisst die Spiel-Engine hinter Fortnite, die viele Studios nutzen?", a: "Die Unreal Engine" },
            { q: "Welches Studio entwickelte «The Witcher 3» und «Cyberpunk 2077»?", a: "CD Projekt Red" },
          ]},
          { name: "Streaming & YouTube", qa: [
            { q: "Auf welcher Plattform lädt man Videos hoch?", a: "YouTube" },
            { q: "Auf welcher Plattform streamen Gamer live?", a: "Twitch" },
            { q: "Welcher schwedische Gamer war jahrelang der meistabonnierte YouTuber?", a: "PewDiePie" },
            { q: "Wie hiess das allererste YouTube-Video?", a: "«Me at the zoo»" },
            { q: "Welches war das erste YouTube-Video mit über einer Milliarde Aufrufen?", a: "«Gangnam Style»" },
          ]},
          { name: "Abkürzungen & Emojis", qa: [
            { q: "Wofür steht «LOL»?", a: "Laughing Out Loud" },
            { q: "Was bedeutet «FOMO»?", a: "Fear Of Missing Out" },
            { q: "Was bedeutet «NPC», auch als Spott über Menschen benutzt?", a: "Non-Player Character" },
            { q: "Was bedeutet «TL;DR»?", a: "Too Long; Didn't Read" },
            { q: "Was bedeutet «IYKYK»?", a: "If You Know You Know" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "Technik & Apps", qa: [
            { q: "Welche Firma stellt das iPhone her?", a: "Apple" },
            { q: "Welcher Konzern besitzt WhatsApp, Instagram und Facebook?", a: "Meta" },
            { q: "Wie heisst der Chef von Apple?", a: "Tim Cook" },
            { q: "Wie heisst der Apple-Mitgründer neben Steve Jobs?", a: "Steve Wozniak" },
            { q: "Wie heisst der Chef der Firma OpenAI hinter ChatGPT?", a: "Sam Altman" },
          ]},
          { name: "Serien", qa: [
            { q: "In welcher Netflix-Serie geht es um ein tödliches Spiel namens «Squid Game»?", a: "Squid Game" },
            { q: "In welcher spanischen Serie tragen Räuber rote Overalls und Dalí-Masken?", a: "Haus des Geldes" },
            { q: "In welcher Serie wird ein todkranker Chemielehrer zum Drogenkoch?", a: "Breaking Bad" },
            { q: "Welcher Schauspieler spielt Walter White in Breaking Bad?", a: "Bryan Cranston" },
            { q: "In welcher US-Stadt spielt die Serie Breaking Bad?", a: "In Albuquerque" },
          ]},
          { name: "Film-Reihen", qa: [
            { q: "In welcher Filmreihe geht es um Zauberer und die Schule «Hogwarts»?", a: "Harry Potter" },
            { q: "Wie heisst der lila Bösewicht, der bei den «Avengers» die halbe Menschheit auslöscht?", a: "Thanos" },
            { q: "In welcher Filmreihe rast eine Crew mit schnellen Autos, angeführt von Dominic Toretto?", a: "Fast & Furious" },
            { q: "Welcher Regisseur drehte «Inception», «Interstellar» und «Oppenheimer»?", a: "Christopher Nolan" },
            { q: "Welcher Regisseur ist für «Pulp Fiction», «Django Unchained» und «Kill Bill» bekannt?", a: "Quentin Tarantino" },
          ]},
          { name: "Was ist die Frage?", reverse: true, qa: [
            { q: "Auf dieser roten Plattform lädt man Videos hoch.", a: "Was ist YouTube?" },
            { q: "Diese Sony-Konsole heisst aktuell «PS5».", a: "Was ist die PlayStation?" },
            { q: "Dieser japanische Konzern erfand Mario, Zelda und die Switch.", a: "Was ist Nintendo?" },
            { q: "Diese Firma baut Grafikkarten und wurde durch den KI-Boom extrem wertvoll.", a: "Was ist Nvidia?" },
            { q: "Diese Programmiersprache mit Schlangen-Namen ist bei Einsteigern und für KI sehr beliebt.", a: "Was ist Python?" },
          ]},
          { name: "Internet-Geschichte", qa: [
            { q: "Welche Suchmaschine ist so bekannt, dass sie zum Verb wurde?", a: "Google" },
            { q: "Wofür steht das «www» vor Webadressen?", a: "World Wide Web" },
            { q: "In welchem Jahr wurde das erste iPhone vorgestellt?", a: "2007" },
            { q: "Wie hiess die grosse Social-Media-Seite vor Facebook mit «Top 8»-Freundeslisten?", a: "MySpace" },
            { q: "Wer erfand 1989 das World Wide Web?", a: "Tim Berners-Lee" },
          ]},
        ],
      },
    ],
  },

  /* ================= SET 3: MUSIK & CHARTS ================= */
  {
    name: "Musik & Charts",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Aktuelle Stars", qa: [
            { q: "Welche US-Sängerin füllte mit ihrer «Eras Tour» weltweit Stadien?", a: "Taylor Swift" },
            { q: "Welche Sängerin sang 2023 die Trennungshymne «Flowers»?", a: "Miley Cyrus" },
            { q: "Welcher kanadische Sänger ist für «Blinding Lights» bekannt?", a: "The Weeknd" },
            { q: "Wie lautet der bürgerliche Name von «The Weeknd»?", a: "Abel Tesfaye" },
            { q: "Wie lautet der bürgerliche Name von Lady Gaga?", a: "Stefani Germanotta" },
          ]},
          { name: "Rap & Hip-Hop", qa: [
            { q: "Welcher Rapper mit dem Spitznamen «Drizzy» sang «God's Plan»?", a: "Drake" },
            { q: "Welcher US-Rapper nennt sich «Slim Shady»?", a: "Eminem" },
            { q: "Welcher Rapper ist für das Album «Astroworld» bekannt?", a: "Travis Scott" },
            { q: "Welcher Rapper gewann als Erster einen Pulitzer-Preis für sein Album?", a: "Kendrick Lamar" },
            { q: "Welcher Rapper wurde 1997 erschossen und rappte «Hypnotize»?", a: "The Notorious B.I.G." },
          ]},
          { name: "Ohrwürmer", qa: [
            { q: "Von welcher Band stammt «Bohemian Rhapsody»?", a: "Queen" },
            { q: "Von welcher Band stammt «Wonderwall»?", a: "Oasis" },
            { q: "Von welcher Band stammt «Mr. Brightside»?", a: "The Killers" },
            { q: "Welche Band sang den oft gecoverten 80er-Hit «Africa»?", a: "Toto" },
            { q: "Welche Band veröffentlichte das Album «The Dark Side of the Moon»?", a: "Pink Floyd" },
          ]},
          { name: "Instrumente & Musik", qa: [
            { q: "Wie viele Saiten hat eine normale Gitarre?", a: "6" },
            { q: "Wie viele Tasten hat ein Standard-Klavier?", a: "88" },
            { q: "Wie lautet der italienische Begriff für ein schnelles Tempo?", a: "Allegro" },
            { q: "Wie lautet der italienische Begriff für «sehr laut» in Noten?", a: "Fortissimo" },
            { q: "Wie viele verschiedene Töne hat eine chromatische Tonleiter?", a: "12" },
          ]},
          { name: "Festivals", qa: [
            { q: "Welches grosse Hip-Hop-Open-Air findet jährlich in Frauenfeld statt?", a: "Das Openair Frauenfeld" },
            { q: "Auf welchem Berner Hausberg findet jährlich ein bekanntes Festival statt?", a: "Auf dem Gurten" },
            { q: "Welches weltberühmte Jazz-Festival findet am Genfersee statt?", a: "Das Montreux Jazz Festival" },
            { q: "In welchem Kanton findet das «Paléo Festival» bei Nyon statt?", a: "Im Kanton Waadt" },
            { q: "Wie heisst das grosse Schweizer Open-Air im St. Galler «Sittertobel»?", a: "Das OpenAir St. Gallen" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "ESC & Eurovision", qa: [
            { q: "Welcher Schweizer gewann 2024 den ESC mit «The Code»?", a: "Nemo" },
            { q: "Welche italienische Rockband gewann den ESC 2021?", a: "Måneskin" },
            { q: "Wie oft hat die Schweiz den ESC insgesamt gewonnen?", a: "3-mal" },
            { q: "Welche kanadische Weltstar-Sängerin gewann 1988 für die Schweiz den ESC?", a: "Céline Dion" },
            { q: "Wer gewann 1956 den allerersten ESC für die Schweiz?", a: "Lys Assia" },
          ]},
          { name: "Alte Legenden", qa: [
            { q: "Welche Band aus Liverpool bestand aus John, Paul, George und Ringo?", a: "Die Beatles" },
            { q: "Wie hiess der Leadsänger der Band Queen?", a: "Freddie Mercury" },
            { q: "Welcher Beatles-Sänger wurde 1980 in New York erschossen?", a: "John Lennon" },
            { q: "Welche als «Queen of Soul» bekannte Sängerin sang «Respect»?", a: "Aretha Franklin" },
            { q: "Welcher Gitarrist wird «King of the Blues» genannt?", a: "B. B. King" },
          ]},
          { name: "Genres & Stile", qa: [
            { q: "Aus welchem Land stammt Reggae-Musik?", a: "Aus Jamaika" },
            { q: "Wofür steht die Abkürzung «EDM»?", a: "Electronic Dance Music" },
            { q: "In welcher US-Stadt entstand in den 1970ern der Hip-Hop?", a: "In New York" },
            { q: "Aus welcher US-Stadt stammt der «Motown»-Sound?", a: "Aus Detroit" },
            { q: "Aus welchem Land stammt der Musikstil «Bossa Nova»?", a: "Aus Brasilien" },
          ]},
          { name: "Charts & Rekorde", qa: [
            { q: "Auf welcher Plattform streamt man Musik mit einem grünen Logo?", a: "Spotify" },
            { q: "Welche Auszeichnung bekommt ein Song für sehr viele Verkäufe?", a: "Gold oder Platin" },
            { q: "Wie heisst der wichtigste Preis der US-Musikindustrie?", a: "Der Grammy" },
            { q: "Welches Album gilt als meistverkauftes aller Zeiten?", a: "«Thriller»" },
            { q: "Welcher Song ist der meistgestreamte auf Spotify aller Zeiten?", a: "«Blinding Lights»" },
          ]},
          { name: "DJs & Electro", qa: [
            { q: "Welches französische Duo mit Roboter-Helmen machte «Get Lucky»?", a: "Daft Punk" },
            { q: "Welcher schwedische DJ machte «Wake Me Up» und «Levels»?", a: "Avicii" },
            { q: "Welcher niederländische DJ ist für «Animals» bekannt?", a: "Martin Garrix" },
            { q: "Wie heisst das grösste Dance-Festival der Welt, das in Belgien stattfindet?", a: "Tomorrowland" },
            { q: "Welches schwedische DJ-Trio machte «Don't You Worry Child»?", a: "Swedish House Mafia" },
          ]},
        ],
      },
    ],
  },

  /* ================= SET 4: WELT & WISSEN ================= */
  {
    name: "Welt & Wissen",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Hauptstädte", qa: [
            { q: "Wie heisst die Hauptstadt von Frankreich?", a: "Paris" },
            { q: "Wie heisst die Hauptstadt von Kanada?", a: "Ottawa" },
            { q: "Wie heisst die Hauptstadt von Australien?", a: "Canberra" },
            { q: "Wie heisst die Hauptstadt von Neuseeland?", a: "Wellington" },
            { q: "Wie heisst die Hauptstadt von Kasachstan?", a: "Astana" },
          ]},
          { name: "Flaggen", type: "flag", qa: [
            { q: "🇮🇹", a: "Italien" },
            { q: "🇧🇷", a: "Brasilien" },
            { q: "🇸🇪", a: "Schweden" },
            { q: "🇰🇷", a: "Südkorea" },
            { q: "🇧🇹", a: "Bhutan" },
          ]},
          { name: "Weltall", qa: [
            { q: "Welcher Planet wird «der rote Planet» genannt?", a: "Der Mars" },
            { q: "Welcher ist der grösste Planet unseres Sonnensystems?", a: "Jupiter" },
            { q: "Wie lange braucht das Licht der Sonne bis zur Erde ungefähr?", a: "Etwa 8 Minuten" },
            { q: "Wie heisst der grösste Mond unseres Sonnensystems?", a: "Ganymed" },
            { q: "Wie heisst die grosse Nachbargalaxie, die mit der Milchstrasse kollidieren wird?", a: "Die Andromedagalaxie" },
          ]},
          { name: "Tierwelt", qa: [
            { q: "Welches ist das grösste Tier der Welt?", a: "Der Blauwal" },
            { q: "Welches ist das schnellste Landtier?", a: "Der Gepard" },
            { q: "Welches Säugetier kann als einziges richtig fliegen?", a: "Die Fledermaus" },
            { q: "Welches australische Säugetier legt Eier, statt lebende Junge zu gebären?", a: "Das Schnabeltier" },
            { q: "Wie heisst die grösste heute lebende Echse der Welt?", a: "Der Komodowaran" },
          ]},
          { name: "Naturwissenschaft", qa: [
            { q: "Welches Gas atmen wir zum Leben ein?", a: "Sauerstoff" },
            { q: "Welches Metall ist bei Zimmertemperatur flüssig?", a: "Quecksilber" },
            { q: "Wie heisst das häufigste Gas in der Erdatmosphäre?", a: "Stickstoff" },
            { q: "Welches ist das leichteste chemische Element?", a: "Wasserstoff" },
            { q: "Wie viele Elemente enthält das Periodensystem heute ungefähr?", a: "118" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "Geografie-Rekorde", qa: [
            { q: "Wie heisst der höchste Berg der Welt?", a: "Der Mount Everest" },
            { q: "Wie heisst die grösste heisse Wüste der Welt?", a: "Die Sahara" },
            { q: "Wie heisst der grösste See der Erde nach Fläche?", a: "Das Kaspische Meer" },
            { q: "Wie heisst der tiefste Punkt der Weltmeere?", a: "Der Marianengraben" },
            { q: "Wie heisst der längste Gebirgszug der Welt in Südamerika?", a: "Die Anden" },
          ]},
          { name: "Sprachen & Wörter", qa: [
            { q: "In welchem Land Südamerikas spricht man Portugiesisch?", a: "In Brasilien" },
            { q: "Welches Land hat die meisten Einwohner der Welt?", a: "Indien" },
            { q: "Welche Sprache hat weltweit die meisten Muttersprachler?", a: "Chinesisch" },
            { q: "Wie sagt man «Danke» auf Japanisch?", a: "Arigatō" },
            { q: "In welchem ostafrikanischen Land ist Suaheli Amtssprache?", a: "In Tansania" },
          ]},
          { name: "Der Körper", qa: [
            { q: "Welches Organ pumpt das Blut durch den Körper?", a: "Das Herz" },
            { q: "Wie viele Knochen hat ein erwachsener Mensch ungefähr?", a: "206" },
            { q: "Wie heisst der Zellbestandteil, den man «Kraftwerk der Zelle» nennt?", a: "Das Mitochondrium" },
            { q: "Wie viele Chromosomenpaare hat der Mensch?", a: "23" },
            { q: "Wie heisst der längste Nerv im menschlichen Körper?", a: "Der Ischiasnerv" },
          ]},
          { name: "Erfinder & Forscher", qa: [
            { q: "Welcher Physiker stellte die Relativitätstheorie auf?", a: "Albert Einstein" },
            { q: "Welche Physikerin bekam als erste Frau einen Nobelpreis?", a: "Marie Curie" },
            { q: "Wer formulierte die Gesetze der Schwerkraft?", a: "Isaac Newton" },
            { q: "Welcher Astronom stellte fest, dass sich die Erde um die Sonne dreht?", a: "Nikolaus Kopernikus" },
            { q: "Welcher Forscher entdeckte 1928 das Penicillin?", a: "Alexander Fleming" },
          ]},
          { name: "Mathematik & Logik", qa: [
            { q: "Wie viel ist 12 mal 12?", a: "144" },
            { q: "Wie viel ist 15 Prozent von 200?", a: "30" },
            { q: "Wie heisst die einzige gerade Primzahl?", a: "2" },
            { q: "Wie viele Nullen hat eine Milliarde?", a: "9" },
            { q: "Wie heisst die Zahlenfolge, bei der jede Zahl die Summe der beiden vorherigen ist?", a: "Die Fibonacci-Folge" },
          ]},
        ],
      },
    ],
  },

  /* ================= SET 5: SPORT, FILM & FUN ================= */
  {
    name: "Sport, Film & Fun",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Fussball", qa: [
            { q: "Wie viele Spieler einer Mannschaft stehen beim Fussball auf dem Feld?", a: "11" },
            { q: "Welches Land hat mit fünf Titeln die meisten Fussball-WM gewonnen?", a: "Brasilien" },
            { q: "Welches Land wurde 2022 in Katar Fussball-Weltmeister?", a: "Argentinien" },
            { q: "Welcher Verein gewann bisher die meisten Champions-League-Titel?", a: "Real Madrid" },
            { q: "In welchem Land fand die erste Fussball-WM 1930 statt?", a: "In Uruguay" },
          ]},
          { name: "Schweizer Sport", qa: [
            { q: "In welcher Sportart wurde Roger Federer zur Weltlegende?", a: "Tennis" },
            { q: "Welche Sportart mit Sägemehl und Zwilchhosen ist ein Schweizer Nationalsport?", a: "Schwingen" },
            { q: "Welcher Schweizer ist aktuell einer der weltbesten Skirennfahrer?", a: "Marco Odermatt" },
            { q: "Welcher Schweizer Tennisprofi gewann neben Federer ebenfalls drei Grand-Slam-Titel?", a: "Stan Wawrinka" },
            { q: "In welcher Schweizer Stadt hat das Internationale Olympische Komitee seinen Sitz?", a: "In Lausanne" },
          ]},
          { name: "Sportarten", qa: [
            { q: "Bei welcher Sportart wirft man einen Ball in einen Korb?", a: "Basketball" },
            { q: "Wie viele Spieler hat eine Volleyball-Mannschaft auf dem Feld?", a: "6" },
            { q: "Wie viele Punkte ist ein «Touchdown» im American Football wert?", a: "6" },
            { q: "Wie viele Löcher werden bei einer regulären Golfrunde gespielt?", a: "18" },
            { q: "Wie heisst beim Tennis der Punktestand, bei dem beide 40 haben?", a: "Einstand" },
          ]},
          { name: "Film-Klassiker", qa: [
            { q: "Wie heisst der Zauberschüler mit der Blitznarbe auf der Stirn?", a: "Harry Potter" },
            { q: "In welcher Filmreihe geht es um Jedi-Ritter und «die Macht»?", a: "Star Wars" },
            { q: "In welchem Film fällt der Satz «Das Leben ist wie eine Schachtel Pralinen»?", a: "Forrest Gump" },
            { q: "Welcher Regisseur drehte «Titanic» und «Avatar»?", a: "James Cameron" },
            { q: "Welcher Regisseur gilt als «Master of Suspense» und drehte «Psycho»?", a: "Alfred Hitchcock" },
          ]},
          { name: "Kurioses & Fun", qa: [
            { q: "Wie viele Beine hat eine Spinne?", a: "8" },
            { q: "Welche Farbe hat die «Blackbox» in Flugzeugen in Wirklichkeit?", a: "Orange" },
            { q: "Wie viele Herzen hat ein Krake?", a: "3" },
            { q: "Wie viele Knochen hat ein Hai?", a: "0" },
            { q: "Wie viele Zähne hat eine erwachsene Katze?", a: "30" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "Kino-Blockbuster", qa: [
            { q: "Welcher Superheld wird von einer radioaktiven Spinne gebissen?", a: "Spider-Man" },
            { q: "In welchem Film von 1993 klonen Forscher Dinosaurier für einen Park?", a: "Jurassic Park" },
            { q: "In welchem Film von Christopher Nolan dringt man über Träume in fremde Köpfe ein?", a: "Inception" },
            { q: "Welcher Film gewann 2020 als erster nicht-englischsprachiger den Oscar als «Bester Film»?", a: "Parasite" },
            { q: "Welcher Film ist der erfolgreichste an den Kinokassen aller Zeiten?", a: "«Avatar»" },
          ]},
          { name: "Essen & Trinken", qa: [
            { q: "Aus welchem Land stammt Sushi?", a: "Aus Japan" },
            { q: "Aus welcher Bohne wird Schokolade gemacht?", a: "Aus der Kakaobohne" },
            { q: "Aus welchem Land stammt das scharfe, fermentierte Gericht Kimchi?", a: "Aus Südkorea" },
            { q: "Welches Gewürz ist nach Gewicht das teuerste der Welt?", a: "Safran" },
            { q: "Aus welcher Pflanze werden schwarzer und grüner Tee gewonnen?", a: "Aus der Teepflanze" },
          ]},
          { name: "Autos & Marken", qa: [
            { q: "Welche Automarke hat einen dreizackigen Stern als Logo?", a: "Mercedes-Benz" },
            { q: "Welche Automarke hat vier Ringe als Logo?", a: "Audi" },
            { q: "Welche britische Luxusmarke baut den «Phantom»?", a: "Rolls-Royce" },
            { q: "Welche italienische Marke mit einem Stier im Logo baut den «Aventador»?", a: "Lamborghini" },
            { q: "Welche französische Automarke hat einen Löwen im Logo?", a: "Peugeot" },
          ]},
          { name: "Bauwerke der Welt", qa: [
            { q: "In welcher Stadt steht der Eiffelturm?", a: "In Paris" },
            { q: "In welcher Stadt steht die Freiheitsstatue?", a: "In New York" },
            { q: "In welcher Stadt steht die unvollendete Kirche «Sagrada Família»?", a: "In Barcelona" },
            { q: "In welchem Land stehen die Maya-Ruinen von Chichén Itzá?", a: "In Mexiko" },
            { q: "In welcher Stadt steht die «Hagia Sophia»?", a: "In Istanbul" },
          ]},
          { name: "Ängste & Kurioses", qa: [
            { q: "Wie viele Farben hat ein Regenbogen klassischerweise?", a: "7" },
            { q: "Wie heisst die Angst vor engen Räumen?", a: "Klaustrophobie" },
            { q: "Wie nennt man ein Wort, das vorwärts wie rückwärts gleich gelesen wird?", a: "Ein Palindrom" },
            { q: "Wie heisst die Angst vor der Zahl 13?", a: "Triskaidekaphobie" },
            { q: "Wie heisst ironischerweise die Angst vor langen Wörtern?", a: "Hippopotomonstrosesquippedaliophobie" },
          ]},
        ],
      },
    ],
  },

  /* ================= SET 6: STREAMER & BRAINROT ================= */
  {
    name: "Streamer & Brainrot",
    boards: [
      {
        title: "BOARD 1",
        points: BOARD_POINTS[0],
        categories: [
          { name: "Twitch-Slang", qa: [
            { q: "Welches Wort feuert der Chat bei einem krassen Moment ab, benannt nach einem Frosch-Emote?", a: "Pog" },
            { q: "Was bedeutet «KEKW» im Chat?", a: "Lautes Lachen" },
            { q: "Was «raucht» laut Chat jemand, der eine Niederlage nicht wahrhaben will?", a: "Copium" },
            { q: "Was meint der Chat mit «Skill-Diff»?", a: "Ein Unterschied im Können" },
            { q: "Was bedeutet «malding»?", a: "Vor Wut fast durchdrehen" },
          ]},
          { name: "Jugendslang", qa: [
            { q: "Was bedeutet «cringe»?", a: "Fremdscham" },
            { q: "Was bedeutet «sus»?", a: "Verdächtig" },
            { q: "Was bedeutet «lost» als Jugendwort?", a: "Ahnungslos" },
            { q: "Was bedeutet «slay»?", a: "Etwas grossartig machen" },
            { q: "Was bedeutet «Rizz»?", a: "Charme beim Flirten" },
          ]},
          { name: "Meme-Kunde", qa: [
            { q: "Wie heisst der grüne Comic-Frosch aus unzähligen «Feels»-Memes?", a: "Pepe" },
            { q: "Wie heisst das Meme mit dem Shiba-Inu-Hund und dem Text in gebrochenem Englisch?", a: "Doge" },
            { q: "Welches Meme zeigt einen Hund im brennenden Raum mit den Worten «This is fine»?", a: "This is fine" },
            { q: "Wie heisst das Ideal-Mann-Meme mit dem extrem muskulösen Schwarz-Weiss-Kerl?", a: "Gigachad" },
            { q: "Wie heisst die kahle, traurige «Feels Guy»-Figur, dünn gezeichnet?", a: "Wojak" },
          ]},
          { name: "Gaming-Deepcuts", qa: [
            { q: "In welchem Koop-Spiel rennt man als bunte Bohne durch Hindernis-Parcours?", a: "Fall Guys" },
            { q: "In welchem Open-World-Spiel jagt man als Hexer Geralt Monster?", a: "The Witcher" },
            { q: "Wie lautet der Siegesspruch, wenn du bei «Fortnite» als Letzter übrig bleibst?", a: "Victory Royale" },
            { q: "In welcher Spielreihe kämpft Kratos gegen die Götter?", a: "God of War" },
            { q: "Welches Fantasy-Rollenspiel räumte 2023 als «Baldur's Gate 3» die Game Awards ab?", a: "Baldur's Gate 3" },
          ]},
          { name: "Anime & Manga", qa: [
            { q: "In welchem Anime will Ruffy König der Piraten werden?", a: "One Piece" },
            { q: "Wie heisst der Ninja, der den Neunschwänzigen Fuchs in sich trägt?", a: "Naruto" },
            { q: "In welchem Anime kämpft die Menschheit hinter Mauern gegen riesige «Titanen»?", a: "Attack on Titan" },
            { q: "Wie heisst das Heft, das jeden tötet, dessen Name hineingeschrieben wird?", a: "Death Note" },
            { q: "Wie heisst der Dämonenjäger-Held aus «Demon Slayer»?", a: "Tanjiro" },
          ]},
        ],
      },
      {
        title: "BOARD 2",
        points: BOARD_POINTS[1],
        categories: [
          { name: "Brainrot 2024", qa: [
            { q: "Was bedeutet «Sigma» im Slang?", a: "Ein cooler Einzelgänger" },
            { q: "Was bedeutet «based» als Lob im Netz?", a: "Mutig zur eigenen Meinung stehen" },
            { q: "Aus welchem viralen Video-Franchise stammt «Skibidi»?", a: "Skibidi Toilet" },
            { q: "Was beschreibt der Beauty-Trend «Mewing»?", a: "Die Zunge an den Gaumen drücken für eine schärfere Kieferlinie" },
            { q: "Wofür ist «delulu» die Kurzform?", a: "Delusional" },
          ]},
          { name: "Streamer & Creator", qa: [
            { q: "Welcher YouTuber ist weltweit am meisten abonniert und bekannt für teure Challenges?", a: "MrBeast" },
            { q: "Welcher US-Streamer war das Gesicht von «Fortnite» und wechselte 2019 gross zu Mixer?", a: "Ninja" },
            { q: "Welcher spanischsprachige Streamer brach mit Millionen gleichzeitigen Zuschauern Twitch-Rekorde?", a: "Ibai" },
            { q: "Wie heisst das grosse deutschsprachige Streamer-Charity-Event, das jährlich Millionen sammelt?", a: "Friendly Fire" },
            { q: "Welche Livestreaming-Plattform startete 2022 als Twitch-Konkurrent, benannt nach einem Tritt?", a: "Kick" },
          ]},
          { name: "Esports & Speedrun", qa: [
            { q: "Wie nennt man das möglichst schnelle Durchspielen eines Games für einen Rekord?", a: "Speedrun" },
            { q: "Wie heisst die jährliche «League of Legends»-Weltmeisterschaft kurz?", a: "Worlds" },
            { q: "Wie heisst der höchste Rang im Ranglisten-System von «Valorant»?", a: "Radiant" },
            { q: "Wie viele Gegner schaltet man für ein «Ace» in einer Valorant-Runde aus?", a: "5" },
            { q: "Wie heisst das grösste «Dota 2»-Turnier mit Rekord-Preisgeld?", a: "The International" },
          ]},
          { name: "Viral gegangen", qa: [
            { q: "Welche Handy-App schickte 2016 Millionen nach draussen, um Monster zu fangen?", a: "Pokémon Go" },
            { q: "Bei welcher Charity-Aktion 2014 kippten sich Promis Eiswasser über den Kopf?", a: "Ice Bucket Challenge" },
            { q: "Welches Foto spaltete 2015 das Netz: blau-schwarz oder weiss-gold?", a: "Das Kleid" },
            { q: "Welche Katze mit mürrischem Blick wurde als Internet-Star weltberühmt?", a: "Grumpy Cat" },
            { q: "In welchem viralen Video fragt ein benommener Junge nach dem Zahnarzt «Is this real life?»", a: "David After Dentist" },
          ]},
          { name: "Was ist die Frage?", reverse: true, qa: [
            { q: "Dieses Chat-Programm mit «Servern» und «Channels» ist bei Gamern der Standard zum Quatschen.", a: "Was ist Discord?" },
            { q: "Dieser Streaming-Dienst mit rotem «N» zeigt Serien wie «Stranger Things».", a: "Was ist Netflix?" },
            { q: "Diese Plattform nennt sich «Startseite des Internets» und ist in «Subreddits» unterteilt.", a: "Was ist Reddit?" },
            { q: "Diese KI von OpenAI schreibt auf Zuruf ganze Texte und Programmcode.", a: "Was ist ChatGPT?" },
            { q: "So nennt man einen Zuschauer, der stumm mitschaut, ohne je zu chatten.", a: "Was ist ein Lurker?" },
          ]},
        ],
      },
    ],
  },
];
