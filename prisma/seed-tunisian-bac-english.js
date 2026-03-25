const { PrismaClient, Language, BacModule, Difficulty, GrammarCategory, VocabTheme, PassageType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding rich Tunisian Baccalaureate English curriculum data (Module Grid)...');

  // Grammar: Cause and Effect (Creative Minds)
  await prisma.grammarRule.upsert({
    where: { slug: "cause-and-effect-tech" },
    update: {},
    create: {
      slug: "cause-and-effect-tech",
      language: Language.ENGLISH,
      category: GrammarCategory.CONNECTORS,
      title: "Expressing Cause and Effect",
      rule: "Use 'due to' / 'because of' + Noun for causes. Use 'results in' / 'leads to' + Noun for effects.",
      formula: "[Cause] + leads to / results in + [Effect]",
      examples: JSON.stringify([
        "Due to rapid AI advancement, many jobs are changing.",
        "The heavy reliance on smartphones leads to less face-to-face communication."
      ]),
      usageNotes: "Essential for essay writing in Module 3.",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      isEssential: true
    }
  });

  // Vocabulary: Brain Drain (Youth Issues)
  await prisma.vocabularySet.upsert({
    where: { slug: "brain-drain-youth" },
    update: {},
    create: {
      slug: "brain-drain-youth",
      language: Language.ENGLISH,
      theme: VocabTheme.SOCIETY,
      title: "Brain Drain: Push and Pull Factors",
      description: "Essential vocabulary for discussing the emigration of skilled professionals.",
      bacContext: "Very common in the 'Youth Issues' writing tasks.",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_4_YOUTH_ISSUES,
      isCommon: true,
      items: {
        create: [
          {
            word: "brain drain",
            definition: "The emigration of highly trained or intelligent people.",
            partOfSpeech: "Noun phrase",
            exampleSentence: "The brain drain is severely affecting developing nations.",
            bacExample: "Many Tunisian doctors move abroad, contributing to the brain drain.",
            register: "formal"
          },
          {
            word: "pull factor",
            definition: "Something that attracts people to go and live in a particular place.",
            partOfSpeech: "Noun phrase",
            exampleSentence: "High salaries are a major pull factor.",
            bacExample: "Better research facilities are a strong pull factor for young scientists.",
            register: "formal"
          }
        ]
      }
    }
  });

  // Reading Passage: Eco-actions (Sustainable Development)
  await prisma.readingPassage.upsert({
    where: { slug: "eco-conscious-living" },
    update: {},
    create: {
      slug: "eco-conscious-living",
      language: Language.ENGLISH,
      title: "The Shift Towards Eco-Conscious Living",
      passageType: PassageType.ARTICLE,
      content: "As global warming accelerates, communities around the world are rethinking their daily habits. Sustainable development is not merely an option, it is a necessity. Actions such as reducing carbon footprints, transitioning to renewable energy sources, and minimizing single-use plastics have gained immense traction. Young people, in particular, are leading the charge, demanding stronger environmental policies from governments and corporations alike. It is imperative that we all take part in this green transition to ensure a habitable planet for future generations.",
      wordCount: 82,
      difficulty: Difficulty.EASY,
      themes: JSON.stringify(["Environment", "Pollution", "Activism"]),
      keyVocabulary: JSON.stringify(["sustainable", "carbon footprint", "renewable"]),
      compressionQuestions: undefined,
      bacRelevance: "Matches Module 6: Sustainable Development themes perfectly.",
      bacModule: BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT
    }
  });

  console.log('🌟 TUNISIAN BAC ENGLISH CURRICULUM SEEDING COMPLETE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
