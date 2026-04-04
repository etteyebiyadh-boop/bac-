import { db } from "@/lib/db";
import { Language, Difficulty, ExerciseType } from "@prisma/client";

export type StudentLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface StudyRecommendation {
  lessonId: string;
  reason: string;
  priority: number; // 1-5
}

/**
 * Analyzes a student's level based on diagnostic results and exercise attempts.
 */
export async function analyzeStudentLevel(userId: string, language: Language): Promise<StudentLevel> {
  const attempts = await db.exerciseAttempt.findMany({
    where: { userId, exercise: { language } },
    include: { exercise: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // If we have enough exercise data, use that
  if (attempts.length >= 10) {
    const correctCount = attempts.filter(a => a.isCorrect).length;
    const accuracy = correctCount / attempts.length;
    if (accuracy > 0.8) return "B2";
    if (accuracy < 0.4) return "A2";
    return "B1";
  }

  // Baseline: Use the latest diagnostic result
  const diagnostic = await db.diagnosticResult.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  if (diagnostic) {
    const ratio = diagnostic.score / diagnostic.maxScore;
    if (ratio >= 0.8) return "B2";
    if (ratio >= 0.5) return "B1";
    return "A2";
  }
  
  return "B1"; // Default for BAC students
}


/**
 * Detects weak points (skills with high error rates).
 */
export async function detectWeakPoints(userId: string, language: Language) {
  const attempts = await db.exerciseAttempt.findMany({
    where: { userId, exercise: { language } },
    include: { exercise: true },
  });

  const skillstats: Record<string, { total: number; correct: number }> = {};

  attempts.forEach(attempt => {
    const skill = attempt.exercise.skillFocus;
    if (!skillstats[skill]) skillstats[skill] = { total: 0, correct: 0 };
    skillstats[skill].total++;
    if (attempt.isCorrect) skillstats[skill].correct++;
  });

  const weakPoints = Object.entries(skillstats)
    .filter(([_, stats]) => stats.total > 3 && (stats.correct / stats.total) < 0.6)
    .map(([skill]) => skill);

  return weakPoints;
}

/**
 * Suggests what to study next based on level and weak points.
 */
export async function getSmartRecommendations(userId: string, language: Language): Promise<StudyRecommendation[]> {
  const weakPoints = await detectWeakPoints(userId, language);
  const completions = await db.lessonCompletion.findMany({
    where: { userId, lesson: { language } },
    select: { lessonId: true },
  });
  const completedIds = completions.map(c => c.lessonId);

  // Find lessons in weak point categories that are not completed
  const recommendedLessons = await db.lesson.findMany({
    where: {
      language,
      id: { notIn: completedIds },
      skillFocus: { in: weakPoints },
    },
    take: 3,
  });

  return recommendedLessons.map(lesson => ({
    lessonId: lesson.id,
    reason: `You've struggled with ${lesson.skillFocus} recently. Reviewing this will help!`,
    priority: 5,
  }));
}

/**
 * Streak and Progression logic
 */
export async function getWeeklyStreak(userId: string): Promise<number> {
  const missions = await db.dailyMission.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { missionDate: "desc" },
    take: 7,
  });

  // Calculate consecutive days...
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < missions.length; i++) {
    const missionDate = new Date(missions[i].missionDate);
    missionDate.setHours(0, 0, 0, 0);
    
    const diff = (today.getTime() - missionDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === i || diff === i + 1) { // Allows for "today" or "yesterday" starting point
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
