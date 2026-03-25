const { PrismaClient, Language, Difficulty, SkillFocus } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Global Bac Parity Seed...');

  const languageSystemPath = path.join(__dirname, '../src/data/language-system.json');
  const data = JSON.parse(fs.readFileSync(languageSystemPath, 'utf8'));

  for (const langConfig of data.languages) {
    const language = langConfig.language;
    console.log(`\nProcessing Language: ${language}`);

    for (const level of langConfig.levels) {
      for (const skill of level.skills) {
        for (const lessonData of skill.lessons) {
          
          // 1. Prepare Lesson Content Body
          const contentBody = `
## ${lessonData.theme}
${lessonData.explanation}

### Example:
${lessonData.example}

### Common Mistake:
${lessonData.mistake}
          `.trim();

          const takeaway = [
            lessonData.summary,
            lessonData.arabicHint || "Focus on the core pattern.",
            `Target: ${lessonData.theme}`
          ];

          // 2. Upsert Lesson
          const lesson = await prisma.lesson.upsert({
            where: { slug: lessonData.slug },
            update: {
              language: language,
              title: lessonData.title,
              summary: lessonData.summary,
              body: contentBody,
              theme: lessonData.theme,
              skillFocus: skill.skill.toUpperCase(),
              estimatedMinutes: lessonData.estimatedMinutes || 6,
              takeawayJson: takeaway,
              difficulty: Difficulty.MEDIUM
            },
            create: {
              slug: lessonData.slug,
              language: language,
              title: lessonData.title,
              summary: lessonData.summary,
              body: contentBody,
              theme: lessonData.theme,
              skillFocus: skill.skill.toUpperCase(),
              estimatedMinutes: lessonData.estimatedMinutes || 6,
              takeawayJson: takeaway,
              difficulty: Difficulty.MEDIUM
            }
          });

          // 3. Upsert Exercise for the Lesson
          const exerciseSlug = `${lessonData.slug}-practice`;
          await prisma.exercise.upsert({
            where: { slug: exerciseSlug },
            update: {
              language: language,
              lessonId: lesson.id,
              type: skill.skill.toUpperCase(),
              prompt: lessonData.exercise,
              choicesJson: [lessonData.answer, "Incorrect Option 1", "Try Again 2"], // Simple mock choices if not provided
              answerJson: { correctChoice: lessonData.answer },
              explanation: lessonData.correction,
              difficulty: Difficulty.MEDIUM,
              skillFocus: skill.skill.toUpperCase(),
              xpReward: 20
            },
            create: {
              slug: exerciseSlug,
              language: language,
              lessonId: lesson.id,
              type: skill.skill.toUpperCase(),
              prompt: lessonData.exercise,
              choicesJson: [lessonData.answer, "Selection B", "Selection C"],
              answerJson: { correctChoice: lessonData.answer },
              explanation: lessonData.correction,
              difficulty: Difficulty.MEDIUM,
              skillFocus: skill.skill.toUpperCase(),
              xpReward: 20
            }
          });

          console.log(`  ✅ Synced: [${language}] ${lessonData.title}`);
        }
      }
    }
  }

  console.log('\n🌟 GLOBAL BAC PARITY SEED COMPLETE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
