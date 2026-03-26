const { PrismaClient, Language, Difficulty } = require('@prisma/client');
const prisma = new PrismaClient();

const ARABIC_EXAMS = [
  {
    slug: 'bac-2025-principale-arabic',
    year: 2025,
    title: 'BAC 2025 Session Principale - Arabe',
    language: Language.ARABIC,
    prompt: 'امتحان البكالوريا - القراءة (الشباب والتكنولوجيا) + الإنتاج الكتابي (مقال 200-250 كلمة)',
    modelAnswer: 'نموذج إجابة كامل: فهم القراءة، قواعد اللغة، ومقال رأي حول دور التكنولوجيا في حياة الشباب',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'الشباب والتكنولوجيا: تحديات وآفاق',
    readingContent: 'الشباب والتكنولوجيا: تحديات وآفاق\n\nأصبحت التكنولوجيا جزءًا لا يتجزأ من حياة الشباب في عصرنا الرقمي. تقدم منصات التواصل الاجتماعي مثل إنستغرام وتيك توك فرصًا غير مسبوقة للتعبير عن الذات والإبداع والتواصل.\n\nغير أن هذا الاتصال الدائم يأتي مع تحديات كبيرة. تشير الدراسات الحديثة إلى أن المراهق يقضي 7-8 ساعات يوميًا على منصات التواصل. هذه المنصات تعرض الشباب للتنمر الإلكتروني ومعايير جمال غير واقعية.',
    methodology: 'تنسيق البكالوريا التونسية: القراءة (12 نقطة)، الإنتاج الكتابي (8 نقاط)، النحو (10 نقاط)'
  },
  {
    slug: 'bac-2024-principale-arabic',
    year: 2024,
    title: 'BAC 2024 Session Principale - Arabe',
    language: Language.ARABIC,
    prompt: 'امتحان البكالوريا - نص فلسفي: الحرية والمسؤولية + مقال فلسفي',
    modelAnswer: 'نموذج إجابة: تحليل نص فلسفي حول الحرية، والمقال الفلسفي حول العلاقة بين الحرية والمسؤولية',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'الحرية والمسؤولية: وجهان لعملة واحدة',
    readingContent: 'الحرية والمسؤولية: وجهان لعملة واحدة\n\nالحرية ليست غياب القيود، بل هي القدرة على اختيار ما هو صحيح وأخلاقي. الإنسان الحر هو الذي يتحمل مسؤولية أفعاله أمام نفسه و أمام مجتمعه.\n\nفالحرية المطلقة غير موجودة في أي مجتمع. كل حرية تنتهي حيث تبدأ حرية الآخرين. هذه هي الحكمة التي يجب أن يفهمها كل مواطن.',
    methodology: 'تنسيق البكالوريا التونسية: القراءة (12 نقطة)، الإنتاج الكتابي (8 نقاط)، النحو (10 نقاط)'
  },
  {
    slug: 'bac-2023-principale-arabic',
    year: 2023,
    title: 'BAC 2023 Session Principale - Arabe',
    language: Language.ARABIC,
    prompt: 'امتحان البكالوريا - نص أدبي: الوطن والانتماء + إنشاء أدبي',
    modelAnswer: 'نموذج إجابة: تحليل نص أدبي حول حب الوطن، والإنشاء الأدبي في موضوع الانتماء الوطني',
    difficulty: Difficulty.HARD,
    estimatedMinutes: 180,
    readingTitle: 'حب الوطن: أصدق أنواع الحب',
    readingContent: 'حب الوطن: أصدق أنواع الحب\n\nالوطن ليس مجرد قطعة أرض نعيش عليها، بل هو هويتنا وتاريخنا وذاكرتنا الجماعية. حب الوطن ليس شعارًا نردده، بل عمل نمارسه كل يوم.\n\nفي تونس، نحن نفتخر بأننا أهل ثورة الحرية والكرامة. هذه الثورة علمتنا أن الوطن يُبنى بالعمل الجاد، وأن المستقبل يُصنع بالأمل والتضحية.',
    methodology: 'تنسيق البكالوريا التونسية: القراءة (12 نقطة)، الإنتاج الكتابي (8 نقاط)، النحو (10 نقاط)'
  }
];

