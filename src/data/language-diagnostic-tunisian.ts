import type { CurriculumLanguageCode, CurriculumLevel, CurriculumSkillFocus } from "@/lib/language-system";

export type DiagnosticChoice = {
  id: string;
  text: string;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  skill: CurriculumSkillFocus;
  targetLevel: CurriculumLevel;
  choices: DiagnosticChoice[];
  correctChoiceId: string;
  explanation: string;
  bacContext?: string; // Context about why this matters for Tunisian Bac
};

export type DiagnosticTrack = {
  intro: string;
  title: string;
  subtitle: string;
  questions: DiagnosticQuestion[];
};

// Tunisian Bac-Focused Diagnostic Questions
// These questions are designed specifically for Tunisian students preparing for the Bac
export const diagnosticQuestionBank: Record<CurriculumLanguageCode, DiagnosticTrack> = {
  ENGLISH: {
    title: "Tunisian Bac English Diagnostic",
    subtitle: "Assess your English level for the 2026 Tunisian Baccalaureate",
    intro: "This diagnostic evaluates your English skills specifically for the Tunisian Bac exam format: essay writing, reading comprehension, and grammar relevant to your Bac section.",
    questions: [
      // BAC SECTION CONTEXT QUESTION
      {
        id: "en-bac-section",
        prompt: "What is your Tunisian Bac section? (This helps us tailor content to your needs)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "lettres", text: "Lettres (I need strong writing & literature skills)" },
          { id: "sciences", text: "Sciences/Technique/Maths (I need technical & essay skills)" },
          { id: "eco", text: "Économie/Gestion (I need business & formal communication)" },
          { id: "other", text: "Other/Not sure yet" }
        ],
        correctChoiceId: "lettres",
        explanation: "Your Bac section determines which language skills to prioritize. Lettres students need advanced essay writing, Sciences need technical vocabulary, Économie needs formal communication.",
        bacContext: "BAC sections have different language requirements"
      },
      // ESSAY WRITING - Critical for Tunisian Bac
      {
        id: "en-essay-intro",
        prompt: "You are writing a Bac essay about 'Education in Tunisia'. Which introduction is most appropriate?",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Education is good. I like school. We learn many things." },
          { id: "b", text: "Since independence in 1956, Tunisia has prioritized education, yet challenges remain in our current system." },
          { id: "c", text: "Yesterday I went to school and my teacher was nice." }
        ],
        correctChoiceId: "b",
        explanation: "A strong Bac essay introduction provides context (Tunisian history), acknowledges complexity, and sets up your argument. This is what Tunisian examiners expect.",
        bacContext: "Essay structure is worth 10/20 points in the Bac"
      },
      // GRAMMAR - Common errors in Tunisian student essays
      {
        id: "en-grammar-conditional",
        prompt: "In your Bac essay about the environment, which sentence is grammatically correct?",
        skill: "grammar",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "If the government will invest more, pollution will decrease." },
          { id: "b", text: "If the government invests more, pollution would decrease." },
          { id: "c", text: "If the government invested more, pollution would decrease." }
        ],
        correctChoiceId: "c",
        explanation: "Second conditional (If + past simple, would + verb) is essential for hypothetical arguments in Bac essays. This is a common grammar point tested in the Bac.",
        bacContext: "Conditionals are frequently tested in the Bac language section"
      },
      // VOCABULARY - Bac themes
      {
        id: "en-vocab-collocation",
        prompt: "Which collocation is correct for a Bac essay about sustainable development?",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "make attention to the environment" },
          { id: "b", text: "pay attention to the environment" },
          { id: "c", text: "give attention to the environment" }
        ],
        correctChoiceId: "b",
        explanation: "Collocations like 'pay attention' demonstrate advanced vocabulary. Using correct collocations instead of literal translations (common in Tunisian Arabic influence) shows examiner-level English.",
        bacContext: "Vocabulary range is worth 5/20 in Bac essay grading"
      },
      // READING COMPREHENSION - Bac-style inference
      {
        id: "en-reading-inference",
        prompt: "A Bac reading passage states: 'Despite free education, many Tunisian youth struggle to find jobs matching their qualifications.' What can you infer?",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Education in Tunisia is completely ineffective." },
          { id: "b", text: "There is a gap between education and employment opportunities in Tunisia." },
          { id: "c", text: "Tunisian youth are not studying hard enough." }
        ],
        correctChoiceId: "b",
        explanation: "Bac reading comprehension tests inference - understanding implied meaning without exaggeration. The passage suggests a disconnect, not complete failure or blame on students.",
        bacContext: "Reading comprehension is Section I of the Bac exam (12 points)"
      },
      // CONNECTORS - Essay flow
      {
        id: "en-connectors",
        prompt: "Which connector should you use to add a contrasting argument in your Bac essay?",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Furthermore" },
          { id: "b", text: "However" },
          { id: "c", text: "In addition" }
        ],
        correctChoiceId: "b",
        explanation: "Using sophisticated connectors like 'However' instead of basic 'But' elevates your essay. Tunisian Bac examiners value varied, accurate use of connectors.",
        bacContext: "Connectors are part of the structure/coherence grade (10/20)"
      },
      // PASSIVE VOICE - Formal writing
      {
        id: "en-passive",
        prompt: "Rewrite this for a formal Bac essay: 'The government should fix this problem.'",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "This problem should be fixed by the government." },
          { id: "b", text: "The government must to fix this problem." },
          { id: "c", text: "This problem the government should fix it." }
        ],
        correctChoiceId: "a",
        explanation: "Passive voice ('should be fixed') creates formal, objective tone preferred in academic essays. This construction demonstrates B2-level grammar control expected in the Bac.",
        bacContext: "Passive voice is a key B2 grammar point for formal writing"
      },
      // TENSES - Bac common errors
      {
        id: "en-tenses",
        prompt: "Which sentence is correct for discussing your last school year in your Bac essay?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "Last year, I have studied very hard for the Bac." },
          { id: "b", text: "Last year, I studied very hard for the Bac." },
          { id: "c", text: "Last year, I am studying very hard for the Bac." }
        ],
        correctChoiceId: "b",
        explanation: "Past simple is required for completed past actions. Many Tunisian students confuse present perfect and past simple - this is a key error to avoid in the Bac.",
        bacContext: "Past tenses are essential for narrative sections"
      }
    ]
  },
  FRENCH: {
    title: "Diagnostic Français - Bac Tunisien",
    subtitle: "Évaluez votre niveau de français pour le Baccalauréat tunisien 2026",
    intro: "Ce diagnostic évalue vos compétences en français pour le format de l'examen du Bac tunisien : rédaction de dissertation, compréhension de texte, et grammaire adaptée à votre section.",
    questions: [
      {
        id: "fr-bac-section",
        prompt: "Quelle est votre section au Bac tunisien ? (Cela nous aide à personnaliser votre parcours)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "lettres", text: "Lettres (j'ai besoin de compétences avancées en rédaction)" },
          { id: "sciences", text: "Sciences/Technique/Maths (vocabulaire technique et dissertation)" },
          { id: "eco", text: "Économie/Gestion (communication formelle)" },
          { id: "autre", text: "Autre/Pas encore décidé" }
        ],
        correctChoiceId: "lettres",
        explanation: "Votre section du Bac détermine les compétences linguistiques à prioriser. Les lettres nécessitent une rédaction avancée, les sciences un vocabulaire technique, l'économie une communication formelle.",
        bacContext: "Les sections ont des exigences langagières différentes"
      },
      {
        id: "fr-dissertation-intro",
        prompt: "Vous rédigez une dissertation sur 'L'éducation en Tunisie'. Quelle introduction est la plus appropriée pour le Bac ?",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "L'éducation c'est bien. J'aime l'école. On apprend beaucoup de choses." },
          { id: "b", text: "Depuis l'indépendance en 1956, la Tunisie a fait de l'éducation une priorité, mais des défis persistent dans notre système actuel." },
          { id: "c", text: "Hier je suis allé à l'école et mon professeur était gentil." }
        ],
        correctChoiceId: "b",
        explanation: "Une bonne introduction de dissertation fournit du contexte (histoire tunisienne), reconnaît la complexité et annonce l'argument. C'est ce que les examinateurs du Bac attendent.",
        bacContext: "La structure de la dissertation vaut des points au Bac"
      },
      {
        id: "fr-subjonctif",
        prompt: "Complétez cette phrase pour une dissertation sur l'environnement : 'Il est essentiel que le gouvernement ___ des mesures.'",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "prend" },
          { id: "b", text: "prenne" },
          { id: "c", text: "pris" }
        ],
        correctChoiceId: "b",
        explanation: "Après 'Il est essentiel que', on utilise le subjonctif. Le subjonctif est très valorisé au Bac - il démontre une maîtrise avancée de la grammaire française.",
        bacContext: "Le subjonctif est une structure clé pour le niveau B2"
      },
      {
        id: "fr-vocab-expression",
        prompt: "Quelle expression est correcte pour une dissertation formelle sur le développement durable ?",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "faire attention à l'environnement" },
          { id: "b", text: "porter attention à l'environnement" },
          { id: "c", text: "prêter attention à l'environnement" }
        ],
        correctChoiceId: "a",
        explanation: "Les collocations correctes comme 'faire attention' (et non pas 'porter/prêter' sous influence de l'arabe) montrent un vocabulaire de niveau Bac.",
        bacContext: "Le vocabulaire juste est valorisé à la note de 20"
      },
      {
        id: "fr-comprehension",
        prompt: "Un texte de Bac dit : 'Malgré la gratuité de l'enseignement, nombreux sont les jeunes Tunisiens qui peinent à trouver un emploi correspondant à leurs qualifications.' Que pouvez-vous en déduire ?",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "L'éducation en Tunisie est complètement inefficace." },
          { id: "b", text: "Il existe un décalage entre la formation et l'emploi en Tunisie." },
          { id: "c", text: "Les jeunes Tunisiens n'étudient pas assez." }
        ],
        correctChoiceId: "b",
        explanation: "La compréhension au Bac teste l'inférence - comprendre le sens implicite sans exagération. Le texte suggère un décalage, pas un échec complet ni la faute des étudiants.",
        bacContext: "La compréhension est la Section I du Bac (12 points)"
      },
      {
        id: "fr-connecteurs",
        prompt: "Quel connecteur utilisez-vous pour ajouter un argument contrastant dans votre dissertation ?",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "De plus" },
          { id: "b", text: "Cependant" },
          { id: "c", text: "En outre" }
        ],
        correctChoiceId: "b",
        explanation: "Utiliser des connecteurs sophistiqués comme 'Cependant' au lieu du simple 'Mais' élève le niveau de votre dissertation. Les examinateurs valorisent l'usage varié des connecteurs.",
        bacContext: "Les connecteurs font partie de la note de structure"
      },
      {
        id: "fr-passe-compose",
        prompt: "Quelle phrase est correcte pour parler de votre année scolaire passée ?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "L'année dernière, j'ai beaucoup étudié pour le Bac." },
          { id: "b", text: "L'année dernière, je beaucoup étudiais pour le Bac." },
          { id: "c", text: "L'année dernière, j'ai beaucoup étudié pour le Bac." }
        ],
        correctChoiceId: "c",
        explanation: "Le passé composé avec l'auxiliaire 'avoir' et le participe passé avec accord (étudié) est nécessaire pour les actions passées achevées. C'est un point clé du Bac.",
        bacContext: "Les temps du passé sont essentiels pour la narration"
      },
      {
        id: "fr-expression-opinion",
        prompt: "Quelle expression est la plus appropriée pour exprimer une opinion nuancée au Bac ?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "À mon avis, les réseaux sociaux présentent des avantages ; toutefois, ils nécessitent un usage responsable." },
          { id: "b", text: "Les réseaux sociaux c'est bien." },
          { id: "c", text: "Moi je pense que c'est bien les réseaux sociaux." }
        ],
        correctChoiceId: "a",
        explanation: "Une opinion solide présente une idée et une nuance avec des mots de liaison sophistiqués ('toutefois'). C'est le niveau attendu pour une bonne note au Bac.",
        bacContext: "L'expression de l'opinion est testée à l'oral et à l'écrit"
      }
    ]
  },
  ARABIC: {
    title: "تشخيص اللغة العربية - الباكالوريا التونسية",
    subtitle: "قيّم مستواك في العربية لامتحان الباكالوريا التونسية 2026",
    intro: "يقيّم هذا التشخيص مهاراتك في اللغة العربية وفقاً لصيغة امتحان الباكالوريا التونسي: المقال، الفهم، القواعد، والتعبير.",
    questions: [
      {
        id: "ar-bac-section",
        prompt: "ما هي شعبتك في الباكالوريا التونسية؟ (هذا يساعدنا على تخصيص المحتوى)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "lettres", text: "الآداب (أحتاج مهارات متقدمة في الكتابة والأدب)" },
          { id: "sciences", text: "العلوم/تقني/رياضيات (مفردات علمية ومقال)" },
          { id: "eco", text: "اقتصاد وتصرف (تواصل رسمي)" },
          { id: "autre", text: "أخرى/لم أقرر بعد" }
        ],
        correctChoiceId: "lettres",
        explanation: "تحدد شعبة الباكالوريا المهارات اللغوية التي يجب إتقانها. الآداب تحتاج كتابة متقدمة، العلوم تحتاج مفردات علمية، الاقتصاد يحتاج تواصلاً رسمياً.",
        bacContext: "الشعب لها متطلبات لغوية مختلفة"
      },
      {
        id: "ar-essay-structure",
        prompt: "تكتب مقالاً عن 'التعليم في تونس'. أي مقدمة هي الأنسب لامتحان الباكالوريا؟",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "التعليم شيء مهم. أحب المدرسة. نتعلم أشياء كثيرة." },
          { id: "b", text: "منذ الاستقلال عام 1956، اهتمّت تونس بالتعليم، لكن التحديات لا تزال قائمة في نظامنا الحالي." },
          { id: "c", text: "أمس ذهبت إلى المدرسة وكان أستاذي لطيفاً." }
        ],
        correctChoiceId: "b",
        explanation: "مقدمة المقال الجيدة تقدم سياقاً تاريخياً (استقلال تونس)، وتعترف بالتعقيد، وتطرح الإشكالية. هذا ما يتوقعه المصحّحون في الباكالوريا.",
        bacContext: "هيكلة المقال تحصل على نقاط في الباكالوريا"
      },
      {
        id: "ar-grammar",
        prompt: "أي جملة صحيحة نحوياً لمقال عن البيئة: 'يجب على الحكومة ___ إجراءات صارمة.'",
        skill: "grammar",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "أن تأخذ" },
          { id: "b", text: "أن تتخذ" },
          { id: "c", text: "أن تأخذها" }
        ],
        correctChoiceId: "b",
        explanation: "التصرف الصحيح 'تتخذ إجراءات' (وليس تأخذ). التراكيب الصحيحة تظهر إتقاناً للغة يُقدّر في الباكالوريا.",
        bacContext: "التراكيب اللغوية الصحيحة أساسية في التقويم"
      },
      {
        id: "ar-vocab",
        prompt: "أي تعبير هو الأصح لاستخدامه في مقال رسمي عن التنمية المستدامة؟",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "نلقي نظرة على البيئة" },
          { id: "b", text: "نولي اهتماماً بالبيئة" },
          { id: "c", text: "نضع عيناً على البيئة" }
        ],
        correctChoiceId: "b",
        explanation: "'نولي اهتماماً' هو التراكيب اللغوي الصحيح والرسمي. التعابير الرصينة تُفرّق بين مقال جيد ومقال ضعيف في الباكالوريا.",
        bacContext: "التوظيف الجيد للمفردات يحصل على نقاط عالية"
      },
      {
        id: "ar-comprehension",
        prompt: "نص الباك يقول: 'على الرغم من مجانية التعليم، فإن العديد من الشباب التونسي يعانون في إيجاد عمل يتوافق مع مؤهلاتهم.' ماذا يمكنك استنتاجه؟",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "التعليم في تونس غير فعّال تماماً." },
          { id: "b", text: "هناك فجوة بين التكوين وفرص العمل في تونس." },
          { id: "c", text: "الشباب التونسي لا يدرس بما فيه الكفاية." }
        ],
        correctChoiceId: "b",
        explanation: "الفهم في الباك يختبر الاستنتاج - فهم المعنى الضمني دون مبالغة. النص يشير إلى تناقض، لا فشلاً تاماً ولا لوماً على الطلاب.",
        bacContext: "الفهم هو القسم الأول في الباك (12 نقطة)"
      },
      {
        id: "ar-connectors",
        prompt: "أي رابط تستخدم لإضافة حجة متناقضة في مقالك؟",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "علاوة على ذلك" },
          { id: "b", text: "غير أن" },
          { id: "c", text: "بالإضافة إلى ذلك" }
        ],
        correctChoiceId: "b",
        explanation: "استخدام روابط متطورة مثل 'غير أن' بدلاً من 'لكن' البسيطة يرفع مستوى المقال. المصححون يقدرون التنويع في الروابط.",
        bacContext: "الروابط جزء من تقييم التركيب"
      },
      {
        id: "ar-expression",
        prompt: "أي عبارة هي الأنسب للتعبير عن رأٍ متوازن في الباكالوريا؟",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "في تقديري، وسائل التواصل الاجتماعي سلاح ذو حدين؛ فهي تُقرب وقد تُبعد في آن واحد." },
          { id: "b", text: "وسائل التواصل الاجتماعي شيء جيد." },
          { id: "c", text: "أنا أحب وسائل التواصل الاجتماعي لأنها مفيدة." }
        ],
        correctChoiceId: "a",
        explanation: "رأٍ قوي يقدم فكرة وتوازناً مع تعبيرات رصينة ('سلاح ذو حدين'). هذا هو المستوى المتوقع للحصول على علامة جيدة في الباك.",
        bacContext: "التعبير عن الرأي يُختبر شفهياً وكتابياً"
      },
      {
        id: "ar-balagha",
        prompt: "أي جملة تستخدم تشبيهاً بليغاً مناسباً للمقال؟",
        skill: "vocabulary",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "التعليم مثل النور." },
          { id: "b", text: "التعليم نور يضيء دروب المستقبل." },
          { id: "c", text: "التعليم شيء مهم جداً ومفيد." }
        ],
        correctChoiceId: "b",
        explanation: "التشبيه البليغ مع تفصيل ('يضيء دروب المستقبل') يظهر مهارة بلاغية عالية. البلاغة تُقدّر في مقال الباكالوريا.",
        bacContext: "البلاغة والتشبيه يُثريان المقال الأدبي"
      }
    ]
  },
  SPANISH: {
    title: "Diagnóstico Español - Bachillerato Tunecino",
    subtitle: "Evalúa tu nivel de español para el Bachillerato tunecino 2026",
    intro: "Este diagnóstico evalúa tus habilidades en español específicamente para el formato del examen de Bachillerato: expresión escrita, comprensión y comunicación.",
    questions: [
      {
        id: "es-bac-section",
        prompt: "¿Cuál es tu sección de Bachillerato? (Esto nos ayuda a personalizar tu aprendizaje)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "letras", text: "Letras (necesito habilidades avanzadas de escritura)" },
          { id: "ciencias", text: "Ciencias/Técnica/Matemáticas (vocabulario técnico)" },
          { id: "eco", text: "Economía/Gestión (comunicación formal)" },
          { id: "otro", text: "Otro/Aún no lo sé" }
        ],
        correctChoiceId: "letras",
        explanation: "Tu sección de Bachillerato determina qué habilidades lingüísticas priorizar. Letras necesita escritura avanzada, Ciencias vocabulario técnico, Economía comunicación formal.",
        bacContext: "Las secciones tienen diferentes requisitos lingüísticos"
      },
      {
        id: "es-essay-intro",
        prompt: "Escribes un ensayo sobre 'La educación'. ¿Qué introducción es más apropiada?",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "La educación es buena. Me gusta la escuela." },
          { id: "b", text: "Desde la independencia en 1956, Túnez ha priorizado la educación, aunque persisten desafíos." },
          { id: "c", text: "Ayer fui a la escuela y mi profesor fue amable." }
        ],
        correctChoiceId: "b",
        explanation: "Una buena introducción proporciona contexto histórico y plantea la complejidad del tema. Esto es lo que los examinadores esperan en el Bachillerato.",
        bacContext: "La estructura del ensayo cuenta para la calificación"
      },
      {
        id: "es-subjuntivo",
        prompt: "Completa: 'Es esencial que el gobierno ___ medidas.'",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "toma" },
          { id: "b", text: "tome" },
          { id: "c", text: "tomó" }
        ],
        correctChoiceId: "b",
        explanation: "Después de 'Es esencial que' se usa el subjuntivo. El subjuntivo es muy valorizado en el Bachillerato - demuestra dominio avanzado del español.",
        bacContext: "El subjuntivo es una estructura clave para nivel B2"
      },
      {
        id: "es-vocab",
        prompt: "¿Qué expresión es correcta para un ensayo formal sobre el medio ambiente?",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "hacer atención al medio ambiente" },
          { id: "b", text: "prestar atención al medio ambiente" },
          { id: "c", text: "dar atención al medio ambiente" }
        ],
        correctChoiceId: "b",
        explanation: "Las colocaciones correctas como 'prestar atención' demuestran vocabulario de nivel Bachillerato. Las colocaciones correctas elevan la calificación.",
        bacContext: "El vocabulario preciso es parte de la evaluación"
      },
      {
        id: "es-comprehension",
        prompt: "Un texto dice: 'A pesar de la educación gratuita, muchos jóvenes tunecinos luchan por encontrar trabajo acorde a sus cualificaciones.' ¿Qué puedes inferir?",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "La educación en Túnez es completamente ineficaz." },
          { id: "b", text: "Existe una brecha entre la formación y el empleo en Túnez." },
          { id: "c", text: "Los jóvenes tunecinos no estudian lo suficiente." }
        ],
        correctChoiceId: "b",
        explanation: "La comprensión lectora en el Bachillerato prueba la inferencia - entender el significado implícito sin exagerar. El texto sugiere una desconexión, no un fracaso total.",
        bacContext: "La comprensión lectora es sección I del examen"
      },
      {
        id: "es-conectores",
        prompt: "¿Qué conector usas para añadir un argumento contrastante?",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Además" },
          { id: "b", text: "Sin embargo" },
          { id: "c", text: "Por otra parte" }
        ],
        correctChoiceId: "b",
        explanation: "Usar conectores sofisticados como 'Sin embargo' en lugar del simple 'Pero' eleva el nivel del ensayo. Los examinadores valoran el uso variado de conectores.",
        bacContext: "Los conectores son parte de la nota de estructura"
      },
      {
        id: "es-expression",
        prompt: "¿Qué expresión es más apropiada para expresar una opinión matizada?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "En mi opinión, las redes sociales son útiles, pero requieren un uso responsable." },
          { id: "b", text: "Las redes sociales sí." },
          { id: "c", text: "Yo pienso que está bien las redes sociales." }
        ],
        correctChoiceId: "a",
        explanation: "Una opinión sólida presenta una idea y una matiz con conectores sofisticados ('pero'). Este es el nivel esperado para una buena nota.",
        bacContext: "La expresión de opinión se evalúa oral y escrito"
      },
      {
        id: "es-tiempo",
        prompt: "¿Qué oración es correcta para hablar de tu año escolar pasado?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "El año pasado, he estudiado mucho para el Bachillerato." },
          { id: "b", text: "El año pasado, estudié mucho para el Bachillerato." },
          { id: "c", text: "El año pasado, estoy estudiando mucho para el Bachillerato." }
        ],
        correctChoiceId: "b",
        explanation: "El pretérito indefinido es necesario para acciones pasadas completas. Muchos estudiantes confunden los tiempos pasados - este es un error clave a evitar.",
        bacContext: "Los tiempos del pasado son esenciales para la narración"
      }
    ]
  },
  GERMAN: {
    title: "Deutsch-Diagnose - tunesisches Abitur",
    subtitle: "Bewerte dein Deutsch-Niveau für das tunesische Abitur 2026",
    intro: "Diese Diagnose bewertet deine Deutschkenntnisse speziell für das Abitur-Format: Aufsatzschreiben, Leseverständnis und Grammatik.",
    questions: [
      {
        id: "de-bac-section",
        prompt: "Was ist dein Abitur-Zweig? (Dies hilft uns, den Inhalt anzupassen)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "literatur", text: "Literatur (ich brauche fortgeschrittene Schreibfähigkeiten)" },
          { id: "natur", text: "Naturwissenschaften/Technik/Mathematik (Fachvokabular)" },
          { id: "wirtschaft", text: "Wirtschaft/Verwaltung (formelle Kommunikation)" },
          { id: "andere", text: "Andere/Noch unsicher" }
        ],
        correctChoiceId: "literatur",
        explanation: "Der Abitur-Zweig bestimmt die priorisierten Sprachfähigkeiten. Literatur braucht fortgeschrittenes Schreiben, Naturwissenschaften Fachvokabular, Wirtschaft formelle Kommunikation.",
        bacContext: "Die Zweige haben unterschiedliche Sprachanforderungen"
      },
      {
        id: "de-essay-intro",
        prompt: "Du schreibst einen Aufsatz über 'Bildung'. Welche Einleitung ist am besten?",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Bildung ist gut. Ich mag Schule." },
          { id: "b", text: "Seit der Unabhängigkeit 1956 hat Tunesien Bildung priorisiert, aber Herausforderungen bleiben." },
          { id: "c", text: "Gestern war ich in der Schule und mein Lehrer war nett." }
        ],
        correctChoiceId: "b",
        explanation: "Eine gute Einleitung bietet historischen Kontext und thematisiert Komplexität. Das erwarten Abitur-Prüfer.",
        bacContext: "Die Aufsatzstruktur zählt für die Note"
      },
      {
        id: "de-konjunktiv",
        prompt: "Vervollständige: 'Es ist wichtig, dass die Regierung ___ Maßnahmen ergreift.'",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "ergreift" },
          { id: "b", text: "ergreifen würde" },
          { id: "c", text: "wird ergreifen" }
        ],
        correctChoiceId: "a",
        explanation: "Nach 'Es ist wichtig, dass' folgt der Konjunktiv II. Konjunktiv ist im Abitur sehr wertvoll - er zeigt fortgeschrittene Grammatikkenntnisse.",
        bacContext: "Konjunktiv ist eine Schlüsselstruktur für B2-Niveau"
      },
      {
        id: "de-wortschatz",
        prompt: "Welche Kollokation ist für einen formalen Aufsatz über Nachhaltigkeit korrekt?",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Aufmerksamkeit geben zur Umwelt" },
          { id: "b", text: "Aufmerksamkeit schenken der Umwelt" },
          { id: "c", text: "Aufmerksamkeit machen zur Umwelt" }
        ],
        correctChoiceId: "b",
        explanation: "Korrekte Kollokationen wie 'Aufmerksamkeit schenken' zeigen Abitur-Niveau-Vokabular. Korrekte Kollokationen heben die Note.",
        bacContext: "Präzises Vokabular ist Teil der Bewertung"
      },
      {
        id: "de-verstehen",
        prompt: "Ein Text sagt: 'Trotz kostenloser Bildung kämpfen viele tunesische Jugendliche, um passende Arbeit zu finden.' Was kannst du schließen?",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Bildung in Tunesien ist völlig unwirksam." },
          { id: "b", text: "Es gibt eine Lücke zwischen Ausbildung und Beschäftigung in Tunesien." },
          { id: "c", text: "Tunesische Jugendliche lernen nicht genug." }
        ],
        correctChoiceId: "b",
        explanation: "Leseverständnis im Abitur testet Schlussfolgerungen - implizite Bedeutung verstehen ohne Übertreibung. Der Text suggeriert eine Diskrepanz, kein totales Versagen.",
        bacContext: "Leseverständnis ist Abschnitt I der Prüfung"
      },
      {
        id: "de-konnektoren",
        prompt: "Welcher Konnektor fügt ein kontrastierendes Argument hinzu?",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Außerdem" },
          { id: "b", text: "Allerdings" },
          { id: "c", text: "Darüber hinaus" }
        ],
        correctChoiceId: "b",
        explanation: "Sofistizierte Konnektoren wie 'Allerdings' statt einfachem 'Aber' heben das Niveau. Prüfer schätzen vielfältige Konnektor-Verwendung.",
        bacContext: "Konnektoren sind Teil der Struktur-Note"
      },
      {
        id: "de-meinung",
        prompt: "Welcher Ausdruck ist am besten für eine nuancierte Meinung?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Meiner Meinung nach sind soziale Medien nützlich, erfordern aber verantwortungsvollen Umgang." },
          { id: "b", text: "Soziale Medien ja." },
          { id: "c", text: "Ich denke soziale Medien sind gut." }
        ],
        correctChoiceId: "a",
        explanation: "Eine starke Meinung präsentiert eine Idee und Nuance mit sofistizierten Verbindern ('aber'). Das ist das erwartete Niveau für eine gute Note.",
        bacContext: "Meinungsäußerung wird mündlich und schriftlich geprüft"
      },
      {
        id: "de-vergangenheit",
        prompt: "Welcher Satz ist korrekt für dein letztes Schuljahr?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "Letztes Jahr habe ich sehr viel für das Abitur gelernt." },
          { id: "b", text: "Letztes Jahr lerne ich sehr viel für das Abitur." },
          { id: "c", text: "Letztes Jahr ich lernen sehr für das Abitur." }
        ],
        correctChoiceId: "a",
        explanation: "Perfekt ist erforderlich für abgeschlossene vergangene Handlungen. Viele Studenten verwechseln die Zeitformen - das ist ein Schlüsselfehler.",
        bacContext: "Vergangenheitszeiten sind wesentlich für Erzählungen"
      }
    ]
  },
  ITALIAN: {
    title: "Diagnosi Italiano - Maturità tunisina",
    subtitle: "Valuta il tuo livello di italiano per la Maturità tunisina 2026",
    intro: "Questa diagnosi valuta le tue competenze in italiano specificamente per il formato dell'esame di Maturità: scrittura tematica, comprensione e comunicazione.",
    questions: [
      {
        id: "it-bac-section",
        prompt: "Qual è la tua sezione di Maturità? (Questo ci aiuta a personalizzare il contenuto)",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "lettere", text: "Lettere (ho bisogno di abilità avanzate di scrittura)" },
          { id: "scienze", text: "Scienze/Tecnica/Matematica (vocabolario tecnico)" },
          { id: "eco", text: "Economia/Gestione (comunicazione formale)" },
          { id: "altro", text: "Altro/Non ancora deciso" }
        ],
        correctChoiceId: "lettere",
        explanation: "La sezione di Maturità determina le competenze linguistiche da prioritizzare. Lettere necessita scrittura avanzata, Scienze vocabolario tecnico, Economia comunicazione formale.",
        bacContext: "Le sezioni hanno diversi requisiti linguistici"
      },
      {
        id: "it-tema-intro",
        prompt: "Scrivi un tema sull'istruzione. Quale introduzione è più appropriata?",
        skill: "structure",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "L'istruzione è buona. Mi piace la scuola." },
          { id: "b", text: "Dall'indipendenza nel 1956, la Tunisia ha dato priorità all'istruzione, ma sfide persistono." },
          { id: "c", text: "Ieri sono andato a scuola e il mio professore era gentile." }
        ],
        correctChoiceId: "b",
        explanation: "Una buona introduzione fornisce contesto storico e affronta la complessità del tema. Questo è ciò che gli esaminatori della Maturità si aspettano.",
        bacContext: "La struttura del tema conta per il voto"
      },
      {
        id: "it-congiuntivo",
        prompt: "Completa: 'È essenziale che il governo ___ misure.'",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "prende" },
          { id: "b", text: "prenda" },
          { id: "c", text: "prendeva" }
        ],
        correctChoiceId: "b",
        explanation: "Dopo 'È essenziale che' si usa il congiuntivo. Il congiuntivo è molto valorizzato nella Maturità - dimostra padronanza avanzata della grammatica.",
        bacContext: "Il congiuntivo è una struttura chiave per livello B2"
      },
      {
        id: "it-vocab",
        prompt: "Quale espressione è corretta per un tema formale sulla sostenibilità?",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "fare attenzione all'ambiente" },
          { id: "b", text: "prestare attenzione all'ambiente" },
          { id: "c", text: "dare attenzione all'ambiente" }
        ],
        correctChoiceId: "b",
        explanation: "Le collocazioni corrette come 'prestare attenzione' dimostrano vocabolario di livello Maturità. Le collocazioni corrette elevano la valutazione.",
        bacContext: "Il vocabolario preciso è parte della valutazione"
      },
      {
        id: "it-comprensione",
        prompt: "Un testo dice: 'Nonostante l'istruzione gratuita, molti giovani tunisini faticano a trovare lavoro adeguato.' Cosa puoi dedurre?",
        skill: "comprehension",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "L'istruzione in Tunisia è completamente inefficace." },
          { id: "b", text: "C'è un divario tra formazione e occupazione in Tunisia." },
          { id: "c", text: "I giovani tunisini non studiano abbastanza." }
        ],
        correctChoiceId: "b",
        explanation: "La comprensione nella Maturità testa l'inferenza - capire il significato implicito senza esagerare. Il testo suggerisce una discrepanza, non un fallimento totale.",
        bacContext: "La comprensione è la sezione I dell'esame"
      },
      {
        id: "it-connettori",
        prompt: "Quale connettore usi per aggiungere un argomento contrastante?",
        skill: "structure",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Inoltre" },
          { id: "b", text: "Tuttavia" },
          { id: "c", text: "Oltretutto" }
        ],
        correctChoiceId: "b",
        explanation: "Usare connettori sofisticati come 'Tuttavia' invece del semplice 'Ma' eleva il livello del tema. Gli esaminatori apprezzano l'uso variato dei connettori.",
        bacContext: "I connettori fanno parte del voto di struttura"
      },
      {
        id: "it-opinione",
        prompt: "Quale espressione è più appropriata per esprimere un'opinione equilibrata?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Secondo me, i social media sono utili, ma richiedono un uso responsabile." },
          { id: "b", text: "I social media sì." },
          { id: "c", text: "Io penso che i social media siano buoni." }
        ],
        correctChoiceId: "a",
        explanation: "Un'opinione solida presenta un'idea e una sfumatura con connettori sofisticati ('ma'). Questo è il livello atteso per un buon voto.",
        bacContext: "L'espressione dell'opinione è valutata orale e scritta"
      },
      {
        id: "it-passato",
        prompt: "Quale frase è corretta per parlare del tuo anno scolastico passato?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "L'anno scorso, ho studiato molto per la Maturità." },
          { id: "b", text: "L'anno scorso, studio molto per la Maturità." },
          { id: "c", text: "L'anno scorso, io studiare molto per la Maturità." }
        ],
        correctChoiceId: "a",
        explanation: "Il passato prossimo è necessario per azioni passate completate. Molti studenti confondono i tempi passati - questo è un errore chiave da evitare.",
        bacContext: "I tempi del passato sono essenziali per la narrazione"
      }
    ]
  }
};
