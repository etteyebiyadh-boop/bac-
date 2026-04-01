const { PrismaClient, Language, GrammarCategory, VocabTheme, BacModule, Difficulty } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * ARABIC LANGUAGE CONTENT FOR TUNISIAN BAC
 * Complete grammar, vocabulary, and lessons for Arabic section students
 */

async function main() {
  console.log('🇸🇦 Seeding Arabic BAC Content...\n');

  await seedArabicGrammarRules();
  await seedArabicVocabulary();
  await seedArabicLessons();

  console.log('\n✅ Arabic Content Seeded Successfully!');
}

// ==========================================
// ARABIC GRAMMAR RULES
// ==========================================

async function seedArabicGrammarRules() {
  console.log('📘 Creating Arabic Grammar Rules...');

  const arabicGrammarRules = [
    // MODULE 1: HOLIDAYING & ART SHOWS
    {
      slug: 'arabic-present-tense',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.TENSES,
      title: 'المضارع (Present Tense)',
      rule: 'يُستعمل للحدث الحالي أو المتكرر. يبدأ بالمضارعة (أ، ي، ت، ن).',
      formula: 'المضارعة + الفعل + ضمائر الرفع',
      examples: [
        { positive: 'أسافر إلى تونس كل صيف', translation: 'I travel to Tunisia every summer' },
        { positive: 'يزور السياح المتاحف', translation: 'Tourists visit museums' },
        { positive: 'تستمتع العائلات بالعطلات', translation: 'Families enjoy holidays' }
      ],
      exceptions: ['الأفعال الناقصة: كان، أصبح، أضحى، ظل، ما زال، ما برح، ما فتئ'],
      usageNotes: 'Essential for describing travel routines, habits, and current situations.',
      commonErrors: ['Confusing present with future', 'Wrong prefix for person'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'arabic-past-tense',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      category: GrammarCategory.TENSES,
      title: 'الماضي (Past Tense)',
      rule: 'يُستعمل للحدث المنتهي في الماضي. يُبنى على الفتح.',
      formula: 'الفعل الماضي + ضمائر الرفع',
      examples: [
        { positive: 'سافرت إلى قرطاج', translation: 'I traveled to Carthage' },
        { positive: 'زارت العائلة المتحف', translation: 'The family visited the museum' },
        { positive: 'استمتعنا بالمهرجان', translation: 'We enjoyed the festival' }
      ],
      exceptions: ['الأفعال المعتلة: قال، رمى، مشى', 'الأفعال الناقصة في الماضي'],
      usageNotes: 'Used for completed actions in travel narratives and storytelling.',
      commonErrors: ['Wrong voweling on weak verbs', 'Confusing with present'],
      difficulty: Difficulty.EASY,
      isEssential: true
    },
    {
      slug: 'arabic-idafa-construction',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      category: GrammarCategory.ARTICLES,
      title: 'الإضافة (The Construct State)',
      rule: 'للدلالة على الملكية أو العلاقة بين اسمين.',
      formula: 'المضاف (منوّن) + المضاف إليه (مجرور بدون أل)',
      examples: [
        { example: 'كتاب الطالب', translation: 'The student\'s book' },
        { example: 'مكتب المدرس', translation: 'The teacher\'s office' },
        { example: 'متحف الآثار', translation: 'The archaeology museum' }
      ],
      exceptions: ['إذا كان المضاف إليه معرف بـ"أل" فإنه يُبقى مجروراً'],
      usageNotes: 'Essential for forming compound nouns and showing possession.',
      commonErrors: ['Using al- on the second noun', 'Wrong case ending'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'arabic-conditional-sentences',
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      category: GrammarCategory.CONDITIONALS,
      title: 'جمل الشرط (Conditional Sentences)',
      rule: 'للتعبير عن افتراضات وإمكانيات.',
      formula: 'أداة الشرط (إن، لو، لولا، لوما) + فعل ماض + جواب الشرط',
      examples: [
        { example: 'إنْ تدرسْ جيداً، تنجحْ', translation: 'If you study well, you succeed' },
        { example: 'لَوْ عرفتُ، لأخبرتُك', translation: 'Had I known, I would have told you' },
        { example: 'لَوْلا العلم، لما تقدّمنا', translation: 'Were it not for knowledge, we would not advance' }
      ],
      exceptions: ['الجزم في فعل الشرط إذا كان مضارعاً', 'استخدام لام التعليل في جواب الشرط'],
      usageNotes: 'Critical for discussing hypothetical situations and innovation scenarios.',
      commonErrors: ['Wrong verb form in conditional', 'Wrong response particle'],
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'arabic-passive-voice',
      bacModule: BacModule.MODULE_4_YOUTH_ISSUES,
      category: GrammarCategory.PASSIVE_VOICE,
      title: 'المبني للمجهول (Passive Voice)',
      rule: 'للتعبير عن الحدث دون ذكر الفاعل.',
      formula: 'نون النسوة/المضارعة + الفعل + ضمائر الرفع',
      examples: [
        { example: 'أُقيم المهرجان سنوياً', translation: 'The festival is held annually' },
        { example: 'يُدرّس اللغة العربية في المدارس', translation: 'Arabic is taught in schools' },
        { example: 'تمّ بناء المدرسة', translation: 'The school was built' }
      ],
      exceptions: ['لا يُستعمل مع الأفعال الناقصة', 'تغيّر الحركات في الماضي'],
      usageNotes: 'Used for formal writing and when the actor is unknown or unimportant.',
      commonErrors: ['Keeping the active form', 'Wrong voweling'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'arabic-verbal-nouns',
      bacModule: BacModule.MODULE_5_WOMEN_POWER,
      category: GrammarCategory.TENSES,
      title: 'المصادر (Verbal Nouns)',
      rule: 'أسماء تدل على معنى الفعل.',
      formula: 'مشتقة من الأفعال الثلاثية والرباعية',
      examples: [
        { example: 'النجاح يتطلب العمل', translation: 'Success requires work' },
        { example: 'التعليم حقّ للجميع', translation: 'Education is a right for everyone' },
        { example: 'التقدّم يحتاج إلى صبر', translation: 'Progress requires patience' }
      ],
      exceptions: ['أوزان المصادر: فعل، فعْل، فِعْل، فعَلان، مفعَل، etc.'],
      usageNotes: 'Essential for abstract and academic writing about social issues.',
      commonErrors: ['Wrong pattern for verbal noun', 'Using verb instead of masdar'],
      difficulty: Difficulty.HARD,
      isEssential: true
    },
    {
      slug: 'arabic-relative-clauses',
      bacModule: BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT,
      category: GrammarCategory.RELATIVE_CLAUSES,
      title: 'جمل الصلة (Relative Clauses)',
      rule: 'لربط الجمل باستخدام اسم الموصول.',
      formula: 'الموصول (الذي، التي، الذين، اللاتي) + جملة صلة',
      examples: [
        { example: 'البيئة التي نعيش فيها', translation: 'The environment we live in' },
        { example: 'المشروع الذي بدأناه', translation: 'The project we started' },
        { example: 'الموارد التي نحتاجها', translation: 'The resources we need' }
      ],
      exceptions: ['العود إلى الموصول يمكن حذفه إذا لم يكن ضميراً متصلاً'],
      usageNotes: 'Creates complex sentences and adds sophistication to writing.',
      commonErrors: ['Wrong gender/number agreement', 'Forgetting the return pronoun'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'arabic-connector-words',
      bacModule: BacModule.MODULE_7_WORK_COMMITMENT,
      category: GrammarCategory.CONNECTORS,
      title: 'أدوات الربط (Connectors)',
      rule: 'لربط الأفكار وتنظيم النص.',
      formula: 'حسب المعنى: إضافة، تناقض، سبب، نتيجة',
      examples: [
        { addition: 'كما، أيضاً، فضلاً عن', contrast: 'لكن، مع ذلك، بينما' },
        { cause: 'لأنّ، نظراً لـ، بسبب', result: 'لذلك، إذاً، وبالتالي' }
      ],
      exceptions: ['بعض الأدوات تتطلب تغييراً في الجملة التي تسبقها'],
      usageNotes: 'Essential for coherent essay writing and formal discourse.',
      commonErrors: ['Using connectors incorrectly', 'Wrong connector for context'],
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'arabic-rhetorical-questions',
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS,
      category: GrammarCategory.MODALS,
      title: 'الأساليب الإنشائية (Rhetorical Patterns)',
      rule: 'أساليب بلاغية للتأثير على المتلقي.',
      formula: 'الاستفهام، التقرير، القسم، النداء، التعجب',
      examples: [
        { interrogative: 'أليس التعليم حقاً للجميع؟', oath: 'والله لتجدنّي أعمل جاهداً' },
        { exclamation: 'ما أجمل العلم!', call: 'يا شباب التقدم!'
      }],
      exceptions: ['الأساليب تتغير حسب السياق البلاغي'],
      usageNotes: 'Used in literary analysis and persuasive writing.',
      commonErrors: ['Wrong pattern for style', 'Overuse of rhetorical devices'],
      difficulty: Difficulty.HARD,
      isEssential: true
    }
  ];

  for (const rule of arabicGrammarRules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: { ...rule, language: Language.ARABIC }
    });
  }

  console.log(`✅ Created ${arabicGrammarRules.length} Arabic Grammar Rules`);
}

// ==========================================
// ARABIC VOCABULARY SETS
// ==========================================

async function seedArabicVocabulary() {
  console.log('\n📚 Creating Arabic Vocabulary Sets...');

  const arabicVocabSets = [
    {
      slug: 'arabic-module-1-travel',
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      theme: VocabTheme.TRAVEL,
      title: 'العربية - الوحدة 1: السفر والسياحة',
      description: 'مفردات أساسية للحديث عن السفر والسياحة والعطلات.',
      bacContext: 'هذه المفردات تظهر في نصوص الباك حول السياحة والتجارب الثقافية.',
      items: [
        { word: 'سفر', definition: 'الانتقال من مكان إلى آخر للسياحة أو العمل', partOfSpeech: 'اسم', exampleSentence: 'السفر يوسّع الأفق.', bacExample: 'يُفضّل الشباب السفر في العطلة الصيفية.', collocations: ['السفر إلى الخارج', 'رحلة سفر'] },
        { word: 'سياحة', definition: 'زيارة الأماكن للاستمتاع والتعلم', partOfSpeech: 'اسم', exampleSentence: 'السياحة مصدر دخل مهم.', bacExample: 'تُعدّ السياحة من أهم موارد البلاد.', collocations: ['السياحة الثقافية', 'قطاع السياحة'] },
        { word: 'موقع', definition: 'مكان أو موضع', partOfSpeech: 'اسم', exampleSentence: 'هذا موقع تاريخي مهم.', bacExample: 'تونس موقع استراتيجي في المتوسط.', collocations: ['موقع تاريخي', 'موقع جغرافي'] },
        { word: 'معالم', definition: 'أماكن مشهورة وأثار تاريخية', partOfSpeech: 'اسم جمع', exampleSentence: 'زُرنا معالم المدينة القديمة.', bacExample: 'تزخر تونس بالمعالم الأثرية.', collocations: ['معالم تاريخية', 'معالم سياحية'] },
        { word: 'تراث', definition: 'ما خلفه الأجداد من ثقافة وعادات', partOfSpeech: 'اسم', exampleSentence: 'التراث الثقافي غني.', bacExample: 'يجب الحفاظ على التراث للأجيال القادمة.', collocations: ['التراث الثقافي', 'التراث الشعبي'] },
        { word: 'حضارة', definition: 'تطوّر المجتمع في العلوم والفنون', partOfSpeech: 'اسم', exampleSentence: 'الحضارة الإسلامية عظيمة.', bacExample: 'شهدت قرطاجة حضارة عريقة.', collocations: ['الحضارة القديمة', 'حضارة متقدمة'] },
        { word: 'استكشاف', definition: 'اكتشاف مكان جديد أو معلومة', partOfSpeech: 'اسم', exampleSentence: 'أحبّ استكشاف الأماكن الجديدة.', bacExample: 'يتطلب النجاح استكشاف فرص جديدة.', collocations: ['استكشاف المعالم', 'روح الاستكشاف'] },
        { word: 'مغامرة', definition: 'خوض تجربة جديدة ومحفوفة بالمخاطر', partOfSpeech: 'اسم', exampleSentence: 'السفر مغامرة ممتعة.', bacExample: 'تُعتبر الدراسة في الخارج مغامرة ثقافية.', collocations: ['مغامرة جديدة', 'روح المغامرة'] },
        { word: 'استراحة', definition: 'فترة للراحة والاستجمام', partOfSpeech: 'اسم', exampleSentence: 'نحتاج إلى استراحة بعد العمل.', bacExample: 'تُعدّ العطلة فترة استراحة مهمة للطلاب.', collocations: ['استراحة قصيرة', 'فترة استراحة'] },
        { word: 'ذكرى', definition: 'ما يبقى في الذاكرة من حدث', partOfSpeech: 'اسم', exampleSentence: 'السفر يخلّد الذكريات.', bacExample: 'تظلّ رحلة الباك ذكرى لا تُنسى.', collocations: ['ذكرى جميلة', 'تخليد الذكرى'] }
      ]
    },
    {
      slug: 'arabic-module-2-education',
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS,
      theme: VocabTheme.EDUCATION,
      title: 'العربية - الوحدة 2: التعليم والتعلم',
      description: 'مفردات أكاديمية للحديث عن النظام التعليمي والدراسة.',
      bacContext: 'أساسي للكتابة عن التعليم ومقارنة طرق التعلم.',
      items: [
        { word: 'علم', definition: 'معرفة أو فهم في مجال ما', partOfSpeech: 'اسم', exampleSentence: 'العلم نور.', bacExample: 'يُعتبر العم التعليمي أساساً للتقدم.', collocations: ['العلم والمعرفة', 'طلب العلم'] },
        { word: 'معرفة', definition: 'إدراك الحقائق والمعلومات', partOfSpeech: 'اسم', exampleSentence: 'المعرفة قوة.', bacExample: 'تُسهم المعرفة في بناء المجتمع.', collocations: ['معرفة عميقة', 'اكتساب المعرفة'] },
        { word: 'تعليم', definition: 'نقل المعارف والمهارات', partOfSpeech: 'اسم', exampleSentence: 'التعليم حق للجميع.', bacExample: 'يحتاج التعليم في تونس إلى إصلاحات.', collocations: ['التعليم الأساسي', 'نظام التعليم'] },
        { word: 'تعلم', definition: 'اكتساب المعارف والمهارات', partOfSpeech: 'اسم/فعل', exampleSentence: 'التعلم مستمر.', bacExample: 'يتطلب التعلم الناجح جهدًا وصبرًا.', collocations: ['التعلم الذاتي', 'استراتيجية التعلم'] },
        { word: 'دراسة', definition: 'قراءة وفهم المواد الدراسية', partOfSpeech: 'اسم', exampleSentence: 'الدراسة تتطلب تركيزاً.', bacExample: 'تُعدّ الدراسة للباك تحدياً كبيراً.', collocations: ['دراسة جادة', 'مكان الدراسة'] },
        { word: 'طالب', definition: 'من يلتحق بالمدرسة أو الجامعة للتعلم', partOfSpeech: 'اسم', exampleSentence: 'الطالب مجتهد.', bacExample: 'يُواجه الطالب الباك تحديات كبيرة.', collocations: ['طالب مجتهد', 'حياة الطالب'] },
        { word: 'معلم', definition: 'من يُعلّم الطلاب في المدرسة', partOfSpeech: 'اسم', exampleSentence: 'المعلمُ مُربٍّ.', bacExample: 'يُعتبر المعلم عماد العملية التعليمية.', collocations: ['معلم كفء', 'دور المعلم'] },
        { word: 'مناهج', definition: 'المواد الدراسية المقررة', partOfSpeech: 'اسم جمع', exampleSentence: 'المناهج تحتاج إلى تحديث.', bacExample: 'تُحاول وزارة التربية تطوير المناهج.', collocations: ['مناهج تعليمية', 'تطوير المناهج'] },
        { word: 'امتحان', definition: 'اختبار لقياس المعرفة', partOfSpeech: 'اسم', exampleSentence: 'الامتحان قريب.', bacExample: 'يُعدّ امتحان الباك محطة حاسمة.', collocations: ['امتحان نهائي', 'موسم الامتحانات'] },
        { word: 'نجاح', definition: 'الوصول إلى الهدف المرجو', partOfSpeech: 'اسم', exampleSentence: 'النجاح يحتاج إلى عمل.', bacExample: 'يُعدّ النجاح في الباك هدفاً يسعى إليه الطلاب.', collocations: ['نجاح دراسي', 'مفتاح النجاح'] }
      ]
    }
  ];

  for (const set of arabicVocabSets) {
    await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: {
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
      },
      create: {
        slug: set.slug,
        language: Language.ARABIC,
        bacModule: set.bacModule,
        theme: set.theme,
        title: set.title,
        description: set.description,
        bacContext: set.bacContext,
        difficulty: Difficulty.MEDIUM,
        isCommon: true
      }
    });

    for (const item of set.items) {
      const vocabSet = await prisma.vocabularySet.findUnique({ where: { slug: set.slug } });
      if (vocabSet) {
        await prisma.vocabItem.create({
          data: {
            vocabularySetId: vocabSet.id,
            word: item.word,
            definition: item.definition,
            partOfSpeech: item.partOfSpeech,
            exampleSentence: item.exampleSentence,
            bacExample: item.bacExample,
            collocations: item.collocations,
            difficulty: Difficulty.MEDIUM
          }
        });
      }
    }
  }

  console.log(`✅ Created ${arabicVocabSets.length} Arabic Vocabulary Sets`);
}

