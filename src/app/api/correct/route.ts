import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { examId, promptText, studentText, language } = await req.json();
    if (!studentText) return NextResponse.json({ error: "Essay is empty" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "replace_me") {
        return NextResponse.json({ error: "401 Incorrect API key provided: replace_me. Please update your .env file." }, { status: 401 });
    }

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const systemPrompt = `You are an elite Tunisian Baccalaureate examiner for ${language}.
Your task is to grade the student essay based on official ministry criteria:
1. Grammar & Syntax (5 pts)
2. Vocabulary range & accuracy (5 pts)
3. Structure, Coherence & Flow (10 pts)

Exam Prompt: ${promptText || "Free writing topic"}
Student Essay: "${studentText}"

Output a JSON object with:
- "overallScore": Final mark out of 20.
- "grammarScore": Mark out of 20 for grammar.
- "vocabularyScore": Mark out of 20 for vocab.
- "structureScore": Mark out of 20 for structure.
- "summary": A brief encouraging 2-sentence overview.
- "correctedText": The full essay with grammar and lexical improvements.
- "strengths": Array of 3 bullet points.
- "improvements": Array of 3 bullet points.
- "recommendedLesson": { "slug": "link-to-best-matching-lesson", "title": "Lesson Title", "summary": "Why this lesson?", "skillFocus": "grammar/vocab/structure" }
`;

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    // Persist submission
    await db.submission.create({
      data: {
        userId: auth.userId,
        examId: examId || null,
        language: language as any,
        originalText: studentText,
        correctedText: result.correctedText || studentText,
        overallScore: result.overallScore || 0,
        grammarScore: result.grammarScore || 0,
        vocabularyScore: result.vocabularyScore || 0,
        structureScore: result.structureScore || 0,
        feedbackJson: result,
        wordCount: studentText.split(/\s+/).length,
      }
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "AI Correction failed. Please check your connection." }, { status: 500 });
  }
}
