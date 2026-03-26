import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sentence, ruleTitle, ruleDescription } = await req.json();
    if (!sentence) return NextResponse.json({ error: "Sentence is required" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are a high-level English grammar expert. Analyze the following sentence specifically for the rule: "${ruleTitle}" (${ruleDescription}).
Target: Tunisian Baccalaureate students.

Sentence to check: "${sentence}"

Determine if the sentence correctly applies the rule.
Output in JSON format with two fields:
- "isCorrect": true or false.
- "feedback": If correct, give a "Well done!" and a brief explanation why. If incorrect, explain the exact error and provide the corrected version.`;

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check grammar" }, { status: 500 });
  }
}
