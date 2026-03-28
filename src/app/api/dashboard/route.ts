import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { FREE_CORRECTIONS_PER_WEEK } from "@/lib/constants";
import { buildDashboardMetrics } from "@/lib/dashboard";
import { ensureDailyMission, ensureStudentProfile, getXpTotal } from "@/lib/missions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, profile, mission, xpTotal, totalCorrections, correctionsThisWeek, recentSubmissions] = await Promise.all([
    db.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        isPremium: true
      }
    }),
    ensureStudentProfile(auth.userId),
    ensureDailyMission(auth.userId),
    getXpTotal(auth.userId),
    db.submission.count({
      where: { userId: auth.userId }
    }),
    db.submission.count({
      where: {
        userId: auth.userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    db.submission.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        createdAt: true,
        overallScore: true,
        grammarScore: true,
        vocabularyScore: true,
        structureScore: true,
        wordCount: true,
        exam: {
          select: {
            year: true,
            title: true
          }
        }
      }
    })
  ]);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    plan: user.isPremium ? "premium" : "free",
    metrics: buildDashboardMetrics({
      recentSubmissions,
      totalCorrections,
      correctionsThisWeek,
      isPremium: user.isPremium,
      freeCorrectionLimit: FREE_CORRECTIONS_PER_WEEK
    }),
    profile,
    mission,
    xpTotal,
    recentSubmissions
  });
}
