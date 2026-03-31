import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/lessons/complete - Mark a lesson as completed
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { lessonId } = await req.json();
    
    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    // Check if already completed
    const existing = await db.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        alreadyCompleted: true,
        xpEarned: 0,
        completedAt: existing.completedAt 
      });
    }

    // Get lesson XP reward
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { estimatedMinutes: true }
    });

    const xpEarned = lesson ? Math.min(50, Math.max(20, lesson.estimatedMinutes * 5)) : 30;

    // Create completion record
    const completion = await db.lessonCompletion.create({
      data: {
        userId: auth.userId,
        lessonId,
        xpEarned
      }
    });

    return NextResponse.json({
      success: true,
      alreadyCompleted: false,
      xpEarned,
      completedAt: completion.completedAt
    });
  } catch (error) {
    console.error("[LESSON_COMPLETE] Error:", error);
    return NextResponse.json({ error: "Failed to complete lesson" }, { status: 500 });
  }
}

// GET /api/lessons/complete - Get user's completed lessons
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const completions = await db.lessonCompletion.findMany({
      where: { userId: auth.userId },
      include: {
        lesson: {
          select: {
            id: true,
            slug: true,
            title: true,
            language: true,
            skillFocus: true,
            difficulty: true
          }
        }
      },
      orderBy: { completedAt: "desc" }
    });

    const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);

    return NextResponse.json({
      completions,
      totalCount: completions.length,
      totalXp
    });
  } catch (error) {
    console.error("[LESSON_COMPLETE] Error:", error);
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 });
  }
}
