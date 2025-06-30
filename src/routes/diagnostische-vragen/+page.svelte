<script>
  // Research/paper references with verified URLs and comprehensive academic sources
  const refs = [
    {
      id: 1,
      url: 'https://www.diagnostischevragen.nl/informatie/wat-is-een-diagnostische-vraag/',
      label: 'DiagnostischeVragen.nl – Wat is een diagnostische vraag? (Nederlands)'
    },
    {
      id: 2,
      url: 'https://www.diagnostischevragen.nl/informatie/hoe-zet-je-dit-effectief-in-je-les-in/',
      label: 'DiagnostischeVragen.nl – Hoe zet je dit effectief in je les in? (Nederlands)'
    },
    {
      id: 3,
      url: 'https://www.diagnostischevragen.nl/informatie/onderzoek/',
      label: 'DiagnostischeVragen.nl – Onderzoek (Nederlands)'
    },
    {
      id: 4,
      url: 'https://toetsrevolutie.nl/hoe-ik-door-diagnostische-vragen-op-het-spoor-van-formatief-handelen-kwam/',
      label: 'Toetsrevolutie – Hoe ik door diagnostische vragen op het spoor van formatief handelen kwam (Nederlands)'
    },
    {
      id: 5,
      url: 'https://toetsrevolutie.nl/chatgpt-bij-het-ontwerpen-van-formatief-handelen/',
      label: 'Toetsrevolutie – ChatGPT bij het ontwerpen van formatief handelen (Nederlands)'
    },
    {
      id: 6,
      url: 'https://files.eric.ed.gov/fulltext/EJ1182085.pdf',
      label: 'Barton, C. (2018). On Formative Assessment in Math: How Diagnostic Questions Can Help. American Educator, 42(2), 33-38.'
    },
    {
      id: 7,
      url: 'https://www.mrbartonmaths.com/blog/diagnostic-questions/',
      label: 'Barton, C. – Diagnostic Questions Blog (Engels)'
    },
    {
      id: 8,
      url: 'https://library.maastrichtuniversity.nl/apps-tools/ai-prompt-library/create-multiple-choice-questions/',
      label: 'Universiteit Maastricht – AI Prompt Library voor Multiple Choice Vragen (Nederlands)'
    },
    {
      id: 9,
      url: 'https://tipsforteachers.co.uk/diagnostic-questions/',
      label: 'Barton, C. (2025). Diagnostic Questions – Tips for Teachers (Engels)'
    },
    {
      id: 10,
      url: 'https://mrbartonmaths.com/resourcesnew/8.%20Research/Formative%20Assessment/Is%20there%20value%20in%20just%20one%20-%20Dylan%20Wiliam%202006.pdf',
      label: 'Wiliam, D. (2006). Diagnostic Questions: Is There Value in Just One? (Engels)'
    },
    {
      id: 11,
      url: 'https://researchschool.org.uk/durrington/news/using-diagnostic-questions',
      label: 'Durrington Research School (2021). Using Diagnostic Questions (Engels)'
    },
    {
      id: 12,
      url: 'https://www.york.ac.uk/education/research/uyseg/projects/developingdiagnosticassessments/',
      label: 'University of York Science Education Group. Developing Diagnostic Assessments (Engels)'
    },
    {
      id: 13,
      url: 'https://www.stem.org.uk/sites/default/files/pages/downloads/BEST_Approaches_Diagnostic%20questions.pdf',
      label: 'STEM Learning. BEST Approaches Diagnostic Questions (Engels)'
    },
    {
      id: 14,
      url: 'https://improvingteaching.co.uk/2013/08/17/do-they-understand-this-well-enough-to-move-on-introducing-hinge-questions/',
      label: 'ImProvingTeaching.co.uk (2013). Introducing Hinge Questions (Engels)'
    },
    {
      id: 15,
      url: 'https://www.cambridgeinternational.org/Images/557887-11.-using-multiple-choice-questions-to-identify-student-misconceptions.pdf',
      label: 'Francis, H. (2019). Using Multiple Choice Questions to Identify Student Misconceptions. Cambridge International (Engels)'
    },
    {
      id: 16,
      url: 'https://thirdspacelearning.com/secondary-resources/diagnostic-questions/',
      label: 'Third Space Learning – Diagnostic Questions Resource (Engels)'
    },
    {
      id: 17,
      url: '',
      label: "Barton, C. and Wiliam, D. (2018). How I wish I'd taught maths: Lessons learned from research, conversations with experts, and 12 years of mistakes. Learning Sciences International."
    },
    {
      id: 18,
      url: '',
      label: "Barton, C. (2020). Reflect, Expect, Check, Explain: Sequences and behaviour to enable mathematical thinking in the classroom: Sequences and behaviour to enable mathematical thinking in the classroom. Hachette UK."
    },
    {
      id: 19,
      url: '',
      label: "Barton, C. (2019). Volgens Barton: lesgeven in wiskunde aan de hand van wetenschap, experts, en 12 jaar aan mislukkingen. Phronese."
    },
    {
      id: 20,
      url: 'https://diagnosticquestions.com/learn',
      label: "Diagnostic Questions - Help (Engels)"
    },
    {
      id: 21,
      url: 'https://thirdspacelearning.com/blog/diagnostic-questions/',
      label: "Diagnostic Questions for Teachers - A Comprehensive Guide With Examples (Engels)"
    },
    {
      id: 22,
      url: 'https://www.diagnostischevragen.nl/informatie/maak-je-eigen-vragen/',
      label: "Diagnostische vragen - Maak je eigen vragen (Nederlands)"
    },
    {
      id: 23,
      url: 'https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_1',
      label: 'Cognitive Load Theory and Instructional Design: Recent Developments (Engels)'
    },
  ];

  function refLink(id) {
    const ref = refs.find(r => r.id === id);
    return ref ? ref.url : '#';
  }

  // Dropdown states
  let showIntro = false;
  let showDiagnostischeVragen = false;
  let showWaarom = false;
  let showHoe = false;
  let showMakenAI = false;

  // AI-voorbeeld dropdowns
  let showAIExamples = {};

  // Vak- en linkdata gegroepeerd naar nieuwe categorieën
  let selectedVakgroep = '';

  const vakgroepen = [
    {
      naam: 'Exacte vakken',
      vakken: [
        {
          naam: 'Wiskunde',
          links: [
            { naam: 'DiagnostischeVragen.nl – Wiskunde (Nederlands)', url: 'https://www.diagnostischevragen.nl/wiskunde' },
            { naam: 'DiagnosticQuestions.com – Mathematics (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=3&OrderBy=Newest&IsByStudent=False' },
            { naam: 'Third Space Learning – Maths Diagnostic Questions (Engels)', url: 'https://thirdspacelearning.com/secondary-resources/diagnostic-questions/' },
            { naam: 'STEM Learning – Best Evidence Science Teaching (Engels)', url: 'https://www.stem.org.uk/secondary/resources/collections/maths' },
            { naam: 'Wikiwijs – wiskunde (Nederlands)', url: 'https://zoeken.wikiwijs.nl/search/diagnostische+vragen+wiskunde' },
          ]
        },
        {
          naam: 'Natuurkunde',
          links: [
            { naam: 'DiagnostischeVragen.nl – Natuurkunde (Nederlands)', url: 'https://www.diagnostischevragen.nl/natuurkunde' },
            { naam: 'DiagnosticQuestions.com – Physics (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1993&OrderBy=Newest&IsByStudent=False' },
            { naam: 'University of York – Diagnostic Science Questions (Engels)', url: 'https://www.york.ac.uk/education/research/uyseg/projects/developingdiagnosticassessments/' },
            { naam: 'STEM Learning – Best Evidence Science Teaching (Engels)', url: 'https://www.stem.org.uk/secondary/resources/collections/science' },
            { naam: 'Wikiwijs – natuurkunde (Nederlands)', url: 'https://zoeken.wikiwijs.nl/search/diagnostische+vragen+natuurkunde' },
          ]
        },
        {
          naam: 'Scheikunde',
          links: [
            { naam: 'DiagnostischeVragen.nl – Scheikunde (Nederlands)', url: 'https://www.diagnostischevragen.nl/scheikunde' },
            { naam: 'DiagnosticQuestions.com – Chemistry (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=3162&OrderBy=Newest&IsByStudent=False' },
            { naam: 'STEM Learning – Best Evidence Science Teaching (Engels)', url: 'https://www.stem.org.uk/secondary/resources/collections/science' },
            { naam: 'Wikiwijs – scheikunde (Nederlands)', url: 'https://zoeken.wikiwijs.nl/search/diagnostische+vragen+scheikunde' },
          ]
        },
        {
          naam: 'Biologie',
          links: [
            { naam: 'DiagnostischeVragen.nl – Biologie (Nederlands)', url: 'https://www.diagnostischevragen.nl/biologie' },
            { naam: 'DiagnosticQuestions.com – Biology (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=4419&OrderBy=Newest&IsByStudent=False' },
            { naam: 'STEM Learning – Best Evidence Science Teaching (Engels)', url: 'https://www.stem.org.uk/secondary/resources/collections/science' },
            { naam: 'Wikiwijs – biologie (Nederlands)', url: 'https://zoeken.wikiwijs.nl/search/diagnostische+vragen+biologie' },
          ]
        },
        {
          naam: 'NLT (natuur leven en techniek)',
          links: [
            { naam: 'DiagnostischeVragen.nl – NLT (Nederlands)', url: 'https://www.diagnostischevragen.nl/' },
            { naam: 'STEM Learning – Best Evidence Science Teaching (Engels)', url: 'https://www.stem.org.uk/secondary/resources/collections/science' }
          ]
        }
      ]
    },
    {
      naam: 'Maatschappijvakken',
      vakken: [
        {
          naam: 'Aardrijkskunde',
          links: [
            { naam: 'DiagnosticQuestions.com – Geography (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1992&OrderBy=Newest&IsByStudent=False' },
            { naam: 'Geography All The Way (Engels)', url: 'https://www.geographyalltheway.com/' }
          ]
        },
        {
          naam: 'Economie en Bedrijfseconomie',
          links: [
            { naam: 'DiagnosticQuestions.com – Geography (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1457&OrderBy=Newest&IsByStudent=False' },
            { naam: 'LWEO - Oefen Adapt', url: 'https://lweo.nl/wp-content/uploads/2023/10/handleiding-Adapt-met-schermafbeeldingen.pdf' }
          ]
        },
        {
          naam: 'Filosofie',
          links: [
            { naam: 'DiagnosticQuestions.com – Philosophy and Ethics (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1550&OrderBy=Newest&IsByStudent=False' },
          ]
        },
        {
          naam: 'Geschiedenis',
          links: [
            { naam: 'DiagnosticQuestions.com – History (old) (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1470&OrderBy=Newest&IsByStudent=False' },
            { naam: 'Geschiedenis - Quiz', url: 'https://geschiedenis.nl/quiz' },
          ]
        },
        {
          naam: 'Maatschappijleer',
          links: [
            { naam: 'DiagnosticQuestions.com – More Subjects (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1640&OrderBy=Newest&IsByStudent=False' },
          ]
        }
      ]
    },
    {
      naam: 'Talen',
      vakken: [
        {
          naam: 'Nederlands',
          links: [
            { naam: 'Nederlandse taaltest (Nederlands)', url: 'https://www.nederlandsetaaltest.nl/' },
          ]
        },
        {
          naam: 'Engels',
          links: [
            { naam: 'DiagnosticQuestions.com - Engels (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=5162&OrderBy=Newest&IsByStudent=False' },
          ]
        },
        {
          naam: 'Duits',
          links: [
            { naam: 'Sprachtrainer (Duits)', url: 'https://sprachtrainer.ch/de/135/online-lernen/rechtschreibung-grammatik-komma-kommasetzung-online-test/' }
          ]
        },
        {
          naam: 'Frans',
          links: [
            { naam: 'DiagnosticQuestions.com – French (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1991&OrderBy=Newest&IsByStudent=False' },
          ]
        },
        {
          naam: 'Chinees',
          links: [
            { naam: 'MandarinBean (Engels)', url: 'https://mandarinbean.com/hsk-chinese-test-online/' },
          ]
        }
      ]
    },
    {
      naam: 'Kunstvakken',
      vakken: [
        {
          naam: 'Muziek',
          links: [
            { naam: 'DiagnosticQuestions.com – Music (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1533&OrderBy=Newest&IsByStudent=False' },
          ]
        },
        {
          naam: 'Kunst',
          links: [
            { naam: 'DiagnosticQuestions.com – Art and Design (Engels)', url: 'https://diagnosticquestions.com/Questions?CurrentSubjectId=1364&OrderBy=Newest&IsByStudent=False' },
          ]
        }
      ]
    }
  ];

  // Add Godsdienst to Maatschappijvakken for completeness
  vakgroepen.find(vg => vg.naam === 'Maatschappijvakken').vakken.push({
    naam: 'Godsdienst',
    links: [
      { naam: 'DiagnostischeVragen.nl – Godsdienst (Nederlands)', url: 'https://www.diagnostischevragen.nl/' }
    ]
  });

  // AI voorbeelden per vak
  const aiVoorbeelden = {
    'Wiskunde': {
      vraag: 'Ontbind in factoren: 4x² + 5x − 6.',
      antwoorden: ['A) (2x-1)(2x+6)', 'B) (x+2)(4x-3)', 'C) (4x+6)(x-1)', 'D) (x-2)(4x+3)'],
      juist: 'B) (x+2)(4x-3)',
      uitleg: 'Leerlingen maken vaak fouten bij deze opgave omdat ze de termen verkeerd combineren of het voorteken bij het middenterm verkeerd toepassen bij het zoeken naar twee getallen die zowel optellen tot 5 als vermenigvuldigen tot -6.',
      prompt: 'Maak een lastige diagnostische vraag over ontbinden in factoren voor 2e klas VWO. Zorg dat de foute antwoordopties veelvoorkomende misvattingen weergeven: het verkeerd toepassen van bewerkingsvolgorde en het verwarren van optellen/aftrekken bij het "overzetten" van termen.'
    },
    'Nederlands': {
      vraag: 'Welke zin bevat een bijvoeglijk naamwoord?',
      antwoorden: ['A) Hij loopt snel naar huis.', 'B) De rode auto staat buiten.', 'C) Zij zingt prachtig.', 'D) Wij gaan morgen naar school.'],
      juist: 'B) De rode auto staat buiten.',
      uitleg: 'Leerlingen verwarren vaak bijvoeglijke naamwoorden met bijwoorden (snel, prachtig) of voornaamwoorden (wij).',
      prompt: 'Maak een diagnostische vraag over woordsoorten in het Nederlands voor 1e klas HAVO. Focus op het herkennen van bijvoeglijke naamwoorden. Laat de foute opties bijwoorden, voornaamwoorden en werkwoorden bevatten om misvattingen over woordsoorten bloot te leggen.'
    },
    'Engels': {
      vraag: 'Which sentence is in the present perfect tense?',
      antwoorden: ['A) I am reading a book.', 'B) I read a book yesterday.', 'C) I have read this book.', 'D) I will read a book tomorrow.'],
      juist: 'C) I have read this book.',
      uitleg: 'Leerlingen verwarren present perfect vaak met present continuous (A), simple past (B) of future (D).',
      prompt: 'Create a diagnostic question about English verb tenses for Dutch secondary students. Focus on present perfect vs other tenses. Include distractors that represent common misconceptions: confusing present perfect with present continuous, simple past, and future tense.'
    },
    'Natuurkunde': {
      vraag: 'Een bal valt van een 20 meter hoge toren. Wat gebeurt er met de snelheid tijdens de val?',
      antwoorden: ['A) De snelheid blijft constant', 'B) De snelheid neemt af', 'C) De snelheid neemt toe', 'D) De snelheid is eerst nul, dan constant'],
      juist: 'C) De snelheid neemt toe',
      uitleg: 'Leerlingen denken vaak dat snelheid constant is tijdens vrije val, of dat deze afneemt door luchtweerstand.',
      prompt: 'Maak een diagnostische vraag over vrije val in de natuurkunde voor 3e klas VWO. Focus op het begrip versnelling. Zorg dat foute antwoorden misvattingen weergeven zoals: snelheid is constant tijdens val, snelheid neemt af door weerstand, of verwarring tussen snelheid en versnelling.'
    },
    'Scheikunde': {
      vraag: 'Wat gebeurt er met de totale massa tijdens een chemische reactie?',
      antwoorden: ['A) De massa neemt toe', 'B) De massa neemt af', 'C) De massa blijft gelijk', 'D) De massa wordt omgezet in energie'],
      juist: 'C) De massa blijft gelijk',
      uitleg: 'Leerlingen denken vaak dat massa verloren gaat (bijvoorbeeld als gas) of dat massa verandert in energie.',
      prompt: 'Maak een diagnostische vraag over de wet van behoud van massa in de scheikunde voor 3e klas HAVO. Laat foute opties misvattingen weergeven zoals: massa gaat verloren als gas ontstaat, massa neemt toe door nieuwe stoffen, of massa wordt energie.'
    },
    'Biologie': {
      vraag: 'Waar vindt fotosynthese plaats in een plantencel?',
      antwoorden: ['A) In de mitochondriën', 'B) In de chloroplasten', 'C) In de celkern', 'D) In het cytoplasma'],
      juist: 'B) In de chloroplasten',
      uitleg: 'Leerlingen verwarren chloroplasten vaak met mitochondriën (beide maken energie) of denken dat het in de celkern gebeurt.',
      prompt: 'Maak een diagnostische vraag over fotosynthese in plantenbiologie voor 2e klas VWO. Focus op de locatie in de cel. Zorg dat foute antwoorden misvattingen weergeven zoals: verwarring tussen chloroplasten en mitochondriën, of denken dat alle cellulaire processen in de kern plaatsvinden.'
    },
    'Geschiedenis': {
      vraag: 'Wat was de belangrijkste oorzaak van de Eerste Wereldoorlog?',
      antwoorden: ['A) De moord op aartshertog Franz Ferdinand', 'B) Het systeem van bondgenootschappen', 'C) Duitse expansiedrang', 'D) Economische concurrentie'],
      juist: 'B) Het systeem van bondgenootschappen',
      uitleg: 'Leerlingen zien vaak de aanleiding (moord op Franz Ferdinand) als hoofdoorzaak, of focussen op één factor.',
      prompt: 'Maak een diagnostische vraag over de oorzaken van WO1 voor 4e klas HAVO. Onderscheid tussen aanleidingen en structurele oorzaken. Laat foute opties misvattingen weergeven zoals: verwarring tussen aanleiding en oorzaak, of oversimplificatie naar één enkele factor.'
    },
    'Aardrijkskunde': {
      vraag: 'Waarom is het klimaat aan de westkust van Europa gematigd?',
      antwoorden: ['A) Omdat Europa dicht bij de evenaar ligt', 'B) Door de Golfstroom', 'C) Omdat er veel bossen zijn', 'D) Door de hoge bergen'],
      juist: 'B) Door de Golfstroom',
      uitleg: 'Leerlingen denken vaak dat breedtegraad alles bepaalt, of overschatten de rol van vegetatie en topografie.',
      prompt: 'Maak een diagnostische vraag over klimaatfactoren in Europa voor 2e klas HAVO. Focus op de rol van oceaanstromingen. Zorg dat foute opties misvattingen weergeven zoals: alleen breedtegraad bepaalt klimaat, vegetatie bepaalt klimaat, of topografie is de hoofdfactor.'
    },
    'Economie': {
      vraag: 'Wat gebeurt er met de prijs als de vraag naar een product toeneemt?',
      antwoorden: ['A) De prijs daalt', 'B) De prijs stijgt', 'C) De prijs blijft gelijk', 'D) De prijs wordt door de overheid bepaald'],
      juist: 'B) De prijs stijgt',
      uitleg: 'Leerlingen begrijpen vaak de relatie tussen vraag en aanbod niet, of denken dat prijzen altijd stabiel zijn.',
      prompt: 'Maak een diagnostische vraag over vraag en aanbod in de economie voor 4e klas VWO. Focus op de relatie tussen vraag en prijs. Laat foute opties misvattingen weergeven zoals: verkeerde richting van het verband, denken dat prijzen stabiel zijn, of rol van overheid overschatten.'
    },
    'Frans': {
      vraag: 'Quelle est la forme correcte du verbe "avoir" avec "nous"?',
      antwoorden: ['A) nous as', 'B) nous avons', 'C) nous ont', 'D) nous avez'],
      juist: 'B) nous avons',
      uitleg: 'Leerlingen verwarren vaak persoonsvorm met andere personen of vergeten de correcte uitgang.',
      prompt: 'Creëer een diagnostische vraag over Franse werkwoordvervoegingen voor beginners. Focus op het werkwoord "avoir" met verschillende personen. Zorg dat foute opties veelvoorkomende vervoegingsfouten weergeven.'
    },
    'Duits': {
      vraag: 'Welcher Artikel gehört zu "Haus"?',
      antwoorden: ['A) der', 'B) die', 'C) das', 'D) den'],
      juist: 'C) das',
      uitleg: 'Duitse lidwoorden zijn moeilijk voor Nederlandse leerlingen omdat ze niet logisch lijken en uit het hoofd geleerd moeten worden.',
      prompt: 'Maak een diagnostische vraag over Duitse lidwoorden voor beginners. Focus op veelgebruikte woorden waarvan het geslacht vaak verkeerd wordt geraden door Nederlandse leerlingen. Zorg dat alle drie de lidwoorden als opties voorkomen plus een naamval-variant.'
    },
    'Filosofie': {
      vraag: 'Wat is het belangrijkste kenmerk van Platons ideeënleer?',
      antwoorden: ['A) Alles wat we zien is echt', 'B) Er bestaat een perfecte wereld van ideeën', 'C) Kennis komt alleen door ervaring', 'D) Alleen materie bestaat'],
      juist: 'B) Er bestaat een perfecte wereld van ideeën',
      uitleg: 'Leerlingen verwarren Plato vaak met empiristen of materialisten, of begrijpen het onderscheid tussen verschijning en werkelijkheid niet.',
      prompt: 'Maak een diagnostische vraag over Platons filosofie voor 5e klas VWO. Focus op de ideeënleer versus materialisme en empirisme. Laat foute opties misvattingen weergeven over verschillende filosofische stromingen.'
    },
    'Maatschappijleer': {
      vraag: 'Wat is het verschil tussen directe en indirecte democratie?',
      antwoorden: ['A) Direct = stemmen, indirect = niet stemmen', 'B) Direct = zelf beslissen, indirect = via vertegenwoordigers', 'C) Direct = lokaal, indirect = nationaal', 'D) Direct = voor iedereen, indirect = alleen volwassenen'],
      juist: 'B) Direct = zelf beslissen, indirect = via vertegenwoordigers',
      uitleg: 'Leerlingen verwarren vaak de concepten met stemrecht, bestuursniveaus of leeftijdsgrenzen.',
      prompt: 'Maak een diagnostische vraag over democratievormen voor 3e klas HAVO. Focus op het onderscheid tussen directe en indirecte democratie. Zorg dat foute opties misvattingen weergeven over stemrecht, bestuursniveaus en leeftijd.'
    },
    'Muziek': {
      vraag: 'Hoeveel lijnen heeft een notenbalk?',
      antwoorden: ['A) 4 lijnen', 'B) 5 lijnen', 'C) 6 lijnen', 'D) 8 lijnen'],
      juist: 'B) 5 lijnen',
      uitleg: 'Leerlingen tellen vaak verkeerd, of verwarren lijnen met tussenruimtes.',
      prompt: 'Maak een diagnostische vraag over de notenbalk in muziektheorie voor beginners. Focus op het tellen van lijnen versus tussenruimtes. Zorg dat foute opties veelvoorkomende telfouten weergeven.'
    },
    'Kunst': {
      vraag: 'Welke kleuren zijn primaire kleuren?',
      antwoorden: ['A) Rood, geel, blauw', 'B) Rood, groen, blauw', 'C) Oranje, groen, paars', 'D) Zwart, wit, grijs'],
      juist: 'A) Rood, geel, blauw',
      uitleg: 'Leerlingen verwarren vaak primaire kleuren met RGB-kleuren van schermen, of met secundaire kleuren.',
      prompt: 'Maak een diagnostische vraag over kleurenleer voor beeldende vorming. Focus op het onderscheid tussen traditionele primaire kleuren en RGB-kleuren van beeldschermen. Zorg dat foute opties deze verwarring weergeven.'
    },
    'Chinees': {
      vraag: 'Hoe spreek je "你好" uit?',
      antwoorden: ['A) nǐ hǎo', 'B) nì hào', 'C) ní háo', 'D) nî hâo'],
      juist: 'A) nǐ hǎo',
      uitleg: 'Chinese tonen zijn moeilijk voor Nederlandse leerlingen. Verkeerde tonen kunnen de betekenis completely veranderen.',
      prompt: 'Maak een diagnostische vraag over Chinese uitspraak en tonen voor beginners. Focus op basisbegroeting "你好". Zorg dat foute opties veelvoorkomende toonfouten van Nederlandse leerlingen weergeven.'
    },
    'Godsdienst': {
      vraag: 'Wat is de belangrijkste heilige tekst van het jodendom?',
      antwoorden: ['A) De Koran', 'B) De Bijbel', 'C) De Thora', 'D) De Vedas'],
      juist: 'C) De Thora',
      uitleg: 'Leerlingen verwarren soms heilige teksten van verschillende religies.',
      prompt: 'Maak een diagnostische vraag over wereldreligies voor 1e klas. Focus op het koppelen van heilige teksten aan de juiste religie. Zorg dat foute opties teksten van andere grote wereldreligies bevatten.'
    },
    'Bedrijfseconomie': {
      vraag: 'Wat is het verschil tussen omzet en winst?',
      antwoorden: ['A) Geen verschil, het is hetzelfde', 'B) Omzet = inkomsten, winst = inkomsten minus kosten', 'C) Omzet = winst minus kosten', 'D) Winst = omzet plus kosten'],
      juist: 'B) Omzet = inkomsten, winst = inkomsten minus kosten',
      uitleg: 'Leerlingen gebruiken omzet en winst vaak door elkaar, of begrijpen de relatie met kosten niet.',
      prompt: 'Maak een diagnostische vraag over basisconcepten in bedrijfseconomie voor 4e klas HAVO. Focus op het onderscheid tussen omzet, winst en kosten. Zorg dat foute opties veelvoorkomende verwarringen weergeven.'
    },
    'NLT (natuur leven en techniek)': {
      vraag: 'Wat is duurzame ontwikkeling?',
      antwoorden: ['A) Alleen aandacht voor milieu', 'B) Evenwicht tussen mens, milieu en economie', 'C) Alleen economische groei', 'D) Alleen sociale ontwikkeling'],
      juist: 'B) Evenwicht tussen mens, milieu en economie',
      uitleg: 'Leerlingen zien duurzaamheid vaak als alleen milieu, of begrijpen de balans tussen verschillende aspecten niet.',
      prompt: 'Maak een diagnostische vraag over duurzame ontwikkeling voor NLT. Focus op de drie pijlers (people, planet, profit). Zorg dat foute opties eenzijdige benaderingen weergeven die leerlingen vaak hebben.'
    }
  };
