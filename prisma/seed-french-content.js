const { PrismaClient, Language, Difficulty } = require('@prisma/client');
const prisma = new PrismaClient();

const FRENCH_EXAMS = [
  {
    slug: 'bac-2025-principale-french',
    year: 2025,
    title: 'BAC 2025 Session Principale - Français',
    language: Language.FRENCH,
    prompt: 'Examen BAC Français: Texte argumentatif (Jeunesse et technologie) + Expression écrite (250-300 mots)',
    modelAnswer: 'Modèle de réponse complet: compréhension du texte sur les jeunes et la technologie, analyse argumentative, et dissertation avec introduction, deux parties et conclusion.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Les jeunes et la technologie: entre progrès et dépendance',
    readingContent: 'Les jeunes et la technologie: entre progrès et dépendance\n\nÀ l\'ère numérique, les adolescents passent en moyenne 7 à 8 heures par jour sur les réseaux sociaux. Cette hyperconnexion soulève des questions cruciales sur leur développement cognitif et social.\n\nD\'un côté, la technologie offre des opportunités d\'apprentissage et de créativité sans précédent. Les jeunes peuvent accéder à une quantité illimitée d\'informations et développer des compétences numériques essentielles.\n\nCependant, les dangers sont réels: cyberharcèlement, fausses informations, et addiction aux écrans. La Tunisie, comme d\'autres pays, doit trouver un équilibre entre innovation et protection de sa jeunesse.',
    methodology: 'Format BAC Tunisien: Lecture (12 pts), Expression écrite (8 pts), Grammaire (10 pts)'
  },
  {
    slug: 'bac-2024-principale-french',
    year: 2024,
    title: 'BAC 2024 Session Principale - Français',
    language: Language.FRENCH,
    prompt: 'Examen BAC Français: Texte littéraire (Extrait camusien) + Commentaire composé ou dissertation',
    modelAnswer: 'Modèle de réponse: analyse littéraire du texte, identification des figures de style, et dissertation sur l\'absurde ou la révolte.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'L\'étranger - Albert Camus',
    readingContent: 'L\'étranger - Albert Camus (Extrait)\n\n« Aujourd\'hui, maman est morte. Ou peut-être hier, je ne sais pas. »\n\nCette phrase d\'ouverture célèbre révèle immédiatement le détachement émotionnel du narrateur, Meursault. L\'indifférence apparente face à la mort de sa mère scandalisera la société et constituera l\'accusation principale lors de son procès.\n\nCamus explore ici le thème de l\'absurde: l\'homme confronté à un univers indifférent doit trouver son propre sens à l\'existence. La société, par sa condamnation de Meursault, révèle ses propres hypocrisies morales.',
    methodology: 'Format BAC Tunisien: Lecture (12 pts), Expression écrite (8 pts), Grammaire (10 pts)'
  }
];

