const { PrismaClient, Language, BacSection, Difficulty } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Seeding Creative Content for Tunisian BAC Languages...\n');

  // Helper arrays for all sections
  const allSections = Object.values(BacSection);

  // ==========================================
  // SPANISH CONTENT (Optional Language)
  // ==========================================
  console.log('Seeding Spanish...');
  
  await prisma.lesson.upsert({
    where: { slug: 'spanish-intro-bac' },
    update: {},
    create: {
      slug: 'spanish-intro-bac',
      language: Language.SPANISH,
      title: 'Mastering the Spanish Written Expression',
      summary: 'Learn how to structure your thoughts perfectly for the final BAC exam essay in Spanish.',
      body: 'In the Tunisian BAC, the Spanish written expression tests your ability to narrate past events effectively and express opinions. Always start with a strong introductory hook. For example, if the topic is about the environment (El Medio Ambiente), open with a broad statement before narrowing down to the core issue. Structure your essay with distinct paragraphs: Introduction, 2 Body paragraphs (pros vs cons, or problem vs solution), and a clear Conclusion.',
      theme: 'Exam Strategy',
      skillFocus: 'structure',
      difficulty: Difficulty.MEDIUM,
      estimatedMinutes: 10,
      takeawayJson: JSON.stringify(["Use transitional words heavily", "Always structure in 4 paragraphs"])
    }
  });

  await prisma.grammarRule.upsert({
    where: { slug: 'spanish-preterito-indefinido' },
    update: {},
    create: {
      slug: 'spanish-preterito-indefinido',
      language: Language.SPANISH,
      category: 'TENSES',
      title: 'El Pretérito Indefinido (Past Simple)',
      rule: 'Used to narrate actions completed in the past at a specific moment. Essential for story-telling in exams.',
      formula: 'AR verbs: -é, -aste, -ó, -amos, -asteis, -aron',
      examples: JSON.stringify(["Ayer visité el museo.", "Él comió una manzana."]),
      difficulty: Difficulty.MEDIUM,
      isEssential: true,
      bacSections: allSections
    }
  });

  await prisma.vocabularySet.upsert({
    where: { slug: 'spanish-medio-ambiente' },
    update: {},
    create: {
      slug: 'spanish-medio-ambiente',
      language: Language.SPANISH,
      theme: 'ENVIRONMENT',
      title: 'El Medio Ambiente',
      description: 'Crucial vocabulary for essays concerning ecology, pollution, and climate change.',
      bacContext: 'Highly recurrent topic in the BAC written expression.',
      difficulty: Difficulty.MEDIUM,
      isCommon: true,
      bacSections: allSections,
      items: {
        create: [
          {
            word: 'Contaminación',
            definition: 'Pollution',
            partOfSpeech: 'Noun',
            exampleSentence: 'La contaminación del aire es un problema grave.',
            bacExample: 'En tu ensayo, debes discutir las soluciones a la contaminación.',
          },
          {
            word: 'Proteger',
            definition: 'To protect',
            partOfSpeech: 'Verb',
            exampleSentence: 'Debemos proteger la naturaleza.',
            bacExample: 'Es nuestro deber proteger el medio ambiente para las futuras generaciones.',
          }
        ]
      }
    }
  });

  // ==========================================
  // GERMAN CONTENT (Optional Language)
  // ==========================================
  console.log('Seeding German...');
  
  await prisma.grammarRule.upsert({
    where: { slug: 'german-weil-clauses' },
    update: {},
    create: {
      slug: 'german-weil-clauses',
      language: Language.GERMAN,
      category: 'CONNECTORS',
      title: 'Subordinate Clauses with "weil" (because)',
      rule: 'In German, when using the conjunction "weil", the conjugated verb is pushed to the very end of the clause. This directly impacts your Structure score!',
      formula: 'Hauptsatz + , weil + Subject + ... + conjugated Verb.',
      examples: JSON.stringify([
        "Ich lerne Deutsch, weil es interessant ist. (I learn German because it is interesting.)",
        "Wir bleiben zu Hause, weil das Wetter schlecht ist."
      ]),
      commonErrors: JSON.stringify(["Keeping the verb in the second position after weil (e.g., weil es ist interessant). ALWAYS move it to the end!"]),
      difficulty: Difficulty.MEDIUM,
      isEssential: true,
      bacSections: allSections
    }
  });

  await prisma.vocabularySet.upsert({
    where: { slug: 'german-technologie' },
    update: {},
    create: {
      slug: 'german-technologie',
      language: Language.GERMAN,
      theme: 'TECHNOLOGY',
      title: 'Technologie im Alltag',
      description: 'Vocabulary tailored for technology and internet usage scenarios.',
      bacContext: 'Frequent theme in German Reading Comprehension and writing.',
      difficulty: Difficulty.MEDIUM,
      isCommon: true,
      bacSections: allSections,
      items: {
        create: [
          {
            word: 'Das Handy',
            definition: 'Mobile phone',
            partOfSpeech: 'Noun (Neuter)',
            exampleSentence: 'Mein Handy ist neu.',
            bacExample: 'Jugendliche nutzen das Handy zu oft.',
          },
          {
            word: 'Herunterladen',
            definition: 'To download',
            partOfSpeech: 'Separable Verb',
            exampleSentence: 'Er lädt die Musik herunter.',
            bacExample: 'Wir können viele Informationen aus dem Internet herunterladen.',
          }
        ]
      }
    }
  });

  // ==========================================
  // ITALIAN CONTENT (Optional Language)
  // ==========================================
  console.log('Seeding Italian...');

  await prisma.lesson.upsert({
    where: { slug: 'italian-writing-tips' },
    update: {},
    create: {
      slug: 'italian-writing-tips',
      language: Language.ITALIAN,
      title: 'La Produzione Scritta Perfetta',
      summary: 'Secret formulas for composing high-scoring essays in Italian without translating directly from Arabic/French.',
      body: 'Stop thinking in French and translating to Italian! Use native connectors like "Inoltre" (Furthermore), "D\'altra parte" (On the other hand), and "Insomma" (In conclusion). Structure your letter (Lettera) or essay (Tema) clearly. Always double-check plural noun agreements (o->i, a->e).',
      theme: 'Writing Excellence',
      skillFocus: 'vocabulary',
      difficulty: Difficulty.MEDIUM,
      estimatedMinutes: 8,
      takeawayJson: JSON.stringify(["Use native connectors", "Check noun-adjective agreements"])
    }
  });

  // ==========================================
  // FRENCH CONTENT
  // ==========================================
  console.log('Seeding French...');

  await prisma.grammarRule.upsert({
    where: { slug: 'french-subjonctif' },
    update: {},
    create: {
      slug: 'french-subjonctif',
      language: Language.FRENCH,
      category: 'TENSES',
      title: 'Le Subjonctif Présent',
      rule: 'Used to express doubt, necessity, desire, or emotion. Mandatory after "Il faut que", "Je veux que", etc.',
      formula: 'ils form of present tense, drop -ent, add: -e, -es, -e, -ions, -iez, -ent',
      examples: JSON.stringify([
        "Il faut que nous fassions un effort.",
        "Je doute qu'il vienne à la fête."
      ]),
      difficulty: Difficulty.HARD,
      isEssential: true,
      bacSections: allSections
    }
  });

  // ==========================================
  // ARABIC CONTENT
  // ==========================================
  console.log('Seeding Arabic...');

  await prisma.vocabularySet.upsert({
    where: { slug: 'arabic-literary-critique' },
    update: {},
    create: {
      slug: 'arabic-literary-critique',
      language: Language.ARABIC,
      theme: 'CULTURE', // Mapped to closest theme
      title: 'مصطلحات التحليل الأدبي',
      description: 'Terms exclusively used for analyzing poetry and prose in Arabic Literature exams.',
      bacContext: 'Specifically useful for Lettres students but applicable for deep reading passages in other sections.',
      difficulty: Difficulty.HARD,
      isCommon: false,
      bacSections: [BacSection.LETTRES],
      items: {
        create: [
          {
            word: 'الصورة الشعرية',
            definition: 'Poetic Imagery',
            partOfSpeech: 'Noun Phrase',
            exampleSentence: 'تتجلى الصورة الشعرية بقوة في هذا المقطع.',
            bacExample: 'استخرج صورة شعرية وبين قيمتها الدلالية.',
            synonyms: JSON.stringify(['الخيال الشِعري', 'البيان'])
          }
        ]
      }
    }
  });

  console.log('\n✅ Successfully seeded creative content for new tracks!');
}

main()
  .catch((e) => {
    console.error('Error during creative seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
