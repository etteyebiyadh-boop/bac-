import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getReliableCompletion } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { topic, language, count = 30 } = await req.json();
    
    const prompt = `You are "Bulk Content AI" for Bac Excellence.
Generate a list of exactly ${count} social media content items for the BAC topic: "${topic}" in ${language}.
The content should be optimized for Canva's "Bulk Create" feature.

Structure:
Return a JSON array of objects. Each object MUST have these EXACT keys:
- "hook": A short, high-impact pattern-interrupt (Max 8 words).
- "title": The main educational point or headline.
- "body": 1-2 lines of value/insight.
- "cta": A short call to action.

Rules:
1. Language: EVERYTHING must be in ${language}.
2. Quality: BAC-level accuracy, premium "elite" tone.
3. Diversity: Mix of grammar, vocabulary, study hacks, and mindset tips related to ${topic}.

Format: { "items": [...] }`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const body = JSON.parse(content);
    return NextResponse.json({ ok: true, items: body.items || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
