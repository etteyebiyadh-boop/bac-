const { PrismaClient, Language, Difficulty } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🎓 Seeding Official 2024 Full Mock Exam (Reading + Language + Writing)...');

  const fullMock = {
    slug: 'bac-2024-full-mock-english',
    language: Language.ENGLISH,
    year: 2024,
    title: 'OFFICIAL 2024 MOCK: Technology & Social Impact',
    difficulty: Difficulty.MEDIUM,
    estimatedMinutes: 180, // 3 hours
    
    // Part I: Reading Comprehension (12 pts)
    readingTitle: 'The Digital Transformation of Rural Tunisia',
    readingContent: `In the heart of Tunisia's rural landscapes, a quiet revolution is taking place. For decades, these regions were isolated from the fast-paced digital growth of the capital. However, the introduction of high-speed satellite internet and subsidized mobile devices has begun to bridge the digital divide. 

Local farmers are now using smartphone applications to monitor weather patterns and market prices, while students in remote villages can access the same educational resources as their peers in Tunis. 'It has changed everything,' says Ahmed, a secondary school student from Siliana. 'I can now prepare for my Baccalaureate exam using AI-powered platforms that provide instant feedback.'

But this rapid change brings challenges. Older generations often struggle to keep up with the technical skills required, and the rise of social media has raised concerns about cultural identity and the quality of local face-to-face interactions. Nevertheless, the consensus among youth is clear: technology is the key to a more prosperous and connected future for all Tunisians.`,
    
    readingQuestions: [
      { 
        id: 'q1', 
        type: 'mcq', 
        question: 'What is the main theme of the text?', 
        choices: ['The history of Siliana', 'Digital growth in rural Tunisia', 'Satellite technology in Tunis', 'Traditional farming methods'], 
        answer: 'Digital growth in rural Tunisia' 
      },
      { 
        id: 'q2', 
        type: 'true-false', 
        question: 'Rural regions have always been well-connected to the internet.', 
        answer: 'False', 
        justification: 'For decades, these regions were isolated from the fast-paced digital growth of the capital.'
      },
      { 
        id: 'q3', 
        type: 'gap-fill', 
        question: 'Ahmed uses ___ platforms to prepare for his exams.', 
        answer: 'AI-powered' 
      }
    ],

    // Part II: Language (8 pts)
    languageQuestions: [
      { 
        id: 'l1', 
        type: 'grammar', 
        prompt: 'Complete with the right tense: "If the government (invest) ___ more in rural areas last year, the economy would have improved faster."', 
        answer: 'had invested' 
      },
      { 
        id: 'l2', 
        type: 'vocab', 
        prompt: 'Find a word in paragraph 2 that means "at once" or "without delay":', 
        answer: 'instant' 
      }
    ],

    // Part III: Writing (10 pts)
    prompt: 'Technology can either preserve or destroy cultural identity. Discuss this statement in a 150-word essay, focusing on the Tunisian context.',
    modelAnswer: 'Technology acts as a double-edged sword for cultural identity. On one hand, it allows us to digitize and share our heritage globally through social media. On the other hand, the dominance of global content can overshadow local traditions. In Tunisia, we must use technology to archive our past while embracing the digital future.',
    methodology: 'Introduce the paradox, discuss the pros of preservation, the cons of global influence, and conclude with a Tunisian balanced perspective.'
  };

  await prisma.exam.upsert({
    where: { slug: fullMock.slug },
    update: fullMock,
    create: fullMock
  });

  console.log('✅ Full Mock Exam Seeded!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