const ARABIC_CONTENT = {
  grammarRules: [
    {
      slug: 'arabic-verb-tenses',
      language: Language.ARABIC,
      category: 'TENSES',
      title: 'أزمنة الفعل في العربية',
      rule: 'الماضي: فعل وقع، المضارع: فعل يقع الآن أو سيفعل، الأمر: طلب فعل',
      formula: 'فعل ماضي = فعل + تاء التأنيث (اختياري)، فعل مضارع = ي/ت/ن/أ + الفعل',
      examples: JSON.stringify([
        { past: 'كتبَ الطالبُ الدرسَ', present: 'يكتبُ الطالبُ الدرسَ', command: 'اكتبْ الدرسَ' }
      ]),
      difficulty: Difficulty.MEDIUM,
      isEssential: true
    },
    {
      slug: 'arabic-case-endings',
      language: Language.ARABIC,
      category: 'ARTICLES',
      title: 'إعراب الأسماء: الرفع والنصب والجر',
      rule: 'الرفع: ضمة، النصب: فتحة، الجر: كسرة',
      formula: 'مفعول به = منصوب (فتحة)، فاعل = مرفوع (ضمة)، مضاف إليه = مجرور (كسرة)',
      examples: JSON.stringify([
        { raf: 'الطالبُ مجتهدٌ', nasb: 'رأيتُ الطالبَ', jarr: 'ذهبتُ إلى المدرسةِ' }
      ]),
      difficulty: Difficulty.HARD,
      isEssential: true
    }
  ],
  vocabSets: [
    {
      slug: 'arabic-bac-philosophy-terms',
      language: Language.ARABIC,
      theme: 'SCIENCE',
      title: 'مصطلحات فلسفية للبكالوريا',
      description: 'المفاهيم الفلسفية الأساسية في منهج البكالوريا التونسية',
      bacContext: 'مناسب لجميع الشعب، خاصة شعبة الآداب',
      items: [
        { word: 'الحرية', definition: 'قدرة الإنسان على الاختيار دون إكراه', example: 'الحرية مسؤولية قبل أن تكون حقاً' },
        { word: 'العدالة', definition: 'توزيع حقوق وواجبات متساوية بين الناس', example: 'العدالة أساس المجتمعات المتحضرة' },
        { word: 'الديمقراطية', definition: 'حكم الشعب لنفسه عبر ممثلين', example: 'التونسية نموذج ديمقراطي في المنطقة' },
        { word: 'الكرامة', definition: 'قيمة الإنسان التي لا تُقدر بثمن', example: 'الثورة كانت من أجل الكرامة' },
        { word: 'المواطنة', definition: 'انتماء الفرد لدولة وحقوقه وواجباته', example: 'المواطنة الصالحة تتطلب المشاركة' },
        { word: 'التسامح', definition: 'قبول الآخر واحترام اختلافاته', example: 'التسامح قيمة حضارية' },
        { word: 'العمل', definition: 'جهد يبذله الإنسان لإنتاج شيء مفيد', example: 'العمل مفتاح النجاح' },
        { word: 'العلم', definition: 'معرفة منظمة ومؤكدة', example: 'العلم نور والجهل ظلام' }
      ]
    },
    {
      slug: 'arabic-connectors-essay',
      language: Language.ARABIC,
      theme: 'EDUCATION',
      title: 'روابط الإنشاء العربي',
      description: 'أدوات الربط الأساسية للمقال والإنشاء',
      bacContext: 'ضرورية لإنتاج كتابي متسلسل ومتماسك',
      items: [
        { word: 'أولاً/ثانياً/ثالثاً', definition: 'لترتيب الأفكار', example: 'أولاً نعرف المشكلة، ثانياً نحللها' },
        { word: 'بناءً على ذلك', definition: 'للاستنتاج', example: 'بناءً على ذلك، نرى أن...' },
        { word: 'في الختام', definition: 'للخاتمة', example: 'في الختام، يمكن القول إن...' },
        { word: 'على سبيل المثال', definition: 'لإعطاء مثال', example: 'على سبيل المثال، نجد أن...' },
        { word: 'بعكس ذلك', definition: 'للتناقض', example: 'بعكس ذلك، نرى أن...' }
      ]
    }
  ]
};

async function seed() {
  console.log('Seeding Arabic BAC Content...\n');
  
  // Seed Arabic Exams
  for (const exam of ARABIC_EXAMS) {
    await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: exam,
      create: exam
    });
    console.log(`✓ ${exam.title}`);
  }
  
  // Seed Arabic Grammar Rules
  for (const rule of ARABIC_CONTENT.grammarRules) {
    await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: rule
    });
    console.log(`✓ Grammar: ${rule.title}`);
  }
  
  // Seed Arabic Vocabulary Sets
  for (const set of ARABIC_CONTENT.vocabSets) {
    const items = set.items;
    delete set.items;
    
    const vocabSet = await prisma.vocabularySet.upsert({
      where: { slug: set.slug },
      update: set,
      create: set
    });
    
    // Create vocab items
    for (const item of items) {
      const { example, ...itemData } = item;
      await prisma.vocabItem.createMany({
        data: {
          ...itemData,
          vocabularySetId: vocabSet.id,
          partOfSpeech: 'noun',
          exampleSentence: example,
          bacExample: example
        },
        skipDuplicates: true
      });
    }
    console.log(`✓ Vocab: ${set.title} (${items.length} words)`);
  }
  
  console.log(`\n✅ Arabic BAC Content Seeded Successfully`);
  console.log(`   - ${ARABIC_EXAMS.length} Arabic BAC Exams`);
  console.log(`   - ${ARABIC_CONTENT.grammarRules.length} Grammar Rules`);
  console.log(`   - ${ARABIC_CONTENT.vocabSets.length} Vocabulary Sets`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
