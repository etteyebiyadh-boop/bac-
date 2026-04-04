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
  bacSection?: string | null;
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
    bacSection: getOptionalFormValue(formData.get("bacSection")),
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
  bacSection?: string | null;
}) {
  // Select the MOST relevant BAC example for few-shot prompting to keep context small and fast
  const wordCount = input.studentEssay.split(/\s+/).filter(Boolean).length;
  const allRelevant = selectRelevantExamples(input.studentEssay, wordCount, input.language as any);
  const singleExample = allRelevant.slice(0, 1); // Use only 1 example to avoid Vercel timeout (10s limit)
  const fewShotContext = buildFewShotPrompt(singleExample, input.language as any);

  if (input.type === "FULL_MOCK" && input.examData) {
    return `You are an elite Tunisian Baccalaureate examiner. Study this official example:
${fewShotContext}

Grade this Full Mock Exam for ${input.language} (Section ${input.bacSection || "GENERAL"}).
Reading (12 pts): ${JSON.stringify(input.readingAnswers)}
Language (8 pts): ${JSON.stringify(input.languageAnswers)}
Essay Prompt: ${input.examData?.prompt}
Student Essay: "${input.studentEssay}"

Output JSON:
{ "overallScore": 0-20, "readingScore": 0-12, "languageScore": 0-8, "writingScore": 0-10, "summary": "...", "correctedText": "...", "explanations": [], "strengths": [], "improvements": [], "recommendedLesson": { "slug": "link", "title": "...", "summary": "...", "skillFocus": "..." } }`;
  }

  return `You are an elite Tunisian Baccalaureate examiner for ${input.language}. Study this example:
${fewShotContext}

Grade this essay (Section ${input.bacSection || "GENERAL"}) based on:
1. Grammar (5 pts), 2. Vocabulary (5 pts), 3. Structure (10 pts).

Prompt: ${input.examPrompt || "Free topic"}
Essay: "${input.studentEssay}"

Instructions: Be STRICT. Use half-points (e.g. 12.5). A typical essay is 10-13. 16+ is for exceptional work only.
Output JSON:
{ "overallScore": 0-20, "grammarScore": 0-20, "vocabularyScore": 0-20, "structureScore": 0-20, "summary": "...", "correctedText": "...", "explanations": [{ "original": "...", "fixed": "...", "reason": "..." }], "strengths": [], "improvements": [], "recommendedLesson": { "slug": "link", "title": "...", "summary": "...", "skillFocus": "..." } }`;
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
      bacSection,
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
      bacSection,
    });

    const response = await getReliableCompletion({
      messages: [
         { role: "system", content: systemPrompt },
         { role: "user", content: "Grade my essay according to the rubric. Provide strictly the JSON object as requested. Make sure to escape quotes." }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    // Ensure all required fields exist for the frontend to avoid crashes
    const responsePayload = {
      overallScore: result.overallScore ?? 0,
      grammarScore: result.grammarScore ?? 0,
      vocabularyScore: result.vocabularyScore ?? 0,
      structureScore: result.structureScore ?? 0,
      summary: result.summary ?? (language === "ARABIC" ? "تمت عملية التصحيح بنجاح." : "Correction completed successfully."),
      correctedText: result.correctedText ?? sanitizedStudentText,
      explanations: Array.isArray(result.explanations) ? result.explanations : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      improvements: Array.isArray(result.improvements) ? result.improvements : [],
      recommendedLesson: result.recommendedLesson || null,
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
