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
    const { topic, language, duration, section } = await req.json();
    
    const prompt = `You are an elite Video Director and Pedagogical Architect for 'Bac Excellence', the premier AI platform for Tunisian students.
    Generate a full production blueprint for a high-value ${duration}-minute lesson video about: ${language} - ${topic}.
    Target Section: ${section || "General"}.

    REQUIREMENTS:
    1. TUNISIAN TONE: The script/voiceover must be in 100% authentic, high-energy Tunisian Derja. It must feel like an 'Elder Brother' mentor (vibes) explaining a complex topic simply but with elite authority.
    2. STORYBOARD: Provide a scene-by-scene breakdown including camera angles (Close-up, Wide, Screen-share), visual overlays, and B-roll suggestions.
    3. PEDAGOGICAL ELITE: The academic content (examples/rules) within the script must be 100% accurate and professional in ${language}.
    4. MUSIC & SFX: Suggest specific timestamps for music swells, sound effects (e.g. 'Pop', 'Whoosh'), and energy shifts.
    5. CALL TO ACTION: A viral hook at the end to join BacExcellence.com.

    RETURN ONLY A VALID JSON OBJECT:
    {
      "title": "Viral Video Title",
      "hook": "The first 5 seconds pattern interrupt in Tunisian",
      "voiceover": "The full script in Tunisian Derja",
      "storyboard": [
        { "time": "00:00-00:10", "scene": "Description", "visual": "Overlay/Graphic", "instruction": "Camera/Angle" },
        ...
      ],
      "musicVibe": "Detailed music description",
      "visualTheme": "Colors/Atmosphere suggestion",
      "thumbnailHook": "Clickbait but professional text for thumbnail"
    }`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.5,
    });

    const body = JSON.parse(response.choices[0]?.message?.content || "{}");

    return NextResponse.json({ ok: true, ...body });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to generate video blueprint" }, { status: 500 });
  }
}
