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
2. THE "TUNISIAN VIBE": The 'script' field MUST be written in 100% authentic Tunisian Derja. Use "vibes" and local slang that resonates with BAC students (e.g., 'ya m3allem', 'taayer', 'focus', 'discipline', 'score tayari', 'jib l'excellence', 'kassas', 'revision 9asba').
3. BRAND RECALL: Always refer to the platform as 'Bac Excellence' in the script.
4. PEDAGOGICAL MASTERY: The 'visualTitle' and 'visualBody' MUST be in ${language}.
5. ELITE CONTENT: Provide a masterclass set of synonyms, antonyms, vocabulary, and phrases in ${language} related to ${topic}.

STRUCTURE:
- script: A pattern-interrupt hook and body in Tunisian Derja.
- visualTitle: A viral hook title in ${language}.
- visualBody: A pedagogical masterclass breakdown in ${language}.
- synonyms: Array of { word: string, synonym: string } (at least 3).
- antonyms: Array of { word: string, antonym: string } (at least 3).
- vocabulary: Array of { word: string, definition: string, example: string } (at least 3).
- phrases: Array of strings (at least 3 exam-ready high-scoring phrases).

IMPORTANT: Return ONLY a valid JSON object with these exact keys.`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.5,
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
      synonyms: Array.isArray(body.synonyms) ? body.synonyms : [],
      antonyms: Array.isArray(body.antonyms) ? body.antonyms : [],
      vocabulary: Array.isArray(body.vocabulary) ? body.vocabulary : [],
      phrases: Array.isArray(body.phrases) ? body.phrases : [],
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
