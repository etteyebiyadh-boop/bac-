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
};

export type DiagnosticTrack = {
  intro: string;
  questions: DiagnosticQuestion[];
};

export const diagnosticQuestionBank: Record<CurriculumLanguageCode, DiagnosticTrack> = {
  ENGLISH: {
    intro: "Quick Bac-focused diagnostic for grammar, vocabulary, writing, reading, and practical use.",
    questions: [
      {
        id: "en-a1-grammar",
        prompt: "Choose the correct sentence.",
        skill: "grammar",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "She very tired after school." },
          { id: "b", text: "She is very tired after school." },
          { id: "c", text: "She are very tired after school." }
        ],
        correctChoiceId: "b",
        explanation: "At this level, students should control the verb be in simple sentences."
      },
      {
        id: "en-a2-structure",
        prompt: "What sentence works best as a topic sentence for a paragraph about online learning?",
        skill: "structure",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "First, my friend uses a phone." },
          { id: "b", text: "Online learning offers students more flexibility and access." },
          { id: "c", text: "Yesterday I watched a video lesson." }
        ],
        correctChoiceId: "b",
        explanation: "A topic sentence states the main idea of the paragraph clearly."
      },
      {
        id: "en-b1-vocabulary",
        prompt: "Choose the best collocation.",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "critical thinking" },
          { id: "b", text: "critical homework" },
          { id: "c", text: "critical classroom" }
        ],
        correctChoiceId: "a",
        explanation: "Theme vocabulary and collocations matter a lot in Bac essays."
      },
      {
        id: "en-b1-comprehension",
        prompt: "A passage says: 'After the factory closed, the town fell silent.' What is most likely implied?",
        skill: "comprehension",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "People probably lost jobs and daily activity decreased." },
          { id: "b", text: "The town became more beautiful." },
          { id: "c", text: "The writer is describing a festival." }
        ],
        correctChoiceId: "a",
        explanation: "Inference means reading the hidden meaning suggested by the sentence."
      },
      {
        id: "en-b2-grammar",
        prompt: "Complete the sentence: If the government invested more in schools, education outcomes ___ better.",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "are" },
          { id: "b", text: "will be" },
          { id: "c", text: "would be" }
        ],
        correctChoiceId: "c",
        explanation: "This is a second conditional sentence used for hypothetical present situations."
      },
      {
        id: "en-b2-communication",
        prompt: "Which answer sounds most appropriate in a short interview?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "Because yes." },
          { id: "b", text: "I am applying for this role because I enjoy teamwork and responsibility." },
          { id: "c", text: "Me, I like many things." }
        ],
        correctChoiceId: "b",
        explanation: "B2 communication uses a clear reason and more natural phrasing."
      }
    ]
  },
  FRENCH: {
    intro: "Diagnostic rapide pour repérer ton niveau en français du Bac.",
    questions: [
      {
        id: "fr-a1-grammar",
        prompt: "Choisis la phrase correcte.",
        skill: "grammar",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "Nous sommes prêts pour l'examen." },
          { id: "b", text: "Nous est prêts pour l'examen." },
          { id: "c", text: "Nous prêt pour l'examen." }
        ],
        correctChoiceId: "a",
        explanation: "À ce niveau, le contrôle de base du verbe être est attendu."
      },
      {
        id: "fr-a2-structure",
        prompt: "Quelle phrase convient le mieux comme idée principale d'un paragraphe ?",
        skill: "structure",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "L'école doit développer l'esprit critique des élèves." },
          { id: "b", text: "Hier, j'ai lu un article en classe." },
          { id: "c", text: "Par exemple, mon ami regarde des vidéos." }
        ],
        correctChoiceId: "a",
        explanation: "Une bonne phrase d'ouverture annonce clairement l'idée centrale."
      },
      {
        id: "fr-b1-vocabulary",
        prompt: "Complète correctement: le développement ___",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "cassé" },
          { id: "b", text: "durable" },
          { id: "c", text: "rapideur" }
        ],
        correctChoiceId: "b",
        explanation: "Développement durable est une expression essentielle dans les thèmes du Bac."
      },
      {
        id: "fr-b1-comprehension",
        prompt: "Si un texte dit 'la ville s'est vidée après la fermeture de l'usine', qu'est-ce que cela suggère ?",
        skill: "comprehension",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Il y a probablement eu une baisse de l'emploi." },
          { id: "b", text: "Les habitants ont fait la fête." },
          { id: "c", text: "Le texte parle du tourisme." }
        ],
        correctChoiceId: "a",
        explanation: "La compréhension implique parfois de déduire une conséquence implicite."
      },
      {
        id: "fr-b2-grammar",
        prompt: "Complète: Si les jeunes lisaient davantage, ils ___ leur vocabulaire.",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "développeraient" },
          { id: "b", text: "développent" },
          { id: "c", text: "ont développé" }
        ],
        correctChoiceId: "a",
        explanation: "Après si + imparfait, on utilise le conditionnel présent."
      },
      {
        id: "fr-b2-communication",
        prompt: "Quelle réponse est la plus naturelle pour exprimer une opinion nuancée ?",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "À mon avis, les réseaux sociaux sont utiles, mais ils demandent un usage responsable." },
          { id: "b", text: "Les réseaux sociaux oui." },
          { id: "c", text: "Moi penser que c'est bien." }
        ],
        correctChoiceId: "a",
        explanation: "Une opinion solide présente l'idée et une nuance."
      }
    ]
  },
  SPANISH: {
    intro: "Communication-first diagnostic for the optional Spanish track.",
    questions: [
      {
        id: "es-a1-communication",
        prompt: "How do you say 'My name is Lina'?",
        skill: "communication",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "Me llamo Lina." },
          { id: "b", text: "Yo soy llamo Lina." },
          { id: "c", text: "Tengo Lina." }
        ],
        correctChoiceId: "a",
        explanation: "Me llamo is the basic self-introduction structure."
      },
      {
        id: "es-a2-grammar",
        prompt: "Choose the best future-near plan.",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "Voy a estudiar esta noche." },
          { id: "b", text: "Soy estudiar esta noche." },
          { id: "c", text: "Estoy estudio esta noche." }
        ],
        correctChoiceId: "a",
        explanation: "Ir a + infinitivo is a core communication pattern."
      },
      {
        id: "es-b1-communication",
        prompt: "Which answer expresses an opinion with a reason?",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Creo que aprender idiomas es útil porque abre muchas puertas." },
          { id: "b", text: "Idiomas sí." },
          { id: "c", text: "Tengo un cuaderno." }
        ],
        correctChoiceId: "a",
        explanation: "At B1, students should give a short opinion plus one reason."
      },
      {
        id: "es-b1-vocabulary",
        prompt: "Choose the school word.",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "deberes" },
          { id: "b", text: "aeropuerto" },
          { id: "c", text: "maleta" }
        ],
        correctChoiceId: "a",
        explanation: "Theme vocabulary should support everyday school communication."
      }
    ]
  },
  GERMAN: {
    intro: "Communication-first diagnostic for the optional German track.",
    questions: [
      {
        id: "de-a1-communication",
        prompt: "How do you say 'My name is Sara'?",
        skill: "communication",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "Ich heiße Sara." },
          { id: "b", text: "Ich bin heiße Sara." },
          { id: "c", text: "Mein heiße Sara." }
        ],
        correctChoiceId: "a",
        explanation: "Ich heiße is the standard self-introduction pattern."
      },
      {
        id: "de-a2-grammar",
        prompt: "Which sentence shows a near future plan correctly?",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "Morgen lerne ich Deutsch." },
          { id: "b", text: "Morgen ich lernen Deutsch." },
          { id: "c", text: "Morgen ich Deutsch lerne." }
        ],
        correctChoiceId: "a",
        explanation: "Present tense with a time marker can express a plan in German."
      },
      {
        id: "de-b1-communication",
        prompt: "Which answer gives an opinion and a reason?",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Ich denke, Sprachen sind wichtig, weil sie viele Chancen geben." },
          { id: "b", text: "Sprachen gut." },
          { id: "c", text: "Ich habe einen Stift." }
        ],
        correctChoiceId: "a",
        explanation: "B1 answers should be short but complete."
      },
      {
        id: "de-b1-vocabulary",
        prompt: "Choose the school word.",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Hausaufgaben" },
          { id: "b", text: "Flughafen" },
          { id: "c", text: "Koffer" }
        ],
        correctChoiceId: "a",
        explanation: "Optional-language success still depends on a useful core vocabulary."
      }
    ]
  },
  ITALIAN: {
    intro: "Communication-first diagnostic for the optional Italian track.",
    questions: [
      {
        id: "it-a1-communication",
        prompt: "How do you say 'My name is Lina'?",
        skill: "communication",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "Mi chiamo Lina." },
          { id: "b", text: "Io sono chiamo Lina." },
          { id: "c", text: "Ho Lina." }
        ],
        correctChoiceId: "a",
        explanation: "Mi chiamo is the standard self-introduction pattern."
      },
      {
        id: "it-a2-grammar",
        prompt: "Choose the best near-future plan.",
        skill: "grammar",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "Domani parlo con il professore." },
          { id: "b", text: "Domani parlato con il professore." },
          { id: "c", text: "Domani io essere parlare." }
        ],
        correctChoiceId: "a",
        explanation: "Present tense with a future time marker is a useful simple plan pattern."
      },
      {
        id: "it-b1-communication",
        prompt: "Which answer sounds most complete?",
        skill: "communication",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "Penso che studiare lingue sia utile perché apre opportunità." },
          { id: "b", text: "Lingue bene." },
          { id: "c", text: "Io libro." }
        ],
        correctChoiceId: "a",
        explanation: "B1 optional-language students should express a short opinion plus reason."
      },
      {
        id: "it-b1-vocabulary",
        prompt: "Choose the school word.",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "compiti" },
          { id: "b", text: "aeroporto" },
          { id: "c", text: "valigia" }
        ],
        correctChoiceId: "a",
        explanation: "Theme vocabulary should serve school and daily communication first."
      }
    ]
  },
  ARABIC: {
    intro: "Diagnostic rapid for the core Arabic Bac track.",
    questions: [
      {
        id: "ar-a1-grammar",
        prompt: "اختر الجملة الصحيحة تركيبياً:",
        skill: "grammar",
        targetLevel: "A1",
        choices: [
          { id: "a", text: "الطالب يدرسُ بجدٍ." },
          { id: "b", text: "الطالب يدرسون بجدٍ." },
          { id: "c", text: "الطالب يدرس بجدُّ." }
        ],
        correctChoiceId: "a",
        explanation: "At this level, basic subject-verb agreement is essential."
      },
      {
        id: "ar-a2-structure",
        prompt: "ما هي الجملة الأنسب لتكون مقدمة لفقرة عن التكنولوجيا؟",
        skill: "structure",
        targetLevel: "A2",
        choices: [
          { id: "a", text: "أمس اشتريت هاتفا جديدا." },
          { id: "b", text: "أصبحت التكنولوجيا جزءاً لا يتجزأ من حياتنا المعاصرة." },
          { id: "c", text: "التكنولوجيا سريعة جدا ومفيدة." }
        ],
        correctChoiceId: "b",
        explanation: "A strong opening sentence sets the formal tone for the paragraph."
      },
      {
        id: "ar-b1-vocabulary",
        prompt: "اختر المصطلح المناسب للجملة: 'يجب علينا حماية ___ للأجيال القادمة.'",
        skill: "vocabulary",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "الشارع" },
          { id: "b", text: "البيئة" },
          { id: "c", text: "المكتب" }
        ],
        correctChoiceId: "b",
        explanation: "Environmental vocabulary is a recurring theme in Bac Arabic exams."
      },
      {
        id: "ar-b1-comprehension",
        prompt: "عندما نقول 'غابت الشمس وراء الأفق'، ماذا نقصد غضافة إلى المعنى الحرفي؟",
        skill: "comprehension",
        targetLevel: "B1",
        choices: [
          { id: "a", text: "أن وقت النهار انتهى وبدأ المساء." },
          { id: "b", text: "أن الشمس اختفت تماماً من الوجود." },
          { id: "c", text: "أن الأفق مكان مظلم." }
        ],
        correctChoiceId: "a",
        explanation: "Inference involves understanding temporal and symbolic shifts."
      },
      {
        id: "ar-b2-grammar",
        prompt: "ما هو الوزن الصرفي لكلمة 'استخراج'؟",
        skill: "grammar",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "استفعال" },
          { id: "b", text: "انفعال" },
          { id: "c", text: "افتعل" }
        ],
        correctChoiceId: "a",
        explanation: "Morphology (Sarfi weights) is critical for higher-level Arabic proficiency."
      },
      {
        id: "ar-b2-communication",
        prompt: "أي من الجمل التالية تعبر عن رأي نقدي متوازن؟",
        skill: "communication",
        targetLevel: "B2",
        choices: [
          { id: "a", text: "العمل سلاح ذو حدين، فهو يوفر الدخل ولكنه قد يستنزف الطاقة." },
          { id: "b", text: "العمل جيد ومفيد للجميع." },
          { id: "c", text: "لا أحب العمل لأنه متعب." }
        ],
        correctChoiceId: "a",
        explanation: "B2 communication requires stating an argument and its nuance."
      }
    ]
  }
};
