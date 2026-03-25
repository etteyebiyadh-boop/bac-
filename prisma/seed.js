const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const exams = [
  {
    slug: "2024-social-media-youth",
    language: "ENGLISH",
    year: 2024,
    title: "Bac 2024 (Principal Session): Social Media & Youth",
    difficulty: "MEDIUM",
    estimatedMinutes: 45,
    prompt:
      "Write an essay discussing the advantages and disadvantages of social media for teenagers.",
    methodology:
      "Start with a balanced introduction, develop one paragraph for benefits and one for drawbacks, then end with a clear personal position.",
    modelAnswer:
      "Social media has changed the daily life of teenagers. On the one hand, it helps them communicate, learn, and discover opportunities. On the other hand, overuse can cause distraction, stress, and lower concentration. In conclusion, social media is useful when used responsibly and in moderation."
  },
  {
    slug: "2024-student-volunteering",
    language: "ENGLISH",
    year: 2024,
    title: "Bac 2024 (Control Session): Student Volunteering",
    difficulty: "MEDIUM",
    estimatedMinutes: 45,
    prompt:
      "Write an essay explaining why volunteering can be important for secondary school students.",
    methodology:
      "Begin with a clear thesis, organize your ideas around personal growth and social impact, and finish with a practical conclusion.",
    modelAnswer:
      "Volunteering helps students become more responsible and confident. It also teaches teamwork and allows young people to support their communities. For these reasons, volunteering is an important experience for secondary school students."
  },
  {
    slug: "2023-travel-and-education",
    language: "ENGLISH",
    year: 2023,
    title: "Bac 2023 (Principal Session): Travel and Education",
    difficulty: "EASY",
    estimatedMinutes: 45,
    prompt: "Explain how traveling can contribute to a student's education.",
    methodology:
      "Define the topic quickly, give two concrete benefits with examples, and keep the conclusion short and direct.",
    modelAnswer:
      "Traveling is an important part of education because it allows students to discover new cultures and ideas. It improves language skills and helps students become open-minded. Therefore, travel is a practical way to learn outside the classroom."
  },
  {
    slug: "2023-reading-habits",
    language: "ENGLISH",
    year: 2023,
    title: "Bac 2023 (Control Session): Reading Habits",
    difficulty: "EASY",
    estimatedMinutes: 40,
    prompt:
      "Discuss the importance of reading habits in the life of young people.",
    methodology:
      "State why reading matters, give two educational benefits, and support them with simple examples from student life.",
    modelAnswer:
      "Reading habits are important because they improve vocabulary, imagination, and concentration. Students who read regularly often write better and understand ideas more deeply. Reading is therefore an essential habit for young people."
  },
  {
    slug: "2022-technology-in-schools",
    language: "ENGLISH",
    year: 2022,
    title: "Bac 2022 (Principal Session): Technology in Schools",
    difficulty: "MEDIUM",
    estimatedMinutes: 50,
    prompt:
      "Should schools replace printed books with tablets? Give arguments for your opinion.",
    methodology:
      "State your position early, compare both options in the body, and support each point with a practical school-based example.",
    modelAnswer:
      "Tablets can reduce school bag weight and provide interactive content. However, printed books are less distracting and easier for long reading. Schools should combine both methods to gain benefits while reducing drawbacks."
  },
  {
    slug: "2022-online-learning-balance",
    language: "ENGLISH",
    year: 2022,
    title: "Bac 2022 (Control Session): Online Learning Balance",
    difficulty: "MEDIUM",
    estimatedMinutes: 45,
    prompt:
      "Do you think online learning can fully replace classroom education? Explain your opinion.",
    methodology:
      "Take a clear position from the introduction, compare both learning modes, and mention at least one practical limitation.",
    modelAnswer:
      "Online learning offers flexibility and access to many resources, but it cannot fully replace classroom interaction. Students still need direct guidance, discussion, and social contact. A balanced combination is the best solution."
  },
  {
    slug: "2021-environmental-responsibility",
    language: "ENGLISH",
    year: 2021,
    title: "Bac 2021 (Principal Session): Environmental Responsibility",
    difficulty: "HARD",
    estimatedMinutes: 50,
    prompt:
      "Write about the role of young people in protecting the environment.",
    methodology:
      "Use an introduction that defines responsibility, then organize the body around actions, awareness, and long-term impact.",
    modelAnswer:
      "Young people have a key role in environmental protection through daily habits and community action. They can reduce waste, save energy, and raise awareness on social media. Collective effort from youth can create long-term change."
  },
  {
    slug: "2021-part-time-work",
    language: "ENGLISH",
    year: 2021,
    title: "Bac 2021 (Control Session): Part-Time Work for Students",
    difficulty: "HARD",
    estimatedMinutes: 50,
    prompt:
      "Should secondary school students have part-time jobs? Discuss the advantages and disadvantages.",
    methodology:
      "Keep the essay balanced, explain both benefits and risks, and end with a reasonable final opinion.",
    modelAnswer:
      "Part-time work can teach responsibility and help students gain experience. However, too much work may reduce study time and create stress. Students should only work part-time if they can protect their school performance."
  },
  {
    slug: "2020-success-and-failure",
    language: "ENGLISH",
    year: 2020,
    title: "Bac 2020 (Principal Session): Success and Failure",
    difficulty: "HARD",
    estimatedMinutes: 50,
    prompt:
      "Do you agree that failure is necessary for success? Support your view with examples.",
    methodology:
      "Take a strong position, use examples from real life or study habits, and make sure the final paragraph reinforces the thesis.",
    modelAnswer:
      "Failure teaches valuable lessons, builds resilience, and pushes individuals to improve. Many successful people failed before reaching their goals. In this sense, failure can be a step toward success if we learn from it."
  },
  {
    slug: "2020-youth-and-technology-dependence",
    language: "ENGLISH",
    year: 2020,
    title: "Bac 2020 (Control Session): Technology Dependence",
    difficulty: "HARD",
    estimatedMinutes: 50,
    prompt:
      "Is modern life becoming too dependent on technology? Support your answer with examples.",
    methodology:
      "Define dependence clearly, give examples from school and daily life, and present a balanced conclusion.",
    modelAnswer:
      "Modern life clearly depends on technology for communication, study, and work. This dependence brings efficiency, but it also creates distraction and reduces independence in some situations. People must use technology wisely instead of relying on it completely."
  }
];

