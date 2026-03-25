import { requireCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    await requireCurrentUser();
    const { sentence, ruleTitle, ruleDescription } = await req.json();

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert English teacher for the Tunisian Baccalaureate. The student is practicing the grammar rule: "${ruleTitle}" (${ruleDescription}). 
          Analyze their sentence. Is it grammatically correct and does it correctly use this specific rule? 
          Return a JSON response with:
          {
            "isCorrect": boolean,
            "feedback": "Short encouraging explanation of what's right or what's wrong."
          }`
        },
        { role: "user", content: sentence }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to evaluate sentence." }, { status: 500 });
  }
}
