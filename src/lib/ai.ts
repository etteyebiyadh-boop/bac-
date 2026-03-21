import OpenAI from "openai";
import { z } from "zod";

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

export async function correctEssay(inputText: string, promptText?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await Promise.race([
    client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a strict but encouraging Tunisian Baccalaureate English examiner. Evaluate essays using bac-style criteria: grammar accuracy, vocabulary range, and structure/coherence. Return strict JSON only."
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
