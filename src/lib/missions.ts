import { Language, MissionStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getWeakestSkill, SkillFocus, startOfUtcDay } from "@/lib/learning";

const missionInclude = {
  lesson: true,
  exercise: true
} satisfies Prisma.DailyMissionInclude;

export type DailyMissionRecord = Prisma.DailyMissionGetPayload<{
  include: typeof missionInclude;
}>;

function missionCopy(skillFocus: SkillFocus) {
  if (skillFocus === "grammar") {
    return {
      title: "Grammar booster",
      description: "Review one quick grammar fix and clear one targeted drill."
    };
  }

  if (skillFocus === "vocabulary") {
    return {
      title: "Vocabulary booster",
      description: "Sharpen one reusable expression set and answer one precision drill."
    };
  }

  return {
    title: "Structure booster",
    description: "Tighten essay organization with one lesson and one coherence exercise."
  };
}

async function inferWeakestSkill(userId: string): Promise<SkillFocus> {
  const recentSubmissions = await db.submission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      grammarScore: true,
      vocabularyScore: true,
      structureScore: true
    }
  });

  if (recentSubmissions.length === 0) return "structure";

  const total = recentSubmissions.reduce(
    (accumulator, submission) => {
      accumulator.grammar += submission.grammarScore;
      accumulator.vocabulary += submission.vocabularyScore;
      accumulator.structure += submission.structureScore;
      return accumulator;
    },
    { grammar: 0, vocabulary: 0, structure: 0 }
  );

  return getWeakestSkill({
    grammar: total.grammar / recentSubmissions.length,
    vocabulary: total.vocabulary / recentSubmissions.length,
    structure: total.structure / recentSubmissions.length
  });
}

export async function ensureStudentProfile(userId: string) {
  return db.studentProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      targetScore: 15,
      primaryLanguage: Language.ENGLISH
    }
  });
}

export async function ensureDailyMission(userId: string) {
  const profile = await ensureStudentProfile(userId);
  const missionDate = startOfUtcDay();

  const existing = await db.dailyMission.findUnique({
    where: {
      userId_missionDate: {
        userId,
        missionDate
      }
    },
    include: missionInclude
  });

  if (existing) return existing;

  const primaryLanguage = profile.primaryLanguage ?? Language.ENGLISH;
  const skillFocus = await inferWeakestSkill(userId);

  const lesson = await db.lesson.findFirst({
    where: {
      language: primaryLanguage,
      skillFocus
    },
    orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }]
  });

  const exercise = await db.exercise.findFirst({
    where: {
      language: primaryLanguage,
      skillFocus,
      ...(lesson?.id ? { OR: [{ lessonId: lesson.id }, { lessonId: null }] } : {})
    },
    orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }]
  });

  const copy = missionCopy(skillFocus);

  return db.dailyMission.create({
    data: {
      userId,
      lessonId: lesson?.id,
      exerciseId: exercise?.id,
      missionDate,
      title: copy.title,
      description: copy.description,
      skillFocus,
      status: MissionStatus.READY,
      xpReward: exercise?.xpReward ?? 20
    },
    include: missionInclude
  });
}

export async function getXpTotal(userId: string) {
  const aggregate = await db.exerciseAttempt.aggregate({
    where: { userId },
    _sum: { xpEarned: true }
  });

  return aggregate._sum.xpEarned ?? 0;
}

export async function getDashboardMissions(userId: string) {
  const missionDate = startOfUtcDay();
  return db.dailyMission.findMany({
    where: { userId },
    orderBy: { missionDate: "desc" },
    take: 3,
    include: missionInclude
  });
}

export function buildRecommendedLessonMessage(skillFocus: SkillFocus) {
  if (skillFocus === "grammar") {
    return "Your fastest gain is grammar control. Fix the repeated errors before writing another draft.";
  }

  if (skillFocus === "vocabulary") {
    return "Your next score jump is vocabulary precision. Learn a few stronger phrases and reuse them well.";
  }

  return "Your biggest mark leak is structure. Tighten paragraph flow before your next essay.";
}
