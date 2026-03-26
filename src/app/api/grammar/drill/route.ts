import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { topic, subject, language } = await req.json();
    if (!topic || !subject) return NextResponse.json({ error: "Topic and subject are required" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are a viral English teacher for the Tunisian Baccalaureate.
Generate a quick-fire grammar drill for: ${subject} (${topic}).
The language is: ${language || "ENGLISH"}.

Choose ONE of these drill types:
- Multiple choice
- Rewriting (e.g. active to passive)
- Gap fill

Structure your response as JSON:
- "drillType": e.g. "rewriting", "multipleChoice"
- "prompt": The instruction and context.
- "questionText": The sentence to transform or complete.
- "options": Array of strings (if multiple choice, otherwise empty).
- "correctAnswer": The final string.
- "explanation": Why this answer is correct.
- "hint": A short tip for this specific rule.

Format your output only as valid JSON.`;

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json({ ok: true, drill: result });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate drill" }, { status: 500 });
  }
}
