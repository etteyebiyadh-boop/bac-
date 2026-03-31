import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractTextFromWorkImage, getReliableCompletion } from "@/lib/ai-provider";
import { MAX_ESSAY_CHARS, MAX_SCAN_IMAGE_BYTES, MIN_ESSAY_CHARS } from "@/lib/constants";
import { trackCorrectionCompleted } from "@/lib/analytics";
import { selectRelevantExamples, buildFewShotPrompt, BacEssayExample } from "@/lib/bac-grading-examples";

const MAX_AI_WORDS_FOR_CORRECTION = 220; // Cost control: keep inputs short for Bac-style corrections.
const MAX_PROMPT_CHARS = 600; // Prevent unusually large prompts from burning tokens.

type CorrectionRequestPayload = {
  action?: "extract_text";
  examId?: string | null;
  promptText?: string | null;
  studentText?: string;
  language?: string;
  sourceMode?: "text" | "scan";
  type?: string;
  readingAnswers?: unknown;
  languageAnswers?: unknown;
  imageFile?: File | null;
};

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ??
    error?.response?.status ??
    error?.error?.status ??
    error?.code // fallback (sometimes present as numeric/string)
  );
}

function badRequest(message: string): never {
  const error = new Error(message) as Error & { status: number };
  error.status = 400;
  throw error;
}

function getFormValueAsString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function getOptionalFormValue(value: FormDataEntryValue | null) {
  const parsed = getFormValueAsString(value).trim();
  return parsed.length > 0 ? parsed : null;
}

function parseOptionalJsonField(value: FormDataEntryValue | null) {
  const raw = getFormValueAsString(value).trim();
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && "arrayBuffer" in value;
}

async function parseCorrectionRequest(req: NextRequest): Promise<CorrectionRequestPayload> {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return await req.json();
  }

  const formData = await req.formData();
  const uploadedImage = formData.get("workImage");

  return {
    examId: getOptionalFormValue(formData.get("examId")),
    promptText: getOptionalFormValue(formData.get("promptText")),
    studentText: getFormValueAsString(formData.get("studentText")),
    language: getOptionalFormValue(formData.get("language")) || "ENGLISH",
    action: getOptionalFormValue(formData.get("action")) === "extract_text" ? "extract_text" : undefined,
    sourceMode: getOptionalFormValue(formData.get("sourceMode")) === "scan" ? "scan" : "text",
    type: getOptionalFormValue(formData.get("type")) || undefined,
    readingAnswers: parseOptionalJsonField(formData.get("readingAnswers")),
    languageAnswers: parseOptionalJsonField(formData.get("languageAnswers")),
    imageFile: isUploadedFile(uploadedImage) ? uploadedImage : null,
  };
}

function validateImageFile(imageFile?: File | null) {
  if (!imageFile) return;

  if (!imageFile.type.startsWith("image/")) {
    badRequest("Please upload a valid image file.");
  }

  if (imageFile.size > MAX_SCAN_IMAGE_BYTES) {
    badRequest(`Image is too large. Maximum upload size is ${Math.round(MAX_SCAN_IMAGE_BYTES / (1024 * 1024))} MB.`);
  }
}

function normalizePromptText(promptText: string | null | undefined) {
  const normalizedPromptText = promptText ? String(promptText).trim() : null;
  return normalizedPromptText && normalizedPromptText.length > 0 ? normalizedPromptText : null;
}

function getRequestedSourceMode(payload: CorrectionRequestPayload) {
  if (payload.sourceMode === "scan") return "scan" as const;
  if (payload.imageFile) return "scan" as const;
  return "text" as const;
}

async function resolveStudentSourceText(payload: CorrectionRequestPayload, language: string) {
  if (payload.studentText?.trim()) {
    return String(payload.studentText);
  }

  if (payload.imageFile && payload.type !== "FULL_MOCK") {
    return await extractTextFromWorkImage(payload.imageFile, language);
  }

  return "";
}

