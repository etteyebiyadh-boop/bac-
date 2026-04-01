import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { getXpTotal } from "@/lib/missions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "alltime"; // alltime | week | month
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);

  let since: Date | undefined;
  const now = new Date();
  if (period === "week") {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Aggregate XP from all sources per user
  const whereClause = since ? { createdAt: { gte: since } } : {};

  const [exerciseXp, lessonXp, challengeXp, users] = await Promise.all([
    // XP from exercises
    db.exerciseAttempt.groupBy({
      by: ["userId"],
      _sum: { xpEarned: true },
      where: { ...whereClause, isCorrect: true },
    }),
    // XP from lessons
    db.lessonCompletion.groupBy({
      by: ["userId"],
      _sum: { xpEarned: true },
      where: since ? { completedAt: { gte: since } } : undefined,
    }),
    // XP from challenges won
    db.challenge.groupBy({
      by: ["winnerId"],
      _sum: { xpReward: true },
      where: { ...whereClause, status: "COMPLETED", winnerId: { not: null } },
    }),
    // All users with profiles
    db.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        studentProfile: {
          select: {
            bacSection: true,
            targetScore: true,
          },
        },
        submissions: {
          select: { overallScore: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            submissions: true,
            challengesSent: true,
          },
        },
      },
    }),
  ]);

  // Build XP map
  const xpMap: Record<string, number> = {};

  for (const row of exerciseXp) {
    xpMap[row.userId] = (xpMap[row.userId] || 0) + (row._sum.xpEarned || 0);
  }
  for (const row of lessonXp) {
    xpMap[row.userId] = (xpMap[row.userId] || 0) + (row._sum.xpEarned || 0);
  }
  for (const row of challengeXp) {
    if (row.winnerId) {
      xpMap[row.winnerId] = (xpMap[row.winnerId] || 0) + (row._sum.xpReward || 0);
    }
  }

  // If all-time and user has no XP in map, compute from getXpTotal approach
  // For period queries, submissions don't have XP tracked, so we estimate
  // Add submission bonus XP (10 XP per submission as participation)
  const submissionBonus = period === "alltime"
    ? await db.submission.groupBy({
        by: ["userId"],
        _count: { id: true },
      })
    : await db.submission.groupBy({
        by: ["userId"],
        _count: { id: true },
        where: whereClause,
      });

  for (const row of submissionBonus) {
    xpMap[row.userId] = (xpMap[row.userId] || 0) + (row._count.id || 0) * 10;
  }

  // Build leaderboard entries
  const leaderboard = users
    .map((user) => {
      const xp = xpMap[user.id] || 0;
      if (xp === 0 && !user._count.submissions) return null;

      const avgScore =
        user.submissions.length > 0
          ? user.submissions.reduce((s, sub) => s + sub.overallScore, 0) /
            user.submissions.length
          : 0;

      const displayName =
        user.fullName ||
        (user.email ? user.email.split("@")[0] : "Student");

      const level = Math.floor(xp / 200) + 1;
      const levelTitle = getLevelTitle(level);

      return {
        userId: user.id,
        displayName,
        xp,
        level,
        levelTitle,
        avgScore: parseFloat(avgScore.toFixed(1)),
        totalEssays: user._count.submissions,
        bacSection: user.studentProfile?.bacSection || null,
        isCurrentUser: user.id === auth.userId,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.xp - a!.xp)
    .slice(0, limit);

  // Add rank
  const ranked = leaderboard.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));

  // Current user's position (may be outside top N)
  const currentUserEntry = ranked.find((e) => e!.isCurrentUser);
  let currentUserRank = currentUserEntry?.rank || null;

  if (!currentUserEntry) {
    // user exists but outside top N
    const myXp = xpMap[auth.userId] || 0;
    const total = users.filter((u) => (xpMap[u.id] || 0) > myXp).length;
    currentUserRank = total + 1;
  }

  // Leaderboard stats
  const totalParticipants = users.filter(
    (u) => (xpMap[u.id] || 0) > 0
  ).length;

  return NextResponse.json({
    leaderboard: ranked,
    currentUserRank,
    totalParticipants,
    period,
  });
}

function getLevelTitle(level: number): string {
  if (level <= 2) return "Novice";
  if (level <= 5) return "Apprenti";
  if (level <= 10) return "Intermédiaire";
  if (level <= 15) return "Avancé";
  if (level <= 20) return "Expert";
  if (level <= 30) return "Maître";
  return "Élite BAC";
}
