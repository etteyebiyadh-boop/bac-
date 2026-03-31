const { PrismaClient, Language, GrammarCategory, VocabTheme, Difficulty, VerbTense } = require('@prisma/client');

const prisma = new PrismaClient();

// Official 2026 Tunisian BAC Program - All Languages
async function seed() {
  console.log('Seeding comprehensive BAC content for ALL languages...');
  
  // Seed for each supported language
  for (const language of [Language.ENGLISH, Language.FRENCH, Language.ARABIC, Language.SPANISH, Language.GERMAN, Language.ITALIAN]) {
    console.log(`\n=== Seeding ${language} ===`);
    await seedGrammarRules(language);
    await seedVerbConjugations(language);
    await seedVocabularySets(language);
    await seedReadingPassages(language);
  }
  
  console.log('\n✅ All languages seeded successfully!');
}

// ==================== GRAMMAR RULES BY LANGUAGE ====================
async function seedGrammarRules(language) {
  const grammarRulesByLanguage = {
    [Language.ENGLISH]: getEnglishGrammarRules(),
    [Language.FRENCH]: getFrenchGrammarRules(),
    [Language.ARABIC]: getArabicGrammarRules(),
    [Language.SPANISH]: getSpanishGrammarRules(),
    [Language.GERMAN]: getGermanGrammarRules(),
    [Language.ITALIAN]: getItalianGrammarRules()
  };

  const rules = grammarRulesByLanguage[language] || [];
  
  for (const rule of rules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: { ...rule, language }
    });
  }
  
  console.log(`  ✓ Seeded ${rules.length} grammar rules for ${language}`);
}