const lessons = [
  {
    slug: "english-essay-structure",
    language: "ENGLISH",
    title: "Build a Bac Essay That Feels Organized",
    summary: "Learn how to write an introduction, clear body paragraphs, and a short conclusion.",
    body:
      "A strong bac essay needs a simple structure. Start with an introduction that answers the question and shows your position. Then write body paragraphs with one main idea each, supported by an example or explanation. Finish with a conclusion that restates the main idea without repeating the whole essay.",
    theme: "Essay writing",
    skillFocus: "structure",
    difficulty: "EASY",
    estimatedMinutes: 5,
    takeawayJson: [
      "Write one clear idea per paragraph.",
      "Use an introduction that answers the prompt directly.",
      "Keep the conclusion short and purposeful."
    ]
  },
  {
    slug: "english-connectors-and-transitions",
    language: "ENGLISH",
    title: "Use Connectors to Improve Flow",
    summary: "Make ideas easier to follow with simple and accurate transitions.",
    body:
      "Connectors help your essay sound logical. Use addition words like moreover and in addition, contrast words like however and on the other hand, and result words like therefore and as a result. Choose simple connectors that you can use correctly instead of forcing advanced expressions.",
    theme: "Cohesion",
    skillFocus: "structure",
    difficulty: "MEDIUM",
    estimatedMinutes: 5,
    takeawayJson: [
      "Use connectors to show addition, contrast, and result.",
      "Do not overuse long transition phrases.",
      "A connector must match the meaning of the sentence."
    ]
  },
  {
    slug: "english-common-grammar-fixes",
    language: "ENGLISH",
    title: "Fix the Grammar Errors That Cost Easy Marks",
    summary: "Focus on verb tense, subject-verb agreement, and article usage.",
    body:
      "Many bac essays lose marks because of repeated grammar mistakes. Check whether the subject and verb agree, make sure the tense stays consistent, and use articles like a, an, and the correctly. When editing your essay, review each sentence slowly instead of changing everything at once.",
    theme: "Grammar",
    skillFocus: "grammar",
    difficulty: "EASY",
    estimatedMinutes: 6,
    takeawayJson: [
      "Check agreement between the subject and the verb.",
      "Stay consistent with the main tense of the essay.",
      "Review articles and plural forms carefully."
    ]
  },
  {
    slug: "english-stronger-vocabulary",
    language: "ENGLISH",
    title: "Improve Vocabulary Without Sounding Unnatural",
    summary: "Use accurate and reusable vocabulary for common bac themes.",
    body:
      "Good vocabulary does not mean complicated vocabulary. Choose words that are precise and easy to control. For themes like education, technology, and environment, prepare a few strong expressions and reuse them naturally in sentences. Accuracy is better than decoration.",
    theme: "Vocabulary",
    skillFocus: "vocabulary",
    difficulty: "MEDIUM",
    estimatedMinutes: 5,
    takeawayJson: [
      "Choose accurate words before advanced words.",
      "Prepare vocabulary by theme before the exam.",
      "Reuse strong expressions naturally instead of forcing new ones."
    ]
  },
  {
    slug: "english-argument-support",
    language: "ENGLISH",
    title: "Support Your Opinion With Better Examples",
    summary: "Learn to turn a basic opinion into a convincing argument.",
    body:
      "A high-scoring bac essay does more than state an opinion. Each body paragraph should explain why the idea matters and include an example from school, daily life, or society. Short examples are enough if they clearly support the point you are making.",
    theme: "Argumentation",
    skillFocus: "structure",
    difficulty: "MEDIUM",
    estimatedMinutes: 6,
    takeawayJson: [
      "Every opinion needs a reason.",
      "One short example can strengthen a paragraph.",
      "Explain the impact of your idea, not only the idea itself."
    ]
  },
  {
    slug: "english-better-sentence-variety",
    language: "ENGLISH",
    title: "Write More Varied Sentences",
    summary: "Avoid repetitive sentence patterns and improve readability.",
    body:
      "Sentence variety makes an essay more pleasant to read. Mix short and slightly longer sentences, start some sentences with connectors, and use relative clauses only when you control them well. Variety should improve clarity, not make the sentence confusing.",
    theme: "Style",
    skillFocus: "vocabulary",
    difficulty: "HARD",
    estimatedMinutes: 6,
    takeawayJson: [
      "Mix short and medium-length sentences.",
      "Use variety only when the sentence stays clear.",
      "Readable writing usually scores better than forced complexity."
    ]
  },
  {
    slug: "english-communication-opinions",
    language: "ENGLISH",
    title: "Expressing Opinion & Agreement",
    summary: "Master the exact phrases to express and justify your opinion in dialogues and functions.",
    body: "In the Tunisian bac exam, communication functions require you to use specific phrases. For expressing opinion: 'In my view' or 'I strongly believe that'. For agreeing: 'I share your point of view' or 'I couldn't agree more'. For disagreeing politely: 'I see your point, but...'.",
    theme: "Functions",
    skillFocus: "communication",
    difficulty: "EASY",
    estimatedMinutes: 5,
    takeawayJson: [
      "Always justify your opinion after stating it.",
      "Use 'I share your point of view' to agree strongly."
    ]
  },
  {
    slug: "english-pronunciation-ed-sounds",
    language: "ENGLISH",
    title: "Pronunciation of final -ed",
    summary: "Learn the 3 simple rules to never miss the 'ed' pronunciation question.",
    body: "The final -ed is pronounced /t/ after unvoiced sounds (p, k, s, ch, sh, f). It is pronounced /d/ after voiced sounds (b, g, z, v, m, n, l, r, and vowels). It is pronounced /Id/ only after T and D sounds (e.g., wanted, needed).",
    theme: "Pronunciation",
    skillFocus: "pronunciation",
    difficulty: "MEDIUM",
    estimatedMinutes: 6,
    takeawayJson: [
      "/Id/ after T and D.",
      "/t/ after P, K, S, SH, CH, F.",
      "/d/ for all the rest."
    ]
  },
  {
    slug: "french-reading-comprehension-tricks",
    language: "FRENCH",
    title: "Compréhension: Relever et Justifier",
    summary: "Comment répondre parfaitement aux questions de compréhension de l'écrit sans perdre de points.",
    body: "Ne copiez jamais toute la phrase ! Quand on vous demande de justifier, trouvez la phrase exacte, ouvrez les guillemets (\"\"), copiez le segment exact, et fermez les guillemets. Pour un relevé, assurez-vous que le mot ou l'expression répond directement à la question.",
    theme: "Reading Comprehension",
    skillFocus: "comprehension",
    difficulty: "EASY",
    estimatedMinutes: 5,
    takeawayJson: [
      "Toujours utiliser les guillemets pour justifier.",
      "Ne pas recopier tout le paragraphe."
    ]
  }
];

