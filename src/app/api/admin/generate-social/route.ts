import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getAIClient, getReliableCompletion } from "@/lib/ai-provider";

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
    const { topic, language, platform, section } = await req.json();
    
    const sectionContext = section ? `Target Section: ${section}.` : "Target: All BAC sections.";

    const prompt = `You are a viral social media manager for 'Bac Excellence', the most elite and premium AI-first platform for Tunisian Baccalaureate students.
Write a highly engaging, high-stakes and elite ${platform} post about: ${language} - ${topic}.
${sectionContext}

Guidelines:
1. TARGET: Tunisian BAC students who want to go from a 12 to a 17/20 in their language tracks.
2. STYLE: Professional, bold, outcome-focused. Use words like 'Excellence', 'Top Tier', 'Bac Score', 'Precision'.
3. LANGUAGE PURITY: The entire response (script, visualTitle, visualBody) MUST be written 100% in the selected language (${language}). Absolutely NO English introductions, placeholders, or translations. Show absolute pedagogical mastery and authority in ${language} from start to finish.
4. STRUCTURE for ${platform}:
   - Hook: A pure ${language} pattern-interrupt statement that busts a common BAC myth.
   - Body: 4-5 key 'Elite Insights' in ${language}.
   - Example: A specific exam scenario in ${language}.
   - CTA: Compelling reason in ${language} to use bacexcellence.com.
5. EMOJIS: Use premium emojis like 🌌, 💎, 🚀, 🛡️, 💡 sparingly.
6. Emphasize INSTANT AI FEEDBACK in the selected language.

IMPORTANT: Return ONLY a valid JSON object:
- "script": The full social media script with all slides/hooks.
- "visualTitle": A viral hook title for the graphic card.
- "visualBody": A pedagogical masterclass breakdown FOR the visual card. (Mistakes ❌ vs Mastery ✅, Examiner's Secret, etc.).`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 750,
        temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let body: any = {};
    try {
      body = JSON.parse(content);
    } catch (e) {
      console.error("AI JSON Parse Error:", e);
      throw new Error("AI returned invalid JSON format.");
    }

    // Sanitize specifically for React rendering safety
    const sanitized = {
      script: typeof body.script === 'object' ? JSON.stringify(body.script, null, 2) : (body.script || ""),
      visualTitle: typeof body.visualTitle === 'object' ? JSON.stringify(body.visualTitle) : (body.visualTitle || "Hook Title"),
      visualBody: typeof body.visualBody === 'object' ? JSON.stringify(body.visualBody, null, 2) : (body.visualBody || ""),
    };

    return NextResponse.json({ ok: true, ...sanitized });
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
