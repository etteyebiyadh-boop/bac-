import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/lessons/[slug]/exercises
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await getUserFromRequest(req);
  
  try {
    const { slug } = await params;
    
    // Find the lesson
    const lesson = await db.lesson.findUnique({
      where: { slug },
      include: {
        exercises: {
          orderBy: { difficulty: "asc" },
          select: {
            id: true,
            slug: true,
            type: true,
            prompt: true,
            choicesJson: true,
            explanation: true,
            difficulty: true,
            skillFocus: true,
            xpReward: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // If authenticated, fetch user's progress on these exercises
    let userProgress: Record<string, { attempted: boolean; correct: boolean }> = {};
    if (auth) {
      const attempts = await db.exerciseAttempt.findMany({
        where: {
          userId: auth.userId,
          exerciseId: {
            in: lesson.exercises.map(e => e.id)
          }
        },
        orderBy: { createdAt: "desc" },
        distinct: ["exerciseId"]
      });
      
      userProgress = attempts.reduce((acc, attempt) => {
        acc[attempt.exerciseId] = {
          attempted: true,
          correct: attempt.isCorrect
        };
        return acc;
      }, {} as Record<string, { attempted: boolean; correct: boolean }>);
    }

    // Check lesson completion
    let lessonCompleted = false;
    if (auth) {
      const completion = await db.lessonCompletion.findUnique({
        where: {
          userId_lessonId: {
            userId: auth.userId,
            lessonId: lesson.id
          }
        }
      });
      lessonCompleted = !!completion;
    }

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        language: lesson.language,
        skillFocus: lesson.skillFocus,
        difficulty: lesson.difficulty
      },
      exercises: lesson.exercises.map(ex => ({
        ...ex,
        userProgress: userProgress[ex.id] || { attempted: false, correct: false }
      })),
      lessonCompleted,
      totalExercises: lesson.exercises.length,
      isAuthenticated: !!auth
    });
  } catch (error) {
    console.error("[LESSON_EXERCISES] Error:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
