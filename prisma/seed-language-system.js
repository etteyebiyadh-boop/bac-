const { PrismaClient, Difficulty, ExerciseType } = require("@prisma/client");
const curriculum = require("../src/data/language-system.json");

const prisma = new PrismaClient();

const levelToDifficulty = {
  A1: Difficulty.EASY,
  A2: Difficulty.EASY,
  B1: Difficulty.MEDIUM,
  B2: Difficulty.HARD
};

const skillToExerciseType = {
  grammar: ExerciseType.GRAMMAR,
  vocabulary: ExerciseType.VOCABULARY,
  structure: ExerciseType.MICRO_WRITING,
  comprehension: ExerciseType.COMPREHENSION,
  communication: ExerciseType.COMMUNICATION,
  pronunciation: ExerciseType.PRONUNCIATION
};

function buildLessonBody(lesson) {
  const blocks = [
    "Explanation",
    lesson.explanation,
    "",
    "Example",
    lesson.example,
    "",
    "Exercise",
    lesson.exercise,
    "",
    "Answer",
    lesson.answer,
    "",
    "Correction",
    lesson.correction
  ];

  if (lesson.arabicHint) {
    blocks.push("", "Arabic hint", lesson.arabicHint);
  }

  if (lesson.mistake) {
    blocks.push("", "Common mistake", lesson.mistake);
  }

  return blocks.join("\n");
}

async function main() {
  let lessonCount = 0;
  let exerciseCount = 0;

  for (const track of curriculum.languages) {
    for (const level of track.levels) {
      for (const skill of level.skills) {
        for (const lesson of skill.lessons) {
          const meta = {
            pathway: "bac-language-system",
            language: track.language,
            level: level.level,
            skill: skill.skill,
            explanation: lesson.explanation,
            example: lesson.example,
            exercise: lesson.exercise,
            answer: lesson.answer,
            correction: lesson.correction,
            ...(lesson.arabicHint ? { arabicHint: lesson.arabicHint } : {}),
            ...(lesson.mistake ? { mistake: lesson.mistake } : {})
          };

          const lessonRow = await prisma.lesson.upsert({
            where: { slug: lesson.slug },
            update: {
              language: track.language,
              title: lesson.title,
              summary: lesson.summary,
              body: buildLessonBody(lesson),
              theme: lesson.theme,
              skillFocus: skill.skill,
              difficulty: levelToDifficulty[level.level],
              estimatedMinutes: lesson.estimatedMinutes,
              takeawayJson: meta
            },
            create: {
              slug: lesson.slug,
              language: track.language,
              title: lesson.title,
              summary: lesson.summary,
              body: buildLessonBody(lesson),
              theme: lesson.theme,
              skillFocus: skill.skill,
              difficulty: levelToDifficulty[level.level],
              estimatedMinutes: lesson.estimatedMinutes,
              takeawayJson: meta
            }
          });

          lessonCount += 1;

          await prisma.exercise.upsert({
            where: { slug: `${lesson.slug}-check` },
            update: {
              language: track.language,
              lessonId: lessonRow.id,
              type: skillToExerciseType[skill.skill],
              prompt: lesson.exercise,
              answerJson: { correctChoice: lesson.answer },
              explanation: lesson.correction,
              difficulty: levelToDifficulty[level.level],
              skillFocus: skill.skill
            },
            create: {
              slug: `${lesson.slug}-check`,
              language: track.language,
              lessonId: lessonRow.id,
              type: skillToExerciseType[skill.skill],
              prompt: lesson.exercise,
              answerJson: { correctChoice: lesson.answer },
              explanation: lesson.correction,
              difficulty: levelToDifficulty[level.level],
              skillFocus: skill.skill
            }
          });

          exerciseCount += 1;
        }
      }
    }
  }

  console.log(`Seeded ${lessonCount} language-system lessons and ${exerciseCount} exercises.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
