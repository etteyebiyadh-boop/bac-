import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getReliableCompletion } from "@/lib/ai-provider";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // 1. Fetch current platform content to adapt to
    const [lessons, grammar, vocab] = await Promise.all([
      db.lesson.findMany({ select: { title: true, theme: true }, take: 15 }),
      db.grammarRule.findMany({ select: { title: true }, take: 10 }),
      db.vocabularySet.findMany({ select: { title: true, theme: true }, take: 10 })
    ]);

    const context = {
      lessons: lessons.map(l => l.title),
      grammar: grammar.map(g => g.title),
      vocab: vocab.map(v => v.title)
    };

    const prompt = `You are a viral content strategist for 'Bac Excellence', the elite AI-first platform for Tunisian Baccalaureate students.
    Based on the following pedagogical content currently in the platform, generate 8 VIRAL mastery topics and social media hooks.
    Content Context:
    Lessons: ${context.lessons.join(", ")}
    Grammar: ${context.grammar.join(", ")}
    Vocab: ${context.vocab.join(", ")}

    GOALS:
    1. Make them sound like Elite BAC Secrets (e.g. 'The Inversion Masterclass', 'Stop losing points in Writing', 'The 17/20 Phrase Strategy').
    2. Focus on Mastery Cheat Sheets, Viral Grammar Hacks, and High-Scoring Vocab.
    3. Ensure high-energy and reflect the authority of Bac Excellence.

    RETURN ONLY A VALID JSON ARRAY OF STRINGS:
    ["Hook/Topic 1", "Hook/Topic 2", ...]`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.8,
    });

    const body = JSON.parse(response.choices[0]?.message?.content || "{}");
    const suggestions = Array.isArray(body) ? body : (body.suggestions || Object.values(body)[0] || []);

    return NextResponse.json({ ok: true, suggestions });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
