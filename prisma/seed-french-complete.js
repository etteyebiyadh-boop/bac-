const { PrismaClient, Language, GrammarCategory, VocabTheme, BacModule, Difficulty } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * FRENCH LANGUAGE CONTENT FOR TUNISIAN BAC
 * Complete grammar, vocabulary, and lessons for French section students
 */

async function main() {
  console.log('🇫🇷 Seeding French BAC Content...\n');

  await seedFrenchGrammarRules();
  await seedFrenchVocabulary();
  await seedFrenchVerbs();
  await seedFrenchLessons();

  console.log('\n✅ French Content Seeded Successfully!');
}

// ==========================================
// FRENCH GRAMMAR RULES
// ==========================================

async function seedFrenchGrammarRules() {
  console.log('📘 Creating French Grammar Rules...');

  const frenchGrammarRules = [
    // MODULE 1: HOLIDAYING & ART SHOWS
    {
      slug: 'french-present-indicative',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
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
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'french-passe-compose',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.TENSES,
      title: 'Passé composé',
      rule: 'Action ponctuelle terminée dans le passé.',
      formula: 'Auxiliaire (avoir/être) + participe passé',
      examples: [
        { 'avoir': 'J\'ai voyagé, tu as visité, il a découvert' },
        { 'être': 'Je suis allé(e), tu es arrivé(e), il est parti' }
      ],
      exceptions: ['Accord du participe passé avec l\'auxiliaire être', 'Accord avec l\'objet direct avant le verbe avec avoir'],
      usageNotes: 'Essentiel pour raconter des expériences de voyage et des souvenirs.',
      commonErrors: ['Mauvais choix de l\'auxiliaire', 'Oubli de l\'accord du participe passé'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-imparfait',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.TENSES,
      title: 'Imparfait',
      rule: 'Description, habitude, action en cours dans le passé.',
      formula: 'Radical du nous au présent + terminaisons (-ais, -ais, -ait, -ions, -iez, -aient)',
      examples: [
        { example: 'Nous parlons → je parlais, tu parlais, il parlait, nous parlions, vous parliez, ils parlaient' }
      ],
      exceptions: ['Être: j\'étais (radical ét-)'],
      usageNotes: 'Utilisé pour décrire des situations dans le passé, des souvenirs d\'enfance.',
      commonErrors: ['Confusion avec le passé composé', 'Mauvais radical'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-subjunctive-present',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      category: GrammarCategory.TENSES,
      title: 'Subjonctif présent',
      rule: 'Exprime le doute, la possibilité, le souhait, la nécessité.',
      formula: 'Radical du ils au présent + terminaisons (-e, -es, -e, -ions, -iez, -ent)',
      examples: [
        { example: 'Il faut que je parte, je veux que tu réussisses, bien qu\'il soit tard' }
      ],
      exceptions: ['Verbes irréguliers: aller (aille), faire (fasse), pouvoir (puisse), savoir (sache)'],
      usageNotes: 'Obligatoire après expressions comme "il faut que", "je veux que", "bien que", "pour que".',
      commonErrors: ['Oubli du subjonctif après les locutions impersonnelles', 'Mauvaise terminaison'],
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'french-future-simple',
      bacModule: BacModule.MODULE_4_YOUTH_ISSUES,
      category: GrammarCategory.TENSES,
      title: 'Futur simple',
      rule: 'Action à venir, prédiction, promesse.',
      formula: 'Infinitif + terminaisons (-ai, -as, -a, -ons, -ez, -ont)',
      examples: [
        { regular: 'Je parlerai, tu travailleras, il réussira' },
        { irregular: 'J\'irai, tu seras, il faudra, nous aurons' }
      ],
      exceptions: ['Verbes irréguliers: être (ser-), avoir (aur-), aller (ir-), faire (fer-), pouvoir (pourr-)'],
      usageNotes: 'Utilisé pour projets futurs, espoirs des jeunes, prédictions.',
      commonErrors: ['Confusion des radicaux irréguliers', 'Oubli du double r dans les verbes en -er'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-conditional-present',
      bacModule: BacModule.MODULE_5_WOMEN_POWER,
      category: GrammarCategory.TENSES,
      title: 'Conditionnel présent',
      rule: 'Politesse, hypothèse, souhait, conseil.',
      formula: 'Radical du futur + terminaisons de l\'imparfait (-ais, -ais, -ait, -ions, -iez, -aient)',
      examples: [
        { example: 'Je voudrais, tu aimerais, il faudrait, nous devrions' }
      ],
      exceptions: ['Mêmes radicaux irréguliers que le futur'],
      usageNotes: 'Essentiel pour exprimer des souhaits, des possibilités, donner des conseils.',
      commonErrors: ['Confusion avec l\'imparfait', 'Mauvais radical'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-pronouns-relative',
      bacModule: BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT,
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Pronoms relatifs (qui, que, où, dont)',
      rule: 'Qui = sujet, que = complément d\'objet direct, où = temps/lieu, dont = de + chose/personne.',
      formula: 'Antécédent + qui/que/où/dont + proposition relative',
      examples: [
        { qui: 'L\'environnement qui nous entoure', que: 'Les défis que nous devons relever' },
        { ou: 'L\'époque où nous vivons', dont: 'Les ressources dont nous avons besoin' }
      ],
      exceptions: ['Lequel, auquel, duquel pour préciser (parmi plusieurs)'],
      usageNotes: 'Indispensable pour lier les phrases et créer des textes fluides.',
      commonErrors: ['Confusion entre qui et que', 'Oubli de dont'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-pronouns-demonstrative',
      bacModule: BacModule.MODULE_7_WORK_COMMITMENT,
      category: GrammarCategory.ARTICLES,
      title: 'Pronoms démonstratifs (celui, celle, ceux, celles)',
      rule: 'Remplace un nom précisé par une relative ou un complément.',
      formula: 'Celui/celle/ceux/celles (+ ci / + là) + de + nom ou + qui/que/dont',
      examples: [
        { example: 'Ceux qui travaillent dur réussissent', example2: 'Celle de mon entreprise est mieux' }
      ],
      exceptions: ['Celui-ci / celui-là pour distinguer deux éléments'],
      usageNotes: 'Évite les répétitions dans les textes argumentatifs sur le travail.',
      commonErrors: ['Oubli du -ci ou -là quand nécessaire', 'Mauvais accord'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-connectors-logic',
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS,
      category: GrammarCategory.CONNECTORS,
      title: 'Connecteurs logiques (addition, opposition, cause, conséquence)',
      rule: 'Organisent le raisonnement et améliorent la cohérence du texte.',
      formula: 'Addition: de plus, en outre, également | Opposition: cependant, néanmoins, toutefois | Cause: car, puisque, en effet | Conséquence: donc, ainsi, par conséquent',
      examples: [
        { addition: 'L\'auteur décrit le paysage; de plus, il analyse les sentiments.' },
        { opposition: 'Le personnage semble calme; cependant, il cache une grande colère.' },
        { cause: 'L\'héros échoue, car il n\'a pas écouté les conseils.' },
        { consequence: 'Il fait preuve de courage; ainsi, il triomphe à la fin.' }
      ],
      exceptions: ['Attention à la ponctuation: point-virgule avant les connecteurs de opposition/cause/conséquence'],
      usageNotes: 'Essentiels pour l\'analyse littéraire et les commentaires composés.',
      commonErrors: ['Mauvaise utilisation des connecteurs', 'Ponctuation incorrecte'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    }
  ];

  for (const rule of frenchGrammarRules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: { ...rule, language: Language.FRENCH }
    });
  }

  console.log(`✅ Created ${frenchGrammarRules.length} French Grammar Rules`);
}

// ==========================================
// FRENCH VOCABULARY SETS
// ==========================================

async function seedFrenchVocabulary() {
  console.log('\n📚 Creating French Vocabulary Sets...');

  const frenchVocabSets = [
    {
      slug: 'french-module-1-voyage',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      theme: VocabTheme.TRAVEL,
      title: 'Français - Module 1: Voyage et Tourisme',
      description: 'Vocabulaire essentiel pour parler de voyage, tourisme et vacances.',
      bacContext: 'Ce vocabulaire apparaît dans les textes du BAC sur le tourisme et les expériences culturelles.',
      items: [
        { word: 'séjour', definition: 'Période passée dans un lieu', partOfSpeech: 'nom masculin', exampleSentence: 'Nous avons passé un séjour agréable à Paris.', bacExample: 'Les touristes choisissent la Tunisie pour leur séjour estival.', collocations: ['passer un séjour', 'séjour touristique'] },
        { word: 'découverte', definition: 'Action de trouver, de rencontrer pour la première fois', partOfSpeech: 'nom féminin', exampleSentence: 'Ce voyage a été une vraie découverte.', bacExample: 'La découverte de nouvelles cultures enrichit l\'esprit.', collocations: ['faire une découverte', 'découverte culturelle'] },
        { word: 'paysage', definition: 'Aspect d\'une région, vue naturelle', partOfSpeech: 'nom masculin', exampleSentence: 'Les paysages de montagne sont magnifiques.', bacExample: 'Les paysages tunisiens attirent des visiteurs du monde entier.', collocations: ['paysage naturel', 'admirer le paysage'] },
        { word: 'souvenir', definition: 'Mémoire, objet ramené d\'un voyage', partOfSpeech: 'nom masculin', exampleSentence: 'J\'ai acheté un souvenir pour ma mère.', bacExample: 'Ce voyage restera un souvenir inoubliable.', collocations: ['souvenir de', 'ramener un souvenir'] },
        { word: 'hébergement', definition: 'Lieu où l\'on loge', partOfSpeech: 'nom masculin', exampleSentence: 'Nous cherchons un hébergement pas cher.', bacExample: 'L\'hébergement touristique en Tunisie est diversifié.', collocations: ['trouver un hébergement', 'hébergement de qualité'] },
        { word: 'excursion', definition: 'Voyage d\'agrément, courte sortie', partOfSpeech: 'nom féminin', exampleSentence: 'Nous avons fait une excursion dans le désert.', bacExample: 'Les excursions organisées permettent de découvrir la région.', collocations: ['faire une excursion', 'excursion guidée'] },
        { word: 'patrimoine', definition: 'Biens culturels transmis par les ancêtres', partOfSpeech: 'nom masculin', exampleSentence: 'Le patrimoine historique doit être protégé.', bacExample: 'Le patrimoine culturel tunisien est riche et diversifié.', collocations: ['patrimoine culturel', 'patrimoine mondial'] },
        { word: 'animation', definition: 'Ensemble des activités proposées', partOfSpeech: 'nom féminin', exampleSentence: 'L\'animation du village vacances est excellente.', bacExample: 'L\'animation culturelle attire les visiteurs.', collocations: ['animation culturelle', 'programme d\'animation'] },
        { word: 'croisière', definition: 'Voyage en mer, circuit sur un navire', partOfSpeech: 'nom féminin', exampleSentence: 'Nous avons réservé une croisière en Méditerranée.', bacExample: 'Les croisières en Tunisie sont très prisées.', collocations: ['faire une croisière', 'croisière touristique'] },
        { word: 'gastronomie', definition: 'Art de la cuisine, cuisine d\'une région', partOfSpeech: 'nom féminin', exampleSentence: 'La gastronomie française est réputée.', bacExample: 'La gastronomie tunisienne séduit les palais étrangers.', collocations: ['gastronomie locale', 'découvrir la gastronomie'] }
      ]
    },
    {
      slug: 'french-module-2-education',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      theme: VocabTheme.EDUCATION,
      title: 'Français - Module 2: Éducation et Formation',
      description: 'Vocabulaire académique pour discuter de l\'éducation et des études.',
      bacContext: 'Essentiel pour les rédactions et les textes argumentatifs sur l\'éducation.',
      items: [
        { word: 'apprentissage', definition: 'Action d\'apprendre, acquisition de connaissances', partOfSpeech: 'nom masculin', exampleSentence: 'L\'apprentissage des langues demande de la pratique.', bacExample: 'L\'apprentissage tout au long de la vie est essentiel.', collocations: ['apprentissage scolaire', 'faciliter l\'apprentissage'] },
        { word: 'connaissance', definition: 'Ce que l\'on sait, savoir acquis', partOfSpeech: 'nom féminin', exampleSentence: 'Il a une grande connaissance de l\'histoire.', bacExample: 'L\'école transmet des connaissances fondamentales.', collocations: ['acquérir des connaissances', 'connaissance approfondie'] },
        { word: 'réussite', definition: 'Action de réussir, succès', partOfSpeech: 'nom féminin', exampleSentence: 'Sa réussite au BAC est méritée.', bacExample: 'La réussite scolaire dépend de nombreux facteurs.', collocations: ['réussite scolaire', 'assurer la réussite'] },
        { word: 'méthode', definition: 'Manière d\'apprendre ou d\'enseigner', partOfSpeech: 'nom féminin', exampleSentence: 'Chaque professeur a sa méthode.', bacExample: 'Les méthodes pédagogiques évoluent avec le temps.', collocations: ['méthode de travail', 'méthode efficace'] },
        { word: 'enseignement', definition: 'Action d\'enseigner, éducation', partOfSpeech: 'nom masculin', exampleSentence: 'L\'enseignement supérieur est accessible à tous.', bacExample: 'L\'enseignement tunisien a besoin de réformes.', collocations: ['enseignement primaire', 'système d\'enseignement'] },
        { word: 'comportement', definition: 'Manière de se comporter', partOfSpeech: 'nom masculin', exampleSentence: 'Son comportement en classe est exemplaire.', bacExample: 'Le comportement des élèves influence l\'apprentissage.', collocations: ['comportement scolaire', 'bon comportement'] },
        { word: 'discipline', definition: 'Matière enseignée, ordre dans une classe', partOfSpeech: 'nom féminin', exampleSentence: 'La discipline est nécessaire pour apprendre.', bacExample: 'Les disciplines scientifiques attirent moins d\'étudiants.', collocations: ['discipline scolaire', 'maintenir la discipline'] },
        { word: 'évaluation', definition: 'Jugement sur la valeur d\'un travail', partOfSpeech: 'nom féminin', exampleSentence: 'L\'évaluation continue permet de progresser.', bacExample: 'L\'évaluation des compétences est essentielle.', collocations: ['évaluation des acquis', 'système d\'évaluation'] },
        { word: 'formation', definition: 'Action de former, apprentissage professionnel', partOfSpeech: 'nom féminin', exampleSentence: 'La formation professionnelle ouvre des débouchés.', bacExample: 'La formation continue est obligatoire dans certains métiers.', collocations: ['formation professionnelle', 'suivre une formation'] },
        { word: 'intellectuel', definition: 'Relatif à l\'intelligence, personne cultivée', partOfSpeech: 'adjectif/nom', exampleSentence: 'Le développement intellectuel est important.', bacExample: 'Le travail intellectuel demande de la concentration.', collocations: ['développement intellectuel', 'travail intellectuel'] }
      ]
    }
  ];

  for (const set of frenchVocabSets) {
    await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: {
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
      },
      create: {
        slug: set.slug,
        language: Language.FRENCH,
        bacModule: set.bacModule,
        theme: set.theme,
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
        difficulty: Difficulty.MEDIUM,
        isCommon: true
      }
    });

    for (const item of set.items) {
      const vocabSet = await prisma.vocabularySet.findUnique({ where: { slug: set.slug } });
      if (vocabSet) {
        await prisma.vocabItem.create({
          data: {
            vocabularySetId: vocabSet.id,
            word: item.word,
            definition: item.definition,
            partOfSpeech: item.partOfSpeech,
            exampleSentence: item.exampleSentence,
            bacExample: item.bacExample,
            collocations: item.collocations,
            difficulty: Difficulty.MEDIUM
          }
        });
      }
    }
  }

  console.log(`✅ Created ${frenchVocabSets.length} French Vocabulary Sets`);
}

// ==========================================
// FRENCH VERBS
// ==========================================

async function seedFrenchVerbs() {
  console.log('\n🔤 Creating French Verb Conjugations...');

  const frenchVerbs = [
    {
      slug: 'french-etre',
      baseForm: 'être',
      pastSimple: 'fus/fus/fut/fûmes/fûtes/furent',
      pastParticiple: 'été',
      presentParticiple: 'étant',
      thirdPersonSingular: 'est',
      isIrregular: true,
      fullConjugation: {
        present: { je: 'suis', tu: 'es', il: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont' },
        passe_compose: { je: 'ai été', il: 'a été', nous: 'avons été' },
        imparfait: { je: 'étais', il: 'était', nous: 'étions' },
        futur: { je: 'serai', il: 'sera', nous: 'serons' },
        subjonctif: { que_je: 'sois', qu_il: 'soit', que_nous: 'soyons' }
      },
      commonUses: ['État, identité', 'Description', 'Auxiliaire pour le passé composé'],
      exampleSentences: ['Je suis étudiant.', 'Elle est arrivée hier.', 'Nous sommes en Tunisie.'],
      collocations: ['être en train de', 'être sur le point de']
    },
    {
      slug: 'french-avoir',
      baseForm: 'avoir',
      pastSimple: 'eus/eus/eut/eûmes/eûtes/eurent',
      pastParticiple: 'eu',
      presentParticiple: 'ayant',
      thirdPersonSingular: 'a',
      isIrregular: true,
      fullConjugation: {
        present: { j: 'ai', tu: 'as', il: 'a', nous: 'avons', vous: 'avez', ils: 'ont' },
        passe_compose: { j: 'ai eu', il: 'a eu', nous: 'avons eu' },
        imparfait: { j: 'avais', il: 'avait', nous: 'avions' },
        futur: { j: 'aurai', il: 'aura', nous: 'aurons' },
        subjonctif: { que_j: 'aie', qu_il: 'ait', que_nous: 'ayons' }
      },
      commonUses: ['Possession', 'Auxiliaire pour le passé composé', 'Expressions (avoir faim/soif/peur)'],
      exampleSentences: ['J\'ai un examen demain.', 'Il a réussi son BAC.', 'Nous avons faim.'],
      collocations: ['avoir besoin de', 'avoir envie de', 'avoir peur de']
    },
    {
      slug: 'french-aller',
      baseForm: 'aller',
      pastSimple: 'allai/allas/alla/allâmes/allâtes/allèrent',
      pastParticiple: 'allé',
      presentParticiple: 'allant',
      thirdPersonSingular: 'va',
      isIrregular: true,
      fullConjugation: {
        present: { je: 'vais', tu: 'vas', il: 'va', nous: 'allons', vous: 'allez', ils: 'vont' },
        passe_compose: { je: 'suis allé(e)', il: 'est allé', nous: 'sommes allé(e)s' },
        imparfait: { j: 'allais', il: 'allait', nous: 'allions' },
        futur: { j: 'irai', il: 'ira', nous: 'irons' },
        subjonctif: { que_j: 'aille', qu_il: 'aille', que_nous: 'allions' }
      },
      commonUses: ['Mouvement', 'Futur proche (aller + infinitif)', 'Se rendre quelque part'],
      exampleSentences: ['Je vais à l\'école.', 'Nous allons réussir.', 'Elle est allée à Tunis.'],
      collocations: ['aller bien', 'aller chercher', 's\'en aller']
    },
    {
      slug: 'french-faire',
      baseForm: 'faire',
      pastSimple: 'fis/fis/fit/fîmes/fîtes/firent',
      pastParticiple: 'fait',
      presentParticiple: 'faisant',
      thirdPersonSingular: 'fait',
      isIrregular: true,
      fullConjugation: {
        present: { je: 'fais', tu: 'fais', il: 'fait', nous: 'faisons', vous: 'faites', ils: 'font' },
        passe_compose: { j: 'ai fait', il: 'a fait', nous: 'avons fait' },
        imparfait: { je: 'faisais', il: 'faisait', nous: 'faisions' },
        futur: { je: 'ferai', il: 'fera', nous: 'ferons' },
        subjonctif: { que_je: 'fasse', qu_il: 'fasse', que_nous: 'fassions' }
      },
      commonUses: ['Activité', 'Créer, produire', 'Expressions (faire attention/peur/plaisir)'],
      exampleSentences: ['Je fais mes devoirs.', 'Il fait beau aujourd\'hui.', 'Elle fait du sport.'],
      collocations: ['faire partie de', 'faire face à', 'faire semblant']
    },
    {
      slug: 'french-pouvoir',
      baseForm: 'pouvoir',
      pastSimple: 'pus/pus/put/pûmes/pûtes/purent',
      pastParticiple: 'pu',
      presentParticiple: 'pouvant',
      thirdPersonSingular: 'peut',
      isIrregular: true,
      fullConjugation: {
        present: { je: 'peux', tu: 'peux', il: 'peut', nous: 'pouvons', vous: 'pouvez', ils: 'peuvent' },
        passe_compose: { j: 'ai pu', il: 'a pu', nous: 'avons pu' },
        imparfait: { je: 'pouvais', il: 'pouvait', nous: 'pouvions' },
        futur: { je: 'pourrai', il: 'pourra', nous: 'pourrons' },
        subjonctif: { que_je: 'puisse', qu_il: 'puisse', que_nous: 'puissions' }
      },
      commonUses: ['Capacité, possibilité', 'Permission', 'Politesse (pourrais)'],
      exampleSentences: ['Je peux t\'aider?', 'Il a pu venir.', 'Pourriez-vous répéter?'],
      collocations: ['ne pas pouvoir', 'pouvoir de', 'se pouvoir']
    }
  ];

  for (const verb of frenchVerbs) {
    await prisma.verbConjugation.upsert({
      where: { slug: verb.slug },
      update: verb,
      create: { ...verb, language: Language.FRENCH, isRegular: !verb.isIrregular, difficulty: Difficulty.MEDIUM }
    });
  }

  console.log(`✅ Created ${frenchVerbs.length} French Verb Conjugations`);
}

// ==========================================
// FRENCH LESSONS
// ==========================================

async function seedFrenchLessons() {
  console.log('\n📚 Creating French Lessons...');

  const frenchLessons = [
    {
      slug: 'french-m1-redaction-voyage',
      language: Language.FRENCH,
      title: 'Rédaction: Raconter un voyage',
      summary: 'Apprendre à rédiger un récit de voyage structuré et descriptif.',
      body: `La rédaction d'un récit de voyage demande un équilibre entre description objective et ressenti personnel. Le BAC français évalue votre capacité à organiser un texte narratif cohérent.

**Structure du récit de voyage:**

1. **Introduction (2-3 phrases)**
   - Présentation du lieu et des circonstances du voyage
   - Annonce de l'objectif ou de l'attente initiale

2. **Développement (3-4 paragraphes)**
   - Description des lieux visités (utilisez des détails sensoriels)
   - Rencontres avec des habitants ou d'autres voyageurs
   - Découvertes et surprises
   - Difficultés rencontrées et solutions apportées

3. **Conclusion (2 phrases)**
   - Bilan de l'expérience
   - Évolution personnelle ou leçon tirée

**Vocabulaire utile:**
- Verbes: découvrir, explorer, déambuler, séjourner
- Adjectifs: enchanteur, pittoresque, authentique, dépaysant
- Connecteurs: d'abord, ensuite, finalement, pour conclure

**Exercice:**
Rédigez 150 mots sur un voyage que vous avez fait ou que vous aimeriez faire.`,
      theme: 'Récit de voyage',
      skillFocus: 'structure',
      difficulty: Difficulty.MEDIUM,
      estimatedMinutes: 20,
      takeawayJson: ['Organiser un récit chronologiquement', 'Mêler description et émotion', 'Utiliser le passé composé et l\'imparfait correctement'],
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS
    },
    {
      slug: 'french-m2-dissertation-education',
      language: Language.FRENCH,
      title: 'Dissertation: L\'éducation au défi',
      summary: 'Maîtriser la structure de la dissertation argumentative sur l\'éducation.',
      body: `La dissertation est l'épreuve roi du BAC français. Elle évalue votre capacité à construire un raisonnement logique et argumenté.

**Structure classique:**

**Introduction (10% du texte)**
- Accroche: citation, question, constat
- Définition des termes du sujet
- Problématique: question centrale
- Annonce de plan (2-3 parties)

**Développement (80% du texte)**
- Partie I: Argumentation avec exemples littéraires
- Partie II: Contre-argumentation puis réfutation
- Partie III: Dépassement ou perspective

**Conclusion (10% du texte)**
- Synthèse des arguments
- Ouverture vers un autre domaine

**Sujets fréquents sur l'éducation:**
- "L'éducation peut-elle tout apprendre?"
- "Faut-il obéir pour apprendre?"
- "La technologie transforme-t-elle l'enseignement?"

**Connecteurs argumentatifs:**
- Addition: de plus, en outre
- Opposition: cependant, toutefois
- Causalité: car, en effet, ainsi
- Conclusion: donc, par conséquent

**Exercice:**
Élaborez un plan détaillé sur le sujet: "L'école de la vie vaut-elle plus que l'école des livres?"`,
      theme: 'Dissertation',
      skillFocus: 'structure',
      difficulty: Difficulty.HARD,
      estimatedMinutes: 30,
      takeawayJson: ['Construire une problématique claire', 'Organiser en parties logiques', 'Utiliser des exemples précis'],
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS
    },
    {
      slug: 'french-m8-commentaire-compose',
      language: Language.FRENCH,
      title: 'Commentaire composé: Analyser un texte littéraire',
      summary: 'Méthodologie pour réussir le commentaire de texte au BAC.',
      body: `Le commentaire composé évalue votre capacité à analyser un texte littéraire en mobilisant vos connaissances.

**Méthodologie en 3 temps:**

**1. Lire et comprendre (10 minutes)**
- Identifier le genre (poésie, théâtre, roman)
- Repérer le thème principal
- Observer les particularités stylistiques

**2. Analyser et construire (15 minutes)**
- Trouver une problématique pertinente
- Repérer les effets de sens marquants
- Organiser en progression logique

**3. Rédiger (65 minutes)**
- Introduction: présentation + annonce de problématique + plan
- Développement: 3 parties avec 2 sous-parties chacune
- Conclusion: bilan + ouverture

**Grilles d'analyse:**
- Niveau lexical: registre, champ sémantique
- Syntaxe: types de phrases, procédés d'insistance
- Figures de style: métaphore, comparaison, hyperbole
- Rhythmique: versification, ponctuation, énumération

**Introduction type:**
"Ce texte est extrait de [titre] de [auteur], écrivain [caractéristiques]. Il s'agit d'un [genre] dont le thème principal est [thème]. Nous étudierons comment l'auteur [problématique]."

**Exercice:**
Analysez la structure de l'introduction ci-dessus et adaptez-la à un texte que vous connaissez.`,
      theme: 'Analyse littéraire',
      skillFocus: 'comprehension',
      difficulty: Difficulty.HARD,
      estimatedMinutes: 25,
      takeawayJson: ['Identifier les procédés littéraires', 'Construire une problématique précise', 'Analyser en profondeur, pas en largeur'],
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS
    }
  ];

  for (const lesson of frenchLessons) {
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lesson,
      create: lesson
    });
  }

  console.log(`✅ Created ${frenchLessons.length} French Lessons`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
