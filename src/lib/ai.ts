import { getAIClient } from "@/lib/ai-provider";
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
  const { client, model } = getAIClient();

  const rubricBlock =
    language === "ENGLISH"
      ? getBacEnglishRubricPromptBlock()
      : `Score grammar, vocabulary, and structure each out of 20 for ${language} bac-style writing. ` +
        `Blend them into overallScore (similar weighting: grammar ~35%, vocabulary ~30%, structure ~35%), rounded to one decimal. ` +
        `Keep the same JSON fields and examiner tone.`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          `You are a strict but encouraging Tunisian Baccalaureate ${language} examiner. ` +
          `Evaluate writing using bac-style criteria. Output must be valid JSON only.\n\n` +
          rubricBlock
      },
      {
        role: "user",
        content: `Prompt: ${promptText || "General bac-style writing"}\n\nStudent text:\n${inputText}`
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 1200,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content || "{}";
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
  const { client, model } = getAIClient();

  const promptLanguage = language === "ARABIC" ? "Arabic" : (language === "FRENCH" ? "French" : (language === "SPANISH" ? "Spanish" : "English"));

  const response = await client.chat.completions.create({
    model,
    messages: [
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
    response_format: { type: "json_object" },
    max_tokens: 800,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content || "{}";
  return drillSchema.parse(JSON.parse(content));
}
