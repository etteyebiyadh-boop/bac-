const { PrismaClient, Language, Difficulty, PassageType, BacModule, BacSection } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding "Official Inspector" requested content...');

  // 1. Listening Resource for Module 6: Sustainable Development (Technical/Science focus)
  await prisma.listeningResource.upsert({
    where: { slug: 'eng-listening-renewable-energy' },
    update: {},
    create: {
      slug: 'eng-listening-renewable-energy',
      language: Language.ENGLISH,
      title: 'The Future of Renewable Energy in Tunisia',
      audioUrl: 'https://bacexcellence.tn/static/audio/renewable-energy-tunisia.mp3', // Mock URL
      transcript: "In recent years, Tunisia has made significant strides in adopting renewable energy sources. With abundant sunshine and strong winds along the coast, the country is well-positioned to transition from fossil fuels to solar and wind power. Engineers and policymakers are working together to build massive solar farms in the Sahara desert which could eventually power not just Tunisia, but parts of Europe as well. However, storage technology remains a critical challenge for the grid stability.",
      durationSeconds: 180,
      difficulty: Difficulty.MEDIUM,
      themes: JSON.stringify(['Environment', 'Energy', 'Technology', 'Tunisia']),
      bacRelevance: 'Directly maps to Module 6: Sustainable Development. High priority for Technical and Science sections.',
      bacModule: BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT,
      questions: JSON.stringify([
        { id: 'l1', question: 'What are the two main renewable energy sources mentioned?', answer: 'Solar and wind power.' },
        { id: 'l2', question: 'Where are the massive solar farms being built?', answer: 'In the Sahara desert.' },
        { id: 'l3', question: 'What is the main challenge remaining for the grid?', answer: 'Storage technology (grid stability).' }
      ])
    }
  });

  // 2. Reading Passage for Module 8: Literary Texts (Lettres focus)
  await prisma.readingPassage.upsert({
    where: { slug: 'eng-literary-charles-dickens-excerpt' },
    update: {},
    create: {
      slug: 'eng-literary-charles-dickens-excerpt',
      language: Language.ENGLISH,
      title: 'Excerpt from Great Expectations by Charles Dickens',
      passageType: PassageType.STORY,
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS,
      content: "It was a rimy morning, and very damp. I had seen the damp lying on the outside of my little window, as if some giant had been crying there all night, and using the window for a pocket-handkerchief. Now I saw the damp lying on the bare hedges and spare grass, like a coarser sort of spiders' webs; hanging itself from twig to twig and blade to blade. On every rail and gate, wet lay clammy, and the marsh-mist was so thick, that the wooden finger on the post directing people to our village—a direction which they never accepted, for they never came there—was invisible to me until I was quite close under it.",
      wordCount: 140,
      difficulty: Difficulty.HARD,
      themes: JSON.stringify(['Literature', 'Victorian England', 'Imagery', 'Solitude']),
      keyVocabulary: JSON.stringify(['Rimy', 'Clammy', 'Marsh-mist', 'Hedges']),
      bacRelevance: 'Directly maps to Module 8: Literary Texts. Essential for Lettres students preparing for textual analysis.',
      comprehensionQuestions: JSON.stringify([
        {
          id: 'lit1',
          question: 'What is the "giant crying" a metaphor for?',
          type: 'TEXTUAL_ANALYSIS',
          answer: 'The heavy morning damp or dew on the window.'
        },
        {
          id: 'lit2',
          question: 'Quote a sentence that shows the weather was very thick/foggy.',
          type: 'EVIDENCE',
          answer: '"the marsh-mist was so thick, that the wooden finger on the post ... was invisible to me"'
        }
      ])
    }
  });

  // 3. Listening for Module 4: Youth Issues (Social Media focus)
  await prisma.listeningResource.upsert({
    where: { slug: 'fr-ecoute-reseaux-sociaux' },
    update: {},
    create: {
      slug: 'fr-ecoute-reseaux-sociaux',
      language: Language.FRENCH,
      title: 'Les Jeunes et les Réseaux Sociaux : Impact sur le Bac',
      audioUrl: 'https://bacexcellence.tn/static/audio/jeunes-social-media.mp3', // Mock URL
      transcript: "L'usage excessif des réseaux sociaux est une préoccupation majeure pour les enseignants en Tunisie. Si ces outils offrent des ressources éducatives, ils sont aussi une source de distraction intense pour les élèves en année de Baccalauréat. Plusieurs experts recommandent des 'digital detox' programmés avant les examens pour améliorer la concentration et le sommeil.",
      durationSeconds: 120,
      difficulty: Difficulty.MEDIUM,
      themes: JSON.stringify(['Jeunesse', 'Éducation', 'Santé', 'Concentration']),
      bacRelevance: 'Correspond au Module 4: Youth Issues. Sujet récurrent dans les épreuves de français.',
      bacModule: BacModule.MODULE_4_YOUTH_ISSUES,
      questions: JSON.stringify([
        { id: 'f1', question: 'Quel est l\'impact négatif principal cité ?', answer: 'La distraction intense.' },
        { id: 'f2', question: 'Que recommandent les experts ?', answer: 'Des digital detox programmés.' }
      ])
    }
  });

  // 4. Update Women & Power modules Grammar
  await prisma.grammarRule.updateMany({
    where: { language: Language.ENGLISH, slug: { contains: 'modal' } },
    data: { bacModule: BacModule.MODULE_5_WOMEN_POWER }
  });

  console.log('✅ "Official Inspector" gaps filled with high-quality content!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
