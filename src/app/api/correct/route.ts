import { NextRequest, NextResponse } from "next/server";
import { Language, SubmissionType } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { correctEssay } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import {
  CORRECTION_RATE_LIMIT_PER_MINUTE,
  CORRECTION_RATE_LIMIT_WINDOW_MS,
  FREE_CORRECTIONS_PER_WEEK,
  MAX_ESSAY_CHARS,
  MIN_ESSAY_CHARS
} from "@/lib/constants";
import { getWeakestSkill } from "@/lib/learning";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  promptText: z.string().trim().max(600).optional(),
  studentText: z.string().trim().min(MIN_ESSAY_CHARS).max(MAX_ESSAY_CHARS),
  examId: z.string().optional(),
  language: z.nativeEnum(Language).optional()
});

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const rateKey = `${auth.userId}:${ip}`;
  const rateCheck = checkRateLimit(
    rateKey,
    CORRECTION_RATE_LIMIT_PER_MINUTE,
    CORRECTION_RATE_LIMIT_WINDOW_MS
  );
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Too many correction requests. Please wait a minute and try again."
      },
      { status: 429 }
    );
  }

  try {
    const body = schema.parse(await req.json());
    const [user, exam, weeklyCorrections] = await Promise.all([
      db.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, isPremium: true }
      }),
      body.examId
        ? db.exam.findUnique({
            where: { id: body.examId },
            select: { id: true, prompt: true, language: true }
          })
        : Promise.resolve(null),
      db.submission.count({
        where: {
          userId: auth.userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.isPremium && weeklyCorrections >= FREE_CORRECTIONS_PER_WEEK) {
      return NextResponse.json(
        {
          error: `Free plan limit reached. Upgrade for unlimited corrections or wait for next week.`
        },
        { status: 403 }
      );
    }

    if (body.examId && !exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const promptText =
      (exam?.prompt ?? body.promptText?.trim()) || `General bac-style writing`;
    const language = exam?.language ?? body.language ?? Language.ENGLISH;
    
    if (!user.isPremium && language !== Language.ENGLISH) {
      return NextResponse.json(
        {
          error: `The Free plan only supports English corrections. Upgrade to Premium to practice ${language.toLowerCase()}.`
        },
        { status: 403 }
      );
    }
    
    const wordCount = body.studentText.split(/\s+/).filter(Boolean).length;
    const result = await correctEssay(body.studentText, promptText, language);
    const weakestSkill = getWeakestSkill({
      grammar: result.grammarScore,
      vocabulary: result.vocabularyScore,
      structure: result.structureScore
    });
    const recommendedLesson = await db.lesson.findFirst({
      where: {
        language,
        skillFocus: weakestSkill
      },
      orderBy: [{ difficulty: "asc" }, { estimatedMinutes: "asc" }]
    });

    await db.submission.create({
      data: {
        userId: auth.userId,
        examId: exam?.id,
        language,
        submissionType: exam ? SubmissionType.EXAM_PRACTICE : SubmissionType.FREE_WRITE,
        promptText,
        originalText: body.studentText,
        correctedText: result.correctedText,
        overallScore: result.overallScore,
        grammarScore: result.grammarScore,
        vocabularyScore: result.vocabularyScore,
        structureScore: result.structureScore,
        feedbackJson: {
          summary: result.summary,
          strengths: result.strengths,
          improvements: result.improvements
        },
        wordCount,
      }
    });

    return NextResponse.json({
      ...result,
      recommendedLesson: recommendedLesson
        ? {
            slug: recommendedLesson.slug,
            title: recommendedLesson.title,
            summary: recommendedLesson.summary,
            skillFocus: recommendedLesson.skillFocus
          }
        : null,
      remainingFreeCorrections: user.isPremium
        ? null
        : Math.max(0, FREE_CORRECTIONS_PER_WEEK - weeklyCorrections - 1)
    });
  } catch (error) {
    console.error("Correction endpoint failed", error);
    return NextResponse.json(
      { error: "Correction is temporarily unavailable. Please retry in a few seconds." },
      { status: 503 }
    );
  }
}
