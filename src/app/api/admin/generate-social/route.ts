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

    const prompt = `You are a viral content strategist for 'Bac Excellence', the elite AI-first platform for Tunisian Baccalaureate students.
Create a ${platform} content pack about: ${language} - ${topic}. ${sectionContext}

STRICTLY FOLLOW THIS OUTPUT FORMAT (valid JSON only):
{
  "script": "<full social media caption in Tunisian Derja, energetic, with CTA to Bac Excellence>",
  "visualTitle": "<VERY SHORT viral hook title in ${language}, max 6 words>",
  "visualBody": "<EXACTLY 2 SHORT LINES in ${language}, max 80 chars total — this appears on a graphic card, NO long paragraphs>",
  "synonyms": [{ "word": "...", "synonym": "..." }, ...],
  "antonyms": [{ "word": "...", "antonym": "..." }, ...],
  "vocabulary": [{ "word": "...", "definition": "...", "example": "..." }, ...],
  "phrases": ["exam-ready phrase 1", "phrase 2", ...]
}

RULES:
- script: Tunisian Derja slang (ya m3allem, taayer, revision 9asba, jib l'excellence). Energetic. Brand 'Bac Excellence'.
- visualTitle: 4-6 words max. Pattern-interrupt. In ${language}.
- visualBody: MAXIMUM 2 lines, 80 chars total. Punchy. In ${language}. For a graphic card — no long sentences.
- synonyms: 5 items. Key vocabulary for ${topic} in ${language}.
- antonyms: 5 items. Contrasting words for ${topic} in ${language}.
- vocabulary: 4 items. High-value words for ${topic} in ${language}.
- phrases: 5 items. Exam-ready, high-scoring phrases in ${language}.`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1400,
        temperature: 0.6,
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
