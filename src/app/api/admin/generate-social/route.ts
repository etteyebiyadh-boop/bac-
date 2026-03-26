import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
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
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: `Forbidden: Access denied for ${auth.email}. Use the Admin Passcode if needed.` }, { status: 403 });
  }

  try {
    const { topic, language, platform } = await req.json();
    
    const { client, model } = getAIClient();

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
7. PSYCHOLOGY: Use 'Pattern Interrupt' hooks. Start the script with a truth-bomb or a myth-busting statement about the Bac tracks to stop the scroll.
8. ENGAGEMENT: At the end of slide 3/4, include a 'Micro-Conversion' question (e.g., 'Comment "RULE" if you want the PDF cheat sheet').

IMPORTANT: You MUST return your response ONLY as a valid JSON object with the following fields:
- "script": A high-value, multi-part social media script including all slides, emojis, and specific engagement hooks (like poll questions or controversial takes to drive comments).
- "visualTitle": A viral, punchy title for the visual card (e.g., "The 'Never' Inversion Hack 🛡️").
- "visualBody": A comprehensive but concise pedagogical breakdown for the visual card. Include:
  - The "Rule" (explained as an elite secret).
  - A "Mistake vs Master" comparison (❌ vs ✅).
  - An "Examiner's Note" on how this scores 18+/20.
  - Keep it readable but don't limit it to 120 chars—let it be as beneficial as possible.`;

    const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 650,
        temperature: 0.4,
    });

    const body = JSON.parse(response.choices[0]?.message?.content || "{}");
    return NextResponse.json({ ok: true, ...body });
  } catch (error: any) {
    console.error(error);
    const status = getErrorStatus(error);
    if (status === 429) {
      return NextResponse.json(
        { error: "OpenAI quota reached (429). Please wait and retry later." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