function getEnglishGrammarRules() {
  return [
    {
      slug: 'english-present-simple',
      category: GrammarCategory.TENSES,
      title: 'Present Simple',
      rule: 'Used for habitual actions, general truths, and permanent situations.',
      formula: 'Subject + base verb (+ s/es for 3rd person singular)',
      examples: [
        { positive: 'She works hard every day.', negative: 'They don\'t live here.', question: 'Do you speak English?' }
      ],
      exceptions: ['verbs ending in -o, -ch, -sh, -ss, -x, -z add -es', 'verbs ending in consonant + y: change y to i and add -es'],
      usageNotes: 'BAC frequent use: stating facts, describing routines, giving opinions.',
      commonErrors: ['Forgetting third person -s', 'Using continuous form incorrectly'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'english-present-perfect',
      category: GrammarCategory.TENSES,
      title: 'Present Perfect',
      rule: 'Used for actions that started in the past and continue to now, or past actions with present relevance.',
      formula: 'Subject + have/has + past participle',
      examples: [
        { positive: 'I have lived here since 2010.', negative: 'She hasn\'t finished yet.', question: 'Have you ever been to Paris?' }
      ],
      usageNotes: 'BAC key: since/for, ever/never, yet/already. Essential for describing life experiences.',
      commonErrors: ['Using with specific past time (wrong: I have seen him yesterday)', 'Confusing with past simple'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'english-conditionals',
      category: GrammarCategory.CONDITIONALS,
      title: 'Zero, First, Second & Third Conditionals',
      rule: 'Zero: General truths. First: Real possibilities. Second: Hypothetical present. Third: Past hypotheticals.',
      formula: 'Zero: If + present, present | First: If + present, will | Second: If + past, would | Third: If + past perfect, would have',
      examples: [
        { zero: 'If you heat ice, it melts.', first: 'If it rains, I\'ll stay home.', second: 'If I were rich, I would travel.', third: 'If I had studied, I would have passed.' }
      ],
      usageNotes: 'BAC essays: First conditional for arguments; Second for hypotheticals; Third for regrets.',
      commonErrors: ['Using will in if-clause', 'Wrong tense combinations'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'english-passive-voice',
      category: GrammarCategory.PASSIVE_VOICE,
      title: 'Passive Voice',
      rule: 'Used when the action is more important than who does it.',
      formula: 'Subject + be + past participle (+ by + agent)',
      examples: [
        { present: 'The window is broken.', past: 'The letter was sent.', perfect: 'The work has been done.' }
      ],
      usageNotes: 'BAC: Essential for formal/academic writing. Use for objective tone.',
      commonErrors: ['Wrong past participle', 'Overusing passive', 'Forgetting agent when needed'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'english-essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Essay Connectors',
      rule: 'Academic connectors organize arguments and show relationships between ideas.',
      formula: 'Addition, contrast, cause/effect, sequence, example categories',
      examples: [
        { addition: 'Furthermore, Moreover, In addition', contrast: 'However, Nevertheless, On the other hand', cause: 'Therefore, Consequently, As a result', conclusion: 'In conclusion, To sum up, In summary' }
      ],
      usageNotes: 'BAC writing: Sophisticated use separates average from excellent essays.',
      commonErrors: ['Overusing basic connectors (but, so)', 'Wrong punctuation'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'english-relative-clauses',
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Relative Clauses (who, which, that, whose)',
      rule: 'Add information about nouns. Defining clauses identify; non-defining add extra info.',
      formula: 'Noun + who/which/that/whose + clause',
      examples: [
        { defining: 'The student who got the highest score won.', non_defining: 'My brother, who lives in Paris, is visiting.' }
      ],
      usageNotes: 'BAC: Adds sophistication and flow. Use to combine short sentences elegantly.',
      commonErrors: ['Using what instead of which/that', 'Missing commas in non-defining'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

function getFrenchGrammarRules() {
  return [
    {
      slug: 'french-present-indicative',
      category: GrammarCategory.TENSES,
      title: 'Présent de l\'indicatif',
      rule: 'Temps de base pour exprimer des actions habituelles, des vérités générales.',
      formula: 'Radical + terminaison (-e, -es, -e, -ons, -ez, -ent)',
      examples: [
        { regular: 'Je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.' }
      ],
      exceptions: ['Verbes du 3ème groupe: être, avoir, aller, faire, venir, pouvoir, vouloir, savoir, etc.'],
      usageNotes: 'Bac: Indispensable pour exprimer des opinions et des routines.',
      commonErrors: ['Confusion des terminaisons (-ent prononcé [ɑ̃])', 'Erreurs sur les verbes irréguliers'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'french-pass-compose-imparfait',
      category: GrammarCategory.TENSES,
      title: 'Passé composé vs Imparfait',
      rule: 'Le passé composé raconte une action terminée; l\'imparfait décrit une durée, une habitude, un contexte.',
      formula: 'Passé composé: avoir/être + participe passé | Imparfait: radical + terminaison (-ais, -ais, -ait, -ions, -iez, -aient)',
      examples: [
        { passeCompose: 'Hier, j\'ai fini mes devoirs.', imparfait: 'Quand j\'étais petit, je lisais beaucoup.' }
      ],
      usageNotes: 'Bac: Choix crucial pour la narration. Passé composé = action; Imparfait = description.',
      commonErrors: ['Utiliser toujours le passé composé', 'Oublier l\'accord du participe passé avec être'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'french-subjunctive',
      category: GrammarCategory.TENSES,
      title: 'Le Subjonctif Présent',
      rule: 'Utilisé pour exprimer le doute, la nécessité, le souhait, l\'émotion.',
      formula: 'Que + pronom + radical + terminaison (-e, -es, -e, -ions, -iez, -ent)',
      examples: [
        { doubt: 'Je doute qu\'il vienne.', necessity: 'Il faut que tu étudies.', emotion: 'Je suis content que tu réussisses.' }
      ],
      usageNotes: 'Bac: Très valorisant. Après il faut que, je veux que, bien que, etc.',
      commonErrors: ['Utiliser l\'indicatif au lieu du subjonctif', 'Erreurs de radical sur les verbes irréguliers'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'french-relative-clauses',
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Propositions Relatives (qui, que, dont, où)',
      rule: 'Ajoutent des informations sur un nom. Qui = sujet, Que = complément d\'objet, Dont = de + chose, Où = lieu/temps.',
      formula: 'Antécédent + qui/que/dont/où + proposition',
      examples: [
        { qui: 'L\'élève qui travaille réussit.', que: 'Le livre que tu lis est intéressant.', dont: 'Voici le sujet dont je parle.', ou: 'L\'année où j\'ai passé le Bac.' }
      ],
      usageNotes: 'Bac: Indispensable pour lier les phrases et enrichir la syntaxe.',
      commonErrors: ['Confusion entre qui et que', 'Oublier dont'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'french-essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Connecteurs Logiques',
      rule: 'Organisent l\'argumentation et montrent les liens entre les idées.',
      formula: 'Catégories: addition, opposition, cause/conséquence, chronologie, illustration',
      examples: [
        { addition: 'De plus, En outre, Par ailleurs', opposition: 'Cependant, Néanmoins, Toutefois', cause: 'En effet, Ainsi, Par conséquent', conclusion: 'En conclusion, Pour conclure, En résumé' }
      ],
      usageNotes: 'Bac: Usage varié des connecteurs valorisé. Éviter mais et donc au Bac.',
      commonErrors: ['Utiliser toujours mais et donc', 'Fautes de syntaxe après les connecteurs'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

function getArabicGrammarRules() {
  return [
    {
      slug: 'arabic-sentence-types',
      category: GrammarCategory.TENSES,
      title: 'أنواع الجمل (الاسمية والفعلية)',
      rule: 'الجملة الاسمية تبدأ باسم، والجملة الفعلية تبدأ بفعل.',
      formula: 'الجملة الاسمية: مبتدأ + خبر | الجملة الفعلية: فعل + فاعل + (مفعول به)',
      examples: [
        { nominal: 'العلمُ نورٌ', verbal: 'كتبَ التلميذُ الدرسَ' }
      ],
      usageNotes: 'البكالوريا: أساس بناء أي فقرة. التنويع بين الجملتين مهم.',
      commonErrors: ['نسيان تنوين الخبر المفرد المؤنث', 'خطأ في تقديم الفاعل على الفعل في الفعلية'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'arabic-i-rab',
      category: GrammarCategory.ARTICLES,
      title: 'الإعراب (رفع، نصب، جر)',
      rule: 'تحديد موقع الكلمة في الجملة من خلال الحركات الإعرابية.',
      formula: 'المبتدأ والفاعل مرفوعان، المفعول به منصوب، المضاف إليه مجرور',
      examples: [
        { raf: 'الطالبُ ناجحٌ', nasb: 'شاهدتُ الفيلمَ', jarr: 'ذهبتُ إلى المدرسةِ' }
      ],
      usageNotes: 'البكالوريا: الإعراب السليم يضمن جملًا صحيحة وواضحة المعنى.',
      commonErrors: ['تثبيت الحركات (جمع الجر بالرفع)', 'نسيان تنوين التنوين'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'arabic-paragraph-links',
      category: GrammarCategory.CONNECTORS,
      title: 'روابط الفقرة والمقال',
      rule: 'الروابط المنطقية تبني فقرة متماسكة وتربط الأفكار.',
      formula: 'إضافة، تسلسل، تباين، سببية، خاتمة',
      examples: [
        { addition: 'علاوة على ذلك، بالإضافة إلى', sequence: 'في البداية، ثم، في الختام', contrast: 'غير أن، لكن، في المقابل', conclusion: 'في الختام، لعل أهم ما يمكن استخلاصه' }
      ],
      usageNotes: 'البكالوريا: التنويع في الروابط يميز المقال الجيد.',
      commonErrors: ['تكرار نفس الرابط أكثر من مرة', 'استخدام رابط لا يناسب المعنى'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'arabic-verb-tenses',
      category: GrammarCategory.TENSES,
      title: 'أزمنة الفعل (الماضي، المضارع، الأمر)',
      rule: 'تصريف الأفعال في الأزمنة الثلاثة الرئيسية.',
      formula: 'الماضي: فَعَلَ، المضارع: يَفعُلُ، الأمر: افْعُلْ',
      examples: [
        { past: 'درسَ التلميذُ', present: 'يدرسُ التلميذُ', imperative: 'ادرسْ جيدًا' }
      ],
      usageNotes: 'البكالوريا: التنويع بين الأزمنة يُظهر إتقان اللغة.',
      commonErrors: ['خلط تاء التأنيث مع ألف الاثنين', 'أخطاء في بناء المضارع من الأفعال المعتلة'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

function getSpanishGrammarRules() {
  return [
    {
      slug: 'spanish-present-indicative',
      category: GrammarCategory.TENSES,
      title: 'Presente de Indicativo',
      rule: 'Tiempo básico para expresar acciones habituales y verdades generales.',
      formula: 'Radical + terminación (-o, -as, -a, -amos, -áis, -an / -o, -es, -e, -emos, -éis, -en)',
      examples: [
        { regularAR: 'hablo, hablas, habla, hablamos, habláis, hablan', regularER: 'como, comes, come, comemos, coméis, comen' }
      ],
      exceptions: ['Verbos irregulares: ser, estar, ir, tener, venir, poder, hacer'],
      usageNotes: 'Bachillerato: Esencial para expresar opiniones y rutinas.',
      commonErrors: ['Confusión de terminaciones', 'Errores en verbos irregulares'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'spanish-past-tenses',
      category: GrammarCategory.TENSES,
      title: 'Pretérito Indefinido vs Imperfecto',
      rule: 'El pretérito narra acciones terminadas; el imperfecto describe hábitos o contexto.',
      formula: 'Pretérito: radical + terminación (-é, -aste, -ó, -amos, -asteis, -aron) | Imperfecto: (-aba, -abas, -aba, -ábamos, -abais, -aban)',
      examples: [
        { preterito: 'Ayer estudié para el examen.', imperfecto: 'Cuando era niño, leía mucho.' }
      ],
      usageNotes: 'Bachillerato: Elección crucial para la narración.',
      commonErrors: ['Usar siempre el pretérito', 'Confusión entre ambos tiempos'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'spanish-subjunctive',
      category: GrammarCategory.TENSES,
      title: 'Presente de Subjuntivo',
      rule: 'Usado para expresar duda, necesidad, deseo, emoción.',
      formula: 'Que + pronombre + subjuntivo (radical + -e, -es, -e, -emos, -éis, -en)',
      examples: [
        { doubt: 'Dudo que venga.', necessity: 'Es necesario que estudies.', emotion: 'Me alegro de que apruebes.' }
      ],
      usageNotes: 'Bachillerato: Muy valorado. Después de es necesario que, quiero que, etc.',
      commonErrors: ['Usar indicativo en lugar de subjuntivo', 'Errores en el radical'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'spanish-essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Conectores para Redacción',
      rule: 'Organizan la argumentación y muestran relaciones entre ideas.',
      formula: 'Categorías: adición, oposición, causa/efecto, cronología, conclusión',
      examples: [
        { addition: 'Además, Asimismo, También', opposition: 'Sin embargo, No obstante, Por otro lado', cause: 'Por lo tanto, En consecuencia, Así pues', conclusion: 'En conclusión, En resumen, Para concluir' }
      ],
      usageNotes: 'Bachillerato: Uso variado de conectores muy valorado.',
      commonErrors: ['Usar siempre pero y entonces', 'Errores de puntuación'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

function getGermanGrammarRules() {
  return [
    {
      slug: 'german-present-tense',
      category: GrammarCategory.TENSES,
      title: 'Präsens',
      rule: 'Grundzeitform für Gewohnheiten und Gegenwart.',
      formula: 'Konjugation mit Personalendungen (-e, -st, -t, -en, -t, -en)',
      examples: [
        { regular: 'ich spiele, du spielst, er spielt, wir spielen, ihr spielt, sie spielen' }
      ],
      exceptions: ['Verben mit Stammwechsel: essen (du isst), fahren (du fährst)', 'Unregelmäßige Verben: sein, haben, werden'],
      usageNotes: 'Abitur: Grundlegend für Meinungsäußerungen und Beschreibungen.',
      commonErrors: ['Verwechslung der Endungen', 'Fehler bei unregelmäßigen Verben'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'german-perfect',
      category: GrammarCategory.TENSES,
      title: 'Perfekt',
      rule: 'Vergangene Handlungen mit Gegenwartsbezug.',
      formula: 'haben/sein + Partizip II',
      examples: [
        { haben: 'Ich habe gelernt.', sein: 'Ich bin gegangen.' }
      ],
      usageNotes: 'Abitur: Wichtig für mündliche und schriftliche Narration.',
      commonErrors: ['Falsche Wahl von haben/sein', 'Falsche Partizipformen'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'german-subordinate-clauses',
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Nebensätze',
      rule: 'Relativsätze und Konjunktionen erweitern den Satz.',
      formula: 'Nebensatz: Konjunktion + Verb am Ende',
      examples: [
        { relative: 'Das ist der Schüler, der gut lernt.', dass: 'Ich hoffe, dass ich bestehe.', weil: 'Ich lerne, weil ich Erfolg haben will.' }
      ],
      usageNotes: 'Abitur: Komplexe Sätze mit Nebensätzen zeigen Sprachbeherrschung.',
      commonErrors: ['Verb nicht am Ende des Nebensatzes', 'Falsche Konjunktion'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'german-essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Konnektoren für Aufsätze',
      rule: 'Verbinden Sätze und zeigen logische Beziehungen.',
      formula: 'Addition, Gegensatz, Ursache/Wirkung, chronologisch',
      examples: [
        { addition: 'Außerdem, Darüber hinaus, Zudem', contrast: 'Allerdings, Dennoch, Trotzdem', cause: 'Daher, Deshalb, Folglich', conclusion: 'Zusammenfassend, Abschließend, Insgesamt' }
      ],
      usageNotes: 'Abitur: Variierte Konnektoren heben das Niveau.',
      commonErrors: ['Immer nur und und aber verwenden', 'Falsche Satzstellung nach Konnektor'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

function getItalianGrammarRules() {
  return [
    {
      slug: 'italian-present-indicative',
      category: GrammarCategory.TENSES,
      title: 'Presente Indicativo',
      rule: 'Tempo base per azioni abituali e verità generali.',
      formula: 'Radice + desinenza (-o, -i, -a, -iamo, -ate, -ano / -o, -i, -e, -iamo, -ete, -ono)',
      examples: [
        { regularARE: 'parlo, parli, parla, parliamo, parlate, parlano', regularERE: 'vedo, vedi, vede, vediamo, vedete, vedono' }
      ],
      exceptions: ['Verbi irregolari: essere, avere, andare, fare, venire, stare'],
      usageNotes: 'Maturità: Essenziale per esprimere opinioni e routine.',
      commonErrors: ['Confusione delle desinenze', 'Errori nei verbi irregolari'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'italian-past-tenses',
      category: GrammarCategory.TENSES,
      title: 'Passato Prossimo vs Imperfetto',
      rule: 'Passato prossimo per azioni completate; imperfetto per abitudini o descrizioni.',
      formula: 'Passato prossimo: essere/avere + participio passato | Imperfetto: radice + desinenza (-avo, -avi, -ava, -avamo, -avate, -avano)',
      examples: [
        { passato: 'Ieri ho studiato.', imperfect: 'Quando ero piccolo, leggevo molto.' }
      ],
      usageNotes: 'Maturità: Scelta cruciale per la narrazione.',
      commonErrors: ['Usare sempre il passato prossimo', 'Accordo del participio con essere'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'italian-subjunctive',
      category: GrammarCategory.TENSES,
      title: 'Congiuntivo Presente',
      rule: 'Usato per esprimere dubbio, necessità, desiderio, emozione.',
      formula: 'Che + soggetto + congiuntivo',
      examples: [
        { doubt: 'Dubito che venga.', necessity: 'È necessario che tu studi.', emotion: 'Sono felice che tu riesca.' }
      ],
      usageNotes: 'Maturità: Molto valorizzato. Dopo è necessario che, voglio che, etc.',
      commonErrors: ['Usare l\'indicativo al posto del congiuntivo', 'Errori nella radice'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'italian-essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Connettori per la Redazione',
      rule: 'Organizzano l\'argomentazione e mostrano relazioni tra idee.',
      formula: 'Categorie: aggiunta, opposizione, causa/effetto, cronologia, conclusione',
      examples: [
        { addition: 'Inoltre, In aggiunta, Oltretutto', opposition: 'Tuttavia, Ciononostante, D\'altra parte', cause: 'Quindi, Pertanto, Di conseguenza', conclusion: 'In conclusione, In sintesi, Per concludere' }
      ],
      usageNotes: 'Maturità: Uso variato dei connettori molto valorizzato.',
      commonErrors: ['Usare sempre ma e quindi', 'Errori di punteggiatura'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    }
  ];
}

// ==================== VERB CONJUGATIONS ====================
async function seedVerbConjugations(language) {
  // Simplified verb seeding - only essential verbs per language
  const essentialVerbsByLanguage = {
    [Language.ENGLISH]: [
      { baseForm: 'be', pastSimple: 'was/were', pastParticiple: 'been', isIrregular: true },
      { baseForm: 'have', pastSimple: 'had', pastParticiple: 'had', isIrregular: true },
      { baseForm: 'do', pastSimple: 'did', pastParticiple: 'done', isIrregular: true },
      { baseForm: 'make', pastSimple: 'made', pastParticiple: 'made', isIrregular: true },
      { baseForm: 'take', pastSimple: 'took', pastParticiple: 'taken', isIrregular: true },
      { baseForm: 'get', pastSimple: 'got', pastParticiple: 'gotten', isIrregular: true },
      { baseForm: 'go', pastSimple: 'went', pastParticiple: 'gone', isIrregular: true },
      { baseForm: 'come', pastSimple: 'came', pastParticiple: 'come', isIrregular: true },
      { baseForm: 'know', pastSimple: 'knew', pastParticiple: 'known', isIrregular: true },
      { baseForm: 'think', pastSimple: 'thought', pastParticiple: 'thought', isIrregular: true },
      { baseForm: 'say', pastSimple: 'said', pastParticiple: 'said', isIrregular: true },
      { baseForm: 'tell', pastSimple: 'told', pastParticiple: 'told', isIrregular: true },
      { baseForm: 'write', pastSimple: 'wrote', pastParticiple: 'written', isIrregular: true },
      { baseForm: 'become', pastSimple: 'became', pastParticiple: 'become', isIrregular: true },
      { baseForm: 'begin', pastSimple: 'began', pastParticiple: 'begun', isIrregular: true },
    ],
    [Language.FRENCH]: [
      { baseForm: 'être', pastSimple: 'fus', pastParticiple: 'été', isIrregular: true },
      { baseForm: 'avoir', pastSimple: 'eus', pastParticiple: 'eu', isIrregular: true },
      { baseForm: 'faire', pastSimple: 'fis', pastParticiple: 'fait', isIrregular: true },
      { baseForm: 'aller', pastSimple: 'allai', pastParticiple: 'allé', isIrregular: true },
      { baseForm: 'venir', pastSimple: 'vins', pastParticiple: 'venu', isIrregular: true },
      { baseForm: 'pouvoir', pastSimple: 'pus', pastParticiple: 'pu', isIrregular: true },
      { baseForm: 'vouloir', pastSimple: 'voulus', pastParticiple: 'voulu', isIrregular: true },
      { baseForm: 'savoir', pastSimple: 'sus', pastParticiple: 'su', isIrregular: true },
      { baseForm: 'voir', pastSimple: 'vis', pastParticiple: 'vu', isIrregular: true },
      { baseForm: 'prendre', pastSimple: 'pris', pastParticiple: 'pris', isIrregular: true },
    ],
    [Language.SPANISH]: [
      { baseForm: 'ser', pastSimple: 'fui', pastParticiple: 'sido', isIrregular: true },
      { baseForm: 'estar', pastSimple: 'estuve', pastParticiple: 'estado', isIrregular: true },
      { baseForm: 'tener', pastSimple: 'tuve', pastParticiple: 'tenido', isIrregular: true },
      { baseForm: 'hacer', pastSimple: 'hice', pastParticiple: 'hecho', isIrregular: true },
      { baseForm: 'ir', pastSimple: 'fui', pastParticiple: 'ido', isIrregular: true },
      { baseForm: 'venir', pastSimple: 'vine', pastParticiple: 'venido', isIrregular: true },
      { baseForm: 'poder', pastSimple: 'pude', pastParticiple: 'podido', isIrregular: true },
      { baseForm: 'decir', pastSimple: 'dije', pastParticiple: 'dicho', isIrregular: true },
      { baseForm: 'ver', pastSimple: 'vi', pastParticiple: 'visto', isIrregular: true },
    ],
    [Language.GERMAN]: [
      { baseForm: 'sein', pastSimple: 'war', pastParticiple: 'gewesen', isIrregular: true },
      { baseForm: 'haben', pastSimple: 'hatte', pastParticiple: 'gehabt', isIrregular: true },
      { baseForm: 'werden', pastSimple: 'wurde', pastParticiple: 'geworden', isIrregular: true },
      { baseForm: 'machen', pastSimple: 'machte', pastParticiple: 'gemacht', isIrregular: false },
      { baseForm: 'gehen', pastSimple: 'ging', pastParticiple: 'gegangen', isIrregular: true },
      { baseForm: 'kommen', pastSimple: 'kam', pastParticiple: 'gekommen', isIrregular: true },
      { baseForm: 'sehen', pastSimple: 'sah', pastParticiple: 'gesehen', isIrregular: true },
      { baseForm: 'wissen', pastSimple: 'wusste', pastParticiple: 'gewusst', isIrregular: true },
    ],
    [Language.ITALIAN]: [
      { baseForm: 'essere', pastSimple: 'fui', pastParticiple: 'stato', isIrregular: true },
      { baseForm: 'avere', pastSimple: 'ebbi', pastParticiple: 'avuto', isIrregular: true },
      { baseForm: 'fare', pastSimple: 'feci', pastParticiple: 'fatto', isIrregular: true },
      { baseForm: 'andare', pastSimple: 'andai', pastParticiple: 'andato', isIrregular: true },
      { baseForm: 'venire', pastSimple: 'venni', pastParticiple: 'venuto', isIrregular: true },
      { baseForm: 'potere', pastSimple: 'potei', pastParticiple: 'potuto', isIrregular: true },
      { baseForm: 'volere', pastSimple: 'volli', pastParticiple: 'voluto', isIrregular: true },
      { baseForm: 'sapere', pastSimple: 'seppi', pastParticiple: 'saputo', isIrregular: true },
    ]
  };

  const verbs = essentialVerbsByLanguage[language] || [];
  
  for (const verb of verbs) {
    await prisma.verbConjugation.upsert({
      where: { slug: `${language.toLowerCase()}-${verb.baseForm}` },
      update: verb,
      create: { ...verb, language, slug: `${language.toLowerCase()}-${verb.baseForm}` }
    });
  }
  
  if (verbs.length > 0) {
    console.log(`  ✓ Seeded ${verbs.length} verbs for ${language}`);
  }
}

// ==================== VOCABULARY SETS BY LANGUAGE ====================
async function seedVocabularySets(language) {
  const vocabByLanguage = {
    [Language.ENGLISH]: [
      {
        slug: 'english-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'Education & Learning',
        description: 'Essential vocabulary for discussing education, schooling, and academic achievement.',
        bacContext: 'Module 2: Education Matters',
        items: [
          { word: 'curriculum', definition: 'the subjects comprising a course of study', partOfSpeech: 'noun', exampleSentence: 'The school offers a broad curriculum.', bacExample: 'The Bac curriculum covers multiple languages.' },
          { word: 'literacy', definition: 'the ability to read and write', partOfSpeech: 'noun', exampleSentence: 'Literacy rates have improved significantly.', bacExample: 'Digital literacy is essential in modern education.' },
          { word: 'tuition', definition: 'teaching or instruction, especially of individual students or small groups', partOfSpeech: 'noun', exampleSentence: 'He received private tuition in mathematics.', bacExample: 'Tuition fees are a concern for many families.' },
          { word: 'pedagogy', definition: 'the method and practice of teaching', partOfSpeech: 'noun', exampleSentence: 'Modern pedagogy emphasizes student-centered learning.', bacExample: 'Effective pedagogy requires understanding student needs.' },
        ]
      },
      {
        slug: 'english-technology-vocab',
        theme: VocabTheme.TECHNOLOGY,
        title: 'Technology & Digital World',
        description: 'Vocabulary for discussing technological advancement, social media, and digital transformation.',
        bacContext: 'Module 3: Creative Inventive Minds',
        items: [
          { word: 'innovation', definition: 'the introduction of new methods, ideas, or products', partOfSpeech: 'noun', exampleSentence: 'Technological innovation drives economic growth.', bacExample: 'Innovation in education has transformed learning methods.' },
          { word: 'algorithm', definition: 'a process or set of rules for calculation or problem-solving', partOfSpeech: 'noun', exampleSentence: 'Social media platforms use algorithms to recommend content.', bacExample: 'Understanding algorithms helps students navigate digital information.' },
          { word: 'digital divide', definition: 'the gap between those who have access to technology and those who do not', partOfSpeech: 'noun', exampleSentence: 'The digital divide affects educational opportunities.', bacExample: 'Bridging the digital divide is essential for equal education.' },
          { word: 'artificial intelligence', definition: 'the simulation of human intelligence by computer systems', partOfSpeech: 'noun', exampleSentence: 'AI is transforming many industries.', bacExample: 'Artificial intelligence raises questions about the future of work.' },
        ]
      }
    ],
    [Language.FRENCH]: [
      {
        slug: 'french-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'Éducation et Apprentissage',
        description: 'Vocabulaire essentiel pour discuter de l\'éducation et de la formation.',
        bacContext: 'Module 2: Education Matters',
        items: [
          { word: 'scolarité', definition: 'ensemble de la vie d\'élève ou d\'étudiant', partOfSpeech: 'nom', exampleSentence: 'La scolarité est obligatoire jusqu\'à 16 ans.', bacExample: 'La scolarité au lycée prépare au Bac.' },
          { word: 'enseignement', definition: 'action d\'enseigner, de transmettre des connaissances', partOfSpeech: 'nom', exampleSentence: 'L\'enseignement supérieur offre de nombreuses options.', bacExample: 'L\'enseignement traditionnel évolue avec la technologie.' },
          { word: 'savoir', definition: 'connaissance acquise par l\'étude, l\'expérience', partOfSpeech: 'nom', exampleSentence: 'Le savoir est une richesse précieuse.', bacExample: 'Le savoir critique se développe à l\'école.' },
          { word: 'formation', definition: 'action de former, d\'apprendre un métier ou une compétence', partOfSpeech: 'nom', exampleSentence: 'La formation continue est importante.', bacExample: 'La formation professionnelle offre des alternatives au Bac.' },
        ]
      }
    ],
    [Language.ARABIC]: [
      {
        slug: 'arabic-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'المفردات التعليمية',
        description: 'المصطلحات الأساسية للحديث عن التعليم والتربية.',
        bacContext: 'البرنامج الرسمي للباكالوريا',
        items: [
          { word: 'تعليم', definition: 'نقل المعرفة والمهارات', partOfSpeech: 'اسم', exampleSentence: 'التعليم أساس التقدم.', bacExample: 'التعليم الجيد يضمن مستقبل الشباب.' },
          { word: 'معرفة', definition: 'العلم والفهم', partOfSpeech: 'اسم', exampleSentence: 'المعرفة نور والجهل ظلام.', bacExample: 'المعرفة منهجية ضرورية للتفكير.' },
          { word: 'تفكير', definition: 'عملية التأمل والتحليل', partOfSpeech: 'اسم', exampleSentence: 'التفكير النقدي مهم للنجاح.', bacExample: 'التفكير العلمي محور في الباكالوريا.' },
          { word: 'ثقافة', definition: 'كل ما يكتسبه الإنسان من علوم وفنون', partOfSpeech: 'اسم', exampleSentence: 'الثقافة توسع الآفاق.', bacExample: 'التنوير الثقافي هدف من أهداف التعليم.' },
        ]
      }
    ],
    [Language.SPANISH]: [
      {
        slug: 'spanish-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'Educación y Aprendizaje',
        description: 'Vocabulario esencial para hablar sobre educación y formación.',
        bacContext: 'Bachillerato: Educación',
        items: [
          { word: 'enseñanza', definition: 'acción de enseñar o instruir', partOfSpeech: 'sustantivo', exampleSentence: 'La enseñanza de calidad es fundamental.', bacExample: 'La enseñanza tradicional está cambiando.' },
          { word: 'conocimiento', definition: 'saber adquirido por el estudio o la experiencia', partOfSpeech: 'sustantivo', exampleSentence: 'El conocimiento es poder.', bacExample: 'El conocimiento crítico se desarrolla en el bachillerato.' },
          { word: 'alfabetización', definition: 'capacidad de leer y escribir', partOfSpeech: 'sustantivo', exampleSentence: 'La alfabetización digital es importante hoy.', bacExample: 'La alfabetización es un derecho básico.' },
          { word: 'pedagogía', definition: 'arte de enseñar, método educativo', partOfSpeech: 'sustantivo', exampleSentence: 'La pedagogía moderna es participativa.', bacExample: 'Una buena pedagogía motiva a los estudiantes.' },
        ]
      }
    ],
    [Language.GERMAN]: [
      {
        slug: 'german-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'Bildung und Lernen',
        description: 'Wortschatz für Diskussionen über Bildung und Ausbildung.',
        bacContext: 'Abitur: Bildung',
        items: [
          { word: 'Bildung', definition: 'Erwerb von Wissen und Fähigkeiten', partOfSpeech: 'Substantiv', exampleSentence: 'Bildung ist der Schlüssel zum Erfolg.', bacExample: 'Die Bildung bereitet auf das Abitur vor.' },
          { word: 'Wissen', definition: 'durch Lernen erworbene Kenntnisse', partOfSpeech: 'Substantiv', exampleSentence: 'Wissen ist Macht.', bacExample: 'Wissen allein reicht nicht, Anwendung ist wichtig.' },
          { word: 'Lernen', definition: 'Prozess des Wissenserwerbs', partOfSpeech: 'Substantiv', exampleSentence: 'Lebenslanges Lernen ist wichtig.', bacExample: 'Effektives Lernen erfordert Strategien.' },
          { word: 'Lehrplan', definition: 'offizieller Plan des Unterrichts', partOfSpeech: 'Substantiv', exampleSentence: 'Der Lehrplan wurde aktualisiert.', bacExample: 'Der Lehrplan für das Abitur ist umfassend.' },
        ]
      }
    ],
    [Language.ITALIAN]: [
      {
        slug: 'italian-education-vocab',
        theme: VocabTheme.EDUCATION,
        title: 'Istruzione e Apprendimento',
        description: 'Vocabolario essenziale per parlare di istruzione e formazione.',
        bacContext: 'Maturità: Istruzione',
        items: [
          { word: 'istruzione', definition: 'azione di istruire, insegnare', partOfSpeech: 'sostantivo', exampleSentence: 'L\'istruzione è un diritto fondamentale.', bacExample: 'L\'istruzione di qualità prepara alla Maturità.' },
          { word: 'conoscenza', definition: 'sapere acquisito con lo studio', partOfSpeech: 'sostantivo', exampleSentence: 'La conoscenza illumina la mente.', bacExample: 'La conoscenza critica si sviluppa a scuola.' },
          { word: 'alfabetizzazione', definition: 'capacità di leggere e scrivere', partOfSpeech: 'sostantivo', exampleSentence: 'L\'alfabetizzazione digitale è fondamentale.', bacExample: 'L\'alfabetizzazione è la base dell\'istruzione.' },
          { word: 'pedagogia', definition: 'scienza dell\'educazione', partOfSpeech: 'sostantivo', exampleSentence: 'La pedagogia moderna è innovativa.', bacExample: 'La pedagogia influenza i metodi di insegnamento.' },
        ]
      }
    ]
  };

  const vocabSets = vocabByLanguage[language] || [];
  
  for (const set of vocabSets) {
    const vocabSet = await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: {
        theme: set.theme,
        title: set.title,
        description: set.description,
        bacContext: set.bacContext
      },
      create: {
        slug: set.slug,
        theme: set.theme,
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
        language
      }
    });

    // Seed vocab items
    for (const item of set.items) {
      await prisma.vocabItem.upsert({
        where: { 
          word_vocabularySetId: {
            word: item.word,
            vocabularySetId: vocabSet.id
          }
        },
        update: item,
        create: { ...item, vocabularySetId: vocabSet.id }
      });
    }
  }
  
  if (vocabSets.length > 0) {
    console.log(`  ✓ Seeded ${vocabSets.length} vocabulary sets for ${language}`);
  }
}

// ==================== READING PASSAGES ====================
async function seedReadingPassages(language) {
  const passagesByLanguage = {
    [Language.ENGLISH]: [
      {
        slug: 'english-education-system',
        title: 'The Evolution of Education',
        passageType: 'ARTICLE',
        content: 'Education has undergone a remarkable transformation over the past century. From traditional classroom settings to digital learning platforms, the way we acquire knowledge has fundamentally changed. In many countries, including Tunisia, the baccalaureate remains a crucial milestone, representing years of dedication and academic achievement. However, critics argue that standardized testing does not adequately measure a student\'s true potential or creativity. The challenge for modern educators is to balance traditional academic rigor with the skills needed for the 21st century: critical thinking, digital literacy, and adaptability. As technology continues to reshape our world, the question remains: How can education systems evolve to prepare students for jobs that don\'t yet exist?',
        wordCount: 108,
        themes: ['education', 'technology', 'future'],
        bacRelevance: 'Module 2: Education Matters - Debate on modern education systems',
        comprehensionQuestions: [
          { question: 'What does the baccalaureate represent according to the passage?', answer: 'Years of dedication and academic achievement' },
          { question: 'What do critics say about standardized testing?', answer: 'It does not adequately measure a student\'s true potential or creativity' }
        ]
      }
    ],
    [Language.FRENCH]: [
      {
        slug: 'french-numerique-societe',
        title: 'Le Numérique Transforme la Société',
        passageType: 'ARTICLE',
        content: 'La révolution numérique a profondément modifié notre façon de vivre, de travailler et d\'apprendre. Au Tunisie comme ailleurs, les jeunes passent de plus en plus de temps sur les réseaux sociaux et les plateformes numériques. Cette transformation offre des opportunités considérables pour l\'éducation : accès à des ressources illimitées, cours en ligne, collaboration à distance. Cependant, elle pose aussi des défis majeurs : la fracture numérique, l\'addiction aux écrans, la désinformation. Les parents et les enseignants se demandent comment accompagner cette génération connectée tout en préservant l\'esprit critique et la concentration nécessaire aux études. Le défi du siècle sera de réussir une intégration harmonieuse de la technologie dans nos vies.',
        wordCount: 104,
        themes: ['technologie', 'société', 'éducation'],
        bacRelevance: 'Module 3: Creative Inventive Minds - Impact du numérique',
        comprehensionQuestions: [
          { question: 'Quels sont les avantages du numérique pour l\'éducation?', answer: 'Accès à des ressources illimitées, cours en ligne, collaboration à distance' },
          { question: 'Quels défis pose la révolution numérique?', answer: 'La fracture numérique, l\'addiction aux écrans, la désinformation' }
        ]
      }
    ],
    [Language.ARABIC]: [
      {
        slug: 'arabic-environment',
        title: 'حماية البيئة مسؤولية مشتركة',
        passageType: 'ARTICLE',
        content: 'تعد مشكلة التلوث البيئي من أهم القضايا التي تواجه العالم في القرن الحادي والعشرين. فقد أصبحت البيئة مهددة بفعل التصنيع المفرط والتلوث الناجم عن الاستهلاك البشري. وفي تونس كما في غيرها من البلدان، أصبحت حماية المحيط قضية وطنية تستدعي تضافر جهود الجميع. فالحفاظ على نظافة الشواطئ وفرز النفايات وترشيد استهلاك الطاقة ليست مسؤولية الدولة وحسب، بل مسؤولية كل مواطن. إن التربية البيئية يجب أن تبدأ من المدرسة، حيث يتعلم الأطفال أهمية الحفاظ على البيئة للأجيال القادمة. والسؤال المطروح: كيف يمكننا الموازنة بين التنمية الاقتصادية وحماية البيئة؟',
        wordCount: 112,
        themes: ['البيئة', 'التنمية', 'المسؤولية'],
        bacRelevance: 'محور البيئة والمحيط - برنامج الباكالوريا',
        comprehensionQuestions: [
          { question: 'ما هي القضايا البيئية المذكورة في النص؟', answer: 'التلوث، التصنيع المفرط، الاستهلاك البشري' },
          { question: 'من تتحمل مسؤولية حماية البيئة؟', answer: 'الدولة وكل مواطن' }
        ]
      }
    ]
  };

  const passages = passagesByLanguage[language] || [];
  
  for (const passage of passages) {
    await prisma.readingPassage.upsert({
      where: { slug: passage.slug },
      update: passage,
      create: { ...passage, language }
    });
  }
  
  if (passages.length > 0) {
    console.log(`  ✓ Seeded ${passages.length} reading passages for ${language}`);
  }
}

// Run the seed
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
