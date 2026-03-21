import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
  if (!adminEmails.includes(auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { topic, language, platform } = await req.json();
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are a viral social media manager for 'BacLang', a premium AI platform helping Tunisian Baccalaureate students.
Write a highly engaging, creative ${platform} post about: ${language} - ${topic}.
Keep it focused on a specific grammar rule, verb conjugation trick, or vocabulary list for the BAC exam.
Format it practically (e.g., Slide 1, Slide 2 for Instagram Carousel, or Hook/Body/CTA for short-form video). Use emojis.
End with a strong Call to Action telling them to practice essays and get instant AI corrections on baclang.com!`;

    const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices[0]?.message?.content || "Generation failed.";
    return NextResponse.json({ ok: true, content });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
