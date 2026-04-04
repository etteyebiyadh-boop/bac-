import { db } from "@/lib/db";
import { MissionStatus } from "@prisma/client";

export const LEVEL_XP_THRESHOLD = 500;

export async function getStudentStats(userId: string) {
  const profile = await db.studentProfile.findUnique({
    where: { userId },
    include: { user: { include: { lessonCompletions: true, exerciseAttempts: { where: { isCorrect: true } } } } }
  });

  if (!profile) return { level: 1, xp: 0, rank: "NOVICE" };

  const totalXp = (profile.user.lessonCompletions.length * 50) + (profile.user.exerciseAttempts.length * 20);
  const level = Math.floor(totalXp / LEVEL_XP_THRESHOLD) + 1;
  
  const ranks = ["NOVICE", "APPRENTICE", "SCHOLAR", "ELITE", "MASTER", "BAC HERO"];
  const rank = ranks[Math.min(level - 1, ranks.length - 1)];

  return { level, xp: totalXp % LEVEL_XP_THRESHOLD, totalXp, rank };
}

export async function generateDailyMissions(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already exists
  const existing = await db.dailyMission.findMany({
    where: { userId, missionDate: today }
  });

  if (existing.length > 0) return existing;

  // Generate 3 New Missions
  const missions = [
    { title: "Vocabulary Sprint", description: "Master 5 new section-specific words.", skillFocus: "vocabulary", xpReward: 40 },
    { title: "Grammar Repair", description: "Complete one repair drill on your weak points.", skillFocus: "grammar", xpReward: 60 },
    { title: "Mock Text Analysis", description: "Read one official text and answer 2 questions.", skillFocus: "reading", xpReward: 100 },
  ];

  const created = await Promise.all(missions.map(m => 
    db.dailyMission.create({
      data: {
        userId,
        missionDate: today,
        ...m
      }
    })
  ));

  return created;
}

export async function completeMission(missionId: string) {
  return db.dailyMission.update({
    where: { id: missionId },
    data: { 
      status: MissionStatus.COMPLETED,
      completedAt: new Date()
    }
  });
}
