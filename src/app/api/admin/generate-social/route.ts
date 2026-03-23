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
6. Emphasize that on Bac Excellence, you don't just study, you get instant AI-powered feedback on your specific section's criteria.`;

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
