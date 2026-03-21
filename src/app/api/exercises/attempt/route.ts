import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfUtcDay } from "@/lib/learning";

const schema = z.object({
  exerciseId: z.string().min(1),
  answerText: z.string().trim().min(1)
});

type AnswerShape = {
  correctChoice?: string;
};

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const exercise = await db.exercise.findUnique({
      where: { id: body.exerciseId },
      include: {
        lesson: {
          select: {
            title: true
          }
        }
      }
    });

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found." }, { status: 404 });
    }

    const answerData = exercise.answerJson as AnswerShape;
    const normalizedAnswer = body.answerText.trim().toLowerCase();
    const expectedAnswer = (answerData.correctChoice ?? "").trim().toLowerCase();
    const isCorrect = normalizedAnswer === expectedAnswer;

    const previousCorrectAttempt = await db.exerciseAttempt.findFirst({
      where: {
        userId: auth.userId,
        exerciseId: exercise.id,
        isCorrect: true
      },
      select: { id: true }
    });

    const xpEarned = isCorrect && !previousCorrectAttempt ? exercise.xpReward : 0;

    const attempt = await db.exerciseAttempt.create({
      data: {
        userId: auth.userId,
        exerciseId: exercise.id,
        answerText: body.answerText,
        isCorrect,
        xpEarned
      }
    });

    const todayMission = await db.dailyMission.findUnique({
      where: {
        userId_missionDate: {
          userId: auth.userId,
          missionDate: startOfUtcDay()
        }
      }
    });

    let missionCompleted = false;
    if (todayMission && todayMission.exerciseId === exercise.id && todayMission.status !== "COMPLETED" && isCorrect) {
      await db.dailyMission.update({
        where: { id: todayMission.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
      missionCompleted = true;
    }

    return NextResponse.json({
      ok: true,
      attemptId: attempt.id,
      isCorrect,
      xpEarned,
      missionCompleted,
      explanation: exercise.explanation,
      lessonTitle: exercise.lesson?.title ?? null
    });
  } catch {
    return NextResponse.json({ error: "Invalid exercise attempt." }, { status: 400 });
  }
}
