import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: `Forbidden: Access denied for ${auth.email}. Use the Admin Passcode if needed.` }, { status: 403 });
  }

  try {
    const { topic, language, platform } = await req.json();
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "replace_me") throw new Error("Missing valid OPENAI_API_KEY. Please update your .env file.");
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are a viral social media manager for 'Bac Excellence', the most elite and premium AI-first platform for Tunisian Baccalaureate students.
Write a highly engaging, high-stakes and elite ${platform} post about: ${language} - ${topic}.

Guidelines:
1. TARGET: Tunisian BAC students who want to go from a 12 to a 17/20 in their language tracks (English, French, Arabic or Optionals).
2. STYLE: Professional, slightly bold, outcome-focused. Use words like 'Excellence', 'Top Tier', 'Bac Score', 'Precision'.
3. LANGUAGE CONTEXT: If the track is FRENCH or ARABIC, the post should be written PRIMARILY in that language (with some English branding) to showcase our proficiency.
4. STRUCTURE for ${platform === "Instagram Carousel" ? 'Carousel' : platform}:
   - Slide 1: High-impact HOOK (e.g. 'Stop losing 3 points on ${topic}').
   - Slide 2: The Core Rule or Vocab (Simplified but Elite).
   - Slide 3: The 'Pro-Tip' (The secret trick BAC examiners look for).
   - Slide 4: Real Example (Context relevant to Tunisian exams).
   - Slide 5: CTA (Call to Action) to visit bacexcellence.com for unlimited AI corrections.
5. EMOJIS: Use premium-feeling emojis like 🌌, 💎, 🚀, 🛡️, 💡.
6. Emphasize that on Bac Excellence, you don't just study, you get instant AI-powered feedback on your specific section's criteria.

IMPORTANT: You MUST return your response ONLY as a valid JSON object with the following fields:
- "script": The full social media script including all slides and emojis.
- "visualTitle": A ultra-short viral title to be used on a visual card (e.g. "Rule: Subject-Verb Inversion").
- "visualBody": The absolute core rule or punchy takeaway to be displayed on the card (max 120 chars).`;

    const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    const body = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json({ ok: true, ...body });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