function buildSystemPrompt(input: {
  examPrompt: string | null;
  examData?: any;
  language: string;
  type?: string;
  readingAnswers?: unknown;
  languageAnswers?: unknown;
  studentEssay: string;
}) {
  // Select relevant BAC examples for few-shot prompting
  const wordCount = input.studentEssay.split(/\s+/).filter(Boolean).length;
  const relevantExamples = selectRelevantExamples(input.studentEssay, wordCount);
  const fewShotContext = buildFewShotPrompt(relevantExamples);

  if (input.type === "FULL_MOCK" && input.examData) {
    return `You are an elite Tunisian Baccalaureate examiner with 20 years of experience grading official BAC exams.

Below are official BAC essay examples with their Tunisian examiner scores. Study these carefully to understand the grading standards:

${fewShotContext}

Now evaluate this 3-hour Full Mock Exam for ${input.language}.

Section I: Reading (12 pts)
Official Questions: ${JSON.stringify(input.examData?.readingQuestions)}
Student Answers: ${JSON.stringify(input.readingAnswers)}

Section II: Language (8 pts)
Official Questions: ${JSON.stringify(input.examData?.languageQuestions)}
Student Answers: ${JSON.stringify(input.languageAnswers)}

Section III: Writing (10 pts)
Prompt: ${input.examData?.prompt}
Student Essay: "${input.studentEssay}"

Grading Protocol (Tunisian Ministry Standards):
- Calculate Reading score (out of 12) strictly based on comprehension accuracy.
- Calculate Language score (out of 8) based on grammar rule application.
- Grade Writing (out of 10) considering grammar accuracy, vocabulary sophistication, and argument coherence.
- Sum them up for an Overall Score out of 30, then convert to /20.
- Be CRITICAL: A "good" essay should score 13-15, not 18+. Only truly exceptional work deserves 16+.

Output a JSON object with:
- "overallScore": Final mark out of 20 (be conservative, use half-points like 12.5, 13.5)
- "readingScore": Mark out of 12.
- "languageScore": Mark out of 8.
- "writingScore": Mark out of 10.
- "summary": 2-sentence feedback referencing specific strengths.
- "correctedText": Improved version (max 200 words).
- "explanations": Array of { "original": "error", "fixed": "correction", "reason": "grammar rule" }
- "strengths": Array of 3 specific strengths.
- "improvements": Array of 3 actionable improvements.
- "recommendedLesson": { "slug": "link", "title": "Title", "summary": "Why this lesson?", "skillFocus": "grammar/vocab/structure" }
`;
  }

  return `You are an elite Tunisian Baccalaureate examiner with 20 years of experience grading official BAC exams for ${input.language}.

Below are official BAC essay examples with their Tunisian examiner scores. Study these carefully to understand the grading standards:

${fewShotContext}

Now grade this student essay based on official Tunisian Ministry criteria:
1. Grammar & Syntax (5 pts): Accuracy of tenses, subject-verb agreement, articles, prepositions
2. Vocabulary range & accuracy (5 pts): Word variety, appropriateness, collocations
3. Structure, Coherence & Flow (10 pts): Introduction quality, paragraph development, connectors, conclusion

Exam Prompt: ${input.examPrompt || "Free writing topic"}
Student Essay: "${input.studentEssay}"

Grading Instructions:
- Be STRICT and realistic. A typical student essay with some errors should score 10-13, not 17+.
- Reserve 16-20 for truly excellent work with sophisticated vocabulary and complex structures.
- Use HALF-POINTS (e.g., 12.5, 13.5) for more nuanced grading.
- Grammar errors: -0.5 for minor errors, -1 for major errors (wrong tense, missing subject)
- Vocabulary: Simple repetitive words = low score; varied appropriate vocabulary = high score
- Structure: Missing conclusion = -2 points; weak connectors = -1 point

Output a JSON object with:
- "overallScore": Final mark out of 20 (conservative, realistic Tunisian BAC standards)
- "grammarScore": Mark out of 20 for grammar accuracy
- "vocabularyScore": Mark out of 20 for vocabulary range/appropriateness
- "structureScore": Mark out of 20 for essay organization and coherence
- "summary": A brief 2-sentence overview with encouraging but honest tone
- "correctedText": The full essay with grammar and lexical improvements. Keep same meaning, do not add new ideas, NOT longer than ${MAX_AI_WORDS_FOR_CORRECTION} words.
- "explanations": Array of { "original": "text with error", "fixed": "corrected text", "reason": "explanation of the rule" } for the 3-5 most important changes
- "strengths": Array of 3 specific things done well
- "improvements": Array of 3 specific areas to improve
- "recommendedLesson": { "slug": "link-to-best-matching-lesson", "title": "Lesson Title", "summary": "Why this lesson helps?", "skillFocus": "grammar/vocab/structure" }

Remember: You are grading against REAL Tunisian BAC standards where the national average is around 11-12/20. Be honest and constructive.`;
}

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await parseCorrectionRequest(req);
    const {
      action,
      examId,
      promptText,
      studentText,
      language = "ENGLISH",
      type,
      readingAnswers,
      languageAnswers,
      imageFile,
    } = payload;

    if (!studentText && !imageFile && type !== "FULL_MOCK") {
      return NextResponse.json({ error: "Essay is empty" }, { status: 400 });
    }

    validateImageFile(imageFile);

    if (action === "extract_text") {
      if (!imageFile) {
        return NextResponse.json({ error: "Add a photo before asking the AI to read it." }, { status: 400 });
      }

      const extractedText = await extractTextFromWorkImage(imageFile, language);

      return NextResponse.json({
        extractedText,
        sourceMode: "scan",
      });
    }

    const sourceMode = getRequestedSourceMode(payload);
    const sourceText = await resolveStudentSourceText(payload, language);

    const sanitizedStudentText = sourceText.replace(/\r\n/g, "\n").trim();
    const normalizedStudentText = sanitizedStudentText.replace(/\s+/g, " ");
    const promptTextForDb = normalizePromptText(promptText);

    if (!sanitizedStudentText && type !== "FULL_MOCK") {
      return NextResponse.json({ error: "We could not read any text from the photo. Try a clearer image." }, { status: 400 });
    }

    if (sanitizedStudentText.length < MIN_ESSAY_CHARS) {
      const scanHint = sourceMode === "scan" ? " Try a closer, brighter photo with only the answer in frame." : "";
      return NextResponse.json(
        { error: `Essay is too short. Minimum is ${MIN_ESSAY_CHARS} chars.${scanHint}` },
        { status: 400 }
      );
    }
    if (sanitizedStudentText.length > MAX_ESSAY_CHARS) {
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
      const cachedFeedback = existing.feedbackJson as Record<string, unknown>;
      return NextResponse.json({
        ...cachedFeedback,
        sourceText: sanitizedStudentText,
        sourceMode,
      });
    }

    const exam = type === "FULL_MOCK" && safeExamId
      ? await db.exam.findUnique({ where: { id: safeExamId } })
      : null;

    const systemPrompt = buildSystemPrompt({
      examPrompt: promptTextForDb,
      examData: exam,
      language,
      type,
      readingAnswers,
      languageAnswers,
      studentEssay: sanitizedStudentText,
    });

    const response = await getReliableCompletion({
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 900,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    const responsePayload = {
      ...result,
      sourceText: sanitizedStudentText,
      sourceMode,
    };

    // Persist submission
    const submission = await db.submission.create({
      data: {
        userId: auth.userId,
        examId: safeExamId,
        language: language as any,
        promptText: safePromptText,
        originalText: normalizedStudentText,
        correctedText: result.correctedText || sanitizedStudentText,
        overallScore: result.overallScore || 0,
        grammarScore: result.grammarScore || 0,
        vocabularyScore: result.vocabularyScore || 0,
        structureScore: result.structureScore || 0,
        feedbackJson: responsePayload,
        wordCount,
      }
    });

    // Track correction completed
    const user = await db.user.findUnique({ where: { id: auth.userId }, select: { isPremium: true } });
    await trackCorrectionCompleted(auth.userId, submission.id, {
      overall: result.overallScore || 0,
      grammar: result.grammarScore || 0,
      vocabulary: result.vocabularyScore || 0,
      structure: result.structureScore || 0
    }, user?.isPremium || false);

    // Return with submission ID for feedback
    return NextResponse.json({
      ...responsePayload,
      submissionId: submission.id
    });
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
    if (status === 400) {
      return NextResponse.json({ error: msg || "Invalid correction request." }, { status: 400 });
    }
    if (msg.includes("Missing OPENAI_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }
    if (msg.includes("Image scanning requires")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ error: "AI Correction failed. Please check your connection." }, { status: 500 });
  }
}
