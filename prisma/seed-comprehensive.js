const { PrismaClient, Language, GrammarCategory, VocabTheme, Difficulty, VerbTense } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding comprehensive BAC English content...');

  // Grammar Rules - Essential BAC Grammar
  await seedGrammarRules();
  
  // Verb Conjugations - Essential irregular and phrasal verbs
  await seedVerbConjugations();
  
  // Vocabulary Sets - Thematic BAC vocabulary
  await seedVocabularySets();

  console.log('Seed completed successfully!');
}

async function seedGrammarRules() {
  console.log('Seeding grammar rules...');

  const grammarRules = [
    // TENSES
    {
      slug: 'present-simple',
      category: GrammarCategory.TENSES,
      title: 'Present Simple',
      rule: 'Used for habitual actions, general truths, and permanent situations.',
      formula: 'Subject + base verb (+ s/es for 3rd person singular)',
      examples: [
        { positive: 'She works hard every day.', negative: 'They don\'t live here.', question: 'Do you speak English?' }
      ],
      exceptions: ['verbs ending in -o, -ch, -sh, -ss, -x, -z add -es (go → goes)', 'verbs ending in consonant + y: change y to i and add -es (study → studies)'],
      usageNotes: 'BAC frequent use: stating facts, describing routines, giving opinions.',
      commonErrors: ['Forgetting third person -s', 'Using continuous form incorrectly'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'present-perfect',
      category: GrammarCategory.TENSES,
      title: 'Present Perfect',
      rule: 'Used for actions that started in the past and continue to now, or past actions with present relevance.',
      formula: 'Subject + have/has + past participle',
      examples: [
        { positive: 'I have lived here since 2010.', negative: 'She hasn\'t finished yet.', question: 'Have you ever been to Paris?' }
      ],
      exceptions: ['State verbs (know, believe, love) rarely used in perfect continuous', 'American vs British differences in usage'],
      usageNotes: 'BAC key: since/for, ever/never, yet/already. Essential for describing life experiences.',
      commonErrors: ['Using with specific past time (wrong: I have seen him yesterday)', 'Confusing with past simple'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'past-simple-vs-past-perfect',
      category: GrammarCategory.TENSES,
      title: 'Past Simple vs Past Perfect',
      rule: 'Past Perfect shows an action completed before another past action.',
      formula: 'Past Perfect: had + past participle | Past Simple: regular/irregular past form',
      examples: [
        { context: 'When I arrived, the train had already left.', note: 'Leaving happened before arriving' }
      ],
      usageNotes: 'BAC writing: Use past perfect for flashbacks, background events, earlier causes.',
      commonErrors: ['Overusing past perfect', 'Using simple past when sequence matters'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'future-forms',
      category: GrammarCategory.TENSES,
      title: 'Future Forms: will, going to, present continuous',
      rule: 'Will = spontaneous decisions, predictions, promises. Going to = plans, intentions, evidence-based predictions. Present continuous = fixed arrangements.',
      formula: 'will + infinitive | be going to + infinitive | present continuous (with future time reference)',
      examples: [
        { will: 'I\'ll help you with that.', going_to: 'I\'m going to study medicine.', present_continuous: 'I\'m meeting him tomorrow at 3.' }
      ],
      usageNotes: 'BAC: Use appropriately for formal essays. "Will" for universal truths; "going to" for planned changes.',
      commonErrors: ['Using will for all future references', 'Confusing going to with will in predictions'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    
    // CONDITIONALS
    {
      slug: 'zero-first-conditionals',
      category: GrammarCategory.CONDITIONALS,
      title: 'Zero and First Conditionals',
      rule: 'Zero: General truths (If + present, present). First: Real possibilities (If + present, will/can/may + infinitive).',
      formula: 'Zero: If + present simple, present simple | First: If + present simple, will + infinitive',
      examples: [
        { zero: 'If you heat ice, it melts.', first: 'If it rains tomorrow, I\'ll stay home.' }
      ],
      usageNotes: 'BAC: First conditional common in argument essays (If we take action, we will see results).',
      commonErrors: ['Using will in if-clause (wrong: If I will see him...)', 'Wrong comma placement'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'second-conditional',
      category: GrammarCategory.CONDITIONALS,
      title: 'Second Conditional (Hypothetical Present)',
      rule: 'Used for unreal or hypothetical situations in the present or future.',
      formula: 'If + past simple, would + infinitive',
      examples: [
        { positive: 'If I had more money, I would travel the world.', negative: 'If I didn\'t have to work, I\'d go with you.' }
      ],
      usageNotes: 'BAC essays: Use for hypothetical solutions (If the government invested more, unemployment would decrease).',
      commonErrors: ['Using was instead of were for all subjects (formal: If I were...)', 'Would in the if-clause'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },
    {
      slug: 'third-conditional',
      category: GrammarCategory.CONDITIONALS,
      title: 'Third Conditional (Regrets, Past Hypotheticals)',
      rule: 'Used for hypothetical situations in the past - things that didn\'t happen and their imagined results.',
      formula: 'If + past perfect, would have + past participle',
      examples: [
        { positive: 'If I had studied harder, I would have passed the exam.', negative: 'If she hadn\'t been late, she wouldn\'t have missed the train.' }
      ],
      usageNotes: 'BAC writing: Perfect for discussing historical what-ifs, personal reflections, critical analysis.',
      commonErrors: ['Would have in if-clause (wrong: If I would have known...)', 'Mixing conditional types incorrectly'],
      isEssential: true,
      difficulty: Difficulty.HARD
    },
    {
      slug: 'mixed-conditional',
      category: GrammarCategory.CONDITIONALS,
      title: 'Mixed Conditionals',
      rule: 'Combining different time references - past condition with present result or vice versa.',
      formula: 'If + past perfect, would + infinitive (past → present) | If + past simple, would have + past participle (present → past)',
      examples: [
        { type1: 'If I had taken that job, I would be rich now.', type2: 'If I spoke French, I would have applied for that position.' }
      ],
      usageNotes: 'Advanced BAC: Shows sophisticated control of complex hypothetical reasoning.',
      commonErrors: ['Mismatching time references', 'Overusing in simple essays'],
      isEssential: false,
      difficulty: Difficulty.HARD
    },

    // MODALS
    {
      slug: 'modal-verbs-advice',
      category: GrammarCategory.MODALS,
      title: 'Modals: Advice and Obligation',
      rule: 'should/ought to = advice | must/have to = strong obligation/necessity | mustn\'t = prohibition | don\'t have to = no obligation',
      formula: 'Subject + modal + base verb',
      examples: [
        { should: 'You should exercise more.', must: 'You must wear a seatbelt.', have_to: 'I have to finish this report.' }
      ],
      usageNotes: 'BAC: Use appropriately for formal recommendations. "Should" for suggestions; "must" for strong arguments.',
      commonErrors: ['Adding to after modal (wrong: You should to go)', 'Confusing mustn\'t with don\'t have to'],
      isEssential: true,
      difficulty: Difficulty.EASY
    },
    {
      slug: 'modal-verbs-probability',
      category: GrammarCategory.MODALS,
      title: 'Modals: Deduction and Probability',
      rule: 'must = very certain | can\'t = very certain (negative) | could/may/might = possible | may/might + have = past possibility',
      formula: 'Subject + modal + base verb (present) | Subject + modal + have + past participle (past)',
      examples: [
        { deduction: 'She must be tired. (I\'m sure)', possibility: 'It might rain tomorrow.', past: 'He may have forgotten.' }
      ],
      usageNotes: 'BAC essays: Use for measured speculation (This approach could potentially solve...).',
      commonErrors: ['Using must for negative deduction (wrong: He mustn\'t be home)', 'Wrong perfect form construction'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },

    // PASSIVE VOICE
    {
      slug: 'passive-voice',
      category: GrammarCategory.PASSIVE_VOICE,
      title: 'Passive Voice',
      rule: 'Used when the action is more important than who does it, or when the doer is unknown/unimportant.',
      formula: 'Subject + be + past participle (+ by + agent)',
      examples: [
        { present: 'The window was broken.', past: 'The letter has been sent.', modal: 'This must be done immediately.' }
      ],
      usageNotes: 'BAC: Essential for formal/academic writing. Use for objective tone, process descriptions, when actor is obvious.',
      commonErrors: ['Wrong past participle form', 'Overusing passive (makes writing heavy)', 'Forgetting agent when needed'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },

    // REPORTED SPEECH
    {
      slug: 'reported-speech',
      category: GrammarCategory.REPORTED_SPEECH,
      title: 'Reported Speech',
      rule: 'Backshifting tenses when reporting what someone said. Pronouns and time expressions change.',
      formula: 'Reporting verb + that + backshifted clause',
      examples: [
        { direct: '"I am tired," she said.', reported: 'She said (that) she was tired.' },
        { direct: '"I\'ll call you tomorrow," he said.', reported: 'He said he would call me the next day.' }
      ],
      exceptions: ['General truths don\'t backshift (He said the Earth is round)', 'Say vs tell (tell needs object)'],
      usageNotes: 'BAC: Use for summarizing sources, referencing arguments, integrating quotations.',
      commonErrors: ['Not backshifting modals (would stays would)', 'Wrong tense backshift', 'Forgetting to change pronouns'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },

    // CONNECTORS
    {
      slug: 'essay-connectors',
      category: GrammarCategory.CONNECTORS,
      title: 'Essay Connectors and Linking Words',
      rule: 'Academic connectors organize arguments and show relationships between ideas.',
      formula: 'Various categories: addition, contrast, cause/effect, sequence, example, conclusion',
      examples: [
        { addition: 'Furthermore, Moreover, In addition, Besides', contrast: 'However, Nevertheless, On the other hand, Conversely', cause: 'Therefore, Consequently, As a result, Thus', sequence: 'Firstly, Subsequently, Finally, In conclusion', example: 'For instance, Namely, Such as', opinion: 'In my opinion, I believe that, From my perspective' }
      ],
      usageNotes: 'BAC writing: Sophisticated use of connectors separates average from excellent essays. Vary your connectors.',
      commonErrors: ['Overusing basic connectors (but, so, and)', 'Wrong punctuation with however/therefore', 'Using spoken connectors in formal writing'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },

    // RELATIVE CLAUSES
    {
      slug: 'relative-clauses',
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'Relative Clauses (who, which, that, whose)',
      rule: 'Add information about nouns. Defining clauses identify the noun; non-defining add extra information.',
      formula: 'Noun + who/which/that/whose + clause',
      examples: [
        { defining: 'The student who got the highest score won a prize.', non_defining: 'My brother, who lives in Paris, is visiting.' }
      ],
      exceptions: ['That cannot be used in non-defining clauses', 'Commas required for non-defining', 'Whose for possession'],
      usageNotes: 'BAC: Relative clauses add sophistication and flow. Use to combine short sentences elegantly.',
      commonErrors: ['Using what instead of which/that', 'Wrong pronoun choice (who for things)', 'Missing commas in non-defining clauses'],
      isEssential: true,
      difficulty: Difficulty.MEDIUM
    },

    // ARTICLES
    {
      slug: 'articles-definite-indefinite',
      category: GrammarCategory.ARTICLES,
      title: 'Articles: a, an, the',
      rule: 'A/an = indefinite, first mention, any one. The = definite, specific, already mentioned, unique.',
      examples: [
        { indefinite: 'I bought a book.', definite: 'The book I bought was expensive.', zero: 'Love is important. (abstract nouns)' }
      ],
      exceptions: ['Zero article for general plurals (Books are important)', 'The + adjective for groups (the rich, the unemployed)', 'Proper nouns usually take zero article'],
      usageNotes: 'BAC: Correct article usage signals advanced proficiency. Common problem area for Tunisian students.',
      commonErrors: ['Omitting the with unique/superlative (wrong: He is best student)', 'Using the with general plurals', 'Wrong with abstract nouns'],
      isEssential: true,
      difficulty: Difficulty.HARD
    }
  ];

  for (const rule of grammarRules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: { ...rule, language: Language.ENGLISH }
    });
  }

  console.log(`Seeded ${grammarRules.length} grammar rules`);
}

async function seedVerbConjugations() {
  console.log('Seeding verb conjugations...');

  const irregularVerbs = [
    {
      baseForm: 'be',
      pastSimple: 'was/were',
      pastParticiple: 'been',
      presentParticiple: 'being',
      thirdPersonSingular: 'is',
      isRegular: false,
      isIrregular: true,
      isModal: false,
      fullConjugation: {
        present: { I: 'am', you: 'are', he: 'is', she: 'is', it: 'is', we: 'are', they: 'are' },
        past: { I: 'was', you: 'were', he: 'was', she: 'was', it: 'was', we: 'were', they: 'were' },
        future: 'will be',
        conditional: 'would be'
      },
      commonUses: ['Existence/identity', 'Age', 'Location', 'Weather', 'Temporary states', 'Passive voice'],
      exampleSentences: [
        'She is a talented student.',
        'They were late for the exam.',
        'Education is essential for development.'
      ],
      collocations: ['be aware of', 'be responsible for', 'be interested in', 'be capable of', 'be proud of'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'have',
      pastSimple: 'had',
      pastParticiple: 'had',
      presentParticiple: 'having',
      thirdPersonSingular: 'has',
      isRegular: false,
      isIrregular: true,
      fullConjugation: {
        present: { I: 'have', you: 'have', he: 'has', she: 'has', it: 'has', we: 'have', they: 'have' },
        past: { all: 'had' },
        future: 'will have',
        perfect: 'have had / has had'
      },
      commonUses: ['Possession', 'Experiences', 'Actions (have breakfast)', 'Causative (have something done)', 'Obligations'],
      exampleSentences: [
        'I have a great idea.',
        'She has lived here for ten years.',
        'We had a productive discussion.'
      ],
      collocations: ['have a conversation', 'have an impact', 'have access to', 'have faith in', 'have respect for'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'do',
      pastSimple: 'did',
      pastParticiple: 'done',
      presentParticiple: 'doing',
      thirdPersonSingular: 'does',
      isRegular: false,
      isIrregular: true,
      fullConjugation: {
        present: { I: 'do', you: 'do', he: 'does', she: 'does', it: 'does', we: 'do', they: 'do' },
        past: { all: 'did' },
        future: 'will do'
      },
      commonUses: ['Auxiliary for questions/negatives', 'Actions/activities', 'Replace verbs (So do I)', 'Emphasis'],
      exampleSentences: [
        'What do you think?',
        'She did her best.',
        'Education does play a crucial role.'
      ],
      collocations: ['do research', 'do homework', 'do business', 'do harm', 'do good'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'make',
      pastSimple: 'made',
      pastParticiple: 'made',
      presentParticiple: 'making',
      thirdPersonSingular: 'makes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Create/produce', 'Cause (make someone laugh)', 'Force (make someone do)', 'Money (make a living)', 'Decisions'],
      exampleSentences: [
        'Technology makes life easier.',
        'She made an important decision.',
        'This problem was made worse by delays.'
      ],
      collocations: ['make a decision', 'make progress', 'make an effort', 'make sense', 'make a difference', 'make money'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'take',
      pastSimple: 'took',
      pastParticiple: 'taken',
      presentParticiple: 'taking',
      thirdPersonSingular: 'takes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move something', 'Time (take 2 hours)', 'Photos', 'Exams/tests', 'Responsibility', 'Transport'],
      exampleSentences: [
        'Students must take exams seriously.',
        'It takes courage to speak up.',
        'She took responsibility for the project.'
      ],
      collocations: ['take into account', 'take advantage of', 'take place', 'take action', 'take measures', 'take care of'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'get',
      pastSimple: 'got',
      pastParticiple: 'got/gotten',
      presentParticiple: 'getting',
      thirdPersonSingular: 'gets',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Obtain/receive', 'Become (get tired)', 'Arrive (get home)', 'Understand', 'Phrasal verbs'],
      exampleSentences: [
        'Education helps you get a good job.',
        'Things are getting better.',
        'I don\'t get what you mean.'
      ],
      collocations: ['get rid of', 'get used to', 'get in touch', 'get along with', 'get away with', 'get involved'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'give',
      pastSimple: 'gave',
      pastParticiple: 'given',
      presentParticiple: 'giving',
      thirdPersonSingular: 'gives',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Hand to someone', 'Provide information', 'Presentations (give a talk)', 'Opportunities', 'Up (quit)'],
      exampleSentences: [
        'Education gives us opportunities.',
        'She gave an inspiring speech.',
        'Please give me your opinion.'
      ],
      collocations: ['give a speech', 'give advice', 'give priority to', 'give rise to', 'give up', 'give consideration to'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'go',
      pastSimple: 'went',
      pastParticiple: 'gone',
      presentParticiple: 'going',
      thirdPersonSingular: 'goes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move/travel', 'Become (go crazy)', 'Function (go well)', 'Attend (go to school)', 'Phrasal verbs'],
      exampleSentences: [
        'Things go wrong without planning.',
        'She went to university abroad.',
        'How did your interview go?'
      ],
      collocations: ['go wrong', 'go viral', 'go through', 'go ahead', 'go back', 'go over'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'come',
      pastSimple: 'came',
      pastParticiple: 'come',
      presentParticiple: 'coming',
      thirdPersonSingular: 'comes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move towards', 'Arrive', 'Happen (come true)', 'Phrasal verbs', 'Origin (come from)'],
      exampleSentences: [
        'Opportunities come to those who prepare.',
        'Success came after years of work.',
        'Where do you come from?'
      ],
      collocations: ['come up with', 'come across', 'come true', 'come to an end', 'come into effect', 'come to terms with'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'know',
      pastSimple: 'knew',
      pastParticiple: 'known',
      presentParticiple: 'knowing',
      thirdPersonSingular: 'knows',
      isRegular: false,
      isIrregular: true,
      isModal: false,
      fullConjugation: { present: { all: 'know/knows' }, past: { all: 'knew' } },
      commonUses: ['Have information', 'Be familiar with', 'Recognize', 'Distinguish (know right from wrong)'],
      exampleSentences: [
        'Knowledge is knowing what to say.',
        'She knew the answer immediately.',
        'We know that education matters.'
      ],
      collocations: ['know about', 'know of', 'know how to', 'as far as I know', 'know for a fact'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'think',
      pastSimple: 'thought',
      pastParticiple: 'thought',
      presentParticiple: 'thinking',
      thirdPersonSingular: 'thinks',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Use mind', 'Opinion (I think that...)', 'Consider (think about)', 'Believe'],
      exampleSentences: [
        'Critical thinking is essential.',
        'I think education should be free.',
        'She thought carefully before answering.'
      ],
      collocations: ['think about', 'think of', 'think over', 'think ahead', 'critical thinking', 'way of thinking'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'say',
      pastSimple: 'said',
      pastParticiple: 'said',
      presentParticiple: 'saying',
      thirdPersonSingular: 'says',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Speak words', 'Reported speech', 'Express opinion', 'Show on paper/signs'],
      exampleSentences: [
        'The report says that poverty decreased.',
        'It is often said that practice makes perfect.',
        'She said nothing about the problem.'
      ],
      collocations: ['say hello', 'say sorry', 'say yes/no', 'it goes without saying', 'needless to say'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'tell',
      pastSimple: 'told',
      pastParticiple: 'told',
      presentParticiple: 'telling',
      thirdPersonSingular: 'tells',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Inform someone (needs object)', 'Order/instruct', 'Distinguish (tell the difference)', 'Stories'],
      exampleSentences: [
        'Tell me about your experience.',
        'Studies tell us that sleep is important.',
        'Can you tell the difference?'
      ],
      collocations: ['tell the truth', 'tell a lie', 'tell a story', 'tell someone about', 'tell the difference'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'write',
      pastSimple: 'wrote',
      pastParticiple: 'written',
      presentParticiple: 'writing',
      thirdPersonSingular: 'writes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Make letters/words', 'Compose (write a letter/essay)', 'Record information', 'Create literature'],
      exampleSentences: [
        'She wrote an excellent essay.',
        'This book was written in 1984.',
        'Write down your ideas first.'
      ],
      collocations: ['write down', 'write about', 'write to', 'write back', 'well-written'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'see',
      pastSimple: 'saw',
      pastParticiple: 'seen',
      presentParticiple: 'seeing',
      thirdPersonSingular: 'sees',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Perceive with eyes', 'Understand (I see what you mean)', 'Meet/visit', 'Ensure (see that)'],
      exampleSentences: [
        'We see improvements in test scores.',
        'I see your point, but I disagree.',
        'She saw the doctor yesterday.'
      ],
      collocations: ['see the point', 'see about', 'see you', 'see to it that', 'as far as I can see'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'find',
      pastSimple: 'found',
      pastParticiple: 'found',
      presentParticiple: 'finding',
      thirdPersonSingular: 'finds',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Discover', 'Obtain', 'Consider (find it difficult)', 'Reach conclusion'],
      exampleSentences: [
        'Researchers found significant results.',
        'I find this topic fascinating.',
        'She found time to help us.'
      ],
      collocations: ['find out', 'find time', 'find a way', 'find fault with', 'finding'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'become',
      pastSimple: 'became',
      pastParticiple: 'become',
      presentParticiple: 'becoming',
      thirdPersonSingular: 'becomes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Start to be', 'Transform into', 'Suit/look good on'],
      exampleSentences: [
        'He became a doctor in 2015.',
        'The problem became worse.',
        'This color becomes you.'
      ],
      collocations: ['become aware of', 'become interested in', 'become clear', 'become extinct', 'become obsolete'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'leave',
      pastSimple: 'left',
      pastParticiple: 'left',
      presentParticiple: 'leaving',
      thirdPersonSingular: 'leaves',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Go away from', 'Let remain', 'Abandon', 'Entrust (leave to)'],
      exampleSentences: [
        'She left school at 18.',
        'Leave your worries behind.',
        'I\'ll leave the decision to you.'
      ],
      collocations: ['leave out', 'leave behind', 'leave for', 'leave alone', 'leave a message'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'feel',
      pastSimple: 'felt',
      pastParticiple: 'felt',
      presentParticiple: 'feeling',
      thirdPersonSingular: 'feels',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Experience emotion', 'Physical sensation', 'Opinion (I feel that...)', 'Touch'],
      exampleSentences: [
        'I feel strongly about education.',
        'She felt nervous before the exam.',
        'The fabric feels soft.'
      ],
      collocations: ['feel like', 'feel sorry for', 'feel free to', 'feel the need to', 'have a feeling'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'put',
      pastSimple: 'put',
      pastParticiple: 'put',
      presentParticiple: 'putting',
      thirdPersonSingular: 'puts',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Place/position', 'Write (put your name)', 'Express (put into words)', 'Invest effort'],
      exampleSentences: [
        'Put your ideas on paper.',
        'She put effort into her studies.',
        'How shall I put this?'
      ],
      collocations: ['put forward', 'put off', 'put up with', 'put into practice', 'put pressure on'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'bring',
      pastSimple: 'brought',
      pastParticiple: 'brought',
      presentParticiple: 'bringing',
      thirdPersonSingular: 'brings',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Carry to speaker', 'Cause/produce', 'Introduce topic'],
      exampleSentences: [
        'Education brings many benefits.',
        'She brought up an interesting point.',
        'This brings us to our next topic.'
      ],
      collocations: ['bring about', 'bring up', 'bring back', 'bring in', 'bring to light'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'begin',
      pastSimple: 'began',
      pastParticiple: 'begun',
      presentParticiple: 'beginning',
      thirdPersonSingular: 'begins',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Start', 'Originate', 'To start with (beginning)'],
      exampleSentences: [
        'Let\'s begin with the introduction.',
        'The ceremony began at noon.',
        'Education begins at home.'
      ],
      collocations: ['begin with', 'to begin with', 'beginning of', 'begin again'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'keep',
      pastSimple: 'kept',
      pastParticiple: 'kept',
      presentParticiple: 'keeping',
      thirdPersonSingular: 'keeps',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Continue (keep working)', 'Retain possession', 'Maintain (keep calm)', 'Store'],
      exampleSentences: [
        'Keep practicing every day.',
        'She kept her notes organized.',
        'Education keeps minds active.'
      ],
      collocations: ['keep up', 'keep on', 'keep away from', 'keep in mind', 'keep track of'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'hold',
      pastSimple: 'held',
      pastParticiple: 'held',
      presentParticiple: 'holding',
      thirdPersonSingular: 'holds',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Grasp/carry', 'Organize (hold a meeting)', 'Contain', 'Believe (hold that)'],
      exampleSentences: [
        'The conference will be held online.',
        'She holds a degree in literature.',
        'I hold the view that...'
      ],
      collocations: ['hold a meeting', 'hold an opinion', 'hold back', 'hold on', 'hold responsible'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'let',
      pastSimple: 'let',
      pastParticiple: 'let',
      presentParticiple: 'letting',
      thirdPersonSingular: 'lets',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Allow/permit', 'Rent (let a room)', 'Expressions (let\'s, let alone)'],
      exampleSentences: [
        'Let me explain why.',
        'Don\'t let this opportunity pass.',
        'Let\'s consider the alternatives.'
      ],
      collocations: ['let go', 'let down', 'let alone', 'let in', 'let on'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'mean',
      pastSimple: 'meant',
      pastParticiple: 'meant',
      presentParticiple: 'meaning',
      thirdPersonSingular: 'means',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Signify', 'Intend', 'Result in (mean doing)', 'Be important (mean a lot)'],
      exampleSentences: [
        'What does this word mean?',
        'I didn\'t mean to offend you.',
        'This means we must act quickly.'
      ],
      collocations: ['mean to say', 'by all means', 'I mean', 'meaning of', 'well-meaning'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'set',
      pastSimple: 'set',
      pastParticiple: 'set',
      presentParticiple: 'setting',
      thirdPersonSingular: 'sets',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Put/place', 'Establish (set rules)', 'Fix (set a date)', 'Sun going down'],
      exampleSentences: [
        'Set clear goals for yourself.',
        'The rules were set years ago.',
        'We need to set an example.'
      ],
      collocations: ['set up', 'set off', 'set out', 'set aside', 'set a goal'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'meet',
      pastSimple: 'met',
      pastParticiple: 'met',
      presentParticiple: 'meeting',
      thirdPersonSingular: 'meets',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Encounter/see', 'Satisfy (meet requirements)', 'Pay (meet costs)', 'Join together'],
      exampleSentences: [
        'Nice to meet you.',
        'This meets all our criteria.',
        'The committee meets weekly.'
      ],
      collocations: ['meet with', 'meet up', 'meet requirements', 'meet standards', 'meet a deadline'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'pay',
      pastSimple: 'paid',
      pastParticiple: 'paid',
      presentParticiple: 'paying',
      thirdPersonSingular: 'pays',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Give money', 'Give attention (pay attention)', 'Suffer consequence (pay the price)', 'Be worthwhile'],
      exampleSentences: [
        'Hard work pays off.',
        'Pay attention to details.',
        'Education pays dividends.'
      ],
      collocations: ['pay attention', 'pay off', 'pay back', 'pay for', 'pay a visit'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'run',
      pastSimple: 'ran',
      pastParticiple: 'run',
      presentParticiple: 'running',
      thirdPersonSingular: 'runs',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move fast on foot', 'Manage/operate', 'Function', 'Flow', 'Continue in time'],
      exampleSentences: [
        'She runs her own business.',
        'The program runs smoothly.',
        'This debate has run for years.'
      ],
      collocations: ['run out of', 'run into', 'run for', 'run a business', 'in the long run'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'read',
      pastSimple: 'read',
      pastParticiple: 'read',
      presentParticiple: 'reading',
      thirdPersonSingular: 'reads',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Look at and understand writing', 'Study at university', 'Show a value', 'Say aloud'],
      exampleSentences: [
        'She reads extensively.',
        'The thermometer reads 30 degrees.',
        'I read about this in a journal.'
      ],
      collocations: ['read about', 'read through', 'read up on', 'widely read', 'read between the lines'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'lead',
      pastSimple: 'led',
      pastParticiple: 'led',
      presentParticiple: 'leading',
      thirdPersonSingular: 'leads',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Guide/direct', 'Be first, be in charge', 'Result in (lead to)', 'Live (lead a life)'],
      exampleSentences: [
        'Education leads to opportunities.',
        'She leads a team of researchers.',
        'This could lead to problems.'
      ],
      collocations: ['lead to', 'lead by example', 'take the lead', 'leading cause', 'lead a life'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'stand',
      pastSimple: 'stood',
      pastParticiple: 'stood',
      presentParticiple: 'standing',
      thirdPersonSingular: 'stands',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Be upright', 'Tolerate (can\'t stand)', 'Represent (stand for)', 'Be in a position'],
      exampleSentences: [
        'I stand by my decision.',
        'She can\'t stand injustice.',
        'What does UNESCO stand for?'
      ],
      collocations: ['stand for', 'stand out', 'stand by', 'stand up for', 'it stands to reason'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'lose',
      pastSimple: 'lost',
      pastParticiple: 'lost',
      presentParticiple: 'losing',
      thirdPersonSingular: 'loses',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Misplace', 'Not win', 'Decrease (lose weight)', 'No longer have', 'Become confused'],
      exampleSentences: [
        'Don\'t lose sight of your goals.',
        'He lost the debate.',
        'The company is losing customers.'
      ],
      collocations: ['lose weight', 'lose interest', 'lose touch', 'lose track', 'lose temper'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'fall',
      pastSimple: 'fell',
      pastParticiple: 'fallen',
      presentParticiple: 'falling',
      thirdPersonSingular: 'falls',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Drop down', 'Decrease (prices fall)', 'Enter a state (fall asleep)', 'Happen (fall on a date)'],
      exampleSentences: [
        'Temperatures fall in winter.',
        'She fell asleep during class.',
        'This falls under the category...'
      ],
      collocations: ['fall behind', 'fall out', 'fall apart', 'fall in love', 'fall into place'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'speak',
      pastSimple: 'spoke',
      pastParticiple: 'spoken',
      presentParticiple: 'speaking',
      thirdPersonSingular: 'speaks',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Use voice', 'Converse', 'Give speech', 'Use language', 'Express opinion'],
      exampleSentences: [
        'She speaks three languages.',
        'Generally speaking, this is true.',
        'He spoke at the conference.'
      ],
      collocations: ['speak up', 'speak out', 'so to speak', 'speak for', 'frankly speaking'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'understand',
      pastSimple: 'understood',
      pastParticiple: 'understood',
      presentParticiple: 'understanding',
      thirdPersonSingular: 'understands',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Comprehend', 'Know why/how', 'Sympathize', 'Believe (give to understand)'],
      exampleSentences: [
        'I understand your concern.',
        'This is easily understood.',
        'She understands the problem deeply.'
      ],
      collocations: ['understand why', 'come to understand', 'make understood', 'mutual understanding'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'send',
      pastSimple: 'sent',
      pastParticiple: 'sent',
      presentParticiple: 'sending',
      thirdPersonSingular: 'sends',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Make go somewhere', 'Emit (send signal)', 'Cause to be in a state'],
      exampleSentences: [
        'I\'ll send you the details.',
        'The device sends data automatically.',
        'This sends the wrong message.'
      ],
      collocations: ['send back', 'send in', 'send for', 'send out', 'send a message'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'spend',
      pastSimple: 'spent',
      pastParticiple: 'spent',
      presentParticiple: 'spending',
      thirdPersonSingular: 'spends',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Pay money', 'Use time', 'Pass time', 'Use up completely'],
      exampleSentences: [
        'Spend time on what matters.',
        'She spent three years researching.',
        'Don\'t spend all your money.'
      ],
      collocations: ['spend time', 'spend money', 'spend on', 'spend doing', 'well-spent'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'rise',
      pastSimple: 'rose',
      pastParticiple: 'risen',
      presentParticiple: 'rising',
      thirdPersonSingular: 'rises',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Go up', 'Stand up', 'Increase', 'Rebel (rise up)', 'Originate'],
      exampleSentences: [
        'Prices have risen sharply.',
        'The sun rises in the east.',
        'A new generation will rise.'
      ],
      collocations: ['rise up', 'rise above', 'give rise to', 'rise and fall', 'on the rise'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'build',
      pastSimple: 'built',
      pastParticiple: 'built',
      presentParticiple: 'building',
      thirdPersonSingular: 'builds',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Construct', 'Develop gradually', 'Create relationships', 'Base on (build on)'],
      exampleSentences: [
        'We need to build trust.',
        'She built her career carefully.',
        'This builds on previous research.'
      ],
      collocations: ['build up', 'build on', 'build into', 'rebuild', 'well-built'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'break',
      pastSimple: 'broke',
      pastParticiple: 'broken',
      presentParticiple: 'breaking',
      thirdPersonSingular: 'breaks',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Separate into pieces', 'Violate (break law)', 'Pause (break for lunch)', 'News (break a story)'],
      exampleSentences: [
        'Break the task into steps.',
        'Someone broke the rules.',
        'Let\'s break for coffee.'
      ],
      collocations: ['break down', 'break up', 'break out', 'breakthrough', 'give me a break'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'choose',
      pastSimple: 'chose',
      pastParticiple: 'chosen',
      presentParticiple: 'choosing',
      thirdPersonSingular: 'chooses',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Select from options', 'Prefer (choose to)', 'Decide'],
      exampleSentences: [
        'Choose your words carefully.',
        'She chose to study medicine.',
        'We must choose between options.'
      ],
      collocations: ['choose from', 'choose between', 'choose to', 'have no choice', 'chosen one'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'drive',
      pastSimple: 'drove',
      pastParticiple: 'driven',
      presentParticiple: 'driving',
      thirdPersonSingular: 'drives',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Operate vehicle', 'Propel/push', 'Force (drive someone to)', 'Be motivation'],
      exampleSentences: [
        'Fear drove him to succeed.',
        'She drives to work.',
        'What drives your ambition?'
      ],
      collocations: ['drive away', 'drive back', 'drive up', 'drive crazy', 'drive a hard bargain'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'wear',
      pastSimple: 'wore',
      pastParticiple: 'worn',
      presentParticiple: 'wearing',
      thirdPersonSingular: 'wears',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Have clothes on', 'Damage from use (wear out)', 'Expression (wear a smile)'],
      exampleSentences: [
        'Wear comfortable clothes.',
        'The carpet is worn out.',
        'He wore an angry expression.'
      ],
      collocations: ['wear out', 'wear off', 'wear down', 'wear away', 'wear and tear'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'win',
      pastSimple: 'won',
      pastParticiple: 'won',
      presentParticiple: 'winning',
      thirdPersonSingular: 'wins',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Be victorious', 'Gain/obtain', 'Persuade'],
      exampleSentences: [
        'Hard work wins results.',
        'She won first prize.',
        'We must win public support.'
      ],
      collocations: ['win over', 'win back', 'win out', 'win-win', 'win by a landslide'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'teach',
      pastSimple: 'taught',
      pastParticiple: 'taught',
      presentParticiple: 'teaching',
      thirdPersonSingular: 'teaches',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Give instruction', 'Show by experience', 'Make learn (teach someone a lesson)'],
      exampleSentences: [
        'Experience teaches us valuable lessons.',
        'She teaches English at university.',
        'That taught me to be careful.'
      ],
      collocations: ['teach about', 'teach how to', 'teach a lesson', 'self-taught', 'teaching method'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'learn',
      pastSimple: 'learnt/learned',
      pastParticiple: 'learnt/learned',
      presentParticiple: 'learning',
      thirdPersonSingular: 'learns',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Gain knowledge', 'Hear/find out', 'Memorize', 'Become aware'],
      exampleSentences: [
        'We learn from our mistakes.',
        'She learned to drive quickly.',
        'I learnt that the hard way.'
      ],
      collocations: ['learn about', 'learn from', 'learn by heart', 'learn the hard way', 'lifelong learning'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'grow',
      pastSimple: 'grew',
      pastParticiple: 'grown',
      presentParticiple: 'growing',
      thirdPersonSingular: 'grows',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Increase in size', 'Develop/mature', 'Cultivate plants', 'Become (grow tired)'],
      exampleSentences: [
        'The economy is growing.',
        'She has grown into a leader.',
        'We must grow as individuals.'
      ],
      collocations: ['grow up', 'grow out of', 'grow into', 'grow on', 'grown-up'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'draw',
      pastSimple: 'drew',
      pastParticiple: 'drawn',
      presentParticiple: 'drawing',
      thirdPersonSingular: 'draws',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Make pictures', 'Pull (draw curtains)', 'Attract (draw attention)', 'Extract (draw water)', 'Conclude (draw conclusion)'],
      exampleSentences: [
        'Let me draw your attention to...',
        'The study draws important conclusions.',
        'What conclusions can we draw?'
      ],
      collocations: ['draw attention', 'draw a conclusion', 'draw up', 'draw on', 'draw back'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'show',
      pastSimple: 'showed',
      pastParticiple: 'shown',
      presentParticiple: 'showing',
      thirdPersonSingular: 'shows',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Display', 'Prove/demonstrate', 'Guide/lead', 'Teach (show how)'],
      exampleSentences: [
        'Studies show that...',
        'She showed me how to do it.',
        'This shows a clear pattern.'
      ],
      collocations: ['show up', 'show off', 'on show', 'show interest', 'show respect'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'lie',
      pastSimple: 'lay',
      pastParticiple: 'lain',
      presentParticiple: 'lying',
      thirdPersonSingular: 'lies',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Be in horizontal position', 'Be located', 'Exist (problem lies in)'],
      exampleSentences: [
        'The answer lies in education.',
        'He lay on the bed thinking.',
        'The village lies in a valley.'
      ],
      collocations: ['lie down', 'lie ahead', 'lie in', 'lie behind', 'lie with'],
      difficulty: Difficulty.HARD
    },
    {
      baseForm: 'lay',
      pastSimple: 'laid',
      pastParticiple: 'laid',
      presentParticiple: 'laying',
      thirdPersonSingular: 'lays',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Put carefully', 'Prepare (lay the table)', 'Produce eggs', 'Present (lay out)'],
      exampleSentences: [
        'Lay the foundation for success.',
        'She laid out her arguments clearly.',
        'He laid the book on the table.'
      ],
      collocations: ['lay down', 'lay out', 'lay off', 'lay the groundwork', 'lay claim to'],
      difficulty: Difficulty.HARD
    },
    {
      baseForm: 'swim',
      pastSimple: 'swam',
      pastParticiple: 'swum',
      presentParticiple: 'swimming',
      thirdPersonSingular: 'swims',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move through water', 'Be covered in', 'Move smoothly'],
      exampleSentences: [
        'Ideas swam in her head.',
        'He swam across the lake.',
        'The room swam before her eyes.'
      ],
      collocations: ['swim in', 'swim with', 'sink or swim', 'in the swim'],
      difficulty: Difficulty.HARD
    },
    {
      baseForm: 'fly',
      pastSimple: 'flew',
      pastParticiple: 'flown',
      presentParticiple: 'flying',
      thirdPersonSingular: 'flies',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move through air', 'Travel by plane', 'Move fast', 'Pass quickly (time flies)'],
      exampleSentences: [
        'Time flies when you\'re learning.',
        'She flew to London for the conference.',
        'The flag flew in the wind.'
      ],
      collocations: ['fly away', 'fly off', 'fly high', 'fly into a rage', 'as the crow flies'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'forget',
      pastSimple: 'forgot',
      pastParticiple: 'forgotten',
      presentParticiple: 'forgetting',
      thirdPersonSingular: 'forgets',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Lose memory of', 'Leave behind', 'Stop thinking about', 'Not care about'],
      exampleSentences: [
        'Don\'t forget to proofread.',
        'I forgot my umbrella.',
        'Forget about your worries.'
      ],
      collocations: ['forget about', 'never forget', 'forgetful', 'unforgettable'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'forgive',
      pastSimple: 'forgave',
      pastParticiple: 'forgiven',
      presentParticiple: 'forgiving',
      thirdPersonSingular: 'forgives',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Stop being angry', 'Excuse debt/payment', 'Be merciful'],
      exampleSentences: [
        'Please forgive my interruption.',
        'She forgave him eventually.',
        'Forgive me for saying this...'
      ],
      collocations: ['forgive for', 'forgive and forget', 'forgiveness', 'unforgivable'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'hide',
      pastSimple: 'hid',
      pastParticiple: 'hidden',
      presentParticiple: 'hiding',
      thirdPersonSingular: 'hides',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Put out of sight', 'Keep secret', 'Be difficult to find'],
      exampleSentences: [
        'Don\'t hide your talents.',
        'The truth was hidden.',
        'She hid behind the door.'
      ],
      collocations: ['hide from', 'hide away', 'hide behind', 'hide-and-seek'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'shake',
      pastSimple: 'shook',
      pastParticiple: 'shaken',
      presentParticiple: 'shaking',
      thirdPersonSingular: 'shakes',
      isRegular: false,
      isIrregular: true,
      commonUses: ['Move quickly', 'Greet (shake hands)', 'Upset/disturb', 'Weaken confidence'],
      exampleSentences: [
        'Shake hands firmly.',
        'The news shook the community.',
        'She shook her head in disagreement.'
      ],
      collocations: ['shake hands', 'shake off', 'shake up', 'shake down', 'shake with fear'],
      difficulty: Difficulty.MEDIUM
    }
  ];

  // Phrasal verbs (marked as phrasal)
  const phrasalVerbs = [
    {
      baseForm: 'look up',
      pastSimple: 'looked up',
      pastParticiple: 'looked up',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Search for information', 'Visit someone', 'Improve'],
      exampleSentences: ['Look up unfamiliar words.', 'Things are looking up.'],
      collocations: ['look up to', 'look up from'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'look after',
      pastSimple: 'looked after',
      pastParticiple: 'looked after',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Take care of', 'Be responsible for'],
      exampleSentences: ['Look after your health.', 'She looks after her younger brother.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'look forward to',
      pastSimple: 'looked forward to',
      pastParticiple: 'looked forward to',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Anticipate with pleasure'],
      exampleSentences: ['I look forward to hearing from you.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'give up',
      pastSimple: 'gave up',
      pastParticiple: 'given up',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Stop trying', 'Surrender', 'Quit habit'],
      exampleSentences: ['Never give up on your dreams.', 'He gave up smoking.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'carry on',
      pastSimple: 'carried on',
      pastParticiple: 'carried on',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Continue', 'Behave badly'],
      exampleSentences: ['Carry on with your work.', 'Carry on the good work!'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'put off',
      pastSimple: 'put off',
      pastParticiple: 'put off',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Postpone', 'Discourage', 'Take off (clothes)'],
      exampleSentences: ['Don\'t put off studying.', 'The rain put us off.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'turn out',
      pastSimple: 'turned out',
      pastParticiple: 'turned out',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Happen/prove to be', 'Produce', 'Attend'],
      exampleSentences: ['It turned out well.', 'Many students turned out for the event.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'work out',
      pastSimple: 'worked out',
      pastParticiple: 'worked out',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Solve/understand', 'Exercise', 'Develop successfully'],
      exampleSentences: ['Work out the solution.', 'Things will work out.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'find out',
      pastSimple: 'found out',
      pastParticiple: 'found out',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Discover information'],
      exampleSentences: ['I found out the truth.', 'Let\'s find out more.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'deal with',
      pastSimple: 'dealt with',
      pastParticiple: 'dealt with',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Handle/manage', 'Be about'],
      exampleSentences: ['Deal with problems calmly.', 'The book deals with education.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'point out',
      pastSimple: 'pointed out',
      pastParticiple: 'pointed out',
      isRegular: true,
      isPhrasal: true,
      commonUses: ['Indicate/mention', 'Draw attention to'],
      exampleSentences: ['She pointed out the mistake.', 'I\'d like to point out that...'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'set up',
      pastSimple: 'set up',
      pastParticiple: 'set up',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Establish/create', 'Arrange', 'Trap'],
      exampleSentences: ['Set up a study schedule.', 'The company was set up in 2010.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'bring up',
      pastSimple: 'brought up',
      pastParticiple: 'brought up',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Raise (children)', 'Mention topic', 'Vomit'],
      exampleSentences: ['She brought up an interesting point.', 'He was brought up in Tunisia.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'get on',
      pastSimple: 'got on',
      pastParticiple: 'got on',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Board vehicle', 'Have relationship', 'Make progress', 'Manage'],
      exampleSentences: ['Get on the bus.', 'Do you get on with him?', 'How are you getting on?'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'come up with',
      pastSimple: 'came up with',
      pastParticiple: 'come up with',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Think of idea/solution', 'Produce money'],
      exampleSentences: ['Come up with a solution.', 'She came up with a great idea.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'run out of',
      pastSimple: 'ran out of',
      pastParticiple: 'run out of',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Use all supply', 'Expire (time)'],
      exampleSentences: ['We ran out of time.', 'Don\'t run out of patience.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'take into account',
      pastSimple: 'took into account',
      pastParticiple: 'taken into account',
      isRegular: false,
      isIrregular: true,
      isPhrasal: true,
      commonUses: ['Consider/include in decision'],
      exampleSentences: ['Take all factors into account.', 'This must be taken into account.'],
      difficulty: Difficulty.MEDIUM
    }
  ];

  // Modals
  const modals = [
    {
      baseForm: 'can',
      pastSimple: 'could',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Ability/possibility', 'Permission', 'Request', 'Offer'],
      exampleSentences: ['I can speak French.', 'Can you help me?', 'It can be difficult.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'could',
      pastSimple: 'could',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Past ability', 'Polite request', 'Possibility', 'Conditional'],
      exampleSentences: ['I could swim when I was five.', 'Could you open the window?', 'It could rain tomorrow.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'may',
      pastSimple: 'might',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Permission', 'Possibility', 'Wish/hope'],
      exampleSentences: ['You may leave now.', 'It may rain tomorrow.', 'May you succeed!'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'might',
      pastSimple: 'might',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Remote possibility', 'Suggestion', 'Polite request'],
      exampleSentences: ['We might go tomorrow.', 'You might try restarting it.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'must',
      pastSimple: 'had to',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Strong obligation', 'Deduction/certainty', 'Necessity'],
      exampleSentences: ['You must study hard.', 'He must be tired.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'should',
      pastSimple: 'should have',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Advice', 'Expectation', 'Obligation'],
      exampleSentences: ['You should exercise more.', 'The bus should arrive soon.'],
      difficulty: Difficulty.EASY
    },
    {
      baseForm: 'would',
      pastSimple: 'would have',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Conditional', 'Past habit', 'Polite request', 'Preference'],
      exampleSentences: ['I would help if I could.', 'He would walk to school.'],
      difficulty: Difficulty.MEDIUM
    },
    {
      baseForm: 'shall',
      pastSimple: 'should',
      pastParticiple: '-',
      isModal: true,
      commonUses: ['Future (formal/UK)', 'Offers/suggestions', 'Legal obligation'],
      exampleSentences: ['Shall we begin?', 'I shall return.'],
      difficulty: Difficulty.MEDIUM
    }
  ];

  const allVerbs = [...irregularVerbs, ...phrasalVerbs, ...modals];

  for (const verb of allVerbs) {
    await prisma.verbConjugation.upsert({
      where: { slug: verb.baseForm.replace(/ /g, '-') },
      update: verb,
      create: {
        ...verb,
        slug: verb.baseForm.replace(/ /g, '-'),
        language: Language.ENGLISH,
        fullConjugation: verb.fullConjugation || {},
        commonUses: verb.commonUses || [],
        exampleSentences: verb.exampleSentences || [],
        collocations: verb.collocations || []
      }
    });
  }

  console.log(`Seeded ${allVerbs.length} verb conjugations`);
}

async function seedVocabularySets() {
  console.log('Seeding vocabulary sets...');

  const vocabSets = [
    {
      slug: 'environment-climate',
      theme: VocabTheme.ENVIRONMENT,
      title: 'Environment & Climate Change',
      description: 'Essential vocabulary for discussing environmental issues, climate change, and sustainability - a frequent BAC topic.',
      bacContext: 'Common in argumentative essays about pollution, renewable energy, and environmental protection.',
      difficulty: Difficulty.MEDIUM,
      items: [
        { word: 'sustainable', definition: 'able to continue over a long period without damaging the environment', partOfSpeech: 'adjective', exampleSentence: 'We need to find sustainable solutions to energy problems.', bacExample: 'Sustainable development is crucial for future generations.', synonyms: ['renewable', 'viable', 'enduring'], collocations: ['sustainable development', 'sustainable energy', 'sustainable future'] },
        { word: 'pollution', definition: 'the presence of substances in the environment that are harmful to living organisms', partOfSpeech: 'noun', exampleSentence: 'Air pollution is a major problem in big cities.', bacExample: 'Industrial pollution has devastating effects on marine life.', synonyms: ['contamination', 'defilement'], collocations: ['air pollution', 'water pollution', 'reduce pollution', 'noise pollution'] },
        { word: 'renewable', definition: 'can be replaced naturally or can be produced again', partOfSpeech: 'adjective', exampleSentence: 'Solar and wind are renewable energy sources.', bacExample: 'Investing in renewable resources is essential for energy security.', synonyms: ['replaceable', 'sustainable'], collocations: ['renewable energy', 'renewable resources', 'renewable sources'] },
        { word: 'carbon footprint', definition: 'the amount of carbon dioxide released into the atmosphere as a result of activities', partOfSpeech: 'noun', exampleSentence: 'We should all try to reduce our carbon footprint.', bacExample: 'Lowering our carbon footprint is a responsibility we all share.', synonyms: ['environmental impact'], collocations: ['reduce carbon footprint', 'lower carbon footprint', 'calculate carbon footprint'] },
        { word: 'deforestation', definition: 'the clearing of forests by cutting down trees', partOfSpeech: 'noun', exampleSentence: 'Deforestation contributes to climate change.', bacExample: 'Deforestation in the Amazon affects global weather patterns.', synonyms: ['clearing', 'logging'], collocations: ['combat deforestation', 'prevent deforestation', 'stop deforestation'] },
        { word: 'biodiversity', definition: 'the variety of plant and animal life in a particular habitat', partOfSpeech: 'noun', exampleSentence: 'Coral reefs have incredible biodiversity.', bacExample: 'Protecting biodiversity ensures ecosystem stability.', synonyms: ['variety', 'diversity'], collocations: ['preserve biodiversity', 'loss of biodiversity', 'biodiversity conservation'] },
        { word: 'greenhouse effect', definition: 'the trapping of heat in the atmosphere by certain gases', partOfSpeech: 'noun', exampleSentence: 'The greenhouse effect causes global warming.', bacExample: 'The enhanced greenhouse effect is primarily caused by human activities.', synonyms: [], collocations: ['enhanced greenhouse effect', 'greenhouse gases', 'combat the greenhouse effect'] },
        { word: 'ozone layer', definition: 'a layer in the atmosphere that protects living things from harmful solar radiation', partOfSpeech: 'noun', exampleSentence: 'The ozone layer is recovering slowly.', bacExample: 'Depletion of the ozone layer poses serious health risks.', synonyms: [], collocations: ['protect the ozone layer', 'ozone layer depletion', 'damage to the ozone layer'] },
        { word: 'ecosystem', definition: 'all the plants and animals in an area and the way they interact', partOfSpeech: 'noun', exampleSentence: 'Wetlands are delicate ecosystems.', bacExample: 'Disrupting one ecosystem can have global consequences.', synonyms: ['environment', 'habitat'], collocations: ['marine ecosystem', 'delicate ecosystem', 'preserve ecosystem'] },
        { word: 'conservation', definition: 'the protection of plants, animals, and natural areas', partOfSpeech: 'noun', exampleSentence: 'Wildlife conservation is vital for endangered species.', bacExample: 'Conservation efforts have saved many species from extinction.', synonyms: ['preservation', 'protection'], collocations: ['wildlife conservation', 'energy conservation', 'nature conservation'] },
        { word: 'emissions', definition: 'substances sent out into the air', partOfSpeech: 'noun', exampleSentence: 'Car emissions contribute to air pollution.', bacExample: 'Reducing carbon emissions is essential to combat climate change.', synonyms: ['discharge', 'release'], collocations: ['carbon emissions', 'reduce emissions', 'cut emissions', 'greenhouse gas emissions'] },
        { word: 'recycling', definition: 'the process of converting waste into reusable material', partOfSpeech: 'noun', exampleSentence: 'Recycling helps reduce waste in landfills.', bacExample: 'Promoting recycling is a simple way to protect the environment.', synonyms: ['reprocessing', 'reclamation'], collocations: ['waste recycling', 'recycling program', 'promote recycling'] }
      ]
    },
    {
      slug: 'technology-digital',
      theme: VocabTheme.TECHNOLOGY,
      title: 'Technology & Digital Age',
      description: 'Vocabulary for discussing technological advancement, digital transformation, and the impact of technology on society.',
      bacContext: 'Frequently tested in essays about social media, AI, automation, and digital privacy.',
      difficulty: Difficulty.MEDIUM,
      items: [
        { word: 'innovation', definition: 'a new idea, method, or device that creates change', partOfSpeech: 'noun', exampleSentence: 'Smartphones were a major innovation in communication.', bacExample: 'Technological innovation drives economic growth but creates new challenges.', synonyms: ['invention', 'novelty', 'breakthrough'], collocations: ['technological innovation', 'drive innovation', 'foster innovation'] },
        { word: 'artificial intelligence', definition: 'computer systems that can perform tasks requiring human intelligence', partOfSpeech: 'noun', exampleSentence: 'Artificial intelligence is transforming healthcare.', bacExample: 'Artificial intelligence raises ethical questions about privacy and employment.', synonyms: ['AI', 'machine intelligence'], collocations: ['AI development', 'advancements in AI', 'ethical AI'] },
        { word: 'automation', definition: 'the use of machines and technology to perform tasks without human intervention', partOfSpeech: 'noun', exampleSentence: 'Factory automation has increased productivity.', bacExample: 'Automation may eliminate some jobs while creating new opportunities.', synonyms: ['mechanization', 'computerization'], collocations: ['industrial automation', 'automation technology', 'workplace automation'] },
        { word: 'cyberspace', definition: 'the virtual world created by computer networks', partOfSpeech: 'noun', exampleSentence: 'Businesses now operate in cyberspace.', bacExample: 'Security in cyberspace is a growing concern for governments.', synonyms: ['internet', 'virtual world'], collocations: ['in cyberspace', 'cyberspace security', 'navigate cyberspace'] },
        { word: 'digital literacy', definition: 'the ability to use digital technology effectively', partOfSpeech: 'noun', exampleSentence: 'Digital literacy is essential in modern education.', bacExample: 'Promoting digital literacy helps bridge the digital divide.', synonyms: ['computer literacy', 'tech skills'], collocations: ['improve digital literacy', 'digital literacy skills', 'promote digital literacy'] },
        { word: 'privacy', definition: 'the state of being free from public attention or unauthorized access to information', partOfSpeech: 'noun', exampleSentence: 'Online privacy is a major concern today.', bacExample: 'Social media platforms must respect user privacy.', synonyms: ['confidentiality', 'secrecy'], collocations: ['online privacy', 'privacy concerns', 'violate privacy', 'protect privacy'] },
        { word: 'virtual reality', definition: 'a computer-generated simulation of a three-dimensional environment', partOfSpeech: 'noun', exampleSentence: 'Virtual reality is used in training simulations.', bacExample: 'Virtual reality could revolutionize education and remote learning.', synonyms: ['VR', 'simulated reality'], collocations: ['virtual reality technology', 'VR experience', 'virtual reality training'] },
        { word: 'algorithm', definition: 'a set of rules followed by computers to solve problems', partOfSpeech: 'noun', exampleSentence: 'Social media algorithms show personalized content.', bacExample: 'Algorithms can perpetuate bias if not carefully designed.', synonyms: ['procedure', 'formula'], collocations: ['social media algorithm', 'search algorithm', 'algorithm bias'] },
        { word: 'surveillance', definition: 'close observation, especially of suspected people or places', partOfSpeech: 'noun', exampleSentence: 'Security cameras provide constant surveillance.', bacExample: 'Mass surveillance raises questions about individual freedom.', synonyms: ['monitoring', 'observation'], collocations: ['digital surveillance', 'mass surveillance', 'under surveillance'] },
        { word: 'cybersecurity', definition: 'protection of computer systems from theft or damage', partOfSpeech: 'noun', exampleSentence: 'Companies invest heavily in cybersecurity.', bacExample: 'Cybersecurity threats require international cooperation.', synonyms: ['information security', 'data protection'], collocations: ['cybersecurity measures', 'cybersecurity threats', 'enhance cybersecurity'] },
        { word: 'disruption', definition: 'disturbance that interrupts an event or process', partOfSpeech: 'noun', exampleSentence: 'Streaming caused disruption in the music industry.', bacExample: 'Technological disruption can transform entire industries overnight.', synonyms: ['disturbance', 'interruption', 'upheaval'], collocations: ['technological disruption', 'market disruption', 'cause disruption'] },
        { word: 'connectivity', definition: 'the state of being connected to a network or other devices', partOfSpeech: 'noun', exampleSentence: 'Rural areas often lack internet connectivity.', bacExample: 'Global connectivity has transformed how we communicate.', synonyms: ['connection', 'access'], collocations: ['internet connectivity', 'global connectivity', 'improve connectivity'] }
      ]
    },
    {
      slug: 'education-learning',
      theme: VocabTheme.EDUCATION,
      title: 'Education & Learning',
      description: 'Academic vocabulary for discussing education systems, learning methods, and educational challenges.',
      bacContext: 'Core topic for BAC exams - essays about education reform, online learning, and educational equality.',
      difficulty: Difficulty.MEDIUM,
      items: [
        { word: 'curriculum', definition: 'the subjects and content taught in a school or program', partOfSpeech: 'noun', exampleSentence: 'The school updated its science curriculum.', bacExample: 'A balanced curriculum includes arts and sciences.', synonyms: ['syllabus', 'program', 'course of study'], collocations: ['school curriculum', 'curriculum reform', 'design curriculum'] },
        { word: 'pedagogy', definition: 'the method and practice of teaching', partOfSpeech: 'noun', exampleSentence: 'Modern pedagogy emphasizes student-centered learning.', bacExample: 'Effective pedagogy adapts to different learning styles.', synonyms: ['teaching method', 'instruction'], collocations: ['modern pedagogy', 'pedagogical approach', 'student-centered pedagogy'] },
        { word: 'assessment', definition: 'the evaluation of student learning and performance', partOfSpeech: 'noun', exampleSentence: 'Continuous assessment provides better feedback.', bacExample: 'Formative assessment helps teachers adjust instruction.', synonyms: ['evaluation', 'testing', 'appraisal'], collocations: ['student assessment', 'formative assessment', 'assessment methods'] },
        { word: 'literacy', definition: 'the ability to read and write', partOfSpeech: 'noun', exampleSentence: 'Literacy rates have improved globally.', bacExample: 'Digital literacy is as important as traditional literacy.', synonyms: ['reading ability', 'education'], collocations: ['literacy rate', 'literacy skills', 'improve literacy', 'literacy program'] },
        { word: 'dropout', definition: 'a student who leaves school before completing their studies', partOfSpeech: 'noun', exampleSentence: 'High dropout rates indicate systemic problems.', bacExample: 'Reducing dropout rates requires addressing poverty.', synonyms: ['quitter', 'non-completer'], collocations: ['school dropout', 'dropout rate', 'reduce dropout', 'college dropout'] },
        { word: 'tuition', definition: 'the fee charged for instruction', partOfSpeech: 'noun', exampleSentence: 'University tuition has increased significantly.', bacExample: 'High tuition fees limit access to higher education.', synonyms: ['fees', 'charges'], collocations: ['tuition fees', 'pay tuition', 'tuition costs', 'free tuition'] },
        { word: 'scholarship', definition: 'financial aid awarded to students based on merit or need', partOfSpeech: 'noun', exampleSentence: 'She won a scholarship to study abroad.', bacExample: 'Scholarships help talented students from poor families.', synonyms: ['grant', 'fellowship', 'bursary'], collocations: ['win a scholarship', 'scholarship program', 'full scholarship'] },
        { word: 'vocational', definition: 'relating to practical skills and specific occupations', partOfSpeech: 'adjective', exampleSentence: 'Vocational training prepares students for careers.', bacExample: 'Vocational education deserves equal respect to academic paths.', synonyms: ['technical', 'professional', 'career-oriented'], collocations: ['vocational training', 'vocational education', 'vocational school'] },
        { word: 'enrollment', definition: 'the act of registering as a student at an institution', partOfSpeech: 'noun', exampleSentence: 'Enrollment in online courses has doubled.', bacExample: 'Increasing enrollment requires improving education quality.', synonyms: ['registration', 'admission', 'intake'], collocations: ['student enrollment', 'enrollment rate', 'increase enrollment'] },
        { word: 'memorization', definition: 'the process of committing information to memory', partOfSpeech: 'noun', exampleSentence: 'Rote memorization is less effective than understanding.', bacExample: 'Education should focus on understanding, not memorization.', synonyms: ['learning by heart', 'rote learning'], collocations: ['rote memorization', 'memorization techniques', 'avoid memorization'] },
        { word: 'critical thinking', definition: 'the objective analysis and evaluation of issues to form judgments', partOfSpeech: 'noun', exampleSentence: 'Critical thinking is essential for problem-solving.', bacExample: 'Schools must teach critical thinking, not just facts.', synonyms: ['analytical thinking', 'reasoning'], collocations: ['develop critical thinking', 'critical thinking skills', 'promote critical thinking'] },
        { word: 'lifelong learning', definition: 'the ongoing pursuit of knowledge throughout one\'s life', partOfSpeech: 'noun', exampleSentence: 'Lifelong learning is essential in changing times.', bacExample: 'Promoting lifelong learning prepares people for career changes.', synonyms: ['continuing education', 'adult education'], collocations: ['promote lifelong learning', 'lifelong learning skills', 'culture of lifelong learning'] }
      ]
    },
    {
      slug: 'health-wellness',
      theme: VocabTheme.HEALTH,
      title: 'Health & Wellness',
      description: 'Vocabulary for discussing physical and mental health, healthcare systems, and healthy lifestyles.',
      bacContext: 'Popular BAC topic covering public health, mental health awareness, and healthcare access.',
      difficulty: Difficulty.MEDIUM,
      items: [
        { word: 'wellness', definition: 'the state of being in good physical and mental health', partOfSpeech: 'noun', exampleSentence: 'Companies now promote employee wellness programs.', bacExample: 'Wellness programs can reduce healthcare costs.', synonyms: ['wellbeing', 'fitness', 'health'], collocations: ['wellness program', 'mental wellness', 'physical wellness', 'holistic wellness'] },
        { word: 'epidemic', definition: 'a widespread occurrence of an infectious disease', partOfSpeech: 'noun', exampleSentence: 'The flu becomes an epidemic every winter.', bacExample: 'The obesity epidemic requires public health intervention.', synonyms: ['outbreak', 'plague', 'pandemic'], collocations: ['obesity epidemic', 'flu epidemic', 'epidemic disease', 'combat epidemic'] },
        { word: 'preventive', definition: 'designed to keep something undesirable from occurring', partOfSpeech: 'adjective', exampleSentence: 'Preventive medicine is cheaper than treatment.', bacExample: 'Investing in preventive care reduces long-term costs.', synonyms: ['proactive', 'precautionary'], collocations: ['preventive care', 'preventive medicine', 'preventive measures'] },
        { word: 'chronic', definition: 'persisting for a long time or constantly recurring', partOfSpeech: 'adjective', exampleSentence: 'Chronic diseases require ongoing management.', bacExample: 'Chronic stress can lead to serious health problems.', synonyms: ['persistent', 'long-term', 'continuing'], collocations: ['chronic disease', 'chronic illness', 'chronic condition', 'chronic stress'] },
        { word: 'nutrition', definition: 'the process of providing food necessary for health and growth', partOfSpeech: 'noun', exampleSentence: 'Good nutrition is essential for children\'s development.', bacExample: 'Schools should improve nutrition in meal programs.', synonyms: ['nourishment', 'diet', 'sustenance'], collocations: ['proper nutrition', 'nutrition education', 'poor nutrition'] },
        { word: 'sedentary', definition: 'characterized by much sitting and little physical exercise', partOfSpeech: 'adjective', exampleSentence: 'Sedentary lifestyles contribute to health problems.', bacExample: 'Modern jobs are increasingly sedentary.', synonyms: ['inactive', 'stationary'], collocations: ['sedentary lifestyle', 'sedentary behavior', 'sedentary work'] },
        { word: 'mental health', definition: 'a person\'s condition regarding their psychological and emotional well-being', partOfSpeech: 'noun', exampleSentence: 'Mental health is as important as physical health.', bacExample: 'Society must remove the stigma around mental health.', synonyms: ['psychological health', 'emotional wellbeing'], collocations: ['mental health awareness', 'mental health services', 'mental health support'] },
        { word: 'healthcare', definition: 'the organized provision of medical care to individuals', partOfSpeech: 'noun', exampleSentence: 'Universal healthcare ensures access for everyone.', bacExample: 'Healthcare costs are rising faster than inflation.', synonyms: ['medical care', 'health services'], collocations: ['healthcare system', 'healthcare provider', 'healthcare access', 'universal healthcare'] },
        { word: 'immunity', definition: 'the ability of an organism to resist infection', partOfSpeech: 'noun', exampleSentence: 'Vaccines help build immunity against diseases.', bacExample: 'Herd immunity protects vulnerable populations.', synonyms: ['resistance', 'protection'], collocations: ['herd immunity', 'natural immunity', 'build immunity', 'immunity system'] },
        { word: 'pandemic', definition: 'an epidemic of disease that has spread across a large region', partOfSpeech: 'noun', exampleSentence: 'The COVID-19 pandemic changed global society.', bacExample: 'Pandemic preparedness is essential for future security.', synonyms: ['global outbreak', 'worldwide epidemic'], collocations: ['global pandemic', 'pandemic preparedness', 'during the pandemic'] },
        { word: 'hygiene', definition: 'conditions and practices that help maintain health and prevent disease', partOfSpeech: 'noun', exampleSentence: 'Good hygiene prevents the spread of illness.', bacExample: 'Public health campaigns promote hygiene education.', synonyms: ['sanitation', 'cleanliness'], collocations: ['personal hygiene', 'oral hygiene', 'hygiene practices', 'hygiene education'] },
        { word: 'addiction', definition: 'the state of being dependent on a particular substance or activity', partOfSpeech: 'noun', exampleSentence: 'Addiction to social media affects mental health.', bacExample: 'Technology addiction is a growing concern among youth.', synonyms: ['dependence', 'compulsion'], collocations: ['drug addiction', 'social media addiction', 'overcome addiction', 'addiction treatment'] }
      ]
    },
    {
      slug: 'society-inequality',
      theme: VocabTheme.SOCIETY,
      title: 'Society & Social Issues',
      description: 'Vocabulary for discussing social inequality, discrimination, poverty, and community challenges.',
      bacContext: 'Essential for essays about social justice, equality, poverty, discrimination, and human rights.',
      difficulty: Difficulty.HARD,
      items: [
        { word: 'inequality', definition: 'difference in size, degree, or circumstances that results in unfairness', partOfSpeech: 'noun', exampleSentence: 'Income inequality has grown in many countries.', bacExample: 'Addressing inequality requires systemic changes.', synonyms: [' disparity', 'unfairness', 'imbalance'], collocations: ['income inequality', 'social inequality', 'gender inequality', 'reduce inequality'] },
        { word: 'discrimination', definition: 'unjust treatment based on prejudice', partOfSpeech: 'noun', exampleSentence: 'Laws prohibit discrimination in employment.', bacExample: 'Combating discrimination requires education and enforcement.', synonyms: ['prejudice', 'bias', 'intolerance'], collocations: ['racial discrimination', 'gender discrimination', 'combat discrimination', 'discrimination against'] },
        { word: 'marginalized', definition: 'treated as insignificant or peripheral', partOfSpeech: 'adjective', exampleSentence: 'Marginalized communities need more support.', bacExample: 'Education must serve marginalized populations better.', synonyms: ['excluded', 'disadvantaged', 'neglected'], collocations: ['marginalized communities', 'marginalized groups', 'marginalized populations'] },
        { word: 'empowerment', definition: 'the process of becoming stronger and more confident', partOfSpeech: 'noun', exampleSentence: 'Education is a tool for women\'s empowerment.', bacExample: 'Economic empowerment helps break cycles of poverty.', synonyms: ['enablement', 'strengthening'], collocations: ['women\'s empowerment', 'economic empowerment', 'community empowerment'] },
        { word: 'advocacy', definition: 'public support for a particular cause or policy', partOfSpeech: 'noun', exampleSentence: 'Advocacy groups work for policy change.', bacExample: 'Youth advocacy is transforming climate policy.', synonyms: ['support', 'promotion', 'campaigning'], collocations: ['advocacy group', 'advocacy work', 'human rights advocacy'] },
        { word: 'segregation', definition: 'the separation of groups based on characteristics like race', partOfSpeech: 'noun', exampleSentence: 'School segregation persists despite laws.', bacExample: 'Residential segregation affects educational opportunities.', synonyms: ['separation', 'isolation', 'apartheid'], collocations: ['racial segregation', 'school segregation', 'housing segregation', 'end segregation'] },
        { word: 'solidarity', definition: 'unity and mutual support among a group', partOfSpeech: 'noun', exampleSentence: 'International solidarity helps disaster victims.', bacExample: 'Social solidarity is essential during crises.', synonyms: ['unity', 'togetherness', 'fellowship'], collocations: ['social solidarity', 'international solidarity', 'in solidarity with'] },
        { word: 'stigma', definition: 'a mark of disgrace associated with a particular circumstance', partOfSpeech: 'noun', exampleSentence: 'Mental illness still carries stigma.', bacExample: 'We must eliminate the stigma around poverty.', synonyms: ['shame', 'disgrace', 'discredit'], collocations: ['social stigma', 'reduce stigma', 'stigma attached to', 'eliminate stigma'] },
        { word: 'human rights', definition: 'basic rights belonging to all people regardless of nationality', partOfSpeech: 'noun', exampleSentence: 'Freedom of speech is a fundamental human right.', bacExample: 'Education is a basic human right.', synonyms: ['civil rights', 'basic rights'], collocations: ['fundamental human rights', 'violate human rights', 'human rights violation', 'protect human rights'] },
        { word: 'xenophobia', definition: 'dislike of or prejudice against people from other countries', partOfSpeech: 'noun', exampleSentence: 'Xenophobia has risen with migration debates.', bacExample: 'Combating xenophobia requires cultural education.', synonyms: ['racism', 'nativism', 'intolerance'], collocations: ['combat xenophobia', 'rise of xenophobia', 'xenophobia and racism'] },
        { word: 'tolerance', definition: 'the ability to accept opinions different from one\'s own', partOfSpeech: 'noun', exampleSentence: 'Religious tolerance is essential for peace.', bacExample: 'Schools should teach tolerance and respect.', synonyms: ['acceptance', 'open-mindedness', 'forbearance'], collocations: ['religious tolerance', 'show tolerance', 'promote tolerance', 'zero tolerance'] },
        { word: 'civic engagement', definition: 'individual and collective actions to identify and address public concerns', partOfSpeech: 'noun', exampleSentence: 'Civic engagement strengthens democracy.', bacExample: 'Youth civic engagement is essential for social progress.', synonyms: ['citizen participation', 'community involvement'], collocations: ['promote civic engagement', 'civic engagement activities', 'youth civic engagement'] }
      ]
    },
    {
      slug: 'essay-structure',
      theme: VocabTheme.EDUCATION,
      title: 'Essay Writing & Academic Language',
      description: 'Academic connectors, formal phrases, and structural language for BAC essay writing.',
      bacContext: 'Directly applicable to BAC essay writing - transitions, formal expressions, argument structure.',
      difficulty: Difficulty.MEDIUM,
      items: [
        { word: 'furthermore', definition: 'in addition; moreover (used to add supporting information)', partOfSpeech: 'adverb', exampleSentence: 'Furthermore, studies show this trend continues.', bacExample: 'Furthermore, technology has transformed communication patterns.', synonyms: ['moreover', 'in addition', 'besides'], collocations: ['furthermore', 'furthermore, it is clear that'] },
        { word: 'nevertheless', definition: 'in spite of that; however (used to introduce contrast)', partOfSpeech: 'adverb', exampleSentence: 'Nevertheless, there are exceptions to this rule.', bacExample: 'The plan is risky; nevertheless, it may succeed.', synonyms: ['however', 'nonetheless', 'yet'], collocations: ['nevertheless', 'nevertheless, it must be noted'] },
        { word: 'consequently', definition: 'as a result; therefore (shows cause and effect)', partOfSpeech: 'adverb', exampleSentence: 'Consequently, many people lost their jobs.', bacExample: 'Consequently, urgent action is required.', synonyms: ['therefore', 'thus', 'as a result'], collocations: ['consequently', 'consequently, this means'] },
        { word: 'on the other hand', definition: 'used to present a contrasting point of view', partOfSpeech: 'phrase', exampleSentence: 'On the other hand, some argue differently.', bacExample: 'On the other hand, critics point to the costs involved.', synonyms: ['conversely', 'in contrast', 'alternatively'], collocations: ['on the other hand', 'but on the other hand'] },
        { word: 'to illustrate', definition: 'to provide an example or explanation', partOfSpeech: 'phrase', exampleSentence: 'To illustrate, consider the following case.', bacExample: 'To illustrate, the 2008 financial crisis shows...', synonyms: ['for example', 'for instance', 'namely'], collocations: ['to illustrate this point', 'to illustrate, let us consider'] },
        { word: 'in conclusion', definition: 'used to introduce the final summary of an argument', partOfSpeech: 'phrase', exampleSentence: 'In conclusion, education is fundamental.', bacExample: 'In conclusion, the evidence strongly supports this position.', synonyms: ['to sum up', 'in summary', 'to conclude'], collocations: ['in conclusion', 'in conclusion, it is clear that'] },
        { word: 'it is evident that', definition: 'it is clear/obvious that', partOfSpeech: 'phrase', exampleSentence: 'It is evident that changes are needed.', bacExample: 'It is evident that education reforms are necessary.', synonyms: ['clearly', 'obviously', 'apparently'], collocations: ['it is evident that', 'it is self-evident that'] },
        { word: 'underscore', definition: 'to emphasize or highlight the importance of', partOfSpeech: 'verb', exampleSentence: 'These results underscore the need for action.', bacExample: 'The data underscore the urgency of climate action.', synonyms: ['emphasize', 'highlight', 'stress'], collocations: ['underscore the importance', 'underscore the need', 'strongly underscore'] },
        { word: 'arguably', definition: 'it can be argued that; possibly', partOfSpeech: 'adverb', exampleSentence: 'This is arguably the most important factor.', bacExample: 'Technology is arguably the greatest change of our era.', synonyms: ['possibly', 'perhaps', 'allegedly'], collocations: ['arguably the', 'arguably one of', 'arguably, this'] },
        { word: 'pertinent', definition: 'relevant or applicable to a particular matter', partOfSpeech: 'adjective', exampleSentence: 'Several pertinent questions were raised.', bacExample: 'It is pertinent to consider the historical context.', synonyms: ['relevant', 'applicable', 'germane'], collocations: ['pertinent question', 'pertinent point', 'highly pertinent'] },
        { word: 'mitigate', definition: 'to make less severe, serious, or painful', partOfSpeech: 'verb', exampleSentence: 'We must mitigate the environmental damage.', bacExample: 'Education can mitigate the effects of poverty.', synonyms: ['alleviate', 'reduce', 'lessen'], collocations: ['mitigate the effects', 'mitigate the impact', 'mitigate risks'] },
        { word: 'proliferation', definition: 'rapid increase in numbers or spread', partOfSpeech: 'noun', exampleSentence: 'The proliferation of smartphones changed communication.', bacExample: 'The proliferation of fake news is concerning.', synonyms: ['spread', 'expansion', 'multiplication'], collocations: ['proliferation of', 'rapid proliferation', 'widespread proliferation'] }
      ]
    }
  ];

  for (const set of vocabSets) {
    const vocabSet = await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: {
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
        difficulty: set.difficulty
      },
      create: {
        slug: set.slug,
        language: Language.ENGLISH,
        theme: set.theme,
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
        difficulty: set.difficulty
      }
    });

    // Create vocab items
    for (const item of set.items) {
      await prisma.vocabItem.upsert({
        where: {
          id: `${vocabSet.id}-${item.word.replace(/\s+/g, '-')}`
        },
        update: item,
        create: {
          ...item,
          vocabularySetId: vocabSet.id,
          synonyms: item.synonyms || [],
          antonyms: item.antonyms || [],
          collocations: item.collocations || []
        }
      });
    }
  }

  console.log(`Seeded ${vocabSets.length} vocabulary sets with ${vocabSets.reduce((acc, s) => acc + s.items.length, 0)} items`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
