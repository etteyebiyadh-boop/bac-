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
2. THE "TUNISIAN VIBE": The 'script' field MUST be written in 100% authentic Tunisian Derja. Use "vibes" and local slang that resonates with BAC students (e.g., 'ya m3allem', 'taayer', 'focus', 'discipline', 'score tayari', 'jib l\\'excellence', 'kassas', 'revision 9asba'). Mention the target section (${section || 'all sections'}) using its local student nickname if applicable.
3. BRAND RECALL: Always refer to the platform as 'Bac Excellence' in the script, as the most powerful way to guarantee a high score.
4. PEDAGOGICAL MASTERY: While the script is in Tunisian, the 'visualTitle' and 'visualBody' MUST be in ${language} to show absolute authority and mastery of the subject matter.
5. STYLE: Professional, bold, outcome-focused. Use words like 'Excellence', 'Top Tier', 'Bac Score', 'Precision'.
6. NO MIXING: Do not mix English/French into the Tunisian script unless it's extremely common slang. Do not use English in the visual fields if the target language is NOT English.
7. STRUCTURE for ${platform}:
   - Hook: A pattern-interrupt statement in Tunisian Derja that busts a common BAC myth and introduces 'Bac Excellence'. If it's a video, make it a 3-second 'Visual & Verbal Hook'.
   - Body: 4-5 key 'Elite Insights' or slides described with high energy in Tunisian. If it's a video, provide scene-by-scene descriptions.
   - Example: A specific exam scenario in ${language} (embedded within the Tunisian script for context).
   - CTA: Compelling reason in Tunisian Derja to join 'Bac Excellence' at bacexcellence.com ('Bech tadhmen mostaqblek', 'Ma daiaach el waqt').
8. EMOJIS: Use premium emojis like 🌌, 💎, 🚀, 🛡️, 💡 sparingly.

ADDITIONAL FOR VIDEOS (if ${platform} is TikTok/Reels Script):
9. Provide detailed camera movements (e.g., 'Zoom in', 'Fast Cut', 'Transition', 'Overlay').
10. Suggest a 'Tunisian Vibe' music style (e.g., 'Trap Tunisian Remix', 'Cinematic Orchestral', 'High-Tempo Phonk').
11. Provide text overlays to appear on screen in ${language}.

IMPORTANT: Return ONLY a valid JSON object:
- "script": The full social media script/voiceover in Tunisian Derja.
- "visualTitle": A viral hook title in ${language} for the graphic card or video thumbnail.
- "visualBody": A pedagogical masterclass breakdown in ${language} for the visual card or text overlays.
- "videoProduction": (Only for TikTok/Reels) A structured breakdown of scenes, camera movements, and music vibes (in Tunisian/English mix).`;

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
      videoProduction: typeof body.videoProduction === 'object' ? JSON.stringify(body.videoProduction, null, 2) : (body.videoProduction || ""),
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
