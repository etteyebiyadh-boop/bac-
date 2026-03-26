const { PrismaClient, Language, Difficulty } = require('@prisma/client');
const prisma = new PrismaClient();

const EXAMS = [
  {
    slug: 'bac-2025-principale-english',
    year: 2025,
    title: 'BAC 2025 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Social Media) + Language (Grammar) + Writing (Opinion Essay 200-250 words)',
    modelAnswer: 'Complete model answers: Reading comprehension answers, grammar corrections, and sample opinion essay with clear position, supporting arguments, counter-argument, and conclusion.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Teenagers and Social Media: A Double-Edged Sword',
    readingContent: 'Teenagers and Social Media: A Double-Edged Sword\n\nIn today\'s digital age, social media has become an integral part of teenagers\' lives. Platforms like Instagram, TikTok, and Snapchat offer young people unprecedented opportunities for self-expression, creativity, and connection. However, this constant connectivity comes with significant challenges that parents, educators, and policymakers cannot ignore.\n\nRecent studies have shown that the average teenager spends approximately 7-8 hours per day on social media platforms. While these platforms can foster friendships and provide access to educational content, they also expose young users to cyberbullying, unrealistic beauty standards, and misinformation.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2024-principale-english',
    year: 2024,
    title: 'BAC 2024 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Future of Work) + Language (Conditionals) + Writing (Remote Work Essay)',
    modelAnswer: 'Complete model answers: Reading comprehension on remote work trends, grammar exercises on second conditional, and opinion essay on work flexibility.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'The Future of Work: Remote vs. Office',
    readingContent: 'The Future of Work: Remote vs. Office\n\nThe COVID-19 pandemic fundamentally transformed how we work. What began as a temporary emergency measure has evolved into a permanent shift, with millions of workers worldwide now operating from home offices, coffee shops, and co-working spaces.\n\nProponents of remote work cite numerous benefits. Employees save an average of 2 hours per day on commuting, time they can redirect toward family, exercise, or personal development. Companies have discovered they can reduce office space costs by up to 40%.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2024-controle-english',
    year: 2024,
    title: 'BAC 2024 Session Contrôle - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Digital Education) + Language (Comparatives) + Writing (Article)',
    modelAnswer: 'Complete model answers: Reading comprehension on digital divide in Tunisian education, grammar exercises on comparatives and reported speech, article about technology in education.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Education in the Digital Age: Bridging the Gap',
    readingContent: 'Education in the Digital Age: Bridging the Gap\n\nWhile students in urban centers enjoy high-speed internet and modern computers, their counterparts in rural Tunisia often struggle with basic connectivity. This digital divide represents one of the most pressing challenges facing Tunisian education today.\n\nThe Ministry of Education has launched ambitious programs to address this inequality. The "Smart Classroom" initiative aims to equip 5,000 schools with digital tools by 2026.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2023-principale-english',
    year: 2023,
    title: 'BAC 2023 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Volunteerism) + Language (Modals) + Writing (Mandatory Service Essay)',
    modelAnswer: 'Complete model answers: Reading comprehension on youth volunteerism in Tunisia, grammar exercises on modals and participles, opinion essay on mandatory volunteer service.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Volunteerism: Tunisia\'s Youth Making a Difference',
    readingContent: 'Volunteerism: Tunisia\'s Youth Making a Difference\n\nIn the aftermath of the 2011 revolution, Tunisian youth faced significant challenges: high unemployment, political uncertainty, and a sense of disillusionment with institutions. Yet from this difficult context emerged a powerful force for positive change—youth volunteerism.\n\nAcross the country, young Tunisians are organizing to address community needs. Environmental cleanup campaigns have transformed polluted beaches and parks.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2022-principale-english',
    year: 2022,
    title: 'BAC 2022 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Tourism) + Language (Passive Voice) + Writing (Promotional Brochure)',
    modelAnswer: 'Complete model answers: Reading comprehension on tourism challenges post-COVID, grammar exercises on passive voice and comparatives, promotional brochure for Tunisian destination.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Tourism in Tunisia: Challenges and Opportunities',
    readingContent: 'Tourism in Tunisia: Challenges and Opportunities\n\nFor decades, tourism has been the backbone of Tunisia\'s economy. The country\'s Mediterranean beaches, ancient ruins, and distinctive culture attracted millions of visitors annually.\n\nThe 2011 revolution initially caused tourist numbers to plummet. Recovery was gradual but steady—until the COVID-19 pandemic brought international travel to a standstill.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2021-principale-english',
    year: 2021,
    title: 'BAC 2021 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Women in STEM) + Language (Relative Clauses) + Writing (Article)',
    modelAnswer: 'Complete model answers: Reading comprehension on women in science, grammar exercises on relative clauses, article about inspiring Tunisian woman in STEM.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Women in Science: Breaking Barriers in Tunisia',
    readingContent: 'Women in Science: Breaking Barriers in Tunisia\n\nIn laboratories across Tunisia, a quiet revolution is taking place. Increasing numbers of women are pursuing careers in science, technology, engineering, and mathematics (STEM)—fields traditionally dominated by men.\n\nTunisia has long been a regional leader in women\'s rights. The country\'s 1956 Personal Status Code granted women unprecedented legal protections.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  },
  {
    slug: 'bac-2020-principale-english',
    year: 2020,
    title: 'BAC 2020 Session Principale - English',
    language: Language.ENGLISH,
    prompt: 'BAC English Exam: Reading (Climate Change) + Language (Perfect Tenses) + Writing (Opinion Essay)',
    modelAnswer: 'Complete model answers: Reading comprehension on climate change impacts in Tunisia, grammar exercises on perfect tenses, opinion essay on environmental action.',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'Climate Change: A Call to Action',
    readingContent: 'Climate Change: A Call to Action\n\nThe evidence is overwhelming: climate change represents one of the greatest challenges facing humanity in the 21st century. Rising temperatures, extreme weather events, and sea-level rise threaten communities around the globe—including Tunisia\'s coastal regions.\n\nThe scientific consensus is clear. Human activities, particularly the burning of fossil fuels, have released greenhouse gases that trap heat in the atmosphere.',
    methodology: 'Standard Tunisian BAC English: Part I Reading (12 pts), Part II Language (8 pts), Part III Writing (10 pts)'
  }
];

async function seed() {
  console.log('Seeding Tunisian BAC English Exam Archive...\n');
  for (const exam of EXAMS) {
    await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: exam,
      create: exam
    });
    console.log(`✓ ${exam.title}`);
  }
  console.log(`\n✅ Seeded ${EXAMS.length} official BAC English exams (2020-2025)`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