const FRENCH_CONTENT = {
  grammarRules: [
    {
      slug: 'french-subjunctive',
      language: Language.FRENCH,
      category: 'TENSES',
      title: 'Le subjonctif présent',
      rule: 'Le subjonctif exprime un doute, une émotion, une volonté ou une nécessité',
      formula: 'que + je -e, tu -es, il -e, nous -ions, vous -iez, ils -ent',
      examples: JSON.stringify([
        { regular: 'parler → que je parle', irregular: 'être → que je sois, avoir → que j\'aie' },
        { context: 'Il faut que tu étudies', emotion: 'Je suis content qu\'il réussisse' }
      ]),
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'french-connector-words',
      language: Language.FRENCH,
      category: 'CONNECTORS',
      title: 'Connecteurs logiques pour la dissertation',
      rule: 'Les connecteurs assurent la cohérence et la progression de la pensée',
      formula: 'Introduction → Développement → Conclusion',
      examples: JSON.stringify([
        { introduction: 'Tout d\'abord, Premièrement, En premier lieu' },
        { opposition: 'Cependant, Néanmoins, En revanche, Par contre' },
        { conclusion: 'En conclusion, Pour conclure, En définitive' }
      ]),
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'french-passive-voice',
      language: Language.FRENCH,
      category: 'PASSIVE_VOICE',
      title: 'La voix passive',
      rule: 'Le sujet subit l\'action du verbe (être + participe passé)',
      formula: 'sujet + être + participe passé + par + agent',
      examples: JSON.stringify([
        { active: 'L\'étudiant réussit l\'examen', passive: 'L\'examen est réussi par l\'étudiant' },
        { pronominal: 'On dit que... → Il est dit que...' }
      ]),
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    }
  ],
  vocabSets: [
    {
      slug: 'french-bac-essay-vocabulary',
      language: Language.FRENCH,
      theme: 'EDUCATION',
      title: 'Vocabulaire académique pour la dissertation',
      description: 'Mots et expressions essentiels pour une dissertation de qualité BAC',
      bacContext: 'Tous types de sujets: société, éducation, technologie, environnement',
      items: [
        { word: 'd\'une part... d\'autre part', definition: 'pour structurer une comparaison', example: 'D\'une part, la technologie facilite la vie, d\'autre part, elle crée de nouveaux problèmes.' },
        { word: 'en dépit de', definition: 'malgré', example: 'En dépit des difficultés, il a réussi son examen.' },
        { word: 'sous l\'angle de', definition: 'du point de vue de', example: 'Analysons ce problème sous l\'angle économique.' },
        { word: 'il s\'ensuit que', definition: 'il en résulte que', example: 'Il s\'ensuit que cette politique est inefficace.' },
        { word: 'mettre en exergue', definition: 'souligner, mettre en évidence', example: 'L\'auteur met en exergue les inégalités sociales.' },
        { word: 'remettre en question', definition: 'critiquer, contester', example: 'Il faut remettre en question cette hypothèse.' },
        { word: 'à cet égard', definition: 'à ce sujet, sur ce point', example: 'À cet égard, les deux théories divergent.' },
        { word: 'en l\'état actuel des choses', definition: 'actuellement', example: 'En l\'état actuel des choses, cette solution n\'est pas viable.' }
      ]
    },
    {
      slug: 'french-literary-analysis',
      language: Language.FRENCH,
      theme: 'ARTS_ENTERTAINMENT',
      title: 'Vocabulaire de l\'analyse littéraire',
      description: 'Termes techniques pour le commentaire de texte littéraire',
      bacContext: 'Examen de français BAC, textes littéraires',
      items: [
        { word: 'le narrateur', definition: 'celui qui raconte l\'histoire', example: 'Le narrateur est omniscient dans ce roman.' },
        { word: 'le registre', definition: 'ton adopté (sérieux, lyrique, comique...)', example: 'L\'auteur emploie un registre pathétique.' },
        { word: 'la métaphore', definition: 'figure de comparaison implicite', example: '"La mer est un miroir" est une métaphore.' },
        { word: 'l\'anaphore', definition: 'répétition en début de phrase', example: 'L\'anaphore crée un effet d\'insistance.' },
        { word: 'l\'oxymore', definition: 'réunion de deux termes contraires', example: '"Une douce violence" est un oxymore.' }
      ]
    }
  ]
};

async function seed() {
  console.log('Seeding French BAC Content...\n');
  
  // Seed French Exams
  for (const exam of FRENCH_EXAMS) {
    await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: exam,
      create: exam
    });
    console.log(`✓ ${exam.title}`);
  }
  
  // Seed French Grammar Rules
  for (const rule of FRENCH_CONTENT.grammarRules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: rule
    });
    console.log(`✓ Grammar: ${rule.title}`);
  }
  
  // Seed French Vocabulary Sets
  for (const set of FRENCH_CONTENT.vocabSets) {
    const items = set.items;
    delete set.items;
    
    const vocabSet = await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: set,
      create: set
    });
    
    // Create vocab items
    for (const item of items) {
      const { example, ...itemData } = item;
      await prisma.vocabItem.createMany({
        data: {
          ...itemData,
          vocabularySetId: vocabSet.id,
          partOfSpeech: 'expression',
          exampleSentence: example,
          bacExample: example
        },
        skipDuplicates: true
      });
    }
    console.log(`✓ Vocab: ${set.title} (${items.length} expressions)`);
  }
  
  console.log(`\n✅ French BAC Content Seeded Successfully`);
  console.log(`   - ${FRENCH_EXAMS.length} French BAC Exams`);
  console.log(`   - ${FRENCH_CONTENT.grammarRules.length} Grammar Rules`);
  console.log(`   - ${FRENCH_CONTENT.vocabSets.length} Vocabulary Sets`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
