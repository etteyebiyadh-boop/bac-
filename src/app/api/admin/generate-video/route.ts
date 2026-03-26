import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getReliableCompletion } from "@/lib/ai-provider";

/**
 * ELITE AI DIRECTOR v3 (The "Engine-in-a-Box")
 * Generates a full cinematic configuration for our local Video Canvas.
 * No HeyGen or paid video APIs required.
 */
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { topic, language, duration, vibe = "ELITE BROTHER" } = await req.json();
    
    // THE DIRECTORIAL PROMPT
    const prompt = `You are an elite AI Content Director for 'Bac Excellence'.
    Your task is to generate a 'Video Configuration JSON' for a high-value lesson about: ${language} - ${topic}.
    Vibe: ${vibe}.
    
    REQUIREMENTS:
    1. TUNISIAN SCRIPT: The voiceover must be 100% authentic Tunisian Derja senior authority.
    2. SCENE BREAKDOWN: Create at least 10 scenes for a 1-minute video.
    3. LAYOUTS: For each scene, specify a 'layout' (TitleSlide, RuleDefinition, ExampleCode, WarningCard, ViralQuote).
    4. ANIMATIONS: Suggest an 'entrance' animation for text elements (FadeUp, SlideRight, ZoomIn).
    5. COLOR THEMES: Based on the Vibe, suggest a 'theme' (e.g. #ef4444 for warning, #10b981 for success).

    RETURN ONLY A VALID JSON OBJECT:
    {
      "title": "Mastery Video",
      "voiceover_full": "The full script in Tunisian",
      "theme": { "primary": "#ef4444", "secondary": "#22c55e", "bg": "#000" },
      "scenes": [
        {
          "duration_ms": 5000,
          "layout": "TitleSlide",
          "title": "Scene Heading",
          "subtitle": "Tunisian Hook Text",
          "animation": "FadeUp",
          "voiceover_chunk": "Script for this 5-second scene in Tunisian"
        },
        ...
      ]
    }`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 3000,
        temperature: 0.7,
    });

    let content = response.choices[0]?.message?.content || "{}";
    if (content.startsWith("```json")) {
        content = content.replace(/```json|```/g, "").trim();
    }
    
    const body = JSON.parse(content);
    return NextResponse.json({ ok: true, ...body });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to direct cinematic production" }, { status: 500 });
  }
}
