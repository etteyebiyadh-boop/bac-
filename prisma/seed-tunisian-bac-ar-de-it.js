const { PrismaClient, Language, BacModule, Difficulty, GrammarCategory, VocabTheme, PassageType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Arabic, German, and Italian Tunisian Baccalaureate curriculum data...');

  // ------------------------------------------------------------------------------------------------
  // GERMAN
  // ------------------------------------------------------------------------------------------------

  // German Grammar: Trennbare Verben (Separable Verbs)
  await prisma.grammarRule.upsert({
    where: { slug: "de-trennbare-verben" },
    update: {},
    create: {
      slug: "de-trennbare-verben",
      language: Language.GERMAN,
      category: GrammarCategory.TENSES,
      title: "Trennbare Verben (Les Verbes Séparables)",
      rule: "Au présent et au prétérit, la particule séparable (an, auf, fern, etc.) se détache du verbe et se place tout à la fin de la proposition principale.",
      formula: "Sujet + Verbe conjugué + [Compléments] + Particule.",
      examples: JSON.stringify([
        "fernsehen (regarder la télé) : Ich sehe am Abend oft fern.",
        "aufstehen (se lever) : Er steht jeden Morgen um 6 Uhr auf."
      ]),
      usageNotes: "Attention : si la phrase contient un verbe de modalité (müssen, können...), le verbe séparable reste à la fin à l'infinitif en un seul mot (Ich muss früh aufstehen).",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS, 
      isEssential: true
    }
  });

  // ------------------------------------------------------------------------------------------------
  // ITALIAN
  // ------------------------------------------------------------------------------------------------

  // Italian Vocabulary: I Mass Media e i Giovani
  await prisma.vocabularySet.upsert({
    where: { slug: "it-mass-media" },
    update: {},
    create: {
      slug: "it-mass-media",
      language: Language.ITALIAN,
      theme: VocabTheme.MEDIA,
      title: "I Mass Media e Internet",
      description: "Vocabolo essenziale sull'uso dei media e la comunicazione digitale.",
      bacContext: "Axe très fréquent : Mass media e telecomunicazioni.",
      difficulty: Difficulty.MEDIUM,
      bacModule: BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      isCommon: true,
      items: {
        create: [
          {
            word: "lo schermo",
            definition: "La surface sur laquelle on visionne des images (écran).",
            partOfSpeech: "Sostantivo (m)",
            exampleSentence: "I giovani passano molto tempo davanti allo schermo.",
            bacExample: "L'uso eccessivo degli schermi è un problema per la salute.",
            register: "neutral"
          },
          {
            word: "condividere",
            definition: "Partager des informations, des photos, des pensées.",
            partOfSpeech: "Verbo",
            exampleSentence: "Mi piace condividere le mie foto su Instagram.",
            bacExample: "Condividere idee su internet aiuta il dialogo interculturale.",
            register: "neutral"
          }
        ]
      }
    }
  });

  // ------------------------------------------------------------------------------------------------
  // ARABIC
  // ------------------------------------------------------------------------------------------------

  // Arabic Reading: حوار الحضارات (Dialogue of Civilizations - Scientific Sections)
  await prisma.readingPassage.upsert({
    where: { slug: "ar-hiwar-hadharat" },
    update: {},
    create: {
      slug: "ar-hiwar-hadharat",
      language: Language.ARABIC,
      title: "أهمية حوار الحضارات في بناء السلم",
      passageType: PassageType.ESSAY,
      content: "إن الحضارة الإنسانية ليست حكراً على أمة دون أخرى، بل هي محصلة تفاعل مستمر بين مختلف الشعوب على مر العصور. فكل أمة ساهمت بنصيبها في بناء هذا الصرح. وفي عصرنا الحالي، حيث تتشابك المصالح وتتقارب المسافات، يبرز 'حوار الحضارات' كضرورة حتمية وليس مجرد خيار ترفي. يعتمد هذا الحوار على قبول الآخر، واحترام الاختلاف، وتجاوز الأحكام المسبقة. فمن خلال التبادل الثقافي والمعرفي، يمكن للبشرية أن تواجه التحديات المشتركة كالحروب والجهل، وتؤسس لثقافة السلم والتسامح بدلاً من صراع الحضارات.",
      wordCount: 74,
      difficulty: Difficulty.MEDIUM,
      themes: JSON.stringify(["حوار الحضارات", "التسامح", "الثقافة", "الإنسانية"]),
      keyVocabulary: JSON.stringify(["حوار", "تفاعل", "الأحكام المسبقة", "السلم"]),
      compressionQuestions: undefined,
      bacRelevance: "محور: في حوار الحضارات (الشعب العلمية والاقتصاد).",
      bacModule: BacModule.MODULE_4_YOUTH_ISSUES // Represents modern societal themes
    }
  });

  console.log('🌟 ARABIC, GERMAN, AND ITALIAN BAC CURRICULUM SEEDING COMPLETE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
