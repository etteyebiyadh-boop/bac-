import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { 
      score, 
      maxScore, 
      grammarScore, 
      vocabularyScore, 
      readingScore, 
      answers 
    } = body;

    // 1. Save results for detailed tracking
    const result = await db.diagnosticResult.create({
      data: {
        userId: user.id,
        score,
        maxScore,
        grammarScore,
        vocabularyScore,
        readingScore,
        answersJson: JSON.stringify(answers),
      }
    });

    // 2. Set the baseline predicted score on the student profile
    // Tunisian BAC is graded out of 20
    const predictedScale = (score / maxScore) * 20;
    
    await db.studentProfile.update({
      where: { userId: user.id },
      data: {
        predictedScore: predictedScale,
        lastDiagnosticDate: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      prediction: predictedScale.toFixed(2),
      resultId: result.id 
    });
  } catch (error) {
    console.error("[DIAGNOSTIC_ERR]", error);
    return NextResponse.json({ error: "Failed to save diagnostic" }, { status: 500 });
  }
}
