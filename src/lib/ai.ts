import OpenAI from "openai";
import { z } from "zod";
import { getBacEnglishRubricPromptBlock } from "@/lib/examiner-rubric";

const correctionSchema = z.object({
  overallScore: z.number().min(0).max(20),
  grammarScore: z.number().min(0).max(20),
  vocabularyScore: z.number().min(0).max(20),
  structureScore: z.number().min(0).max(20),
  summary: z.string().min(10),
  correctedText: z.string().min(1),
  strengths: z.array(z.string()).min(2).max(4),
  improvements: z.array(z.string()).min(3).max(5)
});

export async function correctEssay(inputText: string, promptText?: string, language: string = "ENGLISH") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const rubricBlock =
    language === "ENGLISH"
      ? getBacEnglishRubricPromptBlock()
      : `Score grammar, vocabulary, and structure each out of 20 for ${language} bac-style writing. ` +
        `Blend them into overallScore (similar weighting: grammar ~35%, vocabulary ~30%, structure ~35%), rounded to one decimal. ` +
        `Keep the same JSON fields and examiner tone.`;

  const response = await Promise.race([
    client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            `You are a strict but encouraging Tunisian Baccalaureate ${language} examiner. ` +
            `Evaluate writing using bac-style criteria. Output must be valid JSON only (no markdown).\n\n` +
            rubricBlock
        },
        {
          role: "user",
          content: `Prompt: ${promptText || "General bac-style writing"}\n\nStudent text:\n${inputText}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "correction",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              overallScore: { type: "number", minimum: 0, maximum: 20 },
              grammarScore: { type: "number", minimum: 0, maximum: 20 },
              vocabularyScore: { type: "number", minimum: 0, maximum: 20 },
              structureScore: { type: "number", minimum: 0, maximum: 20 },
              summary: { type: "string" },
              correctedText: { type: "string" },
              strengths: {
                type: "array",
                minItems: 2,
                maxItems: 4,
                items: { type: "string" }
              },
              improvements: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: { type: "string" }
              }
            },
            required: [
              "overallScore",
              "grammarScore",
              "vocabularyScore",
              "structureScore",
              "summary",
              "correctedText",
              "strengths",
              "improvements"
            ]
          },
          strict: true
        }
      }
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000);
    })
  ]);

  const content = (response as { output_text: string }).output_text;
  const parsed = correctionSchema.parse(JSON.parse(content));
  return parsed;
}

const drillSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().min(0).max(3),
    explanation: z.string()
  }))
});

export async function generateGrammarDrill(ruleName: string, ruleExplanation: string, language: string = "ENGLISH") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const promptLanguage = language === "ARABIC" ? "Arabic" : (language === "FRENCH" ? "French" : (language === "SPANISH" ? "Spanish" : "English"));

  const response = await Promise.race([
    client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            `You are an expert ${promptLanguage} tutor for Tunisian Baccalaureate students. ` +
            `Create exactly 3 challenging multiple-choice questions targeting the grammar rule: ${ruleName}.\n` +
            `Context: ${ruleExplanation}\n\n` +
            `Return valid JSON with 4 options per question, the correct index (0-3), and a helpful explanation. ` +
            `The questions, options, AND explanations MUST be in ${promptLanguage}.`
        },
        {
          role: "user",
          content: `Generate 3 practice questions for ${ruleName} in ${promptLanguage}.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "grammar_drill",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                    correctIndex: { type: "number", minimum: 0, maximum: 3 },
                    explanation: { type: "string" }
                  },
                  required: ["question", "options", "correctIndex", "explanation"]
                }
              }
            },
            required: ["questions"]
          },
          strict: true
        }
      }
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 25000);
    })
  ]);

  const content = (response as { output_text: string }).output_text;
  return drillSchema.parse(JSON.parse(content));
}