const exercises = [
  {
    slug: "grammar-subject-verb-agreement",
    language: "ENGLISH",
    lessonSlug: "english-common-grammar-fixes",
    type: "GRAMMAR",
    prompt: "Choose the correct sentence.",
    choicesJson: [
      "Social media help students learn faster.",
      "Social media helps students learn faster.",
      "Social media helping students learn faster."
    ],
    answerJson: { correctChoice: "Social media helps students learn faster." },
    explanation:
      "The subject social media is treated as singular here, so the verb should be helps.",
    difficulty: "EASY",
    skillFocus: "grammar",
    xpReward: 20
  },
  {
    slug: "grammar-article-choice",
    language: "ENGLISH",
    lessonSlug: "english-common-grammar-fixes",
    type: "GRAMMAR",
    prompt: "Complete the sentence: Traveling is ___ useful way to learn about other cultures.",
    choicesJson: ["a", "an", "the"],
    answerJson: { correctChoice: "a" },
    explanation:
      "Use a before useful because useful begins with a consonant sound.",
    difficulty: "EASY",
    skillFocus: "grammar",
    xpReward: 20
  },
  {
    slug: "structure-best-introduction",
    language: "ENGLISH",
    lessonSlug: "english-essay-structure",
    type: "STRUCTURE",
    prompt: "Which introduction is the strongest opening for a bac opinion essay?",
    choicesJson: [
      "This topic is very important. There are many ideas about it.",
      "Many students disagree about the topic, but I believe schools should combine books and tablets for better learning.",
      "In this essay I will write many different things about technology."
    ],
    answerJson: {
      correctChoice:
        "Many students disagree about the topic, but I believe schools should combine books and tablets for better learning."
    },
    explanation:
      "The best introduction presents the issue and gives a clear position immediately.",
    difficulty: "MEDIUM",
    skillFocus: "structure",
    xpReward: 25
  },
  {
    slug: "structure-correct-connector",
    language: "ENGLISH",
    lessonSlug: "english-connectors-and-transitions",
    type: "STRUCTURE",
    prompt:
      "Choose the best connector: Tablets are interactive. ___, printed books are easier for long reading.",
    choicesJson: ["However", "Moreover", "For example"],
    answerJson: { correctChoice: "However" },
    explanation:
      "However is correct because the second sentence contrasts with the first one.",
    difficulty: "MEDIUM",
    skillFocus: "structure",
    xpReward: 20
  },
  {
    slug: "vocabulary-theme-choice",
    language: "ENGLISH",
    lessonSlug: "english-stronger-vocabulary",
    type: "VOCABULARY",
    prompt:
      "Choose the most precise word: Social media can create a strong sense of ___ among teenagers.",
    choicesJson: ["belonging", "thing", "situation"],
    answerJson: { correctChoice: "belonging" },
    explanation:
      "Belonging is the most precise word for social connection in this context.",
    difficulty: "MEDIUM",
    skillFocus: "vocabulary",
    xpReward: 20
  },
  {
    slug: "vocabulary-better-expression",
    language: "ENGLISH",
    lessonSlug: "english-better-sentence-variety",
    type: "VOCABULARY",
    prompt:
      "Which option sounds stronger in a bac essay: 'technology is good' or 'technology offers practical advantages'?",
    choicesJson: [
      "technology is good",
      "technology offers practical advantages"
    ],
    answerJson: { correctChoice: "technology offers practical advantages" },
    explanation:
      "The second option is more precise and sounds more academic without becoming unnatural.",
    difficulty: "HARD",
    skillFocus: "vocabulary",
    xpReward: 25
  }
];

async function main() {
  for (const exam of exams) {
    await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: exam,
      create: exam
    });
  }

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lesson,
      create: lesson
    });
  }

  for (const exercise of exercises) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: exercise.lessonSlug },
      select: { id: true }
    });

    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: {
        language: exercise.language,
        lessonId: lesson?.id,
        type: exercise.type,
        prompt: exercise.prompt,
        choicesJson: exercise.choicesJson,
        answerJson: exercise.answerJson,
        explanation: exercise.explanation,
        difficulty: exercise.difficulty,
        skillFocus: exercise.skillFocus,
        xpReward: exercise.xpReward
      },
      create: {
        slug: exercise.slug,
        language: exercise.language,
        lessonId: lesson?.id,
        type: exercise.type,
        prompt: exercise.prompt,
        choicesJson: exercise.choicesJson,
        answerJson: exercise.answerJson,
        explanation: exercise.explanation,
        difficulty: exercise.difficulty,
        skillFocus: exercise.skillFocus,
        xpReward: exercise.xpReward
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
