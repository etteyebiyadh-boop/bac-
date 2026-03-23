const { PrismaClient, Language, BacModule, ExerciseType, Difficulty, BacSection } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Initializing BacLang Premium Content Engine (V2)...');

  const premiumContent = [
    {
      slug: "wishes-regrets-youth-unit4",
      title: "Wishes and Regrets (The Gift of Youth)",
      level: "B1/B2",
      section: "ALL",
      skill: "Grammar",
      language: Language.ENGLISH,
      module: BacModule.MODULE_4_YOUTH_ISSUES,
      summary: "Expressing regrets about the past or wishes for the present is a guaranteed question in the Tunisian BAC.",
      content: "In the Tunisian Baccalaureate, expressing regrets about the past or wishes for the present is a guaranteed question. Use 'I wish + Past Simple' for current frustration and 'I wish + Past Perfect' for past errors.",
      examples: "**Present Wish:** I wish I had more time to volunteer (But I don't).\n**Past Regret:** I wish I had studied harder for the mock exams (But I didn't).",
      exercisePrompt: "Fill in the blank: 'I wish I ___ (can) travel to Silicon Valley next summer.'",
      choices: ["can", "could", "will can", "could have"],
      answer: "could",
      correction: "The correct answer is 'could' because it's a present wish/hypothetical situation. Use only past simple after 'I wish'.",
      tip: "BAC EXAM TIP: If you see 'Yesterday' in the wish sentence, jump immediately to 'Had + Past Participle'!"
    },
    {
      slug: "engagement-citoyen-intro-unit7",
      title: "L'Engagement Citoyen (Introduction)",
      level: "B2",
      section: "LETTRES/ECO",
      skill: "Writing",
      language: Language.FRENCH,
      module: BacModule.MODULE_7_WORK_COMMITMENT,
      summary: "L'engagement n'est pas seulement un devoir, c'est une preuve de citoyenneté active.",
      content: "L'engagement n'est pas seulement un devoir, c'est une preuve de citoyenneté active. Pour un essai de bac, commencez toujours par définir l'engagement comme un lien entre l'individu et la collectivité.",
      examples: "**Phrases clés:** 'Il est primordial de s'investir...', 'L'action associative est le pilier de...'",
      exercisePrompt: "Quel connecteur logique marque l'opposition dans un essai sur l'engagement ?",
      choices: ["De plus", "Cependant", "Par conséquent", "En effet"],
      answer: "Cependant",
      correction: "'Cependant' exprime l'opposition ou la nuance, essentiel pour le plan dialectique (Thèse/Antithèse).",
      tip: "METHODOLOGIE: Ne dites pas 'Je pense que'. Dites 'Il est indéniable que' pour un ton plus formel et académique."
    },
    {
      slug: "survival-spanish-presentacion-unit1",
      title: "Survival Spanish: La Presentación",
      level: "A1",
      section: "ALL",
      skill: "Speaking",
      language: Language.SPANISH,
      module: BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      summary: "For the language optionals Bac, the personal presentation is 20% of your grade.",
      content: "Para el Bac de idiomas opcionales, la presentación personal es el 20% de la nota. Enfócate en tu nombre, edad y pasión por el estudio.",
      examples: "'¡Hola! Me llamo Yassine, tengo 18 años y soy de Túnez.'",
      exercisePrompt: "¿Cómo se dice 'I am a student' en español?",
      choices: ["Soy un profesor", "Soy un estudiante", "Tengo un libro", "Me llamo Bac"],
      answer: "Soy un estudiante",
      correction: "'Soy' es el verbo ser para profesiones y estados permanentes.",
      tip: "PRONUNCIATION: In Spanish, 'ñ' (n with tilde) sounds like 'ny' as in 'Onion'. Try 'Español' [Es-pa-nyol]."
    }
  ];

  for (const item of premiumContent) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        body: item.content,
        theme: item.module.toString(),
        language: item.language,
        skillFocus: item.skill.toLowerCase(),
        difficulty: item.level.includes('B2') ? Difficulty.HARD : (item.level.includes('A1') ? Difficulty.EASY : Difficulty.MEDIUM),
        takeawayJson: {
          level: item.level,
          section: item.section,
          tip: item.tip,
          content: item.content,
          examples: item.examples
        },
        bacModule: item.module,
        estimatedMinutes: 5
      }
    });

    await prisma.exercise.upsert({
      where: { slug: `ex-${item.slug}` },
      update: {},
      create: {
        slug: `ex-${item.slug}`,
        lessonId: lesson.id,
        language: item.language,
        type: ExerciseType.GRAMMAR,
        prompt: item.exercisePrompt,
        choicesJson: item.choices,
        answerJson: item.answer,
        explanation: item.correction,
        skillFocus: item.skill.toLowerCase(),
        difficulty: lesson.difficulty
      }
    });

    console.log(`✅ Loaded: [${item.language}] ${item.title}`);
  }

  console.log('\n🚀 ALL PREMIUM BACLANG MODULES ARE LIVE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