</script>

<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-4">Diagnostische vragen in de klas</h1>


  <p class="mb-6 text-lg leading-relaxed">
    Diagnostische vragen zijn krachtige instrumenten voor formatief onderwijs. Deze website biedt een overzicht van wat diagnostische vragen zijn, hoe je ze kunt inzetten in je lessen, en waar je ze kunt vinden voor elk schoolvak. Ontdek hoe je met diagnostische vragen inzicht krijgt in de denkprocessen van je leerlingen, waardoor je je onderwijs beter kunt aanpassen aan hun behoeften.
  </p>

  <!-- Introductie in dropdown -->
  <div class="mb-4">
    <button class="w-full text-left px-4 py-2 bg-orange-100 rounded hover:bg-orange-200 font-semibold" on:click={() => showIntro = !showIntro}>
      Wat zijn diagnostische vragen en waarom zijn ze handig?
    </button>
    {#if showIntro}
      <div class="p-4 bg-gray-50 border-l-4 border-orange-300 mt-2 rounded">
        <p>
          Diagnostische vragen zijn strategisch ontworpen meerkeuzevragen om misvattingen bij leerlingen te constateren. Craig Barton, auteur van "How I Wish I'd Taught Maths"<sup><a href={refLink(17)} target="_blank" class="">[17]</a></sup><sup><a href={refLink(18)} target="_blank" class="">[18]</a></sup><sup><a href={refLink(19)} target="_blank" class="">[19]</a></sup>, omschrijft een diagnostische vraag als een vraag die zo is ontworpen dat hij de docent helpt een geïnformeerde beslissing te nemen over wat de beste vervolgstap is in de les.<sup><a href={refLink(14)} target="_blank" class="text-blue-600">[14]</a></sup>
        </p>
        <p class="mt-2">
        <b>Het probleem van misvattingen:</b>
        Leerlingen mogen fouten maken, maar misvattingen zijn serieuzer.
        Bij een misvatting of misconcept is er sprake van kennis of kunde die fout is. Het is erg lastig een hersenverbinding eerst af te breken voor je hem weer opbouwt, waardoor misvattingen van zichzelf hardnekkig zijn en je ze steeds ziet terugkomen, ook al heb je het nadrukkelijk behandeld.
        Het gevaarlijke van misvattingen is dat leerlingen denken dat ze het wél begrijpen en daardoor niet uit zichzelf op zoek gaan naar het goede antwoord – alleen door een confrontatie met het feit dat ze het fout hebben ontstaat de prikkel om het goede concept aan te leren.<sup><a href={refLink(1)} target="_blank" class="text-blue-600">[1]</a></sup>
        </p>
        <p class="mt-2">
        <b>De kracht van diagnostische vragen:</b>
       Met diagnostische vragen willen we hardnekkige misvattingen blootleggen. Dit maakt diagnostische vragen zo krachtig: ze onthullen de misvattingen van de leerlingen.<sup><a href={refLink(7)} target="_blank" class="text-blue-600">[7]</a></sup>
        </p>
        <p class="mt-2">
          Het gebruik van diagnostische vragen aan het begin van de les is handig: als blijkt dat een groot deel van de klas een misvatting heeft, kun je als docent <b>niet</b> beginnen met nieuwe stof uit te leggen, men kan immers geen wolkenkrabber bouwen op een slechte fundering. In plaats daarvan kan je je les direct aanpassen en ingaan op de specifieke denkfouten die aan het licht komen.<sup><a href={refLink(14)} target="_blank" class="text-blue-600">[14]</a></sup>
        </p>
      </div>
    {/if}
  </div>

  <!-- Dropdowns -->
  <div class="mb-4">
    <button class="w-full text-left px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 font-semibold" on:click={() => showDiagnostischeVragen = !showDiagnostischeVragen}>
      Wat maakt een effectieve diagnostische vraag?
    </button>
    {#if showDiagnostischeVragen}
      <div class="p-4 bg-blue-50 border-l-4 border-blue-300 mt-2 rounded">
        <p>
          Craig Barton stelt in zijn boek dat een goede diagnostische vraag moet voldoen aan de volgende criteria om effectief te zijn:<sup><a href={refLink(6)} target="_blank" class="text-blue-600">[6]</a></sup><sup><a href={refLink(1)} target="_blank" class="text-blue-600">[1]</a></sup>
        </p>
        <ul class="list-disc ml-6 mb-3">
          <li><b>Eenduidig en gesloten:</b> De vraag mag geen ruimte laten voor interpretatie</li>
          <li><b>Bevraagt één concept:</b> Focus op één specifiek leerdoel of concept</li>
          <li><b>Binnen 10 seconden te beantwoorden:</b> Snelle respons is cruciaal voor effectieve inzet.</li> Alhoewel, andere richtlijnen zeggen 1 minuut, waarbij je de antwoorden binnen 30 seconden kan interpreteren.<sup><a href={refLink(10)} target="_blank" class="text-blue-600">[10]</a></sup>
          <li><b>Foute opties geven informatie over denkwijze:</b> Elk fout antwoord moet een specifieke misvatting representeren die de leerling kan hebben. Let op, leerlingen kunnen je verbazen.<sup><a href={refLink(7)} target="_blank" class="text-blue-600">[7]</a></sup></li>
          <li><b>Geen geluk mogelijk:</b> Het moet niet mogelijk zijn met een misvatting op het juiste antwoord te komen</li>
        </ul>

        <p class="mb-2">
          <b>Nog steeds te vaag?</b> Misschien dat deze bronnen je kunnen helpen.
            <sup><a href={refLink(15)} target="_blank" class="text-blue-600">[15]</a></sup>
            <sup><a href={refLink(20)} target="_blank" class="text-blue-600">[20]</a></sup>
            <sup><a href={refLink(21)} target="_blank" class="text-blue-600">[21]</a></sup>
            <sup><a href={refLink(22)} target="_blank" class="text-blue-600">[22]</a></sup>
            <sup><a href={refLink(17)} target="_blank" class="text-blue-600">[17]</a></sup>
            <sup><a href={refLink(18)} target="_blank" class="text-blue-600">[18]</a></sup>
            <sup><a href={refLink(19)} target="_blank" class="text-blue-600">[19]</a></sup>
        </p>

        <p class="mb-2">
          <b>Onderbouwing:</b> Dylan Wiliam's onderzoek naar "hinge questions" toont aan dat één goed geplaatste diagnostische vraag voldoende kan zijn om te bepalen of je door kunt gaan met de les of een stapje terug moet zetten.<sup><a href={refLink(10)} target="_blank" class="text-blue-600">[10]</a></sup> Het University of York Science Education Group heeft uitgebreid onderzoek gedaan naar de ontwikkeling van diagnostische assessments voor science.<sup><a href={refLink(12)} target="_blank" class="text-blue-600">[12]</a></sup>
        </p>

        <p class="mt-2 text-sm">
          <b>Praktische tip:</b> Het bedenken van zulke vragen kost tijd en inzicht in veelgemaakte fouten. Samenwerking met collega's of gebruik van bestaande databanken of AI zijn hier heel handig.<sup><a href={refLink(15)} target="_blank" class="text-blue-600">[15]</a></sup>
        </p>
      </div>
    {/if}
  </div>

  <div class="mb-4">
    <button class="w-full text-left px-4 py-2 bg-green-100 rounded hover:bg-green-200 font-semibold" on:click={() => showWaarom = !showWaarom}>
      Waarom zou je diagnostische vragen gebruiken?
    </button>
    {#if showWaarom}
      <div class="p-4 bg-green-50 border-l-4 border-green-300 mt-2 rounded">
        <div class="mb-4">
          <p class="mb-3">
            Craig Barton, auteur van "How I Wish I'd Taught Maths", stelt dat
            <i>"het stellen van en reageren op diagnostische vragen het belangrijkste is wat ik elke les doe"</i>.<sup><a href={refLink(17)} target="_blank">[17]</a></sup>
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white p-4 rounded border-l-2 border-blue-400">
            <h4 class="font-semibold text-blue-800 mb-2">Wetenschappelijke Basis</h4>
            <ul class="list-disc ml-4 text-sm space-y-1">
              <li><b>Formatieve assessment effectiviteit:</b> Onderzoek toont aan dat formatieve toetsing, waaronder diagnostische vragen en zogenaamde "hinge questions", tot de meest effectieve interventies behoren in het onderwijs.<sup><a href={refLink(10)} target="_blank" class="text-blue-600">[10]</a></sup><sup><a href={refLink(13)} target="_blank" class="text-blue-600">[13]</a></sup></li>
              <li><b>Cognitive Load Theory:</b> Multiple choice vragen zijn kort en reduceren de cognitive load, wat voordelig is voor de lespraktijk. Tevens word je gelimiteerd door maar één concept te kunnen vragen.<sup><a href={refLink(23)} target="_blank" class="text-blue-600">[23]</a></sup><sup><a href={refLink(17)} target="_blank" class="text-blue-600">[17]</a></sup></li>
              <li><b>Efficiënte differentiatie:</b> Je kunt snel en effectief differentiëren op basis van de antwoorden, waardoor iedere leerling passend onderwijs krijgt zonder complexe voorbereiding.<sup><a href={refLink(14)} target="_blank" class="text-blue-600">[14]</a></sup></li>
            </ul>
          </div>

          <div class="bg-white p-4 rounded border-l-2 border-purple-400">
            <h4 class="font-semibold text-purple-800 mb-2">Praktische Voordelen</h4>
            <ul class="list-disc ml-4 text-sm space-y-1">
              <li><b>Directe feedback:</b> Elke verkeerde antwoordoptie is specifiek ontworpen om een bepaalde misconceptie te onthullen, waardoor leraren onmiddellijk kunnen identificeren waar leerlingen vastlopen in hun begrip.<sup><a href={refLink(1)} target="_blank" class="text-blue-600">[1]</a></sup></li>
              <li><b>Herbruikbaarheid:</b> Goede diagnostische vragen kun je hergebruiken en delen met collega's.</li>
              <li><b>Direct inzicht in misconcepties:</b> Je krijgt onmiddellijk zicht op specifieke denkfouten van alle leerlingen, zodat je snel kunt bepalen of je door kunt met de lesstof of een stap terug moet zetten.<sup><a href={refLink(11)} target="_blank" class="text-blue-600">[11]</a></sup></li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="mb-4">
    <button class="w-full text-left px-4 py-2 bg-yellow-100 rounded hover:bg-yellow-200 font-semibold" on:click={() => showHoe = !showHoe}>
      Hoe gebruik je diagnostische vragen effectief in de praktijk?
    </button>
    {#if showHoe}
      <div class="p-4 bg-yellow-50 border-l-4 border-yellow-300 mt-2 rounded">
        <p class="mb-2">
          Craig Barton heeft een specifieke procedure ontwikkeld voor het effectief inzetten van diagnostische vragen:<sup><a href={refLink(2)} target="_blank" class="text-blue-600">[2]</a></sup>
        </p>
        <ol class="list-decimal ml-6 mb-3">
          <li>De vraag komt op het bord</li>
          <li>Leerlingen denken in stilte na over hun antwoord</li>
          <li>Tel af: 3, 2, 1...</li>
          <li>Leerlingen steken tegelijk hun hand op met het aantal vingers van hun gekozen antwoord</li>
          <li>Docent scant het lokaal en zorgt dat élke leerling een zichtbaar antwoord geeft</li>
          <li><i>Optioneel:</i> Geef het juiste antwoord</li>
          <li><i>Optioneel:</i> Leg kort uit waarom andere antwoorden fout zijn</li>
          <li><i>Optioneel:</i> Laat leerlingen het elkaar 30 seconden aan elkaar uitleggen</li>
          <li><i>Optioneel:</i> Ga door met een vraag over hetzelfde concept</li>
        </ol>

        <p class="mb-2">
          <b>Strategische timing:</b> De meest ideale timing voor diagnostische vragen is aan het begin van de les. Als je al begint met je uitleg kan het namelijk al te laat zijn, waardoor je alleen maar een dieper gat graaft voor de misvatting.
        </p>
      </div>
    {/if}
  </div>

  <div class="mb-4">
    <button class="w-full text-left px-4 py-2 bg-purple-100 rounded hover:bg-purple-200 font-semibold" on:click={() => showMakenAI = !showMakenAI}>
      Hoe maak je zelf diagnostische vragen met AI?
    </button>
    {#if showMakenAI}
      <div class="p-4 bg-purple-50 border-l-4 border-purple-300 mt-2 rounded">
        <p class="mb-2">
          <b>AI als hulpmiddel bij het ontwerpen:</b> Moderne AI-tools zoals ChatGPT kunnen docenten helpen bij het ontwikkelen van diagnostische vragen, mits je de juiste prompts gebruikt.<sup><a href={refLink(5)} target="_blank" class="text-blue-600">[5]</a></sup> De Universiteit Maastricht heeft een uitgebreide AI Prompt Library ontwikkeld specifiek voor het maken van multiple choice vragen.<sup><a href={refLink(8)} target="_blank" class="text-blue-600">[8]</a></sup>
        </p>

        <p class="mb-2">
          <b>Belangrijke aandachtspunten bij AI-gebruik:</b>
        </p>
        <ul class="list-disc ml-6 mb-3">
          <li>AI kan helpen met structuur en ideeën, maar vakinhoudelijke kennis van misvattingen blijft essentieel</li>
          <li>Test altijd AI-gegenereerde vragen eerst zelf, met collega's of in een kleine groep leerlingen</li>
          <li>Controleer of de foute antwoorden daadwerkelijk misvattingen zijn</li>
          <li>Houdt de criteria van Craig Barton in het acterhoofd (eenduidig, één concept, kort te beantwoorden, snel te interpreteren, inzichtgevend)</li>
        </ul>

        <p class="text-sm mb-4">
          <b>Praktische tip:</b> Gebruik de <a href={refLink(8)} target="_blank" class="text-blue-600 underline">Universiteit Maastricht AI Prompt Library</a> als startpunt voor het ontwikkelen van je eigen diagnostische vragen.<sup><a href={refLink(8)} target="_blank" class="text-blue-600">[8]</a></sup>
        </p>

        <!-- AI voorbeelden per vak -->
        <h4 class="font-semibold mb-3 text-purple-800">Voorbeelden per vak (met AI gegenereed, dus sorry als de vraag tegenvalt of fout is):</h4>
        <div class="space-y-2">
          {#each Object.keys(aiVoorbeelden) as vak}
            <div class="border border-purple-200 rounded">
              <button
                class="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 font-medium text-sm"
                on:click={() => showAIExamples[vak] = !showAIExamples[vak]}
              >
                {vak} - Voorbeeldvraag
              </button>
              {#if showAIExamples[vak]}
                <div class="p-3 bg-white text-sm">
                  <div class="mb-3">
                    <b class="text-purple-700">Diagnostische vraag:</b>
                    <p class="mt-1">{aiVoorbeelden[vak].vraag}</p>
                    <ul class="list-none ml-4 mt-2">
                      {#each aiVoorbeelden[vak].antwoorden as antwoord}
                        <li class:font-semibold={antwoord === aiVoorbeelden[vak].juist} class:text-green-600={antwoord === aiVoorbeelden[vak].juist}>{antwoord}</li>
                      {/each}
                    </ul>
                  </div>

                  <div class="mb-3">
                    <b class="text-purple-700">Juiste antwoord:</b>
                    <p class="mt-1 text-green-600 font-medium">{aiVoorbeelden[vak].juist}</p>
                  </div>

                  <div class="mb-3">
                    <b class="text-purple-700">Waarom deze afleiders:</b>
                    <p class="mt-1 text-gray-700">{aiVoorbeelden[vak].uitleg}</p>
                  </div>

                  <div class="bg-gray-50 p-2 rounded">
                    <b class="text-purple-700">AI-prompt gebruikt:</b>
                    <p class="mt-1 text-xs text-gray-600 italic">"{aiVoorbeelden[vak].prompt}"</p>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <h2 class="text-2xl font-bold mt-8 mb-4">Diagnostische vragen per vakgebied</h2>
  <p class="mb-4 text-gray-700">
    Selecteer een vakgebied om bronnen te zien van collecties met diagnostische vragen, of gebruik AI om ze zelf te genereren.
  </p>

  <div class="mb-6">
    <div class="block mb-2 font-semibold">Kies een vakgebied:</div>
    <select bind:value={selectedVakgroep} class="w-full p-2 border rounded">
      <option value="">-- Kies een vakgebied --</option>
      {#each vakgroepen as vakgroep}
        <option value={vakgroep.naam}>{vakgroep.naam}</option>
      {/each}
    </select>

    {#if selectedVakgroep}
      {#each vakgroepen as vakgroep}
        {#if vakgroep.naam === selectedVakgroep}
          <div class="mt-4 p-4 bg-gray-50 border rounded">
            <h3 class="font-semibold mb-4 text-lg">Bronnen voor {selectedVakgroep}:</h3>
            <div class="grid gap-4">
              {#each vakgroep.vakken as vak}
                <div class="p-3 bg-white border rounded">
                  <h4 class="font-semibold mb-2 text-blue-800">{vak.naam}</h4>
                  <ul class="list-disc ml-6 space-y-1">
                    {#each vak.links as link}
                      <li>
                        <a href={link.url} target="_blank" class="text-blue-600 underline hover:text-blue-800" rel="noopener noreferrer">{link.naam}</a>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    {/if}
  </div>

  <!-- Algemene bronnen sectie -->
  <h2 class="text-2xl font-bold mt-8 mb-4">Algemene bronnen en platforms</h2>
  <div class="grid md:grid-cols-2 gap-4 mb-6">
    <div class="p-4 bg-blue-50 border rounded">
      <h3 class="font-semibold mb-2">Nederlandse platforms</h3>
      <ul class="space-y-2">
        <li><a href="https://www.diagnostischevragen.nl/" target="_blank" class="text-blue-600 underline hover:text-blue-800">DiagnostischeVragen.nl</a> - De grootste Nederlandse database</li>
        <li><a href="https://toetsrevolutie.nl/" target="_blank" class="text-blue-600 underline hover:text-blue-800">Toetsrevolutie</a> - Formatief handelen</li>
        <li><a href="https://www.wikiwijs.nl/" target="_blank" class="text-blue-600 underline hover:text-blue-800">Wikiwijs</a> - Open onderwijsmaterialen</li>
      </ul>
    </div>
    <div class="p-4 bg-green-50 border rounded">
      <h3 class="font-semibold mb-2">Internationale platforms</h3>
      <ul class="space-y-2">
        <li><a href="https://diagnosticquestions.com" target="_blank" class="text-blue-600 underline hover:text-blue-800">DiagnosticQuestions.com</a> - Craig Barton's wereldwijde platform</li>
        <li><a href="https://www.stem.org.uk/best-evidence-science-teaching" target="_blank" class="text-blue-600 underline hover:text-blue-800">STEM Learning</a> - Evidence-based science teaching</li>
        <li><a href="https://thirdspacelearning.com/secondary-resources/diagnostic-questions/" target="_blank" class="text-blue-600 underline hover:text-blue-800">Third Space Learning</a> - Uitgebreide wiskundevragen</li>
      </ul>
    </div>
  </div>

  <!-- AI Tools sectie -->
  <div class="p-4 bg-yellow-50 border rounded mb-6">
    <h3 class="font-semibold mb-2">AI-tools voor het maken van diagnostische vragen</h3>
    <ul class="space-y-2">
      <li><a href="https://library.maastrichtuniversity.nl/apps-tools/ai-prompt-library/create-multiple-choice-questions/" target="_blank" class="text-blue-600 underline hover:text-blue-800">Universiteit Maastricht AI Prompt Library</a> - Formats voor prompts voor multiple choice vragen</li>
      <li><a href="https://toetsrevolutie.nl/chatgpt-bij-het-ontwerpen-van-formatief-handelen/" target="_blank" class="text-blue-600 underline hover:text-blue-800">ChatGPT voor Formatief Handelen</a> - Nederlandse gids voor AI gebruiken om te helpen bij formatief handelen</li>
    </ul>
  </div>

  <div class="mt-8">
    <h2 class="text-xl font-bold mb-2">Bronnenlijst</h2>
    <ol class="list-decimal ml-6 text-sm">
      {#each refs as ref}
        {#if ref.url !== ''}
          <li class="mb-2">
            <a href={ref.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">{ref.label}</a>
          </li>
        {:else}
          <li class="mb-2">
            <a href={ref.url} target="_blank" rel="noopener noreferrer" class="">{ref.label}</a>
          </li>
        {/if}
      {/each}
    </ol>
  </div>

  <div class="text-center mx-auto">
    <h2 class="text-l font-bold mb-2">Meer bronnen gevonden? <a href="mailto:joris.perrenet+diagnostischevragen@gmail.com" target="_blank" rel="noopener noreferrer" class="text-blue-800">Laat het me weten.</a></h2>
  </div>
</div>

