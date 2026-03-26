import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAIClient, getReliableCompletion } from "@/lib/ai-provider";
import { MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";

const MAX_AI_WORDS_FOR_CORRECTION = 220; // Cost control: keep inputs short for Bac-style corrections.
const MAX_PROMPT_CHARS = 600; // Prevent unusually large prompts from burning tokens.

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ??
    error?.response?.status ??
    error?.error?.status ??
    error?.code // fallback (sometimes present as numeric/string)
  );
}

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { examId, promptText, studentText, language = "ENGLISH", type, readingAnswers, languageAnswers } = await req.json();
    if (!studentText && type !== "FULL_MOCK") return NextResponse.json({ error: "Essay is empty" }, { status: 400 });

    const normalizedStudentText = String(studentText).trim().replace(/\s+/g, " ");
    const normalizedPromptText = promptText ? String(promptText).trim() : null;
    const promptTextForDb = normalizedPromptText && normalizedPromptText.length > 0 ? normalizedPromptText : null;

    if (normalizedStudentText.length < MIN_ESSAY_CHARS) {
      return NextResponse.json({ error: `Essay is too short. Minimum is ${MIN_ESSAY_CHARS} chars.` }, { status: 400 });
    }
    if (normalizedStudentText.length > MAX_ESSAY_CHARS) {
      return NextResponse.json({ error: `Essay is too long. Maximum is ${MAX_ESSAY_CHARS} chars.` }, { status: 400 });
    }

    const wordCount = normalizedStudentText.split(/\s+/).filter(Boolean).length;
    if (wordCount > MAX_AI_WORDS_FOR_CORRECTION) {
      return NextResponse.json(
        { error: `Essay is too long for AI correction. Please keep it under ${MAX_AI_WORDS_FOR_CORRECTION} words.` },
        { status: 400 }
      );
    }

    if (promptTextForDb && promptTextForDb.length > MAX_PROMPT_CHARS) {
      return NextResponse.json({ error: `Prompt is too long. Please use a shorter bac prompt.` }, { status: 400 });
    }

    const safeExamId = examId || null;
    const safeLanguage = language as any;
    const safePromptText = promptTextForDb;

    // Cache: if the student resubmits the same exact text + prompt, return the previous correction.
    const existing = await db.submission.findFirst({
      where: {
        userId: auth.userId,
        examId: safeExamId,
        language: safeLanguage,
        promptText: safePromptText,
        originalText: normalizedStudentText,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing?.feedbackJson && type !== "FULL_MOCK") {
      return NextResponse.json(existing.feedbackJson);
    }

    let systemPrompt = "";

    if (type === "FULL_MOCK" && safeExamId) {
      const exam = await db.exam.findUnique({ where: { id: safeExamId } }) as any;
      systemPrompt = `You are an elite Tunisian Baccalaureate examiner.
Evaluate this 3-hour Full Mock Exam for ${language}.

Section I: Reading (12 pts)
Official Questions: ${JSON.stringify(exam?.readingQuestions)}
Student Answers: ${JSON.stringify(readingAnswers)}

Section II: Language (8 pts)
Official Questions: ${JSON.stringify(exam?.languageQuestions)}
Student Answers: ${JSON.stringify(languageAnswers)}

Section III: Writing (10 pts)
Prompt: ${exam?.prompt}
Student Essay: "${studentText}"

Grading Protocol:
- Calculate Reading score (out of 12) strictly.
- Calculate Language score (out of 8) strictly.
- Grade Writing (out of 10) on grammar, vocab, and structure.
- Sum them up for an Overall Score out of 30, then convert to /20.

Output a JSON object with:
- "overallScore": Final mark out of 20.
- "readingScore": Mark out of 12.
- "languageScore": Mark out of 8.
- "writingScore": Mark out of 10.
- "summary": 2-sentence feedback.
- "correctedText": Improved version of the student's essay (max 200 words).
- "explanations": Array of objects { "original": "text", "fixed": "text", "reason": "why" } for writing improvements.
- "strengths": Array of 3 points.
- "improvements": Array of 3 points.
- "recommendedLesson": { "slug": "link", "title": "Title", "summary": "Summary", "skillFocus": "focus" }
`;
    } else {
      systemPrompt = `You are an elite Tunisian Baccalaureate examiner for ${language}.
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
- "correctedText": The full essay with grammar and lexical improvements. Keep the correctedText concise:
  - same meaning
  - do not add new ideas
  - NOT longer than ${MAX_AI_WORDS_FOR_CORRECTION} words (and keep similar length to the original).
- "explanations": Array of objects { "original": "text", "fixed": "text", "reason": "why" } explaining the 3-5 most important changes made.
- "strengths": Array of 3 bullet points.
- "improvements": Array of 3 bullet points.
- "recommendedLesson": { "slug": "link-to-best-matching-lesson", "title": "Lesson Title", "summary": "Why this lesson?", "skillFocus": "grammar/vocab/structure" }
`;
    }

    const response = await getReliableCompletion({
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 900,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    // Persist submission
    await db.submission.create({
      data: {
        userId: auth.userId,
        examId: safeExamId,
        language: language as any,
        promptText: safePromptText,
        originalText: normalizedStudentText,
        correctedText: result.correctedText || studentText,
        overallScore: result.overallScore || 0,
        grammarScore: result.grammarScore || 0,
        vocabularyScore: result.vocabularyScore || 0,
        structureScore: result.structureScore || 0,
        feedbackJson: result,
        wordCount,
      }
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const status = getErrorStatus(error);
    console.error(error);

    if (status === 429) {
      return NextResponse.json(
        {
          error: "OpenAI quota reached (429). Please wait a bit and retry, or switch to grammar drills until quota resets.",
        },
        { status: 429 }
      );
    }

    const msg = String(error?.message || "");
    if (msg.includes("Missing OPENAI_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ error: "AI Correction failed. Please check your connection." }, { status: 500 });
  }
}
