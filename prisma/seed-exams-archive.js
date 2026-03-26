const { PrismaClient, Language, Difficulty } = require('@prisma/client');

const prisma = new PrismaClient();

const BAC_EXAMS = [
  {
    slug: 'bac-2025-principale-english',
    year: 2025,
    title: 'BAC 2025 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2025: Reading Comprehension + Language Study + Writing (Opinion Essay)',
    modelAnswer: 'Model answer includes: (1) Reading comprehension answers based on social media text, (2) Grammar corrections including third conditional, reported speech, connectors, (3) 200-250 word opinion essay on social media regulation with clear position, supporting arguments, counter-argument, and conclusion.',
Dr. Sarah Chen, a child psychologist, notes: "We're seeing a generation that's always 'on.' The fear of missing out (FOMO) drives compulsive checking of notifications, which disrupts sleep patterns and reduces face-to-face social skills."

Despite these concerns, social media isn't inherently harmful. Many teenagers use these platforms to organize social causes, learn new skills, and stay connected with family members across the globe. The key lies in teaching digital literacy and promoting healthy online habits.

Schools across Tunisia have begun implementing digital wellness programs. The debate surrounding teenagers and social media is far from settled.`,
    topics: JSON.stringify(["social media", "mental health", "teenagers", "technology", "education"]),
    bacRelevance: "Module 3: Creative and Inventive Minds / Youth Issues",
    readingTitle: "Teenagers and Social Media: A Double-Edged Sword",
    readingContent: `Teenagers and Social Media: A Double-Edged Sword

In today's digital age, social media has become an integral part of teenagers' lives. Platforms like Instagram, TikTok, and Snapchat offer young people unprecedented opportunities for self-expression, creativity, and connection. However, this constant connectivity comes with significant challenges that parents, educators, and policymakers cannot ignore.

Recent studies have shown that the average teenager spends approximately 7-8 hours per day on social media platforms. While these platforms can foster friendships and provide access to educational content, they also expose young users to cyberbullying, unrealistic beauty standards, and misinformation.

Dr. Sarah Chen, a child psychologist, notes: "We're seeing a generation that's always 'on.' The fear of missing out (FOMO) drives compulsive checking of notifications, which disrupts sleep patterns and reduces face-to-face social skills."

Despite these concerns, social media isn't inherently harmful. Many teenagers use these platforms to organize social causes, learn new skills, and stay connected with family members across the globe. The key lies in teaching digital literacy and promoting healthy online habits.

Schools across Tunisia have begun implementing digital wellness programs. The debate surrounding teenagers and social media is far from settled.`,
    readingQuestions: JSON.stringify([
      { question: "According to the text, how many hours per day does the average teenager spend on social media?", type: "mcq", choices: ["3-4 hours", "5-6 hours", "7-8 hours", "9-10 hours"], answer: "7-8 hours", points: 1 },
      { question: "What does Dr. Sarah Chen identify as a major problem caused by social media?", type: "mcq", choices: ["Poor academic performance", "FOMO and disrupted sleep patterns", "Physical health issues", "Financial problems"], answer: "FOMO and disrupted sleep patterns", points: 1 },
      { question: "What solution does the text suggest for healthier social media use?", type: "mcq", choices: ["Complete prohibition", "Digital literacy and healthy boundaries", "More expensive internet", "Longer school hours"], answer: "Digital literacy and healthy boundaries", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in the blank with the correct form of the verb: 'By the time I _____ (arrive) at the station, the train had already left.'", type: "gap-fill", answer: "arrived", points: 1 },
      { prompt: "Complete with an appropriate linking word: Digital technology offers many advantages; _____, it also presents serious challenges to mental health.", type: "mcq", choices: ["however", "furthermore", "therefore", "because"], answer: "however", points: 1 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2024-principale-english',
    year: 2024,
    title: 'BAC 2024 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2024: Reading on Future of Work + Language + Opinion Essay on Remote Work',
    modelAnswer: 'Model answer includes reading comprehension answers, grammar exercises on conditionals and passive voice, and 200-250 word essay discussing benefits and drawbacks of remote work.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `The Future of Work: Remote vs. Office

The COVID-19 pandemic fundamentally transformed how we work. What began as a temporary emergency measure has evolved into a permanent shift, with millions of workers worldwide now operating from home offices, coffee shops, and co-working spaces.

Proponents of remote work cite numerous benefits. Employees save an average of 2 hours per day on commuting, time they can redirect toward family, exercise, or personal development. Companies have discovered they can reduce office space costs by up to 40%.

However, the traditional office still holds significant advantages. Collaboration often happens spontaneously in hallways and break rooms, moments that are difficult to replicate over Zoom.

The hybrid model—combining remote and in-office work—has emerged as the most popular compromise. Tunisia's growing tech sector has embraced this trend.

Critics worry about long-term societal impacts. The challenge now is designing work arrangements that maximize productivity, satisfaction, and human connection.`,
    topics: JSON.stringify(["work", "technology", "COVID-19", "remote work", "society"]),
    bacRelevance: "Module 3: Creative and Inventive Minds / Module 7: Work and Commitment",
    readingTitle: "The Future of Work: Remote vs. Office",
    readingContent: `The COVID-19 pandemic fundamentally transformed how we work. What began as a temporary emergency measure has evolved into a permanent shift, with millions of workers worldwide now operating from home offices, coffee shops, and co-working spaces.

Proponents of remote work cite numerous benefits. Employees save an average of 2 hours per day on commuting, time they can redirect toward family, exercise, or personal development. Companies have discovered they can reduce office space costs by up to 40%.

However, the traditional office still holds significant advantages. Collaboration often happens spontaneously in hallways and break rooms, moments that are difficult to replicate over Zoom.

The hybrid model—combining remote and in-office work—has emerged as the most popular compromise. Tunisia's growing tech sector has embraced this trend.

Critics worry about long-term societal impacts. The challenge now is designing work arrangements that maximize productivity, satisfaction, and human connection.`,
    readingQuestions: JSON.stringify([
      { question: "What percentage of office space costs can companies potentially save with remote work?", type: "mcq", choices: ["10%", "25%", "40%", "60%"], answer: "40%", points: 1 },
      { question: "According to the text, where does collaboration often happen spontaneously?", type: "mcq", choices: ["In video meetings", "In hallways and break rooms", "On social media", "At conferences"], answer: "In hallways and break rooms", points: 1 },
      { question: "What negative effect of remote work do mental health professionals report?", type: "mcq", choices: ["Better sleep", "Increased loneliness and burnout", "More exercise", "Higher salaries"], answer: "Increased loneliness and burnout", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in the blank with the correct form: 'If more companies _____ (offer) remote work, urban traffic _____ (reduce) significantly.'", type: "gap-fill", answer: "offered / would reduce", points: 2 },
      { prompt: "Complete with the appropriate connector: Employees enjoy working from home _____ they miss face-to-face interaction.", type: "mcq", choices: ["although", "because", "therefore", "so"], answer: "although", points: 1 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2024-controle-english',
    year: 2024,
    title: 'BAC 2024 - Session Contrôle - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Contrôle 2024: Reading on Digital Education + Language + Article Writing',
    modelAnswer: 'Model answer includes reading comprehension on digital divide, grammar exercises on comparatives and reported speech, article writing about technology in education.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `Education in the Digital Age: Bridging the Gap

While students in urban centers enjoy high-speed internet and modern computers, their counterparts in rural Tunisia often struggle with basic connectivity. This digital divide represents one of the most pressing challenges facing Tunisian education today.

The Ministry of Education has launched ambitious programs to address this inequality. The "Smart Classroom" initiative aims to equip 5,000 schools with digital tools by 2026.

Infrastructure presents the first challenge. Many rural areas lack reliable electricity, let alone fiber optic cables. "We received tablets, but without internet, they're just expensive calculators," remarks Fatima, a teacher in a remote village.

Despite these challenges, success stories abound. In Siliana, a community-driven initiative brought solar-powered internet to three remote schools. Student test scores improved by 20% within two years.

The digital transformation of education is not merely about technology—it's about equity. Every Tunisian student deserves access to the world's knowledge.`,
    topics: JSON.stringify(["education", "technology", "digital divide", "Tunisia", "rural development"]),
    bacRelevance: "Module 2: Education Matters / Module 6: Sustainable Development",
    readingTitle: "Education in the Digital Age: Bridging the Gap",
    readingContent: `Education in the Digital Age: Bridging the Gap

While students in urban centers enjoy high-speed internet and modern computers, their counterparts in rural Tunisia often struggle with basic connectivity. This digital divide represents one of the most pressing challenges facing Tunisian education today.

The Ministry of Education has launched ambitious programs to address this inequality. The "Smart Classroom" initiative aims to equip 5,000 schools with digital tools by 2026.

Infrastructure presents the first challenge. Many rural areas lack reliable electricity, let alone fiber optic cables. "We received tablets, but without internet, they're just expensive calculators," remarks Fatima, a teacher in a remote village.

Despite these challenges, success stories abound. In Siliana, a community-driven initiative brought solar-powered internet to three remote schools. Student test scores improved by 20% within two years.

The digital transformation of education is not merely about technology—it's about equity. Every Tunisian student deserves access to the world's knowledge.`,
    readingQuestions: JSON.stringify([
      { question: "What is the goal of the 'Smart Classroom' initiative?", type: "mcq", choices: ["Build new schools", "Equip 5,000 schools with digital tools by 2026", "Train 5,000 teachers", "Give scholarships to 5,000 students"], answer: "Equip 5,000 schools with digital tools by 2026", points: 1 },
      { question: "What problem does Fatima identify with the tablets?", type: "mcq", choices: ["They're too heavy", "They break easily", "Without internet, they're just expensive calculators", "Students don't like them"], answer: "Without internet, they're just expensive calculators", points: 1 },
      { question: "In Siliana, student test scores improved by what percentage after getting internet?", type: "mcq", choices: ["10%", "20%", "30%", "40%"], answer: "20%", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in with the correct comparative/superlative: 'Students in urban areas have _____ (good) internet access than those in rural areas.'", type: "gap-fill", answer: "better", points: 1 },
      { prompt: "Complete with the appropriate relative pronoun: 'The Smart Classroom initiative, _____ aims to equip 5,000 schools, was launched by the Ministry of Education.'", type: "mcq", choices: ["who", "which", "where", "when"], answer: "which", points: 1 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2023-principale-english',
    year: 2023,
    title: 'BAC 2023 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2023: Reading on Volunteerism + Language + Opinion Essay on Mandatory Service',
    modelAnswer: 'Model answer includes reading comprehension on youth volunteerism, grammar exercises on modals and participles, essay on mandatory volunteer service.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `Volunteerism: Tunisia's Youth Making a Difference

In the aftermath of the 2011 revolution, Tunisian youth faced significant challenges: high unemployment, political uncertainty, and a sense of disillusionment with institutions. Yet from this difficult context emerged a powerful force for positive change—youth volunteerism.

Across the country, young Tunisians are organizing to address community needs. Environmental cleanup campaigns have transformed polluted beaches and parks. Literacy programs in disadvantaged neighborhoods help children develop reading skills.

Jasser, a 22-year-old engineering student from Sfax, founded "Tech for Good" two years ago. His organization teaches coding to underprivileged teenagers.

International organizations have taken notice. The United Nations Volunteer program has partnered with several Tunisian youth initiatives.

Despite these obstacles, youth volunteerism continues to grow. As Tunisia navigates its ongoing democratic transition, these young volunteers represent hope for the future.`,
    topics: JSON.stringify(["volunteerism", "youth", "civic engagement", "Tunisia", "social change"]),
    bacRelevance: "Module 4: Youth Issues / Module 7: Work and Commitment",
    readingTitle: "Volunteerism: Tunisia's Youth Making a Difference",
    readingContent: `Volunteerism: Tunisia's Youth Making a Difference

In the aftermath of the 2011 revolution, Tunisian youth faced significant challenges: high unemployment, political uncertainty, and a sense of disillusionment with institutions. Yet from this difficult context emerged a powerful force for positive change—youth volunteerism.

Across the country, young Tunisians are organizing to address community needs. Environmental cleanup campaigns have transformed polluted beaches and parks. Literacy programs in disadvantaged neighborhoods help children develop reading skills.

Jasser, a 22-year-old engineering student from Sfax, founded "Tech for Good" two years ago. His organization teaches coding to underprivileged teenagers.

International organizations have taken notice. The United Nations Volunteer program has partnered with several Tunisian youth initiatives.

Despite these obstacles, youth volunteerism continues to grow. As Tunisia navigates its ongoing democratic transition, these young volunteers represent hope for the future.`,
    readingQuestions: JSON.stringify([
      { question: "What organization did Jasser found?", type: "mcq", choices: ["Clean Beaches", "Tech for Good", "Youth Volunteer", "Sfax Students"], answer: "Tech for Good", points: 1 },
      { question: "What does Jasser's organization teach?", type: "mcq", choices: ["English", "Coding", "Medicine", "Sports"], answer: "Coding", points: 1 },
      { question: "What is 'brain drain' as mentioned in the text?", type: "mcq", choices: ["A medical condition", "Talented youth emigrating to Europe", "Lack of education", "Poor internet connection"], answer: "Talented youth emigrating to Europe", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in the blank with the correct modal: 'Young people _____ (have) a sense of purpose to sustain volunteer work.'", type: "gap-fill", answer: "must have", points: 1 },
      { prompt: "Correct the error: 'Volunteerism continue to grow despite challenges.'", type: "error-correction", error: "continue", correction: "continues", points: 2 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2022-principale-english',
    year: 2022,
    title: 'BAC 2022 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2022: Reading on Tourism + Language + Brochure Writing',
    modelAnswer: 'Model answer includes reading comprehension on tourism challenges, grammar exercises on comparatives and passive voice, promotional brochure for Tunisian destination.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `Tourism in Tunisia: Challenges and Opportunities

For decades, tourism has been the backbone of Tunisia's economy. The country's Mediterranean beaches, ancient ruins, and distinctive culture attracted millions of visitors annually.

The 2011 revolution initially caused tourist numbers to plummet. Recovery was gradual but steady—until the COVID-19 pandemic brought international travel to a standstill. The sector, which once employed over 400,000 Tunisians, suddenly faced an existential crisis.

Yet crisis often breeds innovation. Sustainable tourism initiatives have gained traction. The Ministry of Tourism has launched "Destination Tunisia 2030," a strategic plan emphasizing quality over quantity.

Digital transformation has accelerated. Virtual tours allow potential visitors to explore destinations before booking.

The future of Tunisian tourism will look different from its past—smaller, more sustainable, more digitally connected, and more culturally authentic.`,
    topics: JSON.stringify(["tourism", "economy", "sustainable development", "Tunisia", "culture"]),
    bacRelevance: "Module 1: Holidaying and Art Shows / Module 6: Sustainable Development",
    readingTitle: "Tourism in Tunisia: Challenges and Opportunities",
    readingContent: `Tourism in Tunisia: Challenges and Opportunities

For decades, tourism has been the backbone of Tunisia's economy. The country's Mediterranean beaches, ancient ruins, and distinctive culture attracted millions of visitors annually.

The 2011 revolution initially caused tourist numbers to plummet. Recovery was gradual but steady—until the COVID-19 pandemic brought international travel to a standstill. The sector, which once employed over 400,000 Tunisians, suddenly faced an existential crisis.

Yet crisis often breeds innovation. Sustainable tourism initiatives have gained traction. The Ministry of Tourism has launched "Destination Tunisia 2030," a strategic plan emphasizing quality over quantity.

Digital transformation has accelerated. Virtual tours allow potential visitors to explore destinations before booking.

The future of Tunisian tourism will look different from its past—smaller, more sustainable, more digitally connected, and more culturally authentic.`,
    readingQuestions: JSON.stringify([
      { question: "How many Tunisians did the tourism sector once employ?", type: "mcq", choices: ["100,000", "200,000", "400,000", "600,000"], answer: "400,000", points: 1 },
      { question: "What is the focus of 'Destination Tunisia 2030'?", type: "mcq", choices: ["Increasing visitor numbers", "Quality over quantity", "Building more hotels", "Reducing prices"], answer: "Quality over quantity", points: 1 },
      { question: "According to the text, what does the new tourism model promise?", type: "mcq", choices: ["More visitors", "Lower prices", "A more resilient and rewarding industry", "More government control"], answer: "A more resilient and rewarding industry", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in with the correct comparative: 'The sector faced _____ (bad) challenges than ever before.'", type: "gap-fill", answer: "worse", points: 1 },
      { prompt: "Rewrite in passive voice: 'The Ministry of Tourism has launched a strategic plan.'", type: "rewrite", answer: "A strategic plan has been launched by the Ministry of Tourism.", points: 2 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2021-principale-english',
    year: 2021,
    title: 'BAC 2021 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2021: Reading on Women in STEM + Language + Article Writing',
    modelAnswer: 'Model answer includes reading comprehension on women in science, grammar exercises on comparatives and relative clauses, article about inspiring Tunisian woman in STEM.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `Women in Science: Breaking Barriers in Tunisia

In laboratories across Tunisia, a quiet revolution is taking place. Increasing numbers of women are pursuing careers in science, technology, engineering, and mathematics (STEM)—fields traditionally dominated by men.

Tunisia has long been a regional leader in women's rights. The country's 1956 Personal Status Code granted women unprecedented legal protections. Education has been compulsory for girls since independence.

Yet STEM fields remained stubbornly male. The few women who persisted faced stereotypes, isolation, and limited mentorship.

The situation is changing. Female enrollment in engineering at Tunisia's universities has risen to 35% and continues climbing.

Government initiatives now support women researchers through dedicated funding programs. The country cannot afford to waste the potential of half its population. In science, equality is not merely a moral imperative—it is a practical necessity for national development.`,
    topics: JSON.stringify(["women", "STEM", "gender equality", "education", "Tunisia"]),
    bacRelevance: "Module 5: Women and Power / Module 2: Education Matters",
    readingTitle: "Women in Science: Breaking Barriers in Tunisia",
    readingContent: `Women in Science: Breaking Barriers in Tunisia

In laboratories across Tunisia, a quiet revolution is taking place. Increasing numbers of women are pursuing careers in science, technology, engineering, and mathematics (STEM)—fields traditionally dominated by men.

Tunisia has long been a regional leader in women's rights. The country's 1956 Personal Status Code granted women unprecedented legal protections. Education has been compulsory for girls since independence.

Yet STEM fields remained stubbornly male. The few women who persisted faced stereotypes, isolation, and limited mentorship.

The situation is changing. Female enrollment in engineering at Tunisia's universities has risen to 35% and continues climbing.

Government initiatives now support women researchers through dedicated funding programs. The country cannot afford to waste the potential of half its population. In science, equality is not merely a moral imperative—it is a practical necessity for national development.`,
    readingQuestions: JSON.stringify([
      { question: "What percentage of engineering enrollment is now female?", type: "mcq", choices: ["20%", "25%", "35%", "50%"], answer: "35%", points: 1 },
      { question: "When did Tunisia make education compulsory for girls?", type: "mcq", choices: ["1956", "At independence", "2011", "2000"], answer: "At independence", points: 1 },
      { question: "What is the author's main argument about women in STEM?", type: "mcq", choices: ["Women are naturally better at science", "Equality is a practical necessity for national development", "Men should leave STEM fields", "STEM is too difficult for women"], answer: "Equality is a practical necessity for national development", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in with the correct comparative/superlative: 'Tunisia has been _____ (good) regional leader in women's rights.'", type: "gap-fill", answer: "a better", points: 1 },
      { prompt: "Complete with the appropriate relative pronoun: 'Women _____ persisted faced stereotypes and limited mentorship.'", type: "mcq", choices: ["who", "which", "where", "when"], answer: "who", points: 1 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  },
  {
    slug: 'bac-2020-principale-english',
    year: 2020,
    title: 'BAC 2020 - Session Principale - English',
    language: Language.ENGLISH,
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    prompt: 'BAC English Exam - Session Principale 2020: Reading on Climate Change + Language + Opinion Essay',
    modelAnswer: 'Model answer includes reading comprehension on climate change, grammar exercises, and 200-250 word opinion essay on environmental action.',
    isOfficial: true,
    section: 'ALL_SECTIONS',
    readingPassage: `Climate Change: A Call to Action

The evidence is overwhelming: climate change represents one of the greatest challenges facing humanity in the 21st century. Rising temperatures, extreme weather events, and sea-level rise threaten communities around the globe—including Tunisia's coastal regions.

The scientific consensus is clear. Human activities, particularly the burning of fossil fuels, have released greenhouse gases that trap heat in the atmosphere. Since the Industrial Revolution, global temperatures have risen by approximately 1.1 degrees Celsius.

The consequences are already visible. Tunisia has experienced increasingly severe droughts, affecting agriculture and water supplies. Coastal erosion threatens tourism infrastructure. Heat waves pose health risks, particularly for vulnerable populations.

Addressing climate change requires action at multiple levels. International agreements like the Paris Agreement set framework targets. National governments must implement policies to reduce emissions and transition to renewable energy.

Individual choices matter too. Reducing energy consumption, minimizing waste, and choosing sustainable transportation options all contribute to collective impact.

The window for preventing the worst effects is narrowing. Yet there is reason for hope. Renewable energy technologies are becoming more affordable. Young people around the world are demanding action.`,
    topics: JSON.stringify(["climate change", "environment", "Tunisia", "sustainability", "global issues"]),
    bacRelevance: "Module 6: Sustainable Development",
    readingTitle: "Climate Change: A Call to Action",
    readingContent: `Climate Change: A Call to Action

The evidence is overwhelming: climate change represents one of the greatest challenges facing humanity in the 21st century. Rising temperatures, extreme weather events, and sea-level rise threaten communities around the globe—including Tunisia's coastal regions.

The scientific consensus is clear. Human activities, particularly the burning of fossil fuels, have released greenhouse gases that trap heat in the atmosphere. Since the Industrial Revolution, global temperatures have risen by approximately 1.1 degrees Celsius.

The consequences are already visible. Tunisia has experienced increasingly severe droughts, affecting agriculture and water supplies. Coastal erosion threatens tourism infrastructure. Heat waves pose health risks, particularly for vulnerable populations.

Addressing climate change requires action at multiple levels. International agreements like the Paris Agreement set framework targets. National governments must implement policies to reduce emissions and transition to renewable energy.

Individual choices matter too. Reducing energy consumption, minimizing waste, and choosing sustainable transportation options all contribute to collective impact.

The window for preventing the worst effects is narrowing. Yet there is reason for hope. Renewable energy technologies are becoming more affordable. Young people around the world are demanding action.`,
    readingQuestions: JSON.stringify([
      { question: "By how much have global temperatures risen since the Industrial Revolution?", type: "mcq", choices: ["0.5 degrees", "1.1 degrees", "2.0 degrees", "3.0 degrees"], answer: "1.1 degrees", points: 1 },
      { question: "What threatens Tunisia's tourism infrastructure according to the text?", type: "mcq", choices: ["Earthquakes", "Coastal erosion", "Floods", "Wildfires"], answer: "Coastal erosion", points: 1 },
      { question: "What international agreement is mentioned as setting framework targets?", type: "mcq", choices: ["Kyoto Protocol", "Paris Agreement", "Geneva Convention", "Montreal Protocol"], answer: "Paris Agreement", points: 2 }
    ]),
    languageQuestions: JSON.stringify([
      { prompt: "Fill in the blank: 'Global temperatures have _____ (rise) by approximately 1.1 degrees Celsius.'", type: "gap-fill", answer: "risen", points: 1 },
      { prompt: "Complete the sentence: 'The consequences _____ (be) already visible.'", type: "gap-fill", answer: "are", points: 1 }
    ]),
    methodology: "Standard Tunisian BAC English format: Part I Reading (12 points), Part II Language Study (8 points), Part III Writing (10 points)"
  }
];

async function seed() {
  console.log('Seeding Tunisian BAC English Exam Archive...\n');
  
  for (const exam of BAC_EXAMS) {
    await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: exam,
      create: exam
    });
    console.log(`✓ ${exam.title} (${exam.year})`);
  }
  
  console.log(`\n✅ Successfully seeded ${BAC_EXAMS.length} official BAC English exams`);
  console.log(`📚 Archive: 2020-2025 (Principale + Contrôle sessions)`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
