import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getAIClient } from "@/lib/ai-provider";

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ??
    error?.response?.status ??
    error?.error?.status ??
    error?.code
  );
}

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sentence, ruleTitle, ruleDescription } = await req.json();
    if (!sentence) return NextResponse.json({ error: "Sentence is required" }, { status: 400 });

    const { client, model } = getAIClient();

    const prompt = `You are a high-level English grammar expert. Analyze the following sentence specifically for the rule: "${ruleTitle}" (${ruleDescription}).
Target: Tunisian Baccalaureate students.

Sentence to check: "${sentence}"

Determine if the sentence correctly applies the rule.
Output in JSON format with two fields:
- "isCorrect": true or false.
- "correctedSentence": If incorrect, provide the fully corrected version. If correct, null.
- "explanation": A clear, pedagogical explanation of the rule application or the error.
- "feedback": A short summary (e.g. "Well done!" or "Watch out for...").`;

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 450,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    const status = getErrorStatus(error);
    if (status === 429) {
      return NextResponse.json(
        { error: "OpenAI quota reached (429). Please try again later." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Failed to check grammar" }, { status: 500 });
  }
}
