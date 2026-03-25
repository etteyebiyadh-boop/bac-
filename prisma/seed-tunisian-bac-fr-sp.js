const { PrismaClient, Language, BacModule, Difficulty, GrammarCategory, VocabTheme, PassageType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding French and Spanish Tunisian Baccalaureate curriculum data...');

  // ------------------------------------------------------------------------------------------------
  // FRENCH
  // ------------------------------------------------------------------------------------------------

  // French Grammar: Le Discours Rapporté (Reported Speech)
  await prisma.grammarRule.upsert({
    where: { slug: "fr-discours-rapporte-bac" },
    update: {},
    create: {
      slug: "fr-discours-rapporte-bac",
      language: Language.FRENCH,
      category: GrammarCategory.REPORTED_SPEECH,
      title: "Le Discours Rapporté (Direct et Indirect)",
      rule: "Au bac, la transformation du discours direct au discours indirect est un classique. Attention à la concordance des temps si le verbe introducteur est au passé !",
      formula: "Il a dit : « Je viendrai. » -> Il a dit qu'il viendrait. (Futur -> Conditionnel)",
      examples: JSON.stringify([
        "Direct : Il déclare : « La technologie avance. » -> Indirect : Il déclare que la technologie avance.",
        "Direct : Elle a affirmé : « Je lis un roman. » -> Indirect : Elle a affirmé qu'elle lisait un roman. (Imparfait)"
      ]),
      usageNotes: "N'oubliez pas les changements de pronoms et d'adjectifs possessifs (mon -> son, etc.) et les indicateurs de temps (demain -> le lendemain).",
      difficulty: Difficulty.HARD,
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS, // Often evaluated in literary analysis or writing
      isEssential: true
    }
  });

  // French Reading: Souvenirs et Nostalgie
  await prisma.readingPassage.upsert({
    where: { slug: "fr-souvenirs-enfance" },
    update: {},
    create: {
      slug: "fr-souvenirs-enfance",
      language: Language.FRENCH,
      title: "Les Échos de l'Enfance",
      passageType: PassageType.STORY,
      content: "Quand je repense à mon village natal, les images affluent comme un torrent. La petite école aux murs blanchis à la chaux, le parfum des olives écrasées en automne, et la voix rassurante de ma grand-mère. Ces souvenirs, bien que lointains, constituent le socle de mon identité. La nostalgie qui m'envahit n'est pas une tristesse, mais plutôt une douce mélancolie qui me rappelle d'où je viens et qui je suis.",
      wordCount: 71,
      difficulty: Difficulty.MEDIUM,
      themes: JSON.stringify(["Souvenirs", "Nostalgie", "Identité", "Autobiographie"]),
      keyVocabulary: JSON.stringify(["souvenirs", "nostalgie", "mélancolie", "socle"]),
      compressionQuestions: undefined,
      bacRelevance: "Correspond au thème classique de l'autobiographie et des souvenirs au bac.",
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS
    }
  });


  // ------------------------------------------------------------------------------------------------
  // SPANISH
  // ------------------------------------------------------------------------------------------------

  // Spanish Vocabulary: Turismo y Fiestas
  await prisma.vocabularySet.upsert({
    where: { slug: "sp-turismo-fiestas" },
    update: {},
    create: {
      slug: "sp-turismo-fiestas",
      language: Language.SPANISH,
      theme: VocabTheme.TOURISM,
      title: "El Turismo y las Fiestas",
      description: "Vocabulario clave para comprender textos sobre el turismo y describir las tradiciones.",
      bacContext: "Frecuente en comprensión de texto (Módulo 1: Turismo y Fiestas).",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      isCommon: true,
      items: {
        create: [
          {
            word: "el destino turístico",
            definition: "Lugar a donde viajan los turistas.",
            partOfSpeech: "Sustantivo",
            exampleSentence: "España es un destino turístico muy popular.",
            bacExample: "Muchos europeos eligen el sur como su destino turístico favorito.",
            register: "neutral"
          },
          {
            word: "las costumbres",
            definition: "Los hábitos de un grupo, tradiciones.",
            partOfSpeech: "Sustantivo plural",
            exampleSentence: "Es importante respetar las costumbres locales.",
            bacExample: "La prueba trata a menudo de las costumbres de las familias españolas.",
            register: "neutral"
          }
        ]
      }
    }
  });

  // Spanish Grammar: Tiempos del pasado (Imperfecto / Indefinido)
  await prisma.grammarRule.upsert({
    where: { slug: "sp-imperfecto-indefinido" },
    update: {},
    create: {
      slug: "sp-imperfecto-indefinido",
      language: Language.SPANISH,
      category: GrammarCategory.TENSES,
      title: "El Pretérito Imperfecto vs El Indefinido",
      rule: "El Indefinido se usa para acciones terminadas en un momento específico del pasado (Ayer comí). El Imperfecto describe contextos, hábitos o personas en el pasado (Antes comía siempre a las dos).",
      formula: "Indefinido = Acción puntual | Imperfecto = Descripción/Hábito",
      examples: JSON.stringify([
        "Indefinido: En 2020 viajé a Madrid.",
        "Imperfecto: Cuando era niño, jugaba en el parque."
      ]),
      usageNotes: "Atención a los marcadores temporales: 'ayer', 'anoche', 'el año pasado' -> Indefinido. 'siempre', 'a menudo', 'antes' -> Imperfecto.",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      isEssential: true
    }
  });

  console.log('🌟 FRENCH AND SPANISH BAC CURRICULUM SEEDING COMPLETE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