// ==========================================
// ARABIC LESSONS
// ==========================================

async function seedArabicLessons() {
  console.log('\n📚 Creating Arabic Lessons...');

  const arabicLessons = [
    {
      slug: 'arabic-m1-writing-travel',
      language: Language.ARABIC,
      title: 'كتابة تعبير عن الرحلة',
      summary: 'تعلم كتابة موضوع تعبير منظم عن الرحلات والسفر.',
      body: `تتطلب كتابة موضوع عن الرحلة التوازن بين الوصف الموضوعي والتأمل الشخصي. يقيّم الباك العربي قدرتك على تنظيم نص سردي متماسك.

**هيكل موضوع الرحلة:**

**المقدمة (2-3 جمل)**
- عرض المكان وظروف الرحلة
- الإعلان عن الهدف أو التوقعات الأولية

**العرض (3-4 فقرات)**
- وصف الأماكن التي زرتها (استخدم التفاصيل الحسية)
- لقاءات مع السكان المحليين أو المسافرين الآخرين
- الاكتشافات والمفاجآت
- الصعوبات التي واجهتها والحلول التي قدمتها

**الخاتمة (جملتان)**
- تقييم التجربة
- التطور الشخصي أو العبرة المستفادة

**مفردات مفيدة:**
- أفعال: اكتشف، استكشف، تجول، أسافر
- صفات: ساحر، خلاب، أصيل، مدهش
- روابط: أولاً، ثمّ، أخيراً، في الختام

**تمرين:**
اكتب 150 كلمة عن رحلة قمت بها أو تودّ القيام بها.`,
      theme: 'كتابة الرحلات',
      skillFocus: 'structure',
      difficulty: Difficulty.MEDIUM,
      estimatedMinutes: 20,
      takeawayJson: ['تنظيم السرد زمنياً', 'مزج الوصف بالشعور', 'استخدام الماضي والمضارع بشكل صحيح'],
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS
    },
    {
      slug: 'arabic-m2-argumentative-education',
      language: Language.ARABIC,
      title: 'موضوع جدلي: التعليم في تحدٍ',
      summary: 'إتقان هيكل المقال الجدلي حول قضايا التعليم.',
      body: `يُعدّ المقال الجدلي امتحان الملك في الباك العربي. يقيّم قدرتك على بناء حجة منطقية ومتماسكة.

**الهيكل الكلاسيكي:**

**المقدمة (10% من النص)**
- جذب الانتباه: اقتباس، سؤال، ملاحظة
- تعريف مصطلحات الموضوع
- إشكالية: السؤال المركزي
- إعلان عن الخطة (2-3 أجزاء)

**العرض (80% من النص)**
- الجزء الأول: حجة مع أمثلة من النصوص
- الجزء الثاني: نقض المعاكس ثم الرد عليه
- الجزء الثالث: تجاوز أو منظور جديد

**الخاتمة (10% من النص)**
- تلخيص الحجج
- فتح على مجال آخر

**مواضيع شائعة حول التعليم:**
- "هل يستطيع التعليم تعليم كل شيء؟"
- "هل يجب أن نطيع لنتعلم؟"
- "هل التكنولوجيا تُغيّر التعليم؟"

**روابط جدلية:**
- الإضافة: كما، أيضاً، فضلاً عن
- المعارضة: لكن، مع ذلك، بينما
- السببية: لأنّ، نظراً لـ، بسبب
- التوصية: لذلك، إذاً، وبالتالي

**تمرين:**
ضع خطة مفصّلة حول الموضوع: "هل مدرسة الحياة تساوي أكثر من مدرسة الكتب؟"`,
      theme: 'المقال الجدلي',
      skillFocus: 'structure',
      difficulty: Difficulty.HARD,
      estimatedMinutes: 30,
      takeawayJson: ['بناء إشكالية واضحة', 'التنظيم في أجزاء منطقية', 'استخدام أمثلة دقيقة'],
      bacModule: BacModule.MODULE_2_EDUCATION_MATTERS
    },
    {
      slug: 'arabic-m8-literary-analysis',
      language: Language.ARABIC,
      title: 'التحليل الأدبي: قراءة النصوص',
      summary: 'منهجية قراءة وتحليل النص الأدبي في الباك.',
      body: `يقيّم التحليل الأدبي قدرتك على قراءة نص أدبي بتمعن واستعمال معارفك.

**المنهجية في 3 مراحل:**

**1. القراءة والفهم (10 دقائق)**
- تحديد النوع الأدبي (شعر، مسرح، نثر)
- تحديد الموضوع الرئيسي
- ملاحظة الخصائص الأسلوبية

**2. التحليل والبناء (15 دقيقة)**
- إيجاد إشكالية مناسبة
- تحديد الآثار المعنوية المهمة
- التنظيم في تسلسل منطقي

**3. الكتابة (65 دقيقة)**
- المقدمة: تقديم + إعلان إشكالية + خطة
- العرض: 3 أجزاء مع قسمين فرعيين لكل جزء
- الخاتمة: تلخيح + فتح

**شبكات التحليل:**
- المستوى اللغوي: المجال الدلالي، حقل معجمي
- البلاغة: الاستعارة، التشبيه، التورية
- الإيقاع: التفعيلة، الالتزام، التجنيس

**مقدمة نموذجية:**
"هذا النص مستخرج من [العنوان] لـ [المؤلف]، الأديب [الخصائص]. إنه [النوع الأدبي] الذي موضوعه الرئيسي هو [الموضوع]. ندرس كيف [الإشكالية]."

**تمرين:**
حلّل هيكل المقدمة أعلاه وطبّقها على نص تعرفه.`,
      theme: 'التحليل الأدبي',
      skillFocus: 'comprehension',
      difficulty: Difficulty.HARD,
      estimatedMinutes: 25,
      takeawayJson: ['تحديد الأساليب الأدبية', 'بناء إشكالية دقيقة', 'تحليل بالعمق لا بالسطحية'],
      bacModule: BacModule.MODULE_8_LITERARY_TEXTS
    }
  ];

  for (const lesson of arabicLessons) {
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: lesson,
      create: lesson
    });
  }

  console.log(`✅ Created ${arabicLessons.length} Arabic Lessons`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
