const { PrismaClient, Language, GrammarCategory, VocabTheme, BacModule, Difficulty } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * BAC TUNISIA ENGLISH PROGRAMME - OFFICIAL SEED
 * Aligned with the Tunisian Ministry of Education curriculum for:
 * - Sciences Expérimentales (SVT)
 * - Mathématiques
 * - Sciences Informatique
 * - Sciences Techniques
 * 
 * 3AC Modules:
 * - Module 1: Holidaying and Art Shows
 * - Module 2: Education Matters  
 * - Module 3: Creative Inventive Minds
 */

async function main() {
  console.log('🎓 Seeding BAC Tunisia English Programme...\n');

  // Clear existing content
  await prisma.vocabItem.deleteMany();
  await prisma.vocabularySet.deleteMany();
  await prisma.grammarRule.deleteMany();
  await prisma.verbConjugation.deleteMany();

  // ==========================================
  // GRAMMAR RULES - Organized by BAC Module relevance
  // ==========================================
  
  console.log('📘 Creating Grammar Rules...');
  
  const grammarRules = [
    // MODULE 1: HOLIDAYING AND ART SHOWS - Travel/Tourism contexts
    {
      slug: 'present-simple-habits',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.TENSES,
      title: 'Present Simple for Habits & General Truths',
      rule: 'Use Present Simple for regular actions, habits, and permanent situations.',
      formula: 'S + V1(s/es) / S + do/does + not + V1',
      examples: [
        { positive: 'Tourists usually visit museums in the morning.', context: 'Module 1 - Holidaying' },
        { positive: 'Art shows attract thousands of visitors every year.', context: 'Module 1 - Art Shows' },
        { positive: 'The festival takes place in July.', context: 'Module 1 - Events' }
      ],
      exceptions: ['Time expressions: always, usually, often, sometimes, never, every day/year'],
      usageNotes: 'Essential for describing travel routines, festival schedules, and tourist behaviors.',
      commonErrors: ['Using continuous form for habits: "I am liking" instead of "I like"'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'present-perfect-experiences',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.TENSES,
      title: 'Present Perfect for Life Experiences',
      rule: 'Use Present Perfect for experiences without specific time reference.',
      formula: 'S + have/has + V3',
      examples: [
        { positive: 'Have you ever visited Carthage?', context: 'Module 1 - Travel' },
        { positive: 'I have never attended an art exhibition.', context: 'Module 1 - Art Shows' },
        { positive: 'She has travelled to many countries.', context: 'Module 1 - Holidaying' }
      ],
      exceptions: ['Use "ever" in questions, "never" for negative experiences'],
      usageNotes: 'Common in travel conversations and describing cultural experiences.',
      commonErrors: ['Using past simple with "ever": "Did you ever go?" instead of "Have you ever been?"'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'modal-verbs-possibility',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.MODALS,
      title: 'Modals for Possibility (may, might, could)',
      rule: 'Use may/might/could to express possibility in the present or future.',
      formula: 'S + may/might/could + V1',
      examples: [
        { positive: 'The weather might be sunny tomorrow.', context: 'Module 1 - Travel plans' },
        { positive: 'You could visit the museum in the afternoon.', context: 'Module 1 - Suggestions' },
        { positive: 'The festival may attract many tourists.', context: 'Module 1 - Predictions' }
      ],
      exceptions: ['Might = less certain than may', 'Could = suggestion/possibility'],
      usageNotes: 'Essential for making travel suggestions and discussing festival possibilities.',
      commonErrors: ['Adding "to" after modal: "You could to visit" instead of "You could visit"'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    
    // MODULE 2: EDUCATION MATTERS - Academic contexts
    {
      slug: 'comparative-superlative',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.COMPARATIVES,
      title: 'Comparative and Superlative Adjectives',
      rule: 'Use -er/-est for short adjectives, more/most for long adjectives.',
      formula: 'Short: adj+er / adj+est | Long: more/most + adj',
      examples: [
        { positive: 'Online learning is more convenient than traditional classes.', context: 'Module 2 - Education' },
        { positive: 'She is the most talented student in the class.', context: 'Module 2 - Academic' },
        { positive: 'This method is better than the old one.', context: 'Module 2 - Learning' }
      ],
      exceptions: ['Irregular: good-better-best, bad-worse-worst, far-further-furthest'],
      usageNotes: 'Key for comparing educational methods, student performance, and school systems.',
      commonErrors: ['Double marking: "more better" instead of "better"'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'passive-voice-academic',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.PASSIVE_VOICE,
      title: 'Passive Voice (Present & Past)',
      rule: 'Use passive when the action is more important than the doer.',
      formula: 'S + am/is/are/was/were + V3',
      examples: [
        { positive: 'The exam was taken by 500 students.', context: 'Module 2 - Assessment' },
        { positive: 'Education is provided free of charge in public schools.', context: 'Module 2 - Education' },
        { positive: 'New technologies are being introduced in classrooms.', context: 'Module 2 - Innovation' }
      ],
      exceptions: ['By-agent can be omitted when unknown or unimportant'],
      usageNotes: 'Essential for academic writing and formal educational discourse.',
      commonErrors: ['Forgetting the be verb: "The exam taken" instead of "The exam was taken"'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'reported-speech',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.REPORTED_SPEECH,
      title: 'Reported Speech',
      rule: 'Change tenses back one step when reporting what someone said.',
      formula: 'Said that + S + past tense / told + object + that + S + past tense',
      examples: [
        { positive: 'The teacher said that the exam would be easy.', context: 'Module 2 - School' },
        { positive: 'He told me that he had studied all night.', context: 'Module 2 - Learning' },
        { positive: 'The principal announced that the school would close early.', context: 'Module 2 - Education' }
      ],
      exceptions: ['If reporting immediately, tenses may stay the same'],
      usageNotes: 'Important for academic discussions and reporting research findings.',
      commonErrors: ['Not changing pronouns: "He said that I studied" instead of "He said that he studied"'],
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'modal-verbs-obligation',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.MODALS,
      title: 'Modals for Obligation & Advice (must, should, have to)',
      rule: 'Use must for strong obligation, should for advice, have to for external rules.',
      formula: 'S + must/should/have to + V1',
      examples: [
        { positive: 'Students must submit their essays on Friday.', context: 'Module 2 - Academic' },
        { positive: 'You should review your notes before the exam.', context: 'Module 2 - Advice' },
        { positive: 'We have to wear uniforms at school.', context: 'Module 2 - Rules' }
      ],
      exceptions: ['Mustn\'t = prohibition', 'Don\'t have to = no obligation'],
      usageNotes: 'Critical for discussing school rules, academic requirements, and advice.',
      commonErrors: ['Confusing mustn\'t and don\'t have to'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    
    // MODULE 3: CREATIVE INVENTIVE MINDS - Innovation contexts
    {
      slug: 'conditionals-types',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      category: GrammarCategory.CONDITIONALS,
      title: 'Conditional Sentences (Zero, First, Second, Third)',
      rule: 'Different conditionals express different levels of possibility.',
      formula: 'Zero: If + present, present | First: If + present, will | Second: If + past, would | Third: If + past perfect, would have',
      examples: [
        { positive: 'If you heat water to 100°C, it boils.', context: 'Module 3 - Scientific facts' },
        { positive: 'If we invest in research, we will make discoveries.', context: 'Module 3 - Innovation' },
        { positive: 'If I were an inventor, I would create a time machine.', context: 'Module 3 - Hypothetical' },
        { positive: 'If he had tested the product, he would have found the error.', context: 'Module 3 - Regret' }
      ],
      exceptions: ['Mixed conditionals combine different time references'],
      usageNotes: 'Essential for discussing inventions, hypotheses, and scientific possibilities.',
      commonErrors: ['Using will in if-clause: "If I will go" instead of "If I go"'],
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'connectors-logic',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      category: GrammarCategory.CONNECTORS,
      title: 'Sentence Connectors (Addition, Contrast, Cause, Result)',
      rule: 'Use connectors to link ideas logically and improve coherence.',
      formula: 'Addition: furthermore, moreover, in addition | Contrast: however, nevertheless, although | Cause: because, since, due to | Result: therefore, consequently, as a result',
      examples: [
        { positive: 'The invention was innovative; however, it was too expensive.', context: 'Module 3 - Innovation' },
        { positive: 'Due to technological advances, life has become easier.', context: 'Module 3 - Technology' },
        { positive: 'She worked hard; therefore, she succeeded.', context: 'Module 3 - Achievement' }
      ],
      exceptions: ['Although/Though/Even though introduce a contrast in the same clause'],
      usageNotes: 'Critical for essay writing about inventions and technological progress.',
      commonErrors: ['Using however with although in the same sentence'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'relative-clauses',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Relative Clauses (who, which, that, whose)',
      rule: 'Use relative clauses to give additional information about nouns.',
      formula: 'Noun + who/which/that/whose + clause',
      examples: [
        { positive: 'The scientist who invented the telephone changed history.', context: 'Module 3 - Inventors' },
        { positive: 'The invention which changed the world was the internet.', context: 'Module 3 - Technology' },
        { positive: 'Students whose projects are creative will win prizes.', context: 'Module 3 - Innovation' }
      ],
      exceptions: ['That can replace who/which in defining clauses', 'Comma for non-defining clauses'],
      usageNotes: 'Important for describing inventors, inventions, and creative projects.',
      commonErrors: ['Using what instead of which: "The thing what" instead of "The thing which/that"'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    
    // Universal Grammar (applies to all modules)
    {
      slug: 'past-simple-narrative',
      category: GrammarCategory.TENSES,
      title: 'Past Simple for Narratives',
      rule: 'Use Past Simple for completed actions at a specific time in the past.',
      formula: 'S + V2 / S + did + not + V1',
      examples: [
        { positive: 'The festival started at 9 AM yesterday.', context: 'All modules' },
        { positive: 'She invented a new device last year.', context: 'All modules' },
        { positive: 'I visited the museum during my trip.', context: 'All modules' }
      ],
      exceptions: ['Time expressions: yesterday, last week/month/year, ago, in 2020'],
      usageNotes: 'Fundamental for storytelling and describing past events.',
      commonErrors: ['Using present form instead of past: "I go yesterday" instead of "I went yesterday"'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'articles-basic',
      category: GrammarCategory.ARTICLES,
      title: 'Articles (a, an, the)',
      rule: 'Use a/an for first mention/general, the for specific/known.',
      formula: 'a/an + singular countable (first mention) | the + specific noun',
      examples: [
        { positive: 'A student came to see the teacher.', context: 'All modules' },
        { positive: 'The invention changed the world.', context: 'All modules' },
        { positive: 'Education is important for success.', context: 'All modules - Zero article' }
      ],
      exceptions: ['No article for general plurals and uncountable nouns'],
      usageNotes: 'Essential for all writing and speaking tasks.',
      commonErrors: ['Omitting the when specific: "I saw movie" instead of "I saw the movie"'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'prepositions-place-time',
      category: GrammarCategory.PREPOSITIONS,
      title: 'Prepositions of Place and Time',
      rule: 'Use in for months/years/locations, on for days/dates, at for specific times/places.',
      formula: 'in (month/year/season/country) | on (day/date) | at (time/place)',
      examples: [
        { positive: 'The festival is in July.', context: 'All modules - Time' },
        { positive: 'The exam starts at 8 AM.', context: 'All modules - Time' },
        { positive: 'She lives in Tunisia.', context: 'All modules - Place' },
        { positive: 'We met on Monday.', context: 'All modules - Time' }
      ],
      exceptions: ['In the morning/afternoon/evening', 'At night', 'On time vs In time'],
      usageNotes: 'Fundamental for all contexts - travel, education, and events.',
      commonErrors: ['"I will go on July" instead of "I will go in July"'],
      difficulty: Difficulty.EASY,
      isEssential: true
    }
  ];

  for (const rule of grammarRules) {
    await prisma.grammarRule.create({ data: rule });
  }
  console.log(`✅ Created ${grammarRules.length} Grammar Rules`);

  // ==========================================
  // VERB CONJUGATIONS - Essential for BAC
  // ==========================================
  
  console.log('\n🔤 Creating Essential Verb Conjugations...');
  
  const essentialIrregularVerbs = [
    {
      slug: 'be',
      baseForm: 'be',
      pastSimple: 'was/were',
      pastParticiple: 'been',
      presentParticiple: 'being',
      thirdPersonSingular: 'is',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'am', he: 'is', she: 'is', it: 'is', we: 'are', you: 'are', they: 'are' },
        past: { I: 'was', he: 'was', she: 'was', it: 'was', we: 'were', you: 'were', they: 'were' }
      },
      commonUses: ['Describing states and conditions', 'Forming passive voice', 'Forming continuous tenses'],
      exampleSentences: ['The festival is in July.', 'Education is important.', 'They were at the museum yesterday.'],
      collocations: ['be interested in', 'be good at', 'be afraid of', 'be proud of']
    },
    {
      slug: 'have',
      baseForm: 'have',
      pastSimple: 'had',
      pastParticiple: 'had',
      presentParticiple: 'having',
      thirdPersonSingular: 'has',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'have', he: 'has', she: 'has', it: 'has', we: 'have', you: 'have', they: 'have' },
        past: { I: 'had', he: 'had', she: 'had', it: 'had', we: 'had', you: 'had', they: 'had' }
      },
      commonUses: ['Possession', 'Perfect tenses (have + V3)', 'Obligations (have to)'],
      exampleSentences: ['I have a book about inventions.', 'She has visited many countries.', 'We had a great time at the festival.'],
      collocations: ['have to', 'have lunch', 'have fun', 'have an idea']
    },
    {
      slug: 'go',
      baseForm: 'go',
      pastSimple: 'went',
      pastParticiple: 'gone',
      presentParticiple: 'going',
      thirdPersonSingular: 'goes',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'go', he: 'goes', she: 'goes', it: 'goes', we: 'go', you: 'go', they: 'go' },
        past: { I: 'went', he: 'went', she: 'went', it: 'went', we: 'went', you: 'went', they: 'went' }
      },
      commonUses: ['Movement and travel', 'Future plans (be going to)', 'General progress'],
      exampleSentences: ['We go to school every day.', 'They went to the art show yesterday.', 'I am going to study engineering.'],
      collocations: ['go abroad', 'go shopping', 'go sightseeing', 'go wrong']
    },
    {
      slug: 'take',
      baseForm: 'take',
      pastSimple: 'took',
      pastParticiple: 'taken',
      presentParticiple: 'taking',
      thirdPersonSingular: 'takes',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'take', he: 'takes', she: 'takes', it: 'takes', we: 'take', you: 'take', they: 'take' },
        past: { I: 'took', he: 'took', she: 'took', it: 'took', we: 'took', you: 'took', they: 'took' }
      },
      commonUses: ['Transport/moving', 'Photos/exams', 'Time duration'],
      exampleSentences: ['It takes two hours to get there.', 'She took beautiful photos.', 'We take the exam next week.'],
      collocations: ['take place', 'take part in', 'take advantage of', 'take care of']
    },
    {
      slug: 'make',
      baseForm: 'make',
      pastSimple: 'made',
      pastParticiple: 'made',
      presentParticiple: 'making',
      thirdPersonSingular: 'makes',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'make', he: 'makes', she: 'makes', it: 'makes', we: 'make', you: 'make', they: 'make' },
        past: { I: 'made', he: 'made', she: 'made', it: 'made', we: 'made', you: 'made', they: 'made' }
      },
      commonUses: ['Creating/producing', 'Forcing/compelling', 'Decisions/plans'],
      exampleSentences: ['He made a creative invention.', 'This makes learning easier.', 'They made a decision to study abroad.'],
      collocations: ['make progress', 'make a mistake', 'make sure', 'make sense']
    },
    {
      slug: 'get',
      baseForm: 'get',
      pastSimple: 'got',
      pastParticiple: 'got/gotten',
      presentParticiple: 'getting',
      thirdPersonSingular: 'gets',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'get', he: 'gets', she: 'gets', it: 'gets', we: 'get', you: 'get', they: 'get' },
        past: { I: 'got', he: 'got', she: 'got', it: 'got', we: 'got', you: 'got', they: 'got' }
      },
      commonUses: ['Receiving/obtaining', 'Becoming (get + adj)', 'Phrasal verbs'],
      exampleSentences: ['I got a good grade on the exam.', 'It is getting better.', 'We got to the museum early.'],
      collocations: ['get along with', 'get rid of', 'get used to', 'get in touch']
    },
    {
      slug: 'do',
      baseForm: 'do',
      pastSimple: 'did',
      pastParticiple: 'done',
      presentParticiple: 'doing',
      thirdPersonSingular: 'does',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'do', he: 'does', she: 'does', it: 'does', we: 'do', you: 'do', they: 'do' },
        past: { I: 'did', he: 'did', she: 'did', it: 'did', we: 'did', you: 'did', they: 'did' }
      },
      commonUses: ['General activities', 'Emphasis', 'Questions and negatives'],
      exampleSentences: ['Do your homework carefully.', 'What do you study?', 'I did my best on the project.'],
      collocations: ['do research', 'do business', 'do well', 'do someone a favor']
    },
    {
      slug: 'give',
      baseForm: 'give',
      pastSimple: 'gave',
      pastParticiple: 'given',
      presentParticiple: 'giving',
      thirdPersonSingular: 'gives',
      isIrregular: true,
      fullConjugation: {
        present: { I: 'give', he: 'gives', she: 'gives', it: 'gives', we: 'give', you: 'give', they: 'give' },
        past: { I: 'gave', he: 'gave', she: 'gave', it: 'gave', we: 'gave', you: 'gave', they: 'gave' }
      },
      commonUses: ['Offering/presenting', 'Presentations/speeches', 'Results/effects'],
      exampleSentences: ['She gave an excellent presentation.', 'This book gives useful information.', 'He gave me some advice.'],
      collocations: ['give up', 'give in', 'give a speech', 'give advice']
    }
  ];

  for (const verb of essentialIrregularVerbs) {
    await prisma.verbConjugation.create({
      data: {
        ...verb,
        language: Language.ENGLISH,
        isRegular: !verb.isIrregular,
        difficulty: Difficulty.MEDIUM
      }
    });
  }
  console.log(`✅ Created ${essentialIrregularVerbs.length} Essential Irregular Verbs`);

  // ==========================================
  // VOCABULARY SETS - Organized by BAC Module
  // ==========================================
  
  console.log('\n📚 Creating Vocabulary Sets by BAC Module...');

  // MODULE 1: HOLIDAYING AND ART SHOWS
  const vocabModule1 = await prisma.vocabularySet.create({
    data: {
      slug: 'module-1-travel-tourism',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      theme: VocabTheme.TRAVEL,
      title: 'Module 1: Travel & Tourism Essentials',
      description: 'Essential vocabulary for discussing travel, holidays, and tourism in the BAC exam.',
      bacContext: 'This vocabulary appears in reading passages about tourism, cultural festivals, and travel experiences. Essential for Module 1 essay writing.',
      difficulty: Difficulty.MEDIUM,
      items: {
        create: [
          { word: 'destination', definition: 'A place where someone is going', partOfSpeech: 'noun', exampleSentence: 'Our destination is a beautiful island in the Mediterranean.', bacExample: 'Tunisia has become a popular tourist destination for European travelers.', collocations: ['tourist destination', 'final destination', 'travel destination'] },
          { word: 'attraction', definition: 'An interesting or enjoyable place to visit', partOfSpeech: 'noun', exampleSentence: 'The Eiffel Tower is a major attraction in Paris.', bacExample: 'The ancient ruins of Carthage are the main attraction in the city of Tunis.', collocations: ['tourist attraction', 'main attraction', 'popular attraction'] },
          { word: 'accommodation', definition: 'A place to stay when traveling', partOfSpeech: 'noun', exampleSentence: 'We need to book accommodation before our trip.', bacExample: 'The hotel provides comfortable accommodation for visitors during the summer festival.', collocations: ['find accommodation', 'book accommodation', 'comfortable accommodation'] },
          { word: 'itinerary', definition: 'A planned route or journey', partOfSpeech: 'noun', exampleSentence: 'Our travel itinerary includes three cities in one week.', bacExample: 'Our itinerary includes visits to three museums in the capital.', collocations: ['travel itinerary', 'planned itinerary', 'follow an itinerary'] },
          { word: 'landmark', definition: 'A famous building or natural feature', partOfSpeech: 'noun', exampleSentence: 'The Statue of Liberty is a famous American landmark.', bacExample: 'The Carthage ruins are an important historical landmark in Tunisia.', collocations: ['historical landmark', 'famous landmark', 'iconic landmark'] },
          { word: 'exhibition', definition: 'A public display of art or objects', partOfSpeech: 'noun', exampleSentence: 'The museum is holding an exhibition of modern art.', bacExample: 'The art exhibition at the national museum attracted thousands of visitors.', collocations: ['art exhibition', 'hold an exhibition', 'visit an exhibition'] },
          { word: 'spectator', definition: 'A person who watches an event', partOfSpeech: 'noun', exampleSentence: 'Thousands of spectators watched the football match.', bacExample: 'The cultural festival had over 10,000 spectators from different countries.', collocations: ['spectator sport', 'attract spectators', 'large crowd of spectators'] },
          { word: 'heritage', definition: 'Traditions and culture passed down through generations', partOfSpeech: 'noun', exampleSentence: 'UNESCO works to protect world heritage sites.', bacExample: 'We must preserve our cultural heritage for future generations of Tunisians.', collocations: ['cultural heritage', 'national heritage', 'world heritage'] },
          { word: 'renowned', definition: 'Famous and respected', partOfSpeech: 'adjective', exampleSentence: 'She is a renowned expert in her field.', bacExample: 'The artist is renowned for his innovative paintings that reflect Tunisian culture.', collocations: ['world-renowned', 'renowned for', 'internationally renowned'] },
          { word: 'entertainment', definition: 'Amusement or enjoyment through performances', partOfSpeech: 'noun', exampleSentence: 'Movies are a popular form of entertainment.', bacExample: 'The summer festival offers various forms of entertainment for families.', collocations: ['live entertainment', 'evening entertainment', 'provide entertainment'] },
          { word: 'sightseeing', definition: 'Visiting places of interest', partOfSpeech: 'noun', exampleSentence: 'We spent the whole day sightseeing in London.', bacExample: 'We spent the afternoon sightseeing in the old city of Sousse.', collocations: ['go sightseeing', 'sightseeing tour', 'popular sightseeing spot'] },
          { word: 'journey', definition: 'An act of traveling from one place to another', partOfSpeech: 'noun', exampleSentence: 'The journey across the desert took three days.', bacExample: 'The journey to the festival took three hours by bus.', collocations: ['long journey', 'safe journey', 'enjoyable journey'] }
        ]
      }
    }
  });
  console.log(`✅ Created Module 1 Vocabulary: ${vocabModule1.title} (12 words)`);

  // MODULE 2: EDUCATION MATTERS
  const vocabModule2 = await prisma.vocabularySet.create({
    data: {
      slug: 'module-2-education-learning',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      theme: VocabTheme.EDUCATION,
      title: 'Module 2: Education & Learning',
      description: 'Academic vocabulary for discussing education systems, learning methods, and school life.',
      bacContext: 'Essential for writing about education, comparing learning methods, and discussing academic success in the BAC exam.',
      difficulty: Difficulty.MEDIUM,
      items: {
        create: [
          { word: 'curriculum', definition: 'The subjects and content taught in schools', partOfSpeech: 'noun', exampleSentence: 'The school curriculum includes science, math, and literature.', bacExample: 'The curriculum includes both science and arts subjects for all students.', collocations: ['school curriculum', 'design a curriculum', 'curriculum development'] },
          { word: 'assessment', definition: 'The evaluation of student learning', partOfSpeech: 'noun', exampleSentence: 'Teachers use assessment to measure student progress.', bacExample: 'Continuous assessment helps teachers monitor progress throughout the year.', collocations: ['formal assessment', 'continuous assessment', 'assessment method'] },
          { word: 'tuition', definition: 'Instruction or teaching, especially in small groups', partOfSpeech: 'noun', exampleSentence: 'He pays for private tuition to improve his grades.', bacExample: 'Private tuition can help students prepare for the BAC exam.', collocations: ['private tuition', 'tuition fees', 'give tuition'] },
          { word: 'scholarship', definition: 'Money given to support a student\'s education', partOfSpeech: 'noun', exampleSentence: 'She received a scholarship to study at Harvard University.', bacExample: 'She won a full scholarship to study engineering at university.', collocations: ['win a scholarship', 'full scholarship', 'scholarship program'] },
          { word: 'pedagogy', definition: 'The method and practice of teaching', partOfSpeech: 'noun', exampleSentence: 'Modern pedagogy focuses on student-centered learning.', bacExample: 'Modern pedagogy emphasizes student-centered learning over memorization.', collocations: ['modern pedagogy', 'pedagogy approach', 'effective pedagogy'] },
          { word: 'literacy', definition: 'The ability to read and write', partOfSpeech: 'noun', exampleSentence: 'The government promotes literacy for all citizens.', bacExample: 'Digital literacy has become essential in modern education and work.', collocations: ['digital literacy', 'literacy rate', 'literacy skills'] },
          { word: 'comprehensive', definition: 'Including all or nearly all aspects of something', partOfSpeech: 'adjective', exampleSentence: 'The report provides a comprehensive overview of the issue.', bacExample: 'The school offers a comprehensive education program covering many subjects.', collocations: ['comprehensive school', 'comprehensive approach', 'comprehensive study'] },
          { word: 'proficient', definition: 'Skilled and competent', partOfSpeech: 'adjective', exampleSentence: 'After years of practice, she is proficient in French.', bacExample: 'Students should be proficient in at least two foreign languages.', collocations: ['proficient in', 'highly proficient', 'become proficient'] },
          { word: 'academic', definition: 'Relating to education and scholarship', partOfSpeech: 'adjective', exampleSentence: 'She has excellent academic records from university.', bacExample: 'Good academic performance opens doors to university education.', collocations: ['academic year', 'academic success', 'academic achievement'] },
          { word: 'seminar', definition: 'A class at university for discussion and research', partOfSpeech: 'noun', exampleSentence: 'The professor gave an interesting seminar on climate change.', bacExample: 'The professor gave an interesting seminar on innovation and creativity.', collocations: ['attend a seminar', 'research seminar', 'seminar room'] },
          { word: 'tuition fees', definition: 'Money paid for instruction at a school or university', partOfSpeech: 'noun', exampleSentence: 'Many students struggle to pay high tuition fees at university.', bacExample: 'Many families struggle to pay high tuition fees at private schools.', collocations: ['pay tuition fees', 'high tuition fees', 'tuition fees increase'] },
          { word: 'diligent', definition: 'Showing care and effort in work', partOfSpeech: 'adjective', exampleSentence: 'The diligent student always completes her homework on time.', bacExample: 'Diligent students usually achieve better results in the BAC exam.', collocations: ['diligent student', 'diligent worker', 'diligent in'] }
        ]
      }
    }
  });
  console.log(`✅ Created Module 2 Vocabulary: ${vocabModule2.title} (12 words)`);

  // MODULE 3: CREATIVE INVENTIVE MINDS
  const vocabModule3 = await prisma.vocabularySet.create({
    data: {
      slug: 'module-3-innovation-technology',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      theme: VocabTheme.TECHNOLOGY,
      title: 'Module 3: Innovation & Technology',
      description: 'Vocabulary for discussing inventions, scientific progress, and technological innovation.',
      bacContext: 'Essential for writing about inventions, comparing old and new technologies, and discussing future innovations in the BAC exam.',
      difficulty: Difficulty.MEDIUM,
      items: {
        create: [
          { word: 'innovation', definition: 'A new idea, method, or device', partOfSpeech: 'noun', exampleSentence: 'The smartphone was a major innovation in communication.', bacExample: 'Technological innovation has transformed our daily lives in Tunisia.', collocations: ['technological innovation', 'drive innovation', 'latest innovation'] },
          { word: 'breakthrough', definition: 'An important discovery or development', partOfSpeech: 'noun', exampleSentence: 'Scientists made a breakthrough in cancer research.', bacExample: 'The scientist made a major breakthrough in renewable energy technology.', collocations: ['scientific breakthrough', 'major breakthrough', 'breakthrough discovery'] },
          { word: 'prototype', definition: 'An early model of a new product', partOfSpeech: 'noun', exampleSentence: 'They built a prototype to test the new car design.', bacExample: 'Engineers built a working prototype to test the design before production.', collocations: ['working prototype', 'build a prototype', 'test a prototype'] },
          { word: 'entrepreneur', definition: 'A person who starts a business', partOfSpeech: 'noun', exampleSentence: 'The entrepreneur started her company from scratch.', bacExample: 'The young entrepreneur created a successful tech company in Tunisia.', collocations: ['successful entrepreneur', 'young entrepreneur', 'social entrepreneur'] },
          { word: 'patent', definition: 'Official rights to an invention', partOfSpeech: 'noun', exampleSentence: 'He filed a patent to protect his new invention.', bacExample: 'He filed a patent to protect his innovative invention from competitors.', collocations: ['file a patent', 'patent protection', 'grant a patent'] },
          { word: 'cutting-edge', definition: 'The most advanced stage of development', partOfSpeech: 'adjective', exampleSentence: 'The lab uses cutting-edge technology for research.', bacExample: 'The laboratory uses cutting-edge technology for scientific experiments.', collocations: ['cutting-edge technology', 'cutting-edge research', 'cutting-edge design'] },
          { word: 'sustainable', definition: 'Able to continue without damaging the environment', partOfSpeech: 'adjective', exampleSentence: 'We need sustainable energy sources for the future.', bacExample: 'We need sustainable solutions to environmental problems in Tunisia.', collocations: ['sustainable development', 'sustainable energy', 'environmentally sustainable'] },
          { word: 'device', definition: 'A tool or piece of equipment', partOfSpeech: 'noun', exampleSentence: 'The device helps doctors monitor patients remotely.', bacExample: 'The new medical device helps doctors diagnose diseases faster and more accurately.', collocations: ['electronic device', 'mobile device', 'medical device'] },
          { word: 'mechanism', definition: 'A system of parts working together', partOfSpeech: 'noun', exampleSentence: 'Scientists studied the mechanism of the disease.', bacExample: 'Scientists discovered the mechanism behind the process of photosynthesis.', collocations: ['defense mechanism', 'mechanism of action', 'biological mechanism'] },
          { word: 'pioneer', definition: 'A person who develops new ideas or methods', partOfSpeech: 'noun', exampleSentence: 'She is a pioneer in the field of genetics.', bacExample: 'She is a pioneer in the field of artificial intelligence research.', collocations: ['pioneer in', 'technological pioneer', 'medical pioneer'] },
          { word: 'revolutionize', definition: 'To completely change the way something is done', partOfSpeech: 'verb', exampleSentence: 'The internet has revolutionized the way we communicate.', bacExample: 'The internet has revolutionized communication and access to information globally.', collocations: ['revolutionize industry', 'revolutionize healthcare', 'revolutionize education'] },
          { word: 'automate', definition: 'To use machines instead of people', partOfSpeech: 'verb', exampleSentence: 'The factory will automate production next year.', bacExample: 'Factories increasingly automate their production processes to reduce costs.', collocations: ['fully automate', 'automate process', 'automate system'] }
        ]
      }
    }
  });
  console.log(`✅ Created Module 3 Vocabulary: ${vocabModule3.title} (12 words)`);

  // UNIVERSAL ACADEMIC VOCABULARY
  const vocabUniversal = await prisma.vocabularySet.create({
    data: {
      slug: 'universal-academic-writing',
      theme: VocabTheme.EDUCATION,
      title: 'Universal: Academic Writing & Expression',
      description: 'Essential vocabulary for essay writing and formal expression across all BAC modules.',
      bacContext: 'These words are crucial for achieving high marks in the written expression section of the BAC exam.',
      difficulty: Difficulty.MEDIUM,
      items: {
        create: [
          { word: 'significant', definition: 'Important or meaningful', partOfSpeech: 'adjective', exampleSentence: 'This is a significant discovery for science.', bacExample: 'Education plays a significant role in personal development and future success.', collocations: ['significant role', 'significant impact', 'statistically significant'] },
          { word: 'consequently', definition: 'As a result', partOfSpeech: 'adverb', exampleSentence: 'It rained heavily; consequently, the match was cancelled.', bacExample: 'He studied hard throughout the year; consequently, he passed the BAC exam.', collocations: ['and consequently', 'consequently lead to'] },
          { word: 'furthermore', definition: 'In addition', partOfSpeech: 'adverb', exampleSentence: 'The house is beautiful; furthermore, it is affordable.', bacExample: 'Furthermore, technology has improved our daily lives in many positive ways.', collocations: ['furthermore', 'and furthermore'] },
          { word: 'nevertheless', definition: 'However; despite that', partOfSpeech: 'adverb', exampleSentence: 'It was raining; nevertheless, we went for a walk.', bacExample: 'The task was difficult and challenging; nevertheless, they succeeded in the end.', collocations: ['but nevertheless', 'nevertheless'] },
          { word: 'emphasis', definition: 'Special importance given to something', partOfSpeech: 'noun', exampleSentence: 'The school places emphasis on sports activities.', bacExample: 'Modern education places great emphasis on critical thinking skills.', collocations: ['place emphasis on', 'put emphasis on', 'strong emphasis'] },
          { word: 'contribute', definition: 'To give or add to something', partOfSpeech: 'verb', exampleSentence: 'Everyone should contribute to protecting the environment.', bacExample: 'Everyone can contribute to environmental protection through small daily actions.', collocations: ['contribute to', 'contribute significantly', 'make a contribution'] },
          { word: 'establish', definition: 'To set up or create', partOfSpeech: 'verb', exampleSentence: 'They want to establish a new company in the city.', bacExample: 'The government aims to establish new schools in rural areas of Tunisia.', collocations: ['establish a system', 'establish rules', 'well-established'] },
          { word: 'implement', definition: 'To put a plan into action', partOfSpeech: 'verb', exampleSentence: 'The company will implement changes next month.', bacExample: 'The school decided to implement a new teaching method for better results.', collocations: ['implement changes', 'implement policy', 'implement strategy'] },
          { word: 'awareness', definition: 'Knowledge or understanding of something', partOfSpeech: 'noun', exampleSentence: 'We need to raise awareness about healthy eating.', bacExample: 'We need to raise awareness about environmental issues affecting our planet.', collocations: ['raise awareness', 'public awareness', 'awareness campaign'] },
          { word: 'challenging', definition: 'Difficult in a way that tests abilities', partOfSpeech: 'adjective', exampleSentence: 'The course was challenging but rewarding.', bacExample: 'The BAC exam can be challenging for many students who lack preparation.', collocations: ['challenging task', 'challenging problem', 'challenging situation'] },
          { word: 'enhance', definition: 'To improve or increase quality', partOfSpeech: 'verb', exampleSentence: 'Exercise can enhance your physical health.', bacExample: 'Technology can greatly enhance the learning experience for students.', collocations: ['enhance performance', 'enhance quality', 'enhance skills'] },
          { word: 'crucial', definition: 'Extremely important', partOfSpeech: 'adjective', exampleSentence: 'Water is crucial for human survival.', bacExample: 'Reading and writing are crucial skills for academic success at university.', collocations: ['crucial role', 'crucial importance', 'absolutely crucial'] }
        ]
      }
    }
  });
  console.log(`✅ Created Universal Vocabulary: ${vocabUniversal.title} (12 words)`);

  console.log('\n🎓 BAC Tunisia English Programme Seeding Complete!');
  console.log('==============================================');
  console.log('Grammar Rules: 11 rules (tagged by BAC Module)');
  console.log('Irregular Verbs: 8 essential verbs with full conjugations');
  console.log('Vocabulary Sets: 4 sets organized by official BAC Modules');
  console.log('- Module 1: Travel & Tourism (12 words)');
  console.log('- Module 2: Education & Learning (12 words)');
  console.log('- Module 3: Innovation & Technology (12 words)');
  console.log('- Universal: Academic Writing (12 words)');
  console.log('==============================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
