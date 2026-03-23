const { PrismaClient, Language, Difficulty, PassageType, BacModule, BacSection } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Seeding Reading Comprehension & Unit-based structure...');

  const allSections = Object.values(BacSection);

  // --- Reading Passage 1: Module 1 (Holidaying & Arts) ---
  await prisma.readingPassage.upsert({
    where: { slug: 'eng-holidaying-world' },
    update: {},
    create: {
      slug: 'eng-holidaying-world',
      language: Language.ENGLISH,
      title: 'The Evolution of Modern Tourism',
      passageType: PassageType.ARTICLE,
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      content: `Tourism has undergone a massive transformation in the last few decades. What was once a luxury reserved for the wealthy has become a global industry accessible to millions. People now travel not just for relaxation, but for cultural immersion and artistic experiences. Art shows, local festivals, and historical exhibitions are becoming the main drivers of international travel. However, this growth comes with challenges, including environmental impact and the commercialization of local cultures.`,
      wordCount: 120,
      difficulty: Difficulty.MEDIUM,
      themes: JSON.stringify(['Tourism', 'Culture', 'Environment']),
      keyVocabulary: JSON.stringify(['Transformation', 'Immersion', 'Commercialization']),
      bacRelevance: 'Directly maps to Module 1: Holidaying & Art Shows.',
      comprehensionQuestions: JSON.stringify([
        {
          id: 'q1',
          question: 'According to the text, why did people use to travel in the past?',
          type: 'TEXTUAL_EVIDENCE',
          answer: 'Travel was once a luxury reserved for the wealthy.'
        },
        {
          id: 'q2',
          question: 'True or False: Modern tourism is only about relaxation.',
          type: 'TRUE_FALSE',
          answer: 'False. People also travel for cultural immersion and artistic experiences.'
        }
      ])
    }
  });

  // --- Reading Passage 2: Module 2 (Education) ---
  await prisma.readingPassage.upsert({
    where: { slug: 'fr-education-avenir' },
    update: {},
    create: {
      slug: 'fr-education-avenir',
      language: Language.FRENCH,
      title: "L'importance de l'éducation numérique",
      passageType: PassageType.ESSAY,
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      content: "L'éducation est le socle de toute société moderne. Face à l'avènement des nouvelles technologies, le système éducatif doit s'adapter pour intégrer le numérique dès le plus jeune âge. Apprendre à coder, à naviguer sur internet de manière critique et à utiliser des outils collaboratifs est devenu aussi essentiel que la lecture ou l'écriture. Cependant, la fracture numérique reste un obstacle majeur pour de nombreux pays en développement.",
      wordCount: 150,
      difficulty: Difficulty.HARD,
      themes: JSON.stringify(['Éducation', 'Technologie', 'Inégalité']),
      keyVocabulary: JSON.stringify(['Socle', 'Collaboratif', 'Fracture numérique']),
      bacRelevance: "Correspond au Module 2: L'éducation est importante.",
      comprehensionQuestions: JSON.stringify([
        {
          id: 'q1',
          question: "Qu'est-ce qui est devenu aussi important que la lecture ou l'écriture ?",
          type: 'DIRECT_ANSWER',
          answer: 'Apprendre à coder, à naviguer sur internet et à utiliser des outils collaboratifs.'
        }
      ])
    }
  });

  // --- Update existing Grammar & Vocab to link them to Modules ---
  // Note: Slugs are from previous seeds.
  
  // English Grammar: Passive Voice (Common in Module 1/3)
  await prisma.grammarRule.updateMany({
    where: { language: Language.ENGLISH, slug: { contains: 'passive' } },
    data: { bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS }
  });

  // English Vocab: Innovation
  await prisma.vocabularySet.updateMany({
    where: { language: Language.ENGLISH, slug: { contains: 'innovation' } },
    data: { bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS }
  });

  // Let's also link the "Holidaying" vocab if it exists
  await prisma.vocabularySet.updateMany({
    where: { language: Language.ENGLISH, theme: 'TRAVEL' },
    data: { bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS }
  });

  console.log('✅ Reading Comprehension seeded and modules mapped!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
